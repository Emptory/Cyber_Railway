from loguru import logger
import sys
from pathlib import Path


def setup_logger(log_level: str = "INFO", log_dir: str = "logs"):
    """������־ϵͳ"""
    
    # ������־Ŀ¼
    log_path = Path(log_dir)
    log_path.mkdir(exist_ok=True)
    
    # �Ƴ�Ĭ�ϵĿ���̨���
    logger.remove()
    
    # ��ӿ���̨���
    logger.add(
        sys.stdout,
        level=log_level,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
               "<level>{level: <8}</level> | "
               "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
               "<level>{message}</level>",
        colorize=True
    )
    
    # ����ļ����
    logger.add(
        log_path / "app.log",
        level=log_level,
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} | {message}",
        rotation="100 MB",
        retention="7 days",
        compression="zip",
        encoding="utf-8"
    )
    
    # ��Ӵ�����־�ļ�
    logger.add(
        log_path / "error.log",
        level="ERROR",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} | {message}",
        rotation="50 MB",
        retention="30 days",
        compression="zip",
        encoding="utf-8"
    )
    
    return logger


# ��ȡӦ����־ʵ��
app_logger = setup_logger()
