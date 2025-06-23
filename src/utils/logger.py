from loguru import logger
import sys
from pathlib import Path


def setup_logger(log_level: str = "INFO", log_dir: str = "logs"):
    """配置日志系统"""
    
    # 创建日志目录
    log_path = Path(log_dir)
    log_path.mkdir(exist_ok=True)
    
    # 移除默认的控制台输出
    logger.remove()
    
    # 添加控制台输出
    logger.add(
        sys.stdout,
        level=log_level,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
               "<level>{level: <8}</level> | "
               "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
               "<level>{message}</level>",
        colorize=True
    )
    
    # 添加文件输出
    logger.add(
        log_path / "app.log",
        level=log_level,
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} | {message}",
        rotation="100 MB",
        retention="7 days",
        compression="zip",
        encoding="utf-8"
    )
    
    # 添加错误日志文件
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


# 获取应用日志实例
app_logger = setup_logger()
