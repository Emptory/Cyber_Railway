from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from datetime import datetime
import json
import os
from loguru import logger
from dotenv import load_dotenv

# ���ػ�������
load_dotenv()

# ����FlaskӦ��
app = Flask(__name__)

# ����
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'mysql+pymysql://username:password@localhost/cyber_railway'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

# ��ʼ����չ
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

# ������־
logger.add("logs/server.log", rotation="100 MB", retention="7 days")


# ����ģ��
class ModelData(db.Model):
    """ģ�����ݱ�"""
    __tablename__ = 'model_data'
    
    id = db.Column(db.Integer, primary_key=True)
    data_id = db.Column(db.String(255), unique=True, nullable=False, index=True)
    source = db.Column(db.String(100), nullable=False)
    original_timestamp = db.Column(db.DateTime, nullable=True)
    received_timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # JSON�����ֶ�
    raw_data = db.Column(db.JSON, nullable=False)
    processed_data = db.Column(db.JSON, nullable=True)
    metadata = db.Column(db.JSON, nullable=True)
    
    # ״̬�ֶ�
    status = db.Column(db.String(50), default='received', nullable=False)
    data_size = db.Column(db.Integer, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'data_id': self.data_id,
            'source': self.source,
            'original_timestamp': self.original_timestamp.isoformat() if self.original_timestamp else None,
            'received_timestamp': self.received_timestamp.isoformat(),
            'status': self.status,
            'data_size': self.data_size,
            'metadata': self.metadata
        }


class UploadLog(db.Model):
    """�ϴ���־��"""
    __tablename__ = 'upload_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    data_id = db.Column(db.String(255), nullable=False, index=True)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(500), nullable=True)
    upload_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    error_message = db.Column(db.Text, nullable=True)


# API·��
@app.route('/api/health', methods=['GET'])
def health_check():
    """�������ӿ�"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0'
    })


@app.route('/api/v1/data/upload', methods=['POST'])
def upload_data():
    """�����ϴ��ӿ�"""
    try:
        # ��ȡ��������
        if not request.is_json:
            return jsonify({
                'success': False,
                'message': '���������JSON��ʽ'
            }), 400
        
        payload = request.get_json()
        
        # ��֤�����ֶ�
        if 'data' not in payload:
            return jsonify({
                'success': False,
                'message': 'ȱ�ٱ����ֶ�: data'
            }), 400
        
        # ��ȡ����
        data = payload['data']
        metadata = payload.get('metadata', {})
        timestamp_str = payload.get('timestamp')
        
        # ��������ID
        data_id = data.get('id') or f"data_{datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')}"
        
        # ����ʱ���
        original_timestamp = None
        if timestamp_str:
            try:
                original_timestamp = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            except ValueError:
                logger.warning(f"ʱ�����ʽ��Ч: {timestamp_str}")
        
        # ����Ƿ��Ѵ���
        existing = ModelData.query.filter_by(data_id=data_id).first()
        if existing:
            logger.warning(f"����ID�Ѵ���: {data_id}")
            return jsonify({
                'success': False,
                'message': f'����ID�Ѵ���: {data_id}'
            }), 409
        
        # �������ݼ�¼
        model_data = ModelData(
            data_id=data_id,
            source=metadata.get('source', 'unknown'),
            original_timestamp=original_timestamp,
            raw_data=data,
            metadata=metadata,
            status='received',
            data_size=len(json.dumps(data, ensure_ascii=False))
        )
        
        # ���浽���ݿ�
        db.session.add(model_data)
        db.session.commit()
        
        # ��¼�ϴ���־
        upload_log = UploadLog(
            data_id=data_id,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent'),
            status='success'
        )
        db.session.add(upload_log)
        db.session.commit()
        
        logger.info(f"�ɹ���������: {data_id}, ��С: {model_data.data_size} �ֽ�")
        
        return jsonify({
            'success': True,
            'message': '�����ϴ��ɹ�',
            'data_id': data_id,
            'received_at': model_data.received_timestamp.isoformat()
        })
        
    except Exception as e:
        logger.error(f"�����ϴ�ʧ��: {str(e)}")
        
        # ��¼������־
        try:
            error_log = UploadLog(
                data_id=data_id if 'data_id' in locals() else 'unknown',
                ip_address=request.remote_addr,
                user_agent=request.headers.get('User-Agent'),
                status='error',
                error_message=str(e)
            )
            db.session.add(error_log)
            db.session.commit()
        except:
            pass
        
        return jsonify({
            'success': False,
            'message': f'�������ڲ�����: {str(e)}'
        }), 500


@app.route('/api/v1/data', methods=['GET'])
def get_data():
    """��ȡ�����б�"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        
        # ������ѯ
        query = ModelData.query
        if status:
            query = query.filter_by(status=status)
        
        # ��ҳ
        pagination = query.order_by(ModelData.received_timestamp.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [item.to_dict() for item in pagination.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        })
        
    except Exception as e:
        logger.error(f"��ȡ�����б�ʧ��: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'��ȡ����ʧ��: {str(e)}'
        }), 500


@app.route('/api/v1/data/<data_id>', methods=['GET'])
def get_data_detail(data_id):
    """��ȡ������������"""
    try:
        data = ModelData.query.filter_by(data_id=data_id).first()
        if not data:
            return jsonify({
                'success': False,
                'message': '���ݲ�����'
            }), 404
        
        result = data.to_dict()
        result['raw_data'] = data.raw_data
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        logger.error(f"��ȡ��������ʧ��: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'��ȡ��������ʧ��: {str(e)}'
        }), 500


@app.route('/api/v1/stats', methods=['GET'])
def get_stats():
    """��ȡͳ����Ϣ"""
    try:
        total_count = ModelData.query.count()
        today_count = ModelData.query.filter(
            ModelData.received_timestamp >= datetime.utcnow().date()
        ).count()
        
        status_counts = db.session.query(
            ModelData.status, 
            db.func.count(ModelData.id)
        ).group_by(ModelData.status).all()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_count': total_count,
                'today_count': today_count,
                'status_distribution': dict(status_counts),
                'last_updated': datetime.utcnow().isoformat()
            }
        })
        
    except Exception as e:
        logger.error(f"��ȡͳ����Ϣʧ��: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'��ȡͳ����Ϣʧ��: {str(e)}'
        }), 500


# ������
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': '�ӿڲ�����'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({
        'success': False,
        'message': '�������ڲ�����'
    }), 500


if __name__ == '__main__':
    # �������ݿ��
    with app.app_context():
        db.create_all()
    
    # ����Ӧ��
    app.run(host='0.0.0.0', port=5000, debug=False)
