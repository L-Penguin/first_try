import socket
import sqlite3
import pink5


def addmessage(datas):
    conn = sqlite3.connect(r"D:\Task_bridgeMonitor\svntest2\web\backend\tensor1.db")
    temp = 'INSERT INTO TENSOR (ID,READTIME,COUNTER,DIVECEID,MACADDRESS,ADC,SENSORDATA) VALUES(?,?,?,?,?,?,?)'
    with conn:
        conn.execute(temp, datas)


def readFileToArr(fileName):
    file = open(fileName, "r")
    lineArr = []
    for line in file:
        lineArr.append(line)
    file.close()
    return lineArr


if __name__ == "__main__":
    fileName = r'C:\Users\L_PenguinQAQ\Desktop\mqtt0902.txt'
    fileArr = readFileToArr(fileName)
    i = 1
    temp = set()
    for data in fileArr:
        try:
            data = str(data).replace('\n', '').split("now time: ")[1].split("   ")
            dataTemp = []
            readTime = data[0]
            if "aeae00" in data[1]:
                sensorData = data[1].split("aeae00")[0] + "aeae"
                if sensorData[2:6] == "abad":
                    sensorData = sensorData[2:]
                counter, diveceid = 123, 231
                extraData = "00" + data[1].split("aeae00")[1]
                macAddress = extraData[0:16]
                subNodeADC = 1.224*4095/int(extraData[24:28], 16)
                priNodeADC = int(extraData[28:32], 16)
                priNodeTEMP = int(extraData[32:36], 16)
                dataTemp.append(None)
                dataTemp.append(readTime)
                dataTemp.append(counter)
                dataTemp.append(diveceid)
                dataTemp.append(macAddress)
                dataTemp.append(subNodeADC)
                dataTemp.append(sensorData)
                i += 1
                temp.add(macAddress)
                print(dataTemp)
                addmessage(dataTemp)
                temp.add(macAddress)
                print(i)

        except (IndexError, ValueError):
            continue

print(temp)
print("长度: ", len(temp))




