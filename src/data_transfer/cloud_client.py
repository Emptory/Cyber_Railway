import requests
import json
from typing import Dict, Any, Optional
from datetime import datetime
from utils.logger import app_logger as logger
from utils.retry import retry_on_failure


class CloudClient:
    """�����������ϴ��ͻ���"""
    
    def __init__(self, server_url: str, timeout: int = 60, api_key: Optional[str] = None):
        self.server_url = server_url.rstrip('/')
        self.timeout = timeout
        self.session = requests.Session()
        
        # ��������ͷ
        headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'CyberRailway-DataTransfer/1.0'
        }
        
        # �����API��Կ����ӵ�����ͷ
        if api_key:
            headers['Authorization'] = f'Bearer {api_key}'
            
        self.session.headers.update(headers)
    
    @retry_on_failure(max_attempts=5, delay=3, backoff=1.5)
    def upload_data(self, data: Dict[str, Any], endpoint: str = "/api/v1/data/upload") -> bool:
        """
        �ϴ����ݵ������Ʒ�����
        
        Args:
            data: Ҫ�ϴ�������
            endpoint: �ϴ��ӿڶ˵�
            
        Returns:
            �ϴ��Ƿ�ɹ�
        """
        url = f"{self.server_url}{endpoint}"
        
        # ׼���ϴ�����
        upload_payload = {
            'timestamp': datetime.now().isoformat(),
            'data': data,
            'metadata': {
                'source': 'cyber_railway_transfer',
                'version': '1.0',
                'data_size': len(str(data))
            }
        }
        
        try:
            logger.info(f"�����ϴ����ݵ�������: {url}")
            logger.debug(f"�ϴ����ݴ�С: {len(json.dumps(upload_payload))} �ַ�")
            
            response = self.session.post(
                url,
                json=upload_payload,
                timeout=self.timeout
            )
            
            response.raise_for_status()
            
            # ������Ӧ
            result = response.json()
            
            if result.get('success', False):
                logger.info("�����ϴ��ɹ�")
                logger.debug(f"��������Ӧ: {result}")
                return True
            else:
                error_msg = result.get('message', 'δ֪����')
                logger.error(f"����������ʧ��״̬: {error_msg}")
                return False
                
        except requests.exceptions.Timeout:
            logger.error("�ϴ����ݳ�ʱ")
            raise
        except requests.exceptions.ConnectionError:
            logger.error("���Ӱ����Ʒ�����ʧ��")
            raise
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP����: {e}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"������������ӦJSONʧ��: {e}")
            raise
        except Exception as e:
            logger.error(f"�ϴ�����ʱ����δ֪����: {e}")
            raise
    
    def test_connection(self, endpoint: str = "/api/health") -> bool:
        """
        �����밢���Ʒ�����������
        
        Args:
            endpoint: �������˵�
            
        Returns:
            �����Ƿ�����
        """
        url = f"{self.server_url}{endpoint}"
        
        try:
            response = self.session.get(url, timeout=10)
            return response.status_code == 200
        except Exception as e:
            logger.warning(f"�����Ʒ��������Ӳ���ʧ��: {e}")
            return False
    
    def get_upload_stats(self, endpoint: str = "/api/v1/stats") -> Optional[Dict[str, Any]]:
        """
        ��ȡ�ϴ�ͳ����Ϣ
        
        Args:
            endpoint: ͳ�ƽӿڶ˵�
            
        Returns:
            ͳ����Ϣ�ֵ�
        """
        url = f"{self.server_url}{endpoint}"
        
        try:
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.warning(f"��ȡ�ϴ�ͳ��ʧ��: {e}")
            return None
    
    def close(self):
        """�رջỰ"""
        self.session.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
