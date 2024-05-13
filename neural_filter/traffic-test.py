import socket

HOST = "192.168.0.189"
PORT=3090


with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()

    print(f"Listening on {HOST}:{PORT}")
    conn, addr = s.accept()

    print(f"{conn}")
    print(f"{addr}")

    with conn:
        print("Connected by", addr)
        while True:
            data = conn.recv(1024)
            if not data:
                break
            print(f"Received data: {data.decode()}")
