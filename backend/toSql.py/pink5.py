import time
import sqlite3
import numpy as np
from scipy import signal
import scipy.integrate as it
import matplotlib.pyplot as plt

# 自由晃动
# readdata = "abad4b5b05004da44e23004b120004d365ef4cfd80ff0e0154fd88ff0a0104fd6c01ae0088fe9402cc0020fe2602d4000cfe3801160120fe9c002c01fefdeeff1401aeaeabad4b5b0501e0fd50ffee00e6fd9efe1a01f8fde2fd4801befd90fd5c01f2fd40fe9001eefdfefe2c014efdc0fff00038fd6e01da00c0fe3802d80026fe0002dc00aeaeabad4b5b050240fe360122014efea2003e011afe06002c0112fe76ff06013cfee0fef40016fe50fe1c0112fef4fd2a0134fe54fe72010cfecefe6401b0fd52ff1601aeaeabad4b5b0503fefcba00f60048fec001c60086fe0c02e0000afe7401120148fec000340126fe3a003c0134feb2ff38011afe18ff18014cfe64fe1c0108feb0fd3801aeaeabad4b5b0504d4fdc8fd8401dcfd86fea00144fd58ff1801b2fc6001b8008efe9402ca00e0fd660296004efe2401fa003cfe7200240136fedcff440100fe38ff3201aeae"
# x轴
# readdata = "abad36cb06000faa4e23004b120004ea37451c001000c6fe5a0016007afeb000000094fec000f2ff2aff3c01eaff2cff4201eaff46ffee00dcff24ff0601ecffe8feaeaeabad36cb060180002200c8ff7e0036001400f0ff1e00baffb6fff6ff68ff0cff000054ff78fe00004cff74ff000050ff48ff040078ff2affeaffecffeafff0ff6efeaeaeabad36cb06024800ecff4cff8200e8ff3effce00feff5cff3601e8ff3efff200f6ff2cff0e010c007affd2000e00a0ffa600ccff16ff1000eeff9cff74ffe6fff6feaeaeabad36cb06030effe6ffa2ffa0feeeff42ff7cff2e0046ff3aff00008aff7cffb0ff22ffa0fff2ffa2ff000002005effd4000000a6fee6001e003aff3c0106003effaeaeabad36cb0604d400f2ff40ffec00f8fff6feaa00ecff1aff80001e005cff1600f8ff32fffaff0800c2fe98ff260010ff1affd8ff36ffd8fec0ff32ff4eff06002effaeae"
# y轴
readdata = "abadeb680d000faa4e23004b120004ee5cb4180066ff26ff0e0078ff44ff000086ff78ff0200b6ff00ffe2ffdcff34ffd2ffeaffbcff00000a00c0ff3600580034ffaeaeabadeb680d015000660012ff2600c00016ff1000060122ff0c000c014aff1400fe0022ff3800f2004aff0e00f2003cff2400e6004eff3200a60026ff2c00be0048ffaeaeabadeb680d020e009a003aff1800760018ff02006c006aff2400180022fff2ffc0ffecfef8ffbcff18ff300072ffe6fe000054ff0cff180050ff4cff200028ff52ffaeaeabadeb680d0304001aff1aff060040ff2aff0a005cff2eff000080ff38ff00008eff2aff3e009eff14ff0800d6ff1aff6c00e0ff46ff2000320082ff1200620026ffaeaeabadeb680d041200800054ff0600ce004cff1e00fe0054ff3000140114ff2400280134ff1a00fc003eff3400fa0042ff3000e20038ff2c00ce0038ff1e00aa0022ffaeae"
# z轴
# readdata = "abad0c4b0c0023a34e23004b120004de5bcfca011aff2e04ca0110ff1204c00112ff7203a80122ff04039a0140ff18038e013cff9a038e014aff1204b0016aff8804aeaeabad0c4b0c018e015effe8044a015eff6205f40054ffb005b00066ffde056a0060ff080634006aff02061e006cfffa051a0060ffe205360046ffca059c0048ff9805aeaeabad0c4b0c02fc0064ff520546014cffe80490015eff7604c0015eff0404a60152ff94038e0158ff4c03700144ff3a0368014cff96038c0154ff0c048a0166ff8204aeaeabad0c4b0c03580160ffe204120160ff4a05dc0064ff8605a6006cffc205560066fff6052a0068fffc052a0068ff1406160058fffc05480048ffe605980050ffc005aeaeabad0c4b0c04ea0060ff8005540156ff2c058c0146ff7e04ee013cffe203f00140ff5603d2015eff3203a40170ff5c0378015cffc60374015aff1404880168ff7204aeae"


