import requests
import json
from typing import Dict, Any, Optional
from datetime import datetime
from utils.logger import app_logger as logger
from utils.retry import retry_on_failure


class ModelClient:
    """ģ�����ݻ�ȡ�ͻ���"""
    
    def __init__(self, base_url: str, timeout: int = 30):
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.session = requests.Session()
        
        # ��������ͷ
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'CyberRailway-DataTransfer/1.0'
        })
    
    @retry_on_failure(max_attempts=3, delay=2)
    def get_model_data(self, endpoint: str = "/api/model/data") -> Optional[Dict[str, Any]]:
        """
        �Ӷ��ѵ�ģ�ͷ����ȡ����
        
        Args:
            endpoint: API �˵�
            
        Returns:
            ģ�������ֵ䣬��ȡʧ�ܷ��� None
        """
        url = f"{self.base_url}{endpoint}"
        
        try:
            logger.info(f"���ڴ�ģ�ͷ����ȡ����: {url}")
            
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            data = response.json()
            
            # ��ӻ�ȡʱ���
            data['fetch_timestamp'] = datetime.now().isoformat()
            data['source'] = 'model_service'
            
            logger.info(f"�ɹ���ȡģ�����ݣ����ݴ�С: {len(str(data))} �ַ�")
            return data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"����ģ�ͷ���ʧ��: {e}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"����ģ������JSONʧ��: {e}")  
            raise
        except Exception as e:
            logger.error(f"��ȡģ������ʱ����δ֪����: {e}")
            raise
    
    def health_check(self, endpoint: str = "/api/health") -> bool:
        """
        ���ģ�ͷ��񽡿�״̬
        
        Args:
            endpoint: �������˵�
            
        Returns:
            �����Ƿ񽡿�
        """
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = self.session.get(url, timeout=5)
            return response.status_code == 200
        except Exception as e:
            logger.warning(f"ģ�ͷ��񽡿����ʧ��: {e}")
            return False
    
    def close(self):
        """�رջỰ"""
        self.session.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
