from functools import wraps
import time
from typing import Callable, Any
from utils.logger import app_logger as logger


def retry_on_failure(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """
    ����װ����
    
    Args:
        max_attempts: ������Դ���
        delay: ��ʼ�ӳ�ʱ�䣨�룩
        backoff: �˱ܱ���
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            last_exception = None
            current_delay = delay
            
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    
                    if attempt < max_attempts - 1:  # �������һ�γ���
                        logger.warning(
                            f"���� {func.__name__} �� {attempt + 1} �ε���ʧ��: {e}��"
                            f"{current_delay:.1f}�������..."
                        )
                        time.sleep(current_delay)
                        current_delay *= backoff
                    else:
                        logger.error(f"���� {func.__name__} ���� {max_attempts} �����Ժ���Ȼʧ��")
            
            # �������Զ�ʧ�ܣ��׳����һ���쳣
            raise last_exception
        
        return wrapper
    return decorator


class RetryableError(Exception):
    """�����ԵĴ���"""
    pass


class NonRetryableError(Exception):
    """�������ԵĴ���"""
    pass
