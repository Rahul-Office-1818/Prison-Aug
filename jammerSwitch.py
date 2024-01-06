from socket import *

class Switch:
    def __init__(self, ip: str, port: int):
        self.ip = ip
        self.port = port
        self.address = (self.ip, self.port)
        self.on_packet = bytearray("module1".encode())
        self.off_packet = bytearray("module2".encode())
        self.voltage_packet = bytearray("module3".encode())
        self.sock = socket(AF_INET, SOCK_DGRAM)

    
    def on(self):
        try: self.sock.sendto(self.on_packet, self.address)
        except Exception as e: print(f"[+] SOMETHING WENT WRONG : {e}")
    
    def off(self):
        try: self.sock.sendto(self.off_packet, self.address)
        except Exception as e: print(f"[+] SOMETHING WENT WRONG : {e}")
    
    def log(self):
        try:
            data, address = self.sock.recvfrom(2048)
            print(f"Response data : {data}")
            print(f'Response address : {address}')
        except Exception as e:
            print(e)

    def run(self):
        while True:
            user = int(input("\n\nPress command \n [+] 1 --> on \n [+] 2 --> off \n [!] press any key for exit \n\n"))
            if user == 1:
                self.on()
                self.log()
            elif user == 2:
                self.off()
                self.log()
            else:
                exit()
HOST = input("[+] PLEASE ENTER THE IP ADDRESS : ")
PORT = int(input("[+] PLEASE ENTER THE IP PORT : "))              
Switch(HOST, PORT).run()