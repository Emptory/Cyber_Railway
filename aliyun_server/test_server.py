#!/usr/bin/env python3
"""
�����Ʒ������˲��Խű�
"""

import requests
import json
from datetime import datetime
import time


def test_server(base_url="http://localhost:5000"):
    """���Է����������ӿ�"""
    
    print("=" * 50)
    print("��ʼ���԰����Ʒ������˽ӿ�")
    print("=" * 50)
    
    # 1. ���Խ������
    print("\n1. ���Խ������ӿ�...")
    try:
        response = requests.get(f"{base_url}/api/health", timeout=10)
        if response.status_code == 200:
            print("? �������ͨ��")
            print(f"   ��Ӧ: {response.json()}")
        else:
            print(f"? �������ʧ��: {response.status_code}")
            return False
    except Exception as e:
        print(f"? ��������쳣: {e}")
        return False
    
    # 2. ���������ϴ�
    print("\n2. ���������ϴ��ӿ�...")
    test_data = {
        "timestamp": datetime.now().isoformat(),
        "data": {
            "id": f"test_data_{int(time.time())}",
            "model_output": {
                "prediction": "test_result",
                "confidence": 0.95,
                "features": [1.2, 3.4, 5.6]
            },
            "processing_time": 1.5
        },
        "metadata": {
            "source": "test_client",
            "version": "1.0",
            "test": True
        }
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/v1/data/upload",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("? �����ϴ��ɹ�")
                print(f"   ����ID: {result.get('data_id')}")
                data_id = result.get('data_id')
            else:
                print(f"? �����ϴ�ʧ��: {result.get('message')}")
                return False
        else:
            print(f"? �����ϴ�ʧ��: {response.status_code}")
            print(f"   ��Ӧ: {response.text}")
            return False
    except Exception as e:
        print(f"? �����ϴ��쳣: {e}")
        return False
    
    # 3. �������ݲ�ѯ
    print("\n3. �������ݲ�ѯ�ӿ�...")
    try:
        response = requests.get(f"{base_url}/api/v1/data?page=1&per_page=5", timeout=10)
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("? ���ݲ�ѯ�ɹ�")
                print(f"   ��������: {len(result.get('data', []))}")
            else:
                print(f"? ���ݲ�ѯʧ��: {result.get('message')}")
        else:
            print(f"? ���ݲ�ѯʧ��: {response.status_code}")
    except Exception as e:
        print(f"? ���ݲ�ѯ�쳣: {e}")
    
    # 4. ������������
    if 'data_id' in locals():
        print("\n4. ������������ӿ�...")
        try:
            response = requests.get(f"{base_url}/api/v1/data/{data_id}", timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get('success'):
                    print("? ���������ѯ�ɹ�")
                    print(f"   ����ID: {result['data']['data_id']}")
                else:
                    print(f"? ���������ѯʧ��: {result.get('message')}")
            else:
                print(f"? ���������ѯʧ��: {response.status_code}")
        except Exception as e:
            print(f"? ���������ѯ�쳣: {e}")
    
    # 5. ����ͳ����Ϣ
    print("\n5. ����ͳ����Ϣ�ӿ�...")
    try:
        response = requests.get(f"{base_url}/api/v1/stats", timeout=10)
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("? ͳ����Ϣ��ѯ�ɹ�")
                stats = result.get('stats', {})
                print(f"   ��������: {stats.get('total_count')}")
                print(f"   ��������: {stats.get('today_count')}")
            else:
                print(f"? ͳ����Ϣ��ѯʧ��: {result.get('message')}")
        else:
            print(f"? ͳ����Ϣ��ѯʧ��: {response.status_code}")
    except Exception as e:
        print(f"? ͳ����Ϣ��ѯ�쳣: {e}")
    
    print("\n" + "=" * 50)
    print("�������˽ӿڲ������")
    print("=" * 50)
    
    return True


def stress_test(base_url="http://localhost:5000", num_requests=10):
    """ѹ������"""
    print(f"\n��ʼѹ�����ԣ����� {num_requests} ����������...")
    
    import threading
    import time
    
    results = []
    start_time = time.time()
    
    def send_request(i):
        try:
            test_data = {
                "timestamp": datetime.now().isoformat(),
                "data": {
                    "id": f"stress_test_{i}_{int(time.time())}",
                    "test_index": i,
                    "value": i * 10
                },
                "metadata": {"source": "stress_test"}
            }
            
            response = requests.post(
                f"{base_url}/api/v1/data/upload",
                json=test_data,
                timeout=30
            )
            
            results.append({
                "index": i,
                "status_code": response.status_code,
                "success": response.status_code == 200
            })
        except Exception as e:
            results.append({
                "index": i,
                "error": str(e),
                "success": False
            })
    
    # �����߳�
    threads = []
    for i in range(num_requests):
        thread = threading.Thread(target=send_request, args=(i,))
        threads.append(thread)
        thread.start()
    
    # �ȴ������߳����
    for thread in threads:
        thread.join()
    
    end_time = time.time()
    duration = end_time - start_time
    
    # ͳ�ƽ��
    success_count = sum(1 for r in results if r.get('success'))
    
    print(f"? ѹ���������:")
    print(f"   ��������: {num_requests}")
    print(f"   �ɹ�����: {success_count}")
    print(f"   ʧ������: {num_requests - success_count}")
    print(f"   �ܺ�ʱ: {duration:.2f} ��")
    print(f"   ƽ��QPS: {num_requests / duration:.2f}")


if __name__ == "__main__":
    import sys
    
    # Ĭ�Ϸ�������ַ
    server_url = "http://localhost:5000"
    
    # ����ṩ�˲�����ʹ�ò�����Ϊ��������ַ
    if len(sys.argv) > 1:
        server_url = sys.argv[1]
    
    print(f"���Է�����: {server_url}")
    
    # �������ܲ���
    if test_server(server_url):
        print("\n�������ܲ���ͨ����")
        
        # ѯ���Ƿ����ѹ������
        choice = input("\n�Ƿ����ѹ�����ԣ�(y/N): ")
        if choice.lower() == 'y':
            stress_test(server_url, 20)
    else:
        print("\n�������ܲ���ʧ�ܣ����������״̬��")
        sys.exit(1)
