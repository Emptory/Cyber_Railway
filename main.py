# -*- coding: GB2312 -*-
import socket

def start_server(host='0.0.0.0', port=8080):
    # ����һ�� socket ����
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(5)  # ���������Ϊ 5
    print(f"�����������������ڼ��� {host}:{port}...")

    try:
        while True:
            # ���ܿͻ�������
            client_socket, client_address = server_socket.accept()
            print(f"���յ����� {client_address} ������")

            # ��������
            data = client_socket.recv(1024)  # ÿ�������� 1024 �ֽ�
            if data:
                print(f"���յ�����: {data.decode('utf-8')}")

            # �رտͻ�������
            client_socket.close()
    except KeyboardInterrupt:
        print("��������ֹͣ")
    finally:
        server_socket.close()

if __name__ == "__main__":
    start_server()
