import requests
import json
from typing import Dict, Any, Optional
from datetime import datetime
from utils.logger import app_logger as logger
from utils.retry import retry_on_failure


class CloudClient:
    """阿里云数据上传客户端"""
    
    def __init__(self, server_url: str, timeout: int = 60, api_key: Optional[str] = None):
        self.server_url = server_url.rstrip('/')
        self.timeout = timeout
        self.session = requests.Session()
        
        # 设置请求头
        headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'CyberRailway-DataTransfer/1.0'
        }
        
        # 如果有API密钥，添加到请求头
        if api_key:
            headers['Authorization'] = f'Bearer {api_key}'
            
        self.session.headers.update(headers)
    
    @retry_on_failure(max_attempts=5, delay=3, backoff=1.5)
    def upload_data(self, data: Dict[str, Any], endpoint: str = "/api/v1/data/upload") -> bool:
        """
        上传数据到阿里云服务器
        
        Args:
            data: 要上传的数据
            endpoint: 上传接口端点
            
        Returns:
            上传是否成功
        """
        url = f"{self.server_url}{endpoint}"
        
        # 准备上传数据
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
            logger.info(f"正在上传数据到阿里云: {url}")
            logger.debug(f"上传数据大小: {len(json.dumps(upload_payload))} 字符")
            
            response = self.session.post(
                url,
                json=upload_payload,
                timeout=self.timeout
            )
            
            response.raise_for_status()
            
            # 解析响应
            result = response.json()
            
            if result.get('success', False):
                logger.info("数据上传成功")
                logger.debug(f"服务器响应: {result}")
                return True
            else:
                error_msg = result.get('message', '未知错误')
                logger.error(f"服务器返回失败状态: {error_msg}")
                return False
                
        except requests.exceptions.Timeout:
            logger.error("上传数据超时")
            raise
        except requests.exceptions.ConnectionError:
            logger.error("连接阿里云服务器失败")
            raise
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP错误: {e}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"解析服务器响应JSON失败: {e}")
            raise
        except Exception as e:
            logger.error(f"上传数据时发生未知错误: {e}")
            raise
    
    def test_connection(self, endpoint: str = "/api/health") -> bool:
        """
        测试与阿里云服务器的连接
        
        Args:
            endpoint: 健康检查端点
            
        Returns:
            连接是否正常
        """
        url = f"{self.server_url}{endpoint}"
        
        try:
            response = self.session.get(url, timeout=10)
            return response.status_code == 200
        except Exception as e:
            logger.warning(f"阿里云服务器连接测试失败: {e}")
            return False
    
    def get_upload_stats(self, endpoint: str = "/api/v1/stats") -> Optional[Dict[str, Any]]:
        """
        获取上传统计信息
        
        Args:
            endpoint: 统计接口端点
            
        Returns:
            统计信息字典
        """
        url = f"{self.server_url}{endpoint}"
        
        try:
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.warning(f"获取上传统计失败: {e}")
            return None
    
    def close(self):
        """关闭会话"""
        self.session.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
