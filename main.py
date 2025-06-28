# -*- coding: GB2312 -*-
import socket

def start_server(host='0.0.0.0', port=8080):
    # 创建一个 socket 对象
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(5)  # 最大连接数为 5
    print(f"服务器已启动，正在监听 {host}:{port}...")

    try:
        while True:
            # 接受客户端连接
            client_socket, client_address = server_socket.accept()
            print(f"接收到来自 {client_address} 的连接")

            # 接收数据
            data = client_socket.recv(1024)  # 每次最多接收 1024 字节
            if data:
                print(f"接收到数据: {data.decode('utf-8')}")

            # 关闭客户端连接
            client_socket.close()
    except KeyboardInterrupt:
        print("服务器已停止")
    finally:
        server_socket.close()

if __name__ == "__main__":
    start_server()
