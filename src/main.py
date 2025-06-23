#!/usr/bin/env python3
"""
Cyber Railway 数据传输服务主程序

功能：
1. 从队友的模型服务获取数据
2. 处理和验证数据
3. 上传数据到阿里云服务器
4. 定时执行和错误处理
"""

import sys
import os
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from scheduler.task_scheduler import TaskScheduler
from utils.logger import app_logger as logger
from config.settings import settings


def main():
    """主函数"""
    logger.info("=" * 50)
    logger.info("Cyber Railway 数据传输服务启动")
    logger.info("=" * 50)
    
    # 显示配置信息
    logger.info(f"模型服务地址: {settings.model_service_url}")
    logger.info(f"云服务器地址: {settings.cloud_server_url}")
    logger.info(f"数据获取间隔: {settings.fetch_interval} 秒")
    
    # 创建任务调度器
    scheduler = TaskScheduler()
    
    try:
        # 初始化调度器
        logger.info("正在初始化调度器...")
        scheduler.initialize()
        
        # 启动调度器
        logger.info("正在启动数据传输服务...")
        scheduler.start()
        
    except KeyboardInterrupt:
        logger.info("接收到中断信号，正在停止服务...")
    except Exception as e:
        logger.error(f"服务运行出错: {e}")
        return 1
    finally:
        scheduler.cleanup()
        logger.info("数据传输服务已停止")
    
    return 0


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
