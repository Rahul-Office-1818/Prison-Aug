from socket import *
 
address = ( '192.168.88.61', 5066) #Defind who you are talking to (must match server IP and port)
client_socket = socket(AF_INET, SOCK_DGRAM) #Set Up the Socket


def switch():
    
    print("Enter Command\n")
    
    while True:
     option = (input("your option : "))
     #option = "37"

     if (option != '0'):                          
       encoded_string = option.encode()
       data = bytearray(encoded_string)
       print(data)
       
       client_socket.sendto(data, address) #send command to server
             
       try:
        rec_data, addr = client_socket.recvfrom(2048) #Read response from server
        print (rec_data) #Print the response from server
        rec_data = '\0'
       except:
        pass    
       option = '0'                                                  
                                    
            
switch()