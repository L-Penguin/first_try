import socket
import time
import sqlite3
import pink5


def addmsg(datas):
    conn = sqlite3.connect("D:\Task_bridgeMonitor\svntest2\web\backend\tensor.db")
    temp = 'INSERT INTO TENSOR (ID,READTIME,COUNTER,DIVECEID,MACADDRESS,ADC,SENSORDATA) VALUES(?,?,?,?,?,?,?)'
    with conn:
        conn.execute(temp, datas)


BUFSIZE = 1024
ip_port = ('0.0.0.0', 2222)
server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # udp协议
server.bind(ip_port)
while True:
    data, client_addr = server.recvfrom(BUFSIZE)
    readdata = data.hex()
    # print('server收到的数据：', readdata)
    a = open('C:\Users\L_PenguinQAQ\Desktop\mqtt0902.txt', 'a')
    a.write("\nnow time: " + time.ctime() + "   " + readdata)
    a.close()

    if readdata[0:4] == "abad" and readdata[10:12] == "00" and readdata[132:136] == "aeae":
        x, y = pink5.calamp(readdata)  # 返回最大振幅及其频率
        datastemp = []  # 生成数据包
        datastemp.append(None)  # 数据库自动生产ID
        datastemp.append(time.ctime())  # 当前时间
        datastemp.append(x)
        datastemp.append(y)
        datastemp.append(readdata[12:28])  # 终端MAC
        datastemp.append(int(readdata[28:32], 16))  # 终端ADC电压
        datastemp.append(readdata)  # 终端原始数据
        addmsg(datastemp)
        # if readdata[12:28] == "65a14e23004b1200":
        coordinator = []
        coordinator.append(None)
        coordinator.append(time.ctime())
        x = int(readdata[680:684], 16) * 3.3 * 2 / 4096  # 协调器ADC
        y = (1.43 - int(readdata[684:688], 16) / 4096 * 3.3) / 0.0043 + 25  # 协调器温度
        coordinator.append(int(x * 100))  # 小数变整数，vue中再变成小数
        coordinator.append(int(y * 100))
        coordinator.append("1200120012001200")
        coordinator.append(123)
        coordinator.append("aabbcc")
        print(coordinator[1:5])
        addmsg(coordinator)
server.close()
