import requests
import json
from typing import Dict, Any, Optional
from datetime import datetime
from utils.logger import app_logger as logger
from utils.retry import retry_on_failure


class ModelClient:
    """模型数据获取客户端"""
    
    def __init__(self, base_url: str, timeout: int = 30):
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.session = requests.Session()
        
        # 设置请求头
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'CyberRailway-DataTransfer/1.0'
        })
    
    @retry_on_failure(max_attempts=3, delay=2)
    def get_model_data(self, endpoint: str = "/api/model/data") -> Optional[Dict[str, Any]]:
        """
        从队友的模型服务获取数据
        
        Args:
            endpoint: API 端点
            
        Returns:
            模型数据字典，获取失败返回 None
        """
        url = f"{self.base_url}{endpoint}"
        
        try:
            logger.info(f"正在从模型服务获取数据: {url}")
            
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            data = response.json()
            
            # 添加获取时间戳
            data['fetch_timestamp'] = datetime.now().isoformat()
            data['source'] = 'model_service'
            
            logger.info(f"成功获取模型数据，数据大小: {len(str(data))} 字符")
            return data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"请求模型服务失败: {e}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"解析模型数据JSON失败: {e}")  
            raise
        except Exception as e:
            logger.error(f"获取模型数据时发生未知错误: {e}")
            raise
    
    def health_check(self, endpoint: str = "/api/health") -> bool:
        """
        检查模型服务健康状态
        
        Args:
            endpoint: 健康检查端点
            
        Returns:
            服务是否健康
        """
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = self.session.get(url, timeout=5)
            return response.status_code == 200
        except Exception as e:
            logger.warning(f"模型服务健康检查失败: {e}")
            return False
    
    def close(self):
        """关闭会话"""
        self.session.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
