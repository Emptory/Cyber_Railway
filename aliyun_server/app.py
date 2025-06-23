from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from datetime import datetime
import json
import os
from loguru import logger
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 创建Flask应用
app = Flask(__name__)

# 配置
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'mysql+pymysql://username:password@localhost/cyber_railway'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

# 初始化扩展
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

# 配置日志
logger.add("logs/server.log", rotation="100 MB", retention="7 days")


# 数据模型
class ModelData(db.Model):
    """模型数据表"""
    __tablename__ = 'model_data'
    
    id = db.Column(db.Integer, primary_key=True)
    data_id = db.Column(db.String(255), unique=True, nullable=False, index=True)
    source = db.Column(db.String(100), nullable=False)
    original_timestamp = db.Column(db.DateTime, nullable=True)
    received_timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # JSON数据字段
    raw_data = db.Column(db.JSON, nullable=False)
    processed_data = db.Column(db.JSON, nullable=True)
    metadata = db.Column(db.JSON, nullable=True)
    
    # 状态字段
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
    """上传日志表"""
    __tablename__ = 'upload_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    data_id = db.Column(db.String(255), nullable=False, index=True)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(500), nullable=True)
    upload_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    error_message = db.Column(db.Text, nullable=True)


# API路由
@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0'
    })


@app.route('/api/v1/data/upload', methods=['POST'])
def upload_data():
    """数据上传接口"""
    try:
        # 获取请求数据
        if not request.is_json:
            return jsonify({
                'success': False,
                'message': '请求必须是JSON格式'
            }), 400
        
        payload = request.get_json()
        
        # 验证必需字段
        if 'data' not in payload:
            return jsonify({
                'success': False,
                'message': '缺少必需字段: data'
            }), 400
        
        # 提取数据
        data = payload['data']
        metadata = payload.get('metadata', {})
        timestamp_str = payload.get('timestamp')
        
        # 生成数据ID
        data_id = data.get('id') or f"data_{datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')}"
        
        # 解析时间戳
        original_timestamp = None
        if timestamp_str:
            try:
                original_timestamp = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            except ValueError:
                logger.warning(f"时间戳格式无效: {timestamp_str}")
        
        # 检查是否已存在
        existing = ModelData.query.filter_by(data_id=data_id).first()
        if existing:
            logger.warning(f"数据ID已存在: {data_id}")
            return jsonify({
                'success': False,
                'message': f'数据ID已存在: {data_id}'
            }), 409
        
        # 创建数据记录
        model_data = ModelData(
            data_id=data_id,
            source=metadata.get('source', 'unknown'),
            original_timestamp=original_timestamp,
            raw_data=data,
            metadata=metadata,
            status='received',
            data_size=len(json.dumps(data, ensure_ascii=False))
        )
        
        # 保存到数据库
        db.session.add(model_data)
        db.session.commit()
        
        # 记录上传日志
        upload_log = UploadLog(
            data_id=data_id,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent'),
            status='success'
        )
        db.session.add(upload_log)
        db.session.commit()
        
        logger.info(f"成功接收数据: {data_id}, 大小: {model_data.data_size} 字节")
        
        return jsonify({
            'success': True,
            'message': '数据上传成功',
            'data_id': data_id,
            'received_at': model_data.received_timestamp.isoformat()
        })
        
    except Exception as e:
        logger.error(f"数据上传失败: {str(e)}")
        
        # 记录错误日志
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
            'message': f'服务器内部错误: {str(e)}'
        }), 500


@app.route('/api/v1/data', methods=['GET'])
def get_data():
    """获取数据列表"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        
        # 构建查询
        query = ModelData.query
        if status:
            query = query.filter_by(status=status)
        
        # 分页
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
        logger.error(f"获取数据列表失败: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'获取数据失败: {str(e)}'
        }), 500


@app.route('/api/v1/data/<data_id>', methods=['GET'])
def get_data_detail(data_id):
    """获取单条数据详情"""
    try:
        data = ModelData.query.filter_by(data_id=data_id).first()
        if not data:
            return jsonify({
                'success': False,
                'message': '数据不存在'
            }), 404
        
        result = data.to_dict()
        result['raw_data'] = data.raw_data
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        logger.error(f"获取数据详情失败: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'获取数据详情失败: {str(e)}'
        }), 500


@app.route('/api/v1/stats', methods=['GET'])
def get_stats():
    """获取统计信息"""
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
        logger.error(f"获取统计信息失败: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'获取统计信息失败: {str(e)}'
        }), 500


# 错误处理
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': '接口不存在'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({
        'success': False,
        'message': '服务器内部错误'
    }), 500


if __name__ == '__main__':
    # 创建数据库表
    with app.app_context():
        db.create_all()
    
    # 启动应用
    app.run(host='0.0.0.0', port=5000, debug=False)
