from typing import Dict, Any, List, Optional
from datetime import datetime
import json
from utils.logger import app_logger as logger


class DataProcessor:
    """数据处理模块"""
    
    def __init__(self, max_size_mb: int = 50):
        self.max_size_mb = max_size_mb
        self.max_size_bytes = max_size_mb * 1024 * 1024
    
    def validate_data(self, data: Dict[str, Any], required_fields: Optional[List[str]] = None) -> bool:
        """
        验证数据格式和内容
        
        Args:
            data: 待验证的数据
            required_fields: 必需字段列表
            
        Returns:
            数据是否有效
        """
        try:
            # 基本类型检查
            if not isinstance(data, dict):
                logger.error("数据格式错误：必须是字典类型")
                return False
            
            # 检查数据大小
            data_size = len(json.dumps(data, ensure_ascii=False))
            if data_size > self.max_size_bytes:
                logger.error(f"数据大小超限：{data_size} 字节 > {self.max_size_bytes} 字节")
                return False
            
            # 检查必需字段
            if required_fields:
                missing_fields = []
                for field in required_fields:
                    if field not in data:
                        missing_fields.append(field)
                
                if missing_fields:
                    logger.error(f"缺少必需字段: {missing_fields}")
                    return False
            
            # 检查时间戳格式（如果存在）
            if 'timestamp' in data:
                try:
                    datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
                except (ValueError, AttributeError):
                    logger.error("时间戳格式无效")
                    return False
            
            logger.debug("数据验证通过")
            return True
            
        except Exception as e:
            logger.error(f"数据验证时发生错误: {e}")
            return False
    
    def process_data(self, raw_data: Dict[str, Any], add_metadata: bool = True) -> Dict[str, Any]:
        """
        处理和转换数据
        
        Args:
            raw_data: 原始数据
            add_metadata: 是否添加元数据
            
        Returns:
            处理后的数据
        """
        try:
            processed_data = raw_data.copy()
            
            # 添加处理时间戳
            processed_data['processed_at'] = datetime.now().isoformat()
            
            # 添加元数据
            if add_metadata:
                processed_data['metadata'] = {
                    'processor': 'cyber_railway_data_processor',
                    'version': '1.0',
                    'processing_time': datetime.now().isoformat(),
                    'data_keys': list(raw_data.keys()),
                    'data_size': len(json.dumps(raw_data, ensure_ascii=False))
                }
            
            # 数据清洗：移除空值
            processed_data = self._remove_empty_values(processed_data)
            
            # 数据标准化
            processed_data = self._standardize_data(processed_data)
            
            logger.info("数据处理完成")
            return processed_data
            
        except Exception as e:
            logger.error(f"数据处理时发生错误: {e}")
            raise
    
    def _remove_empty_values(self, data: Any) -> Any:
        """递归移除空值"""
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
        """数据标准化处理"""
        # 确保有统一的ID
        if 'id' not in data:
            data['id'] = f"data_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
        
        # 标准化时间戳格式
        for key in ['timestamp', 'created_at', 'updated_at']:
            if key in data and isinstance(data[key], str):
                try:
                    # 尝试解析并重新格式化时间戳
                    dt = datetime.fromisoformat(data[key].replace('Z', '+00:00'))
                    data[key] = dt.isoformat()
                except:
                    pass  # 保持原格式
        
        return data
    
    def batch_process(self, data_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        批量处理数据
        
        Args:
            data_list: 数据列表
            
        Returns:
            处理后的数据列表
        """
        processed_list = []
        
        for i, data in enumerate(data_list):
            try:
                if self.validate_data(data):
                    processed = self.process_data(data)
                    processed_list.append(processed)
                else:
                    logger.warning(f"跳过第 {i} 条无效数据")
            except Exception as e:
                logger.error(f"处理第 {i} 条数据时出错: {e}")
        
        logger.info(f"批量处理完成，成功处理 {len(processed_list)}/{len(data_list)} 条数据")
        return processed_list
