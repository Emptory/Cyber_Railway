#!/usr/bin/env python3
"""
简单的测试脚本，用于验证各个模块的功能
"""

import sys
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent / "src"
sys.path.insert(0, str(project_root))


def test_config():
    """测试配置模块"""
    print("测试配置模块...")
    try:
        from config.settings import settings
        print(f"? 模型服务地址: {settings.model_service_url}")
        print(f"? 云服务器地址: {settings.cloud_server_url}")
        print(f"? 获取间隔: {settings.fetch_interval} 秒")
        return True
    except Exception as e:
        print(f"? 配置模块测试失败: {e}")
        return False


def test_data_processor():
    """测试数据处理模块"""
    print("\n测试数据处理模块...")
    try:
        from data_transfer.data_processor import DataProcessor
        
        processor = DataProcessor()
        
        # 测试数据
        test_data = {
            "timestamp": "2025-06-24T10:00:00Z",
            "data": {"value": 123, "status": "ok"},
            "empty_field": "",
            "null_field": None
        }
        
        # 验证数据
        is_valid = processor.validate_data(test_data, ["timestamp", "data"])
        print(f"? 数据验证: {is_valid}")
        
        # 处理数据
        processed = processor.process_data(test_data)
        print(f"? 数据处理完成，字段数: {len(processed)}")
        
        return True
    except Exception as e:
        print(f"? 数据处理模块测试失败: {e}")
        return False


def test_logger():
    """测试日志模块"""
    print("\n测试日志模块...")
    try:
        from utils.logger import app_logger as logger
        
        logger.info("这是一条测试日志")
        logger.warning("这是一条警告日志")
        print("? 日志模块正常")
        return True
    except Exception as e:
        print(f"? 日志模块测试失败: {e}")
        return False


def main():
    """主测试函数"""
    print("=" * 50)
    print("Cyber Railway 模块测试")
    print("=" * 50)
    
    tests = [
        test_config,
        test_data_processor,
        test_logger
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print(f"\n" + "=" * 50)
    print(f"测试结果: {passed}/{total} 通过")
    print("=" * 50)
    
    if passed == total:
        print("? 所有测试通过！系统准备就绪。")
        return 0
    else:
        print("?? 部分测试失败，请检查配置和依赖。")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
