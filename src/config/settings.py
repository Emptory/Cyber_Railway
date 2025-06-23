import os
import yaml
from pathlib import Path
from typing import Dict, Any
from dotenv import load_dotenv


class Settings:
    """配置管理类"""
    
    def __init__(self):
        # 加载环境变量
        load_dotenv()
        
        # 获取配置文件路径
        self.config_path = Path(__file__).parent / "config.yaml"
        self.config = self._load_config()
        
    def _load_config(self) -> Dict[str, Any]:
        """加载配置文件"""
        try:
            with open(self.config_path, 'r', encoding='utf-8') as file:
                config = yaml.safe_load(file)
                
            # 替换环境变量占位符
            config = self._replace_env_vars(config)
            return config
        except Exception as e:
            raise Exception(f"加载配置文件失败: {e}")
    
    def _replace_env_vars(self, obj: Any) -> Any:
        """递归替换配置中的环境变量占位符"""
        if isinstance(obj, dict):
            return {k: self._replace_env_vars(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._replace_env_vars(item) for item in obj]
        elif isinstance(obj, str) and obj.startswith("${") and obj.endswith("}"):
            env_var = obj[2:-1]
            return os.getenv(env_var, obj)
        else:
            return obj
    
    def get(self, key: str, default: Any = None) -> Any:
        """获取配置值，支持点号分隔的嵌套键"""
        keys = key.split('.')
        value = self.config
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        
        return value
    
    @property
    def model_service_url(self) -> str:
        return self.get('model_service.base_url')
    
    @property
    def cloud_server_url(self) -> str:
        return self.get('alibaba_cloud.server_url')
    
    @property
    def fetch_interval(self) -> int:
        return self.get('scheduler.fetch_interval', 60)


# 全局配置实例
settings = Settings()
