#!/usr/bin/env python3
"""
�򵥵Ĳ��Խű���������֤����ģ��Ĺ���
"""

import sys
from pathlib import Path

# �����Ŀ��Ŀ¼��Python·��
project_root = Path(__file__).parent / "src"
sys.path.insert(0, str(project_root))


def test_config():
    """��������ģ��"""
    print("��������ģ��...")
    try:
        from config.settings import settings
        print(f"? ģ�ͷ����ַ: {settings.model_service_url}")
        print(f"? �Ʒ�������ַ: {settings.cloud_server_url}")
        print(f"? ��ȡ���: {settings.fetch_interval} ��")
        return True
    except Exception as e:
        print(f"? ����ģ�����ʧ��: {e}")
        return False


def test_data_processor():
    """�������ݴ���ģ��"""
    print("\n�������ݴ���ģ��...")
    try:
        from data_transfer.data_processor import DataProcessor
        
        processor = DataProcessor()
        
        # ��������
        test_data = {
            "timestamp": "2025-06-24T10:00:00Z",
            "data": {"value": 123, "status": "ok"},
            "empty_field": "",
            "null_field": None
        }
        
        # ��֤����
        is_valid = processor.validate_data(test_data, ["timestamp", "data"])
        print(f"? ������֤: {is_valid}")
        
        # ��������
        processed = processor.process_data(test_data)
        print(f"? ���ݴ�����ɣ��ֶ���: {len(processed)}")
        
        return True
    except Exception as e:
        print(f"? ���ݴ���ģ�����ʧ��: {e}")
        return False


def test_logger():
    """������־ģ��"""
    print("\n������־ģ��...")
    try:
        from utils.logger import app_logger as logger
        
        logger.info("����һ��������־")
        logger.warning("����һ��������־")
        print("? ��־ģ������")
        return True
    except Exception as e:
        print(f"? ��־ģ�����ʧ��: {e}")
        return False


def main():
    """�����Ժ���"""
    print("=" * 50)
    print("Cyber Railway ģ�����")
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
    print(f"���Խ��: {passed}/{total} ͨ��")
    print("=" * 50)
    
    if passed == total:
        print("? ���в���ͨ����ϵͳ׼��������")
        return 0
    else:
        print("?? ���ֲ���ʧ�ܣ��������ú�������")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
