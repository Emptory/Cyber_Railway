#!/usr/bin/env python3
"""
Cyber Railway ���ݴ������������

���ܣ�
1. �Ӷ��ѵ�ģ�ͷ����ȡ����
2. �������֤����
3. �ϴ����ݵ������Ʒ�����
4. ��ʱִ�кʹ�����
"""

import sys
import os
from pathlib import Path

# �����Ŀ��Ŀ¼��Python·��
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from scheduler.task_scheduler import TaskScheduler
from utils.logger import app_logger as logger
from config.settings import settings


def main():
    """������"""
    logger.info("=" * 50)
    logger.info("Cyber Railway ���ݴ����������")
    logger.info("=" * 50)
    
    # ��ʾ������Ϣ
    logger.info(f"ģ�ͷ����ַ: {settings.model_service_url}")
    logger.info(f"�Ʒ�������ַ: {settings.cloud_server_url}")
    logger.info(f"���ݻ�ȡ���: {settings.fetch_interval} ��")
    
    # �������������
    scheduler = TaskScheduler()
    
    try:
        # ��ʼ��������
        logger.info("���ڳ�ʼ��������...")
        scheduler.initialize()
        
        # ����������
        logger.info("�����������ݴ������...")
        scheduler.start()
        
    except KeyboardInterrupt:
        logger.info("���յ��ж��źţ�����ֹͣ����...")
    except Exception as e:
        logger.error(f"�������г���: {e}")
        return 1
    finally:
        scheduler.cleanup()
        logger.info("���ݴ��������ֹͣ")
    
    return 0


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
