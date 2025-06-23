#!/usr/bin/env python3
"""
阿里云服务器端测试脚本
"""

import requests
import json
from datetime import datetime
import time


def test_server(base_url="http://localhost:5000"):
    """测试服务器各个接口"""
    
    print("=" * 50)
    print("开始测试阿里云服务器端接口")
    print("=" * 50)
    
    # 1. 测试健康检查
    print("\n1. 测试健康检查接口...")
    try:
        response = requests.get(f"{base_url}/api/health", timeout=10)
        if response.status_code == 200:
            print("? 健康检查通过")
            print(f"   响应: {response.json()}")
        else:
            print(f"? 健康检查失败: {response.status_code}")
            return False
    except Exception as e:
        print(f"? 健康检查异常: {e}")
        return False
    
    # 2. 测试数据上传
    print("\n2. 测试数据上传接口...")
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
                print("? 数据上传成功")
                print(f"   数据ID: {result.get('data_id')}")
                data_id = result.get('data_id')
            else:
                print(f"? 数据上传失败: {result.get('message')}")
                return False
        else:
            print(f"? 数据上传失败: {response.status_code}")
            print(f"   响应: {response.text}")
            return False
    except Exception as e:
        print(f"? 数据上传异常: {e}")
        return False
    
    # 3. 测试数据查询
    print("\n3. 测试数据查询接口...")
    try:
        response = requests.get(f"{base_url}/api/v1/data?page=1&per_page=5", timeout=10)
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("? 数据查询成功")
                print(f"   数据条数: {len(result.get('data', []))}")
            else:
                print(f"? 数据查询失败: {result.get('message')}")
        else:
            print(f"? 数据查询失败: {response.status_code}")
    except Exception as e:
        print(f"? 数据查询异常: {e}")
    
    # 4. 测试数据详情
    if 'data_id' in locals():
        print("\n4. 测试数据详情接口...")
        try:
            response = requests.get(f"{base_url}/api/v1/data/{data_id}", timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get('success'):
                    print("? 数据详情查询成功")
                    print(f"   数据ID: {result['data']['data_id']}")
                else:
                    print(f"? 数据详情查询失败: {result.get('message')}")
            else:
                print(f"? 数据详情查询失败: {response.status_code}")
        except Exception as e:
            print(f"? 数据详情查询异常: {e}")
    
    # 5. 测试统计信息
    print("\n5. 测试统计信息接口...")
    try:
        response = requests.get(f"{base_url}/api/v1/stats", timeout=10)
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("? 统计信息查询成功")
                stats = result.get('stats', {})
                print(f"   总数据量: {stats.get('total_count')}")
                print(f"   今日数据: {stats.get('today_count')}")
            else:
                print(f"? 统计信息查询失败: {result.get('message')}")
        else:
            print(f"? 统计信息查询失败: {response.status_code}")
    except Exception as e:
        print(f"? 统计信息查询异常: {e}")
    
    print("\n" + "=" * 50)
    print("服务器端接口测试完成")
    print("=" * 50)
    
    return True


def stress_test(base_url="http://localhost:5000", num_requests=10):
    """压力测试"""
    print(f"\n开始压力测试，发送 {num_requests} 个并发请求...")
    
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
    
    # 创建线程
    threads = []
    for i in range(num_requests):
        thread = threading.Thread(target=send_request, args=(i,))
        threads.append(thread)
        thread.start()
    
    # 等待所有线程完成
    for thread in threads:
        thread.join()
    
    end_time = time.time()
    duration = end_time - start_time
    
    # 统计结果
    success_count = sum(1 for r in results if r.get('success'))
    
    print(f"? 压力测试完成:")
    print(f"   总请求数: {num_requests}")
    print(f"   成功请求: {success_count}")
    print(f"   失败请求: {num_requests - success_count}")
    print(f"   总耗时: {duration:.2f} 秒")
    print(f"   平均QPS: {num_requests / duration:.2f}")


if __name__ == "__main__":
    import sys
    
    # 默认服务器地址
    server_url = "http://localhost:5000"
    
    # 如果提供了参数，使用参数作为服务器地址
    if len(sys.argv) > 1:
        server_url = sys.argv[1]
    
    print(f"测试服务器: {server_url}")
    
    # 基础功能测试
    if test_server(server_url):
        print("\n基础功能测试通过！")
        
        # 询问是否进行压力测试
        choice = input("\n是否进行压力测试？(y/N): ")
        if choice.lower() == 'y':
            stress_test(server_url, 20)
    else:
        print("\n基础功能测试失败，请检查服务器状态。")
        sys.exit(1)