def hextoint(strdata): # 十六进制转十进制
    tempp = int(strdata, 16)
    if tempp & 32768 != 32768:
        return tempp
    else:
        return -(65535 - tempp + 1)


def calamp(readdata): # 计算幅度频率
    timedata = [] 
    for i in range(8): # 第一行abad有八个数据点
        timedata.append(readdata[36 + 12 * i:48 + 12 * i])

    for i in range(4):  # 第2-5行abad有十个数据点
        for j in range(10):
            timedata.append(readdata[136 + 136 * i + 12 * j + 12:136 + 136 * i + 12 * j + 12 + 12])

    # amptime = []
    # ampdata = []
    maxtime = 0
    maxdata = 0
    xyzdata = np.zeros((48, 3))

    for i in range(48): # 区分三个轴
        xyzdata[i][0] = hextoint(timedata[i][2:4] + timedata[i][0:2]) / 32768 * 16
        xyzdata[i][1] = hextoint(timedata[i][6:8] + timedata[i][4:6]) / 32768 * 16
        xyzdata[i][2] = hextoint(timedata[i][10:12] + timedata[i][8:10]) / 32768 * 16

    xori = xyzdata[:, 0]
    yori = xyzdata[:, 1]
    zori = xyzdata[:, 2]

    b, a = signal.butter(2, 0.25, 'lowpass')  # 配置滤波器 8 表示滤波器的阶数
    # xfiltedData = signal.filtfilt(b, a, xori)  # data为要过滤的信号
    # yfiltedData = signal.filtfilt(b, a, yori)
    # zfiltedData = signal.filtfilt(b, a, zori)

    # 载入三轴滤波后的加速度
    allfiltedData = []
    allfiltedData.append(signal.filtfilt(b, a, xori))  # data为要过滤的信号
    allfiltedData.append(signal.filtfilt(b, a, yori))
    allfiltedData.append(signal.filtfilt(b, a, zori))

    for xfiltedData in allfiltedData:
        # 所有极大值的点和值
        peakhigh = signal.argrelextrema(xfiltedData, np.greater)
        peakhigh = peakhigh[0]
        peakhighdata = xfiltedData[peakhigh]
        # 所有极小值的点和值
        peaklow = signal.argrelextrema(-xfiltedData, np.greater)
        peaklow = peaklow[0]
        peaklowdata = xfiltedData[peaklow]

        m = 0
        peakall = np.zeros(len(peakhigh) + len(peaklow))
        peakdata = np.zeros(len(peakhigh) + len(peaklow))

        if peakhigh[0] > peaklow[0]:
            while m < len(peakall):
                if m % 2 == 0:
                    peakall[m] = peaklow[int(m / 2)]
                    peakdata[m] = peaklowdata[int(m / 2)]
                else:
                    peakall[m] = peakhigh[int(m / 2)]
                    peakdata[m] = peakhighdata[int(m / 2)]
                m += 1
        else:
            while m < len(peakall):
                if m % 2 != 0:
                    peakall[m] = peaklow[int(m / 2)]
                    peakdata[m] = peaklowdata[int(m / 2)]
                else:
                    peakall[m] = peakhigh[int(m / 2)]
                    peakdata[m] = peakhighdata[int(m / 2)]
                m += 1

        # 查找差值最大的一对极值
        gap = 0
        biggestgap = 0
        for i in range(1, len(peakall)):
            if abs(peakdata[i] - peakdata[i - 1]) > gap:
                gap = abs(peakdata[i] - peakdata[i - 1])
                biggestgap = i

        pdata = xfiltedData[int(peakall[biggestgap - 1]):int(peakall[biggestgap]) + 1]
        pdata = pdata - np.mean(pdata)
        vdata = it.cumtrapz(pdata, initial=0)
        ldata = it.cumtrapz(vdata, initial=0)

        # amptime.append(peakall[biggestgap] - peakall[biggestgap - 1])
        # ampdata.append(ldata[-1])
        if abs(ldata[-1]) > maxdata:
            maxdata = int(abs(ldata[-1])*100)
            maxtime = int(peakall[biggestgap] - peakall[biggestgap - 1])

    return maxdata, maxtime


x, y = calamp(readdata)

