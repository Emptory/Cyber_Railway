from typing import Dict, Any, List, Optional
from datetime import datetime
import json
from utils.logger import app_logger as logger


class DataProcessor:
    """���ݴ���ģ��"""
    
    def __init__(self, max_size_mb: int = 50):
        self.max_size_mb = max_size_mb
        self.max_size_bytes = max_size_mb * 1024 * 1024
    
    def validate_data(self, data: Dict[str, Any], required_fields: Optional[List[str]] = None) -> bool:
        """
        ��֤���ݸ�ʽ������
        
        Args:
            data: ����֤������
            required_fields: �����ֶ��б�
            
        Returns:
            �����Ƿ���Ч
        """
        try:
            # �������ͼ��
            if not isinstance(data, dict):
                logger.error("���ݸ�ʽ���󣺱������ֵ�����")
                return False
            
            # ������ݴ�С
            data_size = len(json.dumps(data, ensure_ascii=False))
            if data_size > self.max_size_bytes:
                logger.error(f"���ݴ�С���ޣ�{data_size} �ֽ� > {self.max_size_bytes} �ֽ�")
                return False
            
            # �������ֶ�
            if required_fields:
                missing_fields = []
                for field in required_fields:
                    if field not in data:
                        missing_fields.append(field)
                
                if missing_fields:
                    logger.error(f"ȱ�ٱ����ֶ�: {missing_fields}")
                    return False
            
            # ���ʱ�����ʽ��������ڣ�
            if 'timestamp' in data:
                try:
                    datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
                except (ValueError, AttributeError):
                    logger.error("ʱ�����ʽ��Ч")
                    return False
            
            logger.debug("������֤ͨ��")
            return True
            
        except Exception as e:
            logger.error(f"������֤ʱ��������: {e}")
            return False
    
    def process_data(self, raw_data: Dict[str, Any], add_metadata: bool = True) -> Dict[str, Any]:
        """
        �����ת������
        
        Args:
            raw_data: ԭʼ����
            add_metadata: �Ƿ����Ԫ����
            
        Returns:
            ����������
        """
        try:
            processed_data = raw_data.copy()
            
            # ��Ӵ���ʱ���
            processed_data['processed_at'] = datetime.now().isoformat()
            
            # ���Ԫ����
            if add_metadata:
                processed_data['metadata'] = {
                    'processor': 'cyber_railway_data_processor',
                    'version': '1.0',
                    'processing_time': datetime.now().isoformat(),
                    'data_keys': list(raw_data.keys()),
                    'data_size': len(json.dumps(raw_data, ensure_ascii=False))
                }
            
            # ������ϴ���Ƴ���ֵ
            processed_data = self._remove_empty_values(processed_data)
            
            # ���ݱ�׼��
            processed_data = self._standardize_data(processed_data)
            
            logger.info("���ݴ������")
            return processed_data
            
        except Exception as e:
            logger.error(f"���ݴ���ʱ��������: {e}")
            raise
    
    def _remove_empty_values(self, data: Any) -> Any:
        """�ݹ��Ƴ���ֵ"""
        if isinstance(data, dict):
            return {
                k: self._remove_empty_values(v) 
                for k, v in data.items() 
                if v is not None and v != "" and v != []
            }
        elif isinstance(data, list):
            return [self._remove_empty_values(item) for item in data if item is not None]
        else:
            return data
    
    def _standardize_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """���ݱ�׼������"""
        # ȷ����ͳһ��ID
        if 'id' not in data:
            data['id'] = f"data_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
        
        # ��׼��ʱ�����ʽ
        for key in ['timestamp', 'created_at', 'updated_at']:
            if key in data and isinstance(data[key], str):
                try:
                    # ���Խ��������¸�ʽ��ʱ���
                    dt = datetime.fromisoformat(data[key].replace('Z', '+00:00'))
                    data[key] = dt.isoformat()
                except:
                    pass  # ����ԭ��ʽ
        
        return data
    
    def batch_process(self, data_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        ������������
        
        Args:
            data_list: �����б�
            
        Returns:
            �����������б�
        """
        processed_list = []
        
        for i, data in enumerate(data_list):
            try:
                if self.validate_data(data):
                    processed = self.process_data(data)
                    processed_list.append(processed)
                else:
                    logger.warning(f"������ {i} ����Ч����")
            except Exception as e:
                logger.error(f"����� {i} ������ʱ����: {e}")
        
        logger.info(f"����������ɣ��ɹ����� {len(processed_list)}/{len(data_list)} ������")
        return processed_list
