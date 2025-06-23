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
    """���������"""
    
    def __init__(self):
        self.scheduler = None
        self.model_client = None
        self.cloud_client = None
        self.data_processor = None
        self.is_running = False
        
        # �����źŴ���
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def initialize(self):
        """��ʼ���������Ϳͻ���"""
        try:
            # ��ʼ��������
            executors = {
                'default': ThreadPoolExecutor(max_workers=settings.get('scheduler.max_workers', 3))
            }
            
            self.scheduler = BlockingScheduler(
                executors=executors,
                timezone='Asia/Shanghai'
            )
            
            # ��ʼ���ͻ���
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
            
            logger.info("�����������ʼ�����")
            
        except Exception as e:
            logger.error(f"��ʼ��������ʧ��: {e}")
            raise
    
    def add_data_transfer_job(self):
        """������ݴ�������"""
        try:
            # ��ȡ���ȼ��
            interval = settings.fetch_interval
            
            # ��Ӷ�ʱ����
            self.scheduler.add_job(
                func=self._transfer_data_job,
                trigger=IntervalTrigger(seconds=interval),
                id='data_transfer_job',
                name='���ݴ�������',
                max_instances=1,  # ͬʱֻ������һ��ʵ��
                replace_existing=True
            )
            
            logger.info(f"���ݴ�����������ӣ�ִ�м��: {interval} ��")
            
            # �������������ִ��
            if settings.get('scheduler.run_immediately', True):
                self.scheduler.add_job(
                    func=self._transfer_data_job,
                    trigger='date',
                    run_date=datetime.now(),
                    id='immediate_transfer_job',
                    name='����ִ�����ݴ���'
                )
                logger.info("�Ѱ�������ִ�����ݴ�������")
            
        except Exception as e:
            logger.error(f"������ݴ�������ʧ��: {e}")
            raise
    
    def _transfer_data_job(self):
        """���ݴ�������ľ���ʵ��"""
        job_start_time = datetime.now()
        logger.info("��ʼִ�����ݴ�������")
        
        try:
            # 1. ���ģ�ͷ��񽡿�״̬
            if not self.model_client.health_check():
                logger.warning("ģ�ͷ��񽡿����ʧ�ܣ��������δ���")
                return
            
            # 2. ��ģ�ͷ����ȡ����
            raw_data = self.model_client.get_model_data()
            if not raw_data:
                logger.warning("δ��ȡ��ģ������")
                return
            
            logger.info(f"�ɹ���ȡģ������: {len(str(raw_data))} �ַ�")
            
            # 3. ��֤�ʹ�������
            required_fields = settings.get('data_processing.validation.required_fields', [])
            
            if not self.data_processor.validate_data(raw_data, required_fields):
                logger.error("������֤ʧ�ܣ������ϴ�")
                return
            
            processed_data = self.data_processor.process_data(
                raw_data, 
                add_metadata=settings.get('data_processing.transformation.add_metadata', True)
            )
            
            # 4. �ϴ���������
            upload_success = self.cloud_client.upload_data(processed_data)
            
            if upload_success:
                job_duration = (datetime.now() - job_start_time).total_seconds()
                logger.info(f"���ݴ���������ɣ���ʱ: {job_duration:.2f} ��")
            else:
                logger.error("�����ϴ�ʧ��")
                
        except Exception as e:
            logger.error(f"���ݴ�������ִ��ʧ��: {e}")
            # ������������Ӹ澯֪ͨ�߼�
    
    def start(self):
        """����������"""
        try:
            if not self.scheduler:
                raise Exception("������δ��ʼ��")
            
            self.is_running = True
            logger.info("�������������...")
            
            # �������
            self.add_data_transfer_job()
            
            # ����������
            self.scheduler.start()
            
        except Exception as e:
            logger.error(f"����������ʧ��: {e}")
            self.cleanup()
            raise
    
    def stop(self):
        """ֹͣ������"""
        if self.scheduler and self.scheduler.running:
            logger.info("����ֹͣ���������...")
            self.scheduler.shutdown(wait=True)
            self.is_running = False
            logger.info("�����������ֹͣ")
    
    def cleanup(self):
        """������Դ"""
        try:
            if self.model_client:
                self.model_client.close()
            if self.cloud_client:
                self.cloud_client.close()
            logger.info("��Դ�������")
        except Exception as e:
            logger.error(f"������Դʱ����: {e}")
    
    def _signal_handler(self, signum, frame):
        """�źŴ�����"""
        logger.info(f"���յ��ź� {signum}����������ֹͣ...")
        self.stop()
        self.cleanup()
        sys.exit(0)
    
    def get_scheduler_status(self) -> dict:
        """��ȡ������״̬"""
        if not self.scheduler:
            return {"status": "not_initialized"}
        
        return {
            "status": "running" if self.scheduler.running else "stopped",
            "jobs": len(self.scheduler.get_jobs()),
            "is_running": self.is_running
        }
