from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.executors.pool import ThreadPoolExecutor
import signal
import sys
from datetime import datetime
from typing import Optional

from config.settings import settings
from data_transfer.model_client import ModelClient
from data_transfer.cloud_client import CloudClient
from data_transfer.data_processor import DataProcessor
from utils.logger import app_logger as logger


class TaskScheduler:
    """任务调度器"""
    
    def __init__(self):
        self.scheduler = None
        self.model_client = None
        self.cloud_client = None
        self.data_processor = None
        self.is_running = False
        
        # 设置信号处理
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def initialize(self):
        """初始化调度器和客户端"""
        try:
            # 初始化调度器
            executors = {
                'default': ThreadPoolExecutor(max_workers=settings.get('scheduler.max_workers', 3))
            }
            
            self.scheduler = BlockingScheduler(
                executors=executors,
                timezone='Asia/Shanghai'
            )
            
            # 初始化客户端
            self.model_client = ModelClient(
                base_url=settings.model_service_url,
                timeout=settings.get('model_service.timeout', 30)
            )
            
            self.cloud_client = CloudClient(
                server_url=settings.cloud_server_url,
                timeout=settings.get('alibaba_cloud.timeout', 60)
            )
            
            self.data_processor = DataProcessor(
                max_size_mb=settings.get('data_processing.validation.max_size_mb', 50)
            )
            
            logger.info("任务调度器初始化完成")
            
        except Exception as e:
            logger.error(f"初始化调度器失败: {e}")
            raise
    
    def add_data_transfer_job(self):
        """添加数据传输任务"""
        try:
            # 获取调度间隔
            interval = settings.fetch_interval
            
            # 添加定时任务
            self.scheduler.add_job(
                func=self._transfer_data_job,
                trigger=IntervalTrigger(seconds=interval),
                id='data_transfer_job',
                name='数据传输任务',
                max_instances=1,  # 同时只能运行一个实例
                replace_existing=True
            )
            
            logger.info(f"数据传输任务已添加，执行间隔: {interval} 秒")
            
            # 如果配置了立即执行
            if settings.get('scheduler.run_immediately', True):
                self.scheduler.add_job(
                    func=self._transfer_data_job,
                    trigger='date',
                    run_date=datetime.now(),
                    id='immediate_transfer_job',
                    name='立即执行数据传输'
                )
                logger.info("已安排立即执行数据传输任务")
            
        except Exception as e:
            logger.error(f"添加数据传输任务失败: {e}")
            raise
    
    def _transfer_data_job(self):
        """数据传输任务的具体实现"""
        job_start_time = datetime.now()
        logger.info("开始执行数据传输任务")
        
        try:
            # 1. 检查模型服务健康状态
            if not self.model_client.health_check():
                logger.warning("模型服务健康检查失败，跳过本次传输")
                return
            
            # 2. 从模型服务获取数据
            raw_data = self.model_client.get_model_data()
            if not raw_data:
                logger.warning("未获取到模型数据")
                return
            
            logger.info(f"成功获取模型数据: {len(str(raw_data))} 字符")
            
            # 3. 验证和处理数据
            required_fields = settings.get('data_processing.validation.required_fields', [])
            
            if not self.data_processor.validate_data(raw_data, required_fields):
                logger.error("数据验证失败，跳过上传")
                return
            
            processed_data = self.data_processor.process_data(
                raw_data, 
                add_metadata=settings.get('data_processing.transformation.add_metadata', True)
            )
            
            # 4. 上传到阿里云
            upload_success = self.cloud_client.upload_data(processed_data)
            
            if upload_success:
                job_duration = (datetime.now() - job_start_time).total_seconds()
                logger.info(f"数据传输任务完成，耗时: {job_duration:.2f} 秒")
            else:
                logger.error("数据上传失败")
                
        except Exception as e:
            logger.error(f"数据传输任务执行失败: {e}")
            # 可以在这里添加告警通知逻辑
    
    def start(self):
        """启动调度器"""
        try:
            if not self.scheduler:
                raise Exception("调度器未初始化")
            
            self.is_running = True
            logger.info("启动任务调度器...")
            
            # 添加任务
            self.add_data_transfer_job()
            
            # 启动调度器
            self.scheduler.start()
            
        except Exception as e:
            logger.error(f"启动调度器失败: {e}")
            self.cleanup()
            raise
    
    def stop(self):
        """停止调度器"""
        if self.scheduler and self.scheduler.running:
            logger.info("正在停止任务调度器...")
            self.scheduler.shutdown(wait=True)
            self.is_running = False
            logger.info("任务调度器已停止")
    
    def cleanup(self):
        """清理资源"""
        try:
            if self.model_client:
                self.model_client.close()
            if self.cloud_client:
                self.cloud_client.close()
            logger.info("资源清理完成")
        except Exception as e:
            logger.error(f"清理资源时出错: {e}")
    
    def _signal_handler(self, signum, frame):
        """信号处理器"""
        logger.info(f"接收到信号 {signum}，正在优雅停止...")
        self.stop()
        self.cleanup()
        sys.exit(0)
    
    def get_scheduler_status(self) -> dict:
        """获取调度器状态"""
        if not self.scheduler:
            return {"status": "not_initialized"}
        
        return {
            "status": "running" if self.scheduler.running else "stopped",
            "jobs": len(self.scheduler.get_jobs()),
            "is_running": self.is_running
        }
