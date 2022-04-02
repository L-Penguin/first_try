//Bug: 当左下角页数不为第1页时，点击其他按钮显示数据是，页数不重新返回第一页
<template>

	<div class="skill" style="height:totalHeight;">
		<div>
		<h1>用户名：&nbsp;{{user}}</h1>
		<div @click="logout">
			<Icon type="md-power" size="30" />
		</div>
		<strong class="h2">协调器状态：<br>编号：{{num}} 号<br>电量：{{electricity}} V<br>温度：{{temper}}  °C<br>布局：{{layoutType}}</strong>
		<div>
		<input type="button" value="切换布局方式" onclick="changeLayout()" class="button white"/>
		</div>
		</div>
		<div id = "showAllButtons" style="margin-top: 50px; margin-left:270px; width:900px;height:175px" align="center">
		</div>
		<div  style=" margin-left:200px; width:600px" id = "checkAll">
			<input type="button" value="查看所有数据" onclick="showRecentInfo()" class="beautifyBtn2" style="cursor: pointer; height:30px"/>
		</div>
		<!-- ADD INFO -->
		<div class="addInfo" style="margin-top: 150px; margin-left: 200px" id="subTable">
			<div class="showInfo">
				<Table border :columns="table7" :data="dataList" width="1100">

					<template slot-scope="{ row }" slot="action3">
						<img :src=row.AMPPIC height="30" width="150">
						<strong>&nbsp;{{row.AMPLITUDE}}</strong>
					</template>

					<template slot-scope="{ row }" slot="action2">
						<img :src=row.ADCPIC height="30" width="48">
						<strong>&nbsp;{{row.Adc}}%</strong>
					</template>

					<template slot-scope="{ row }" slot="action">
						<Button size="small" style="margin-right: 5px" @click="drawAcceleration('success',row.ID)"
							class="update">显示数据</Button>
					</template>
				</Table>
			</div>

			<br>

			<div style="text-align: center; vertical-align: middle;">
				<strong>
					<Col span="2">
					<!-- <strong id="page">第 1 页</strong> -->
					第 <input type="text" style="text-align:center;margin-top:3px" size = "1" value = 1 id="subPage" onchange = "changeTableByPage(this);"/> 页
					</Col>

					<form @submit.prevent="decreaseglobalindex()">
						<Col span="2">
						<input type="submit" value="上一页" class="beautifyBtn" style="cursor: pointer"/>
						</Col>
					</form>
					<form @submit.prevent="increaseglobalindex()">
						<Col span="1">
						<input type="submit" value="下一页" class="beautifyBtn" style="cursor: pointer"/>
						</Col>
					</form>
					<form @submit.prevent="setting()">
						<Col span="4" >
						<input type="submit" value="设置" class="beautifyBtn" style="cursor: pointer"/>
						</Col>
					</form>
					<form @submit.prevent="drawTrends()">
						<Col span="2">
						<input type="submit" value="趋势分析" class="beautifyBtn" style="cursor: pointer"/>
						</Col>
					</form>
					<form @submit.prevent="$router.push('BtnPage')">
						<Col span="2">
						<input type="submit" value="200个点" class="beautifyBtn" style="cursor: pointer"/>
						</Col>
					</form>
				</strong>


			</div> 

			<br>
			<br>

			<!-- <div class="showPic"> -->
			<div class="showUDP1">
				<Table border :columns="columns13" :data="dataList2">
					<template slot-scope="{ row }" slot="message">
						<strong>{{ row.message }}</strong>
					</template>
					<template slot-scope="{ row, index }" slot="action">
						<Button size="small" style="margin-right: 5px" @click="alterData(row.id)"
							class="update">Alter</Button>
						<Button size="small" @click="remove(row.id)" class="delete">Delete</Button>
					</template>
				</Table>
			</div>
		</div>

		<div class="addInfo" style="margin-top: 150px; margin-left: 200px; display:none" id="priTable">
			<br>
			<div class="showInfo">
				<Table border :columns="table5" :data="dataList2" width="1000">

				</Table>
			</div>
			<br>
			<div style="text-align: center; vertical-align: middle;">
				<strong>
					<Col span="2">
						<!-- <strong id="page">第 1 页</strong> -->
						第 <input type="text" style="text-align:center; margin-top:3px" size = "1" value = 1 id="priPage" onchange = "changeTableByPage(this);"/> 页
					</Col>

					<form @submit.prevent="decreaseglobalindex()">
						<Col span="2">
						<input type="submit" value="上一页" class="beautifyBtn" style="cursor: pointer"/>
						</Col>
					</form>
					<form @submit.prevent="increaseglobalindex()">
						<Col span="1">
						<input type="submit" value="下一页" class="beautifyBtn" style="cursor: pointer"/>
						</Col>
					</form>
				</strong>
				<br><br>
			</div> 
		</div>
	</div>
</template>

<script type="text/javascript">
	import * as echarts from 'echarts'
	import accur1 from '@/assets/accur12.png'
	import accur2 from '@/assets/accur22.png'
	import accur3 from '@/assets/accur32.png'
	import accur4 from '@/assets/accur42.png'
	import amp001 from '@/assets/amp001.png'
	import amp002 from '@/assets/amp002.png'
	import amp003 from '@/assets/amp003.png'
	import amp004 from '@/assets/amp004.png'
	import amp005 from '@/assets/amp005.png'
	import amp006 from '@/assets/amp006.png'
	import amp007 from '@/assets/amp007.png'
	import amp008 from '@/assets/amp008.png'
	import amp009 from '@/assets/amp009.png'
	import amp010 from '@/assets/amp010.png'
	var typeOfShowingButton = "all"
	var globalindex = 0
	const client = require("../client")
	var macAddressArr = {
		"priNode1" : ["003300310f47363530323532", "008600371147373135383230", "004400240347363034303735", "007100340d47363530323532", "002400331647373134303234", "008000541147373135383230", "002c003f1347383235323737",  "004f005b0f47373135383230", "007900560e47383137333835", "003500281147373139303133"],
		"priNode2" : ["003a00280e47363530323532", "0061001a1847373033353732", "007300231847373134303234", "002b00240f47363530323532", "003a005b1547363438303038", "006a00320d47373135383230", "0022002e1147363332383634", "006a002f1847373036353034", "007900310a47363530323532", "005a002c0847363530323532"],
	} 

	var addressKeys = Object.keys(macAddressArr)

	var monthArr = [0, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

	var temp = ""

	var addressArr = {
		"29-S-X-1": "II_1",
		"29-S-X-7": "II_2",
		"29-S-X-14": "II_3",
		"29-S-X-28": "II_4",
		"29-S-X-36": "II_5",
		"29-S-S-1": "II_6",
		"29-S-S-13": "II_7",
		"29-S-S-25": "II_8",
		"29-S-S-36": "II_9",
		"桥下工务段": "II_10",
		"29-M-X-1": "I_1",
		"29-M-X-8": "I_2",
		"29-M-X-14": "I_3",
		"29-M-X-27": "I_4",
		"29-M-X-36": "I_5",
		"29-M-S-1": "IA_1",
		"29-M-S-10": "IA_2",
		"29-M-S-19": "IA_3",
		"29-M-S-28": "IA_4",
		"29-M-S-36": "IA_5",
	}

	var addressName = { 
		"29-M-X":  ["1", "8", "14", "27", "36"], 
		"29-M-S":  ["1", "10", "19", "28", "36"],
		"29-S-X":  ["1", "7", "14", "28", "36"],
		"29-S-S":  ["1", "13", "25", "36", "桥下工务段"]
		}

	var layoutNum = 0

	var priMacAddress = ["main_73", "main_74", "main_72"]

	export default {
		data() {
			return {
				layoutType: "协调器编号",
				priNodes: 3,
				subNodes: [5, 5, 10],
				priNodeValues: ["I", "IA", "II"],
				globalVar: [],
				user: "",
				totalHeight: "",
				accountId: 1,
				electricity: "--",
				temper: "--",
				num: "--",
				message: "",
				orders: "",
				payMethod: "",
				searchId: "",
				createdAt: "",
				// 控制修改用户对话框的显示于隐藏
				editDialogVisible: false,
				modifyId: "",
				modifyMessage: "",
				modifyOrders: "",
				modifyPayMethod: "",
				dataList: [],
				dataList2: [],
				errors: [],
				labelPosition: 'right',
				startTime: "",
				endTime: "",
				alarmThreshold1: 150,
				alarmThreshold2: 100,
				alarmThreshold3: 70,
				refreshStatusAlarm: 1,
				refreshStatusAddress: 1,
				refreshStatusMacArr: 0,
				table7: [{
						title: "位置",
						key: "MACAddress",
						width: 125,
						align: "center",
					},
					{
						title: "振幅",
						slot: "action3",
						width: 250,
						align: "left",
					},
					{
						title: "频率",
						key: "FREQUENCY",
						width: 90,
						align: "center",
					},
					{
						title: "电量",
						slot: "action2",
						width: 150,
						align: "left",
					},
					{
						title: "电压",
						key: "ADC",
						width: 100,
						align: "center",
					},
					{
						title: "查看数据",
						slot: "action",
						width: 100,
						align: "center",
					},
					{
						title: "时间",
						key: "READTIME",
					},
				],
				columns13: [{
						title: "type",
						key: "type",
					},
					{
						title: "data",
						key: "data",
					},
					{
						title: "Remarks",
						slot: "action",
						width: 150,
						align: "center",
					},
				],
				table5: [{
						title: "协调器ID",
						key: "BRIDGEID",
						align: "center"
					},
					{
						title: "一次接收的数量",
						key: "SENSORDATA",
						align: "center"
					},
					{
						title: "电量",
						key: "ADC_MAIN",
						align: "left",
						width: "100px"
					},
					{
						title: "温度",
						key: "TEMPER_MAIN",
						align: "center"
					},
					{
						title: "时间",
						key: "READTIME"			
					}
				],
				charts: "",
				opinionData: ["3", "2", "4", "4", "5"],
				opinionData2: ["3", "2", "4", "4", "5"],
				opinionData3: ["3", "2", "4", "4", "5"],
				opinionData4: [],
				opinionData5: [],
				opinionData6: [],
				imgUrl0: accur1,
				imgUrl1: accur1,
				imgUrl2: accur1,
				imgUrl3: accur1,
				imgUrl4: accur1,
				imgUrl5: accur1,
				imgUrl6: accur1,
				imgUrl7: accur1,
				temp: ""


			}
		},
		// 实例创建完执行
		created() {
			// 使js中添加组件的onclick能执行methods中的槽函数
			window.showRecentInfo = this.showRecentInfo
			window.changeLayout = this.changeLayout
			window.showingTableBySubButton = this.showingTableBySubButton
			window.drawByTime = this.drawByTime
			window.saveSetting = this.saveSetting
			window.showingTableByPriButton = this.showingTableByPriButton
			window.changeState1 = this.changeState1
			window.changeState2 = this.changeState2
			window.changeState3 = this.changeState3
			window.changeCorrespondence = this.changeCorrespondence
			window.changeTableByPage = this.changeTableByPage
			this.getUserName()
			//元素创建完后调整背景图片大小与屏幕一样高
			let bodyHeight = document.body.clientHeight - 1 + "px"
			this.totalHeight = bodyHeight
			this.showTweet()
			sessionStorage.clear()
			this.createMacAddressArr()
		},
		methods: {
			//改变布局方式
			changeLayout() {
				//layoutNum为0表现现阶段布局方式按协调器编号布局，需换为阻尼器编号布局的
				if (layoutNum == 0) {
					//调整表格位置			
					document.getElementById("subTable").style.marginTop = "290px"
					document.getElementById("priTable").style.marginTop = "290px"
					document.getElementById("checkAll").style.marginTop = "135px"
					var rowNum = this.subNodes.length
					//删除行div
					for (var i = 0; i < rowNum; i++) {
						var myDiv = document.getElementById("showButton" + i.toString())
						myDiv.parentNode.removeChild(myDiv)
					}

					var priDiv = document.getElementById("showAllButtons")
					priDiv.style.marginLeft = "225px"

					var subDiv = document.createElement("div")
					subDiv.setAttribute("id", "showButton" + Object.keys(addressName).length.toString())
					var label = document.createElement("h2")
					label.innerHTML = "协调器" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
					label.setAttribute("style", "display:inline-block")
					subDiv.appendChild(label)
					for (var m = 0; m < this.priNodes; m++) {
						subDiv.setAttribute("align", "center")
						var subButton = document.createElement("input")
						subButton.setAttribute("type", "button")
						subButton.setAttribute("class", "QPushbutton")
						subButton.setAttribute("state", "0")
						subButton.setAttribute("value", this.priNodeValues[m])
						subButton.setAttribute("id", "priNode" + this.priNodeValues[m])
						subButton.setAttribute("style", "cursor: pointer")
						subButton.setAttribute("onclick", "showingTableByPriButton(this)")
						subDiv.appendChild(subButton)
					}
					priDiv.appendChild(subDiv)

					for (var j = 0; j < Object.keys(addressName).length; j++) {
						var subDiv = document.createElement("div")
						subDiv.setAttribute("id", "showButton" + j.toString())
						subDiv.setAttribute("align", "center")


							var label = document.createElement("h2")
							label.innerHTML = Object.keys(addressName)[j] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
							label.setAttribute("style", "display:inline-block")
							subDiv.appendChild(label)

							for (var n = 0; n < addressName[Object.keys(addressName)[j]].length; n++) {
								var subButton = document.createElement("input")
								subButton.setAttribute("type", "button")
								subButton.setAttribute("class", "QPushbutton")
								subButton.setAttribute("onclick", "showingTableBySubButton(this)")
								subButton.setAttribute("state", "0")
								subButton.setAttribute("value",  addressName[Object.keys(addressName)[j]][n])
								subButton.setAttribute("style", "cursor: pointer")
								if (addressName[Object.keys(addressName)[j]][n] == "桥下工务段") {
									subButton.setAttribute("id", "subNodeII_10")
								} else {
									var address = Object.keys(addressName)[j] + "-" + addressName[Object.keys(addressName)[j]][n]
									var id = addressArr[address]
									subButton.setAttribute("id", "subNode" + id)
								}
								subDiv.appendChild(subButton)
							}						

						priDiv.appendChild(subDiv)
						layoutNum = 1
						this.layoutType = "阻尼器编号"
					}
				} else {
					for (var i = 0; i < (Object.keys(addressName).length + 1); i++) {
						var myDiv = document.getElementById("showButton" + i.toString())
						myDiv.parentNode.removeChild(myDiv)
					}
					this.setButtons()
					document.getElementById("subTable").style.marginTop = "150px"
					document.getElementById("priTable").style.marginTop = "150px"
					document.getElementById("checkAll").style.marginTop = "0px"
					this.layoutType = "协调器编号"
					layoutNum = 0
				}
			},

			//创建mac地址字典 主节点编号：子节点mac地址
			createMacAddressArr() {
				client.getAll((error, tweets) => {
					var pri1 = ""
					var pri2 = ""
					var pri3 = ""
					for (var i in tweets) {
						if (tweets[i]["PRINUM"] == "I") {
							pri1 += tweets[i]["SUBMACADDRESS"] + "/"
						} else if (tweets[i]["PRINUM"] == "IA") {
							pri2 += tweets[i]["SUBMACADDRESS"] + "/"
						} else if (tweets[i]["PRINUM"] == "II") {
							pri3 += tweets[i]["SUBMACADDRESS"] + "/"
						}
						document.cookie="priNode1"+"="+pri1
						document.cookie="priNode2"+"="+pri2
						document.cookie="priNode3"+"="+pri3
					}
					
				})
				var data = document.cookie
				var dataArr = data.split(";")
				var priData1 = dataArr[0].split("=")[1].split("/")
				var priData2 = dataArr[1].split("=")[1].split("/")
				var priData3 = dataArr[2].split("=")[1].split("/")
				priData1.pop()
				priData2.pop()
				priData3.pop()

				macAddressArr = {}
				macAddressArr["priNodeI"] = priData1
				macAddressArr["priNodeIA"] = priData2
				macAddressArr["priNodeII"] = priData3

				addressKeys = Object.keys(macAddressArr)
			},

			//比较两时间先后，time1先，返回true，反之，返回false，time时间格式为YY-MM-DD—HH-MM-SS
			compareTime(time1, time2) {
				var year1 = parseInt(time1.split("-")[0])
				var month1 = parseInt(time1.split("-")[1])
				var day1 = parseInt(time1.split("-")[2])
				var hour1 = parseInt(time1.split("-")[3])
				var minute1 = parseInt(time1.split("-")[4])
				var second1 = parseInt(time1.split("-")[5])

				var year2 = parseInt(time2.split("-")[0])
				var month2 = parseInt(time2.split("-")[1])
				var day2 = parseInt(time2.split("-")[2])
				var hour2 = parseInt(time2.split("-")[3])
				var minute2 = parseInt(time2.split("-")[4])
				var second2 = parseInt(time2.split("-")[5])

				if (year1 < year2) {
					return true
				} else if (year1 == year2) {
					if (month1 < month2) {
						return true
					} else if (month1 == month2) {
						if (day1 < day2) {
							return true
						} else if (day1 == day2) {
							if (hour1 < hour2){
								return true
							} else if (hour1 == hour2){
								if (minute1 < minute2) {
									return true
								} else if (minute1 == minute2) {
									if (second1 < second2) {
										return true
									} else if (second1 == second2) {
										return true
									} else {
										return false
									}
								} else {
									return false
								}
							} else {
								return false
							}
						} else {
							return false
						}
					} else {
						return false
					}
				} else {
					return false	
				}
			},

			getIdFromMac(macAddress) {
				var id = ""	
				for (var i = 0; i < addressKeys.length; i++) {
					if (macAddressArr[addressKeys[i]].indexOf(macAddress) >= 0) {
						id = this.priNodeValues[i] + "_" + (macAddressArr[addressKeys[i]].indexOf(macAddress) + 1).toString()
					}
				}
				return id
			},

			getMacFromId(id) {
				if (id.indexOf("priNode") >= 0) {
					var index = id.split("priNode")[1]
					var macAddress = priMacAddress[this.priNodeValues.indexOf(index)]
				} else {
					var indexOfKey = id.split("subNode")[1].split("_")[0]
					var indexOfValue = id.split("subNode")[1].split("_")[1]
					var macAddress = macAddressArr["priNode"+indexOfKey][indexOfValue-1]
				}
				return macAddress
			},

			//锁定id=showAllButtons，动态添加按钮组件
			setButtons() {
				var priDiv = document.getElementById("showAllButtons")
				for(var i = 0; i < this.priNodes; i++) {
					var subDiv = document.createElement("div")
					subDiv.setAttribute("id", "showButton"+i.toString())
					subDiv.setAttribute("align", "center")
	
					var priNode = document.createElement("input")
					priNode.setAttribute("type", "button")
					priNode.setAttribute("id", "priNode"+this.priNodeValues[i])
					priNode.setAttribute("value", this.priNodeValues[i])
					priNode.setAttribute("onclick", "showingTableByPriButton(this)")
					priNode.setAttribute("class", "QPushbutton")
					priNode.setAttribute("state", "0")
					//设置鼠标置于按钮上变为 点击状
					priNode.setAttribute("style", "cursor: pointer")
					subDiv.appendChild(priNode)
	
					for(var j = 0; j < this.subNodes[i]; j++) {
						var subNode = document.createElement("input")
						subNode.setAttribute("type", "button")
						subNode.setAttribute("id", "subNode" + this.priNodeValues[i] + "_" + (j+1).toString())
						subNode.setAttribute("value", (j+1).toString())
						subNode.setAttribute("onclick", "showingTableBySubButton(this)")
						subNode.setAttribute("class", "QPushbutton")
						subNode.setAttribute("state", "0")
						subNode.setAttribute("style", "cursor: pointer")
						subDiv.appendChild(subNode)
					}
					priDiv.appendChild(subDiv)
				}
			},

			// 通过页数改变列表显示
			changeTableByPage(obj) {
				globalindex = document.getElementById(obj.id).value - 1
				if (typeOfShowingButton.indexOf("subNode") >= 0) {
					client.getSpecIdTweets2(typeOfShowingButton, globalindex, (errors, tweets) => {
						if (errors.length == 0) {
							tweets = this.formattweets(tweets)
							this.dataList = tweets
						} else {
							this.errors = errors
						}
					})
				} else  if (typeOfShowingButton == "all"){
					client.getRecTweets4(globalindex, (errors, tweets) => {
						if (errors.length == 0) {
							tweets = this.formattweets(tweets)
							this.dataList = tweets
						} else {
							this.errors = errors
						}
					})
				} else if (typeOfShowingButton.indexOf("priNode") >= 0) {
					client.getPriNodeTweet(typeOfShowingButton, globalindex, (errors, tweet) => {
						if (errors.length == 0) {
							for (var i = 0; i < tweet.length; i++) {
								tweet[i]["ADC_MAIN"] = tweet[i]["ADC_MAIN"].toFixed(2) + " V"
								tweet[i]["TEMPER_MAIN"] = Math.floor((Math.abs(tweet[i]["TEMPER_MAIN"]) - 300) * 100) / 100  + " °C"
							}
							this.dataList2 = tweet
						} else {
							this.errors = errors
						}
					})
				}
			},

			showingTableByPriButton(obj) {
				globalindex = 0
				typeOfShowingButton = obj.id
				var subTable = document.getElementById("subTable")
				subTable.style.display = "none"

				var priTable = document.getElementById("priTable")
				priTable.style.display = "block"
				this.num = obj.id.split("priNode")[1]

				client.getPriNodeTweet(typeOfShowingButton, 0, (errors, tweet) => {
					if (errors.length == 0) {
						for (var i = 0; i < tweet.length; i++) {
							tweet[i]["ADC_MAIN"] = tweet[i]["ADC_MAIN"].toFixed(2) + " V"
							tweet[i]["TEMPER_MAIN"] = Math.floor((Math.abs(tweet[i]["TEMPER_MAIN"]) - 300) * 100) / 100  + " °C"
						}
						this.dataList2 = tweet
					} else {
						this.errors = errors
					}
				})
				document.getElementById("priPage").value = globalindex + 1
			},

			//退出登录，清除localStorage中的用户信息并跳转到登录页
			logout() {
				localStorage.removeItem("persons")
				this.$router.push("/")
			},
			//从localStorage中获取登录用户名
			getUserName() {
				//如果用户名未登录， 返回空。做判断防止报错
				let judegExist = JSON.parse(localStorage.getItem("persons"))
				if (judegExist) {
					this.user = JSON.parse(localStorage.getItem("persons"))[0].user
				} else {
					return false
				}
			},
			//数据删除
			remove(id) {
				let filtersIndex = id
				let judegExist = JSON.parse(localStorage.getItem("persons"))
				if (judegExist) {
					client.getDelTweets(filtersIndex, (errors, tweets) => {
						this.$message.success("Delete Success")
						this.showTweet()
					})
				} else {
					this.$message.error("Delete Fali Please Login First")
				}
			},
			//添加数据(并作出判断为输入框必须有值))
			createTweet() {
				let judegExist = JSON.parse(localStorage.getItem("persons"))
				if (judegExist) {
					client.createTweet(
						this.accountId,
						this.message,
						this.orders,
						this.payMethod,
						(errors, id) => {
							if (
								errors.length == 0 &&
								this.message !== "" &&
								this.orders !== "" &&
								this.payMethod !== ""
							) {
								this.$message({
									message: "Add success！",
									type: "success",
								})
								this.message = ""
								this.orders = ""
								this.payMethod = ""
								//添加后再此调用改方法，显示最新数据
								this.showTweet()
							} else {
								this.errors = errors
								this.$message.error("Add fali")
							}
						}
					)
				} else {
					this.$message.error("Add Fali Please Login First")
				}
			},
			//展示所有数据
			showTweet() {
				client.getAllTweets((errors, tweets) => {
					if (errors.length == 0) {
						tweets = this.formattweets(tweets)
						this.dataList = tweets
					} else {
						this.errors = errors
					}
				})
			},
			//将数据进行展示
			showRecentInfo() {
				var priTable = document.getElementById("priTable").style.display = "none"
				var subTable = document.getElementById("subTable")
				subTable.style.display = "block"
				this.num = "--"
				typeOfShowingButton = "all"
				globalindex = 0

				document.getElementById("subPage").value = 1

				client.getRecTweets((errors, tweets) => {
					if (errors.length == 0) {
						tweets = this.formattweets(tweets)
						this.dataList = tweets
					} else {
						this.errors = errors
					}
				})
			},
			//页数减一
			decreaseglobalindex() {
				if (globalindex > 0) {
					globalindex = globalindex - 1
				} else {
					globalindex = 0
				}
				if (typeOfShowingButton.indexOf("subNode") >= 0) {
					client.getSpecIdTweets2(typeOfShowingButton, globalindex, (errors, tweets) => {
						if (errors.length == 0) {
							tweets = this.formattweets(tweets)
							this.dataList = tweets
						} else {
							this.errors = errors
						}
					})
				} else  if (typeOfShowingButton == "all"){
					client.getRecTweets4(globalindex, (errors, tweets) => {
						if (errors.length == 0) {
							tweets = this.formattweets(tweets)
							this.dataList = tweets
						} else {
							this.errors = errors
						}
					})
				} else if (typeOfShowingButton.indexOf("priNode") >= 0) {
					client.getPriNodeTweet(typeOfShowingButton, globalindex, (errors, tweet) => {
						if (errors.length == 0) {
							for (var i = 0; i < tweet.length; i++) {
								tweet[i]["ADC_MAIN"] = tweet[i]["ADC_MAIN"].toFixed(2) + " V"
								tweet[i]["TEMPER_MAIN"] = Math.floor((Math.abs(tweet[i]["TEMPER_MAIN"]) - 300) * 100) / 100  + " °C"
							}
							this.dataList2 = tweet
						} else {
							this.errors = errors
						}
					})
					document.getElementById("priPage").value = globalindex+1
				}
				document.getElementById("subPage").value = globalindex+1		
			},
			//页数加一
			increaseglobalindex() {
				globalindex = globalindex + 1
				if (typeOfShowingButton.indexOf("subNode") >= 0) {
					client.getSpecIdTweets2(typeOfShowingButton, globalindex, (errors, tweets) => {
						if (errors.length == 0) {
							tweets = this.formattweets(tweets)
							this.dataList = tweets
						} else {
							this.errors = errors
						}
					})
					document.getElementById("subPage").value = globalindex + 1
				} else  if (typeOfShowingButton == "all"){
					client.getRecTweets4(globalindex, (errors, tweets) => {
						if (errors.length == 0) {
							tweets = this.formattweets(tweets)
							this.dataList = tweets
						} else {
							this.errors = errors
						}
					})
					document.getElementById("subPage").value = globalindex+1
				} else if (typeOfShowingButton.indexOf("priNode") >= 0) {
					client.getPriNodeTweet(typeOfShowingButton, globalindex, (errors, tweet) => {
						if (errors.length == 0) {
							for (var i = 0; i < tweet.length; i++) {
								tweet[i]["ADC_MAIN"] = tweet[i]["ADC_MAIN"].toFixed(2) + " V"
								tweet[i]["TEMPER_MAIN"] = Math.floor((Math.abs(tweet[i]["TEMPER_MAIN"]) - 300) * 100) / 100  + " °C"
							}
							this.dataList2 = tweet
						} else {
							this.errors = errors
						}
					})
					document.getElementById("priPage").value = globalindex + 1
				}
				
			},
			haha() {
				alert('111')
			},
			//将数据按需展示
			showSpecTweet() {
				client.getSpecTweets(this.searchId, (errors, tweets) => {
					if (errors.length == 0) {
						tweets = this.formattweets(tweets)
						this.dataList = tweets
					} else {
						this.errors = errors
					}
				})
			},
			//根据振动传感器节点按钮显示列表数据
			showingTableBySubButton(obj) {
				globalindex = 0
				var priTable = document.getElementById("priTable").style.display = "none"
				var subTable = document.getElementById("subTable")
				subTable.style.display = "block"
				//显示于右上角的编号
				this.num = obj.id.split("subNode")[1].split("_")[0]

				let type = obj.getAttribute("id")
				sessionStorage.setItem('select_Button', type);
				typeOfShowingButton = type
				client.getSpecIdTweets(type, (errors, tweets) => {
					if (errors.length == 0) {
						tweets = this.formattweets(tweets)
						this.dataList = tweets
					} else {
						this.errors = errors
					}
				})
				document.getElementById("subPage").value = globalindex + 1
			},

			alteridData2(type) {
				typeOfShowingButton = type
				globalindex = 0
				client.getSpecIdTweets2(type, globalindex, (errors, tweets) => {
					if (errors.length == 0) {
						tweets = this.formattweets(tweets)
						this.dataList = tweets
					} else {
						this.errors = errors
					}
				})
			},

			//根据ID进行搜索
			instance(type) {
				let judegExist = JSON.parse(localStorage.getItem("persons"))
				if (judegExist) {
					client.getSearchTweets(this.searchId, (errors, tweets) => {
						if (errors.length == 0) {
							const title = "Query Success"
							const content = `<p>ID is：${tweets[0]["ID"]}</p><p>Date：${tweets[0]["READTIME"]}</p>
            <p>Expenditure/Income：${tweets[0]["MACADDRESS"]}</p><p>Type Of Payment：${tweets[0]["SENSORDATA"]}</p>`
							switch (type) {
								case "info":
									this.$Modal.info({
										title: title,
										content: content,
									})
									break
								case "success":
									this.$Modal.success({
										title: title,
										content: content,
									})
									break
							}
						} else {
							this.errors = errors
							this.$message.error("no data")
						}
						this.showSpecTweet()
					})
				} else {
					this.$message.error("Query Fali Please Login First")
				}
			},

			//根据SingleID进行搜索
			drawAcceleration(type, id) {
				let judegExist = JSON.parse(localStorage.getItem("persons"))
				if (judegExist) {
					client.getSearchSingleTweets(id, (errors, tweets) => {
						if (errors.length == 0) {
							const title = "Query Success"
							const content = `<p>ID：${tweets[0]["ID"]}</p><p>时间：${tweets[0]["READTIME"]}</p>
											<p>Mac地址：${tweets[0]["MACADDRESS"]}</p>
											<p>
												<canvas id="accelerationOfX" width="800" height="300" style="border:1px solid #c3c3c3;">
												您的浏览器不支持 HTML5 canvas 标签。
												</canvas>
												<canvas id="accelerationOfY" width="800" height="300" style="border:1px solid #c3c3c3;">
												您的浏览器不支持 HTML5 canvas 标签。
												</canvas>
												<canvas id="accelerationOfZ" width="800" height="300" style="border:1px solid #c3c3c3;">
												您的浏览器不支持 HTML5 canvas 标签。
												</canvas>
											</p>
											`
											// <p>all_data：<textarea rows="9" cols="90">${tweets[0]["SENSORDATA"]}</textarea></p>
							switch (type) {
								case "info":
									this.$Modal.info({
										title: title,
										content: content,
									})
									break
								case "success":
									this.$Modal.success({
										title: title,
										content: content,
										width: 1000
									})
									break
							}
							let readdata = tweets[0]["SENSORDATA"]
							let timedata = []
							for (var i = 0; i < 8; i++) {
								timedata.push(readdata.substr(36 + 12 * i, 12))
							}

							for (var i = 0; i < 4; i++) {
								for (var j = 0; j < 10; j++) {
									timedata.push(readdata.substr(136 + 136 * i + 12 * j + 12, 12))
								}
							}
							console.log(timedata)
							let xtimedata = []
							let ytimedata = []
							let ztimedata = []
							for (var i = 0; i < 48; i++) {
								let tempdata = parseInt(timedata[i].substr(2, 2) + timedata[i].substr(0, 2), 16)
								let tempdata2 = parseInt(timedata[i].substr(6, 2) + timedata[i].substr(4, 2), 16)
								let tempdata3 = parseInt(timedata[i].substr(10, 2) + timedata[i].substr(8, 2), 16)
								if (tempdata > 32768) {
									tempdata = -(65535 - tempdata + 1)
								}
								if (tempdata2 > 32768) {
									tempdata2 = -(65535 - tempdata2 + 1)
								}
								if (tempdata3 > 32768) {
									tempdata3 = -(65535 - tempdata3 + 1)
								}
								xtimedata.push(tempdata)
								ytimedata.push(tempdata2)
								ztimedata.push(tempdata3)
							}
							var meanX = 0
							var meanY = 0
							var meanZ = 0
							for (var j = 0; j < xtimedata.length; j++) {
								//计算均值
								meanX += xtimedata[j]
								meanY += ytimedata[j]
								meanZ += ztimedata[j]
							}
							meanX = meanX / xtimedata.length
							meanY = meanY / ytimedata.length
							meanZ = meanZ / ztimedata.length
							for (var j = 0; j < xtimedata.length; j++) {
								//减去均值
								xtimedata[j] = xtimedata[j] - meanX
								ytimedata[j] = ytimedata[j] - meanY
								ztimedata[j] = ztimedata[j] - meanZ
							}
							this.opinionData = xtimedata
							this.opinionData2 = ytimedata
							this.opinionData3 = ztimedata
						} else {
							this.errors = errors
							this.$message.error("no data")
						}
						this.showSpecTweet()
					})
				} else {
					this.$message.error("Query Fali Please Login First")
				}

			},

			setting() {
				this.refreshStatusAlarm = 1
				const title = "设置"
				const content = `	<div id="alarmThreshold" align="center">
										<h1 style="text-align:center">报警阀值设置</h1>
										<br>
										报警阀值1：
										<input type="text" id="alarmThreshold1" name="alarmThreshold" onclick="changeState1()"/>
										<br><br>
										报警阀值2：
										<input type="text" id="alarmThreshold2" name="alarmThreshold" onclick="changeState1()"/>
										<br><br>
										抱紧阀值3：
										<input type="text" id="alarmThreshold3" name="alarmThreshold" onclick="changeState1()"/>
										<br><br>
										<input type="button" onclick="saveSetting()" style="width:50px" value="保存">
									</div>
									<br><br><br>
									<div id="settingCorresponsence">
										<h1 style="text-align:center">子节点mac地址配置</h1>
										<br>
										<div style="margin-left:200px">
											阻尼器编号：
											<select style="width: 150px; height: 25px" id="adress" onchange="changeState3()">
												<option>29-S-X-1</option>
												<option>29-S-X-7</option>
												<option>29-S-X-14</option>
												<option>29-S-X-28</option>
												<option>29-S-X-36</option>
												<option>29-S-S-1</option>
												<option>29-S-S-13</option>
												<option>29-S-S-25</option>
												<option>29-S-S-36</option>
												<option>桥下工务段</option>
												<option>29-M-X-1</option>
												<option>29-M-X-8</option>
												<option>29-M-X-14</option>
												<option>29-M-X-27</option>
												<option>29-M-X-36</option>
												<option>29-M-S-1</option>
												<option>29-M-S-10</option>
												<option>29-M-S-19</option>
												<option>29-M-S-28</option>
												<option>29-M-S-36</option>
											</select>
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											子节点mac地址：
											<input type="text" style="width: 220px; height: 25px" id="macAddress" onclick="changeState2()">
											<input type="button" value="更改" style="margin-left:40px;width:60px" onclick="changeCorrespondence()">

								`
				this.$Modal.success({
					title: title,
					content: content,
					width: 1200
				})
			},

			saveSetting() {
				this.alarmThreshold1 = parseInt(document.getElementById("alarmThreshold1").value)
				this.alarmThreshold2 = parseInt(document.getElementById("alarmThreshold2").value)
				this.alarmThreshold3 = parseInt(document.getElementById("alarmThreshold3").value)
				this.refreshStatusAlarm = 1
				alert("保存成功！")
			},

			//判断是否刷新显示报警阀值
			changeState1() {
				this.refreshStatusAlarm = 0
			},

			//判断是否刷新显示某一位置mac地址
			changeState2() {
				this.refreshStatusAddress = 0
				this.temp = document.getElementById("macAddress").value
			},

			changeState3() {
				this.refreshStatusAddress = 1
			},

			//更新数据库中CORRESPONDENCE表单内容中的SUBMACADDRESS
			changeCorrespondence() {
				var myOptions = document.getElementById("adress")
				var index = myOptions.selectedIndex
				var address = myOptions.options[index].value
				var subMacAddress = document.getElementById("macAddress").value
				if (subMacAddress == this.temp || this.temp == "") {
					return
				} else {
					client.modifyCorrespondence(address, subMacAddress)
					this.refreshStatusAddress = 1
					alert("修改成功！新mac地址:" + subMacAddress)
					this.refreshStatusMacArr = 1
				}
				location.reload()
			},

			//显示趋势图的窗口
			drawTrends() {
				// 避免观看两个按钮时，当搜索第一个按钮一段时间电压变化，然后点击第二个按钮观察趋势，电压图会显示为上一个按钮的电压图，reset。
				this.opinionData4 = []	
				this.opinionData5 = []
				this.opinionData6 = []
				this.globalVar = []
				let judge = sessionStorage.getItem('select_Button');
				var macaddress = this.getMacFromId(judge)
				var address = sessionStorage.getItem(macaddress)
				if (typeOfShowingButton != "all") {				
					const title = "Query Success"
					const content = `<p style="font-weight:bold;">按钮Id is: ${judge}</p>
									<p style="font-weight:bold;">位置: ${address}</p>
									<p style="font-weight:bold;">采样点间隔时间: 5分钟</p>
									<p style="font-weight:bold;">Mac地址：${macaddress}</p>
									<p id = "number" style="font-weight:bold;">个数：<p>
									<p>
										<div>
											<input type="datetime-local" id="startTime" value=this.startTime step="1"/>
											&nbsp;&nbsp;至&nbsp;&nbsp;
											<input type="datetime-local" id="endTime" step="1"/>		
											<input type="button" value="搜索" id="search" style="margin-left: 10px; width: 50px;height:30px; background: radial-gradient(#F0F8FF,#708090); border-radius: .5em;font: 12px/100% 'Microsoft yahei',Arial, Helvetica, sans-serif;" onclick="drawByTime()"/>

										</div>
										<canvas id="amplitudeTrend" width="1000" height="300" style="border:1px solid #c3c3c3;">
										您的浏览器不支持 HTML5 canvas 标签。
										</canvas>
										<br><br>
										<canvas id="frequencyTrend" width="1000" height="300" style="border:1px solid #c3c3c3;">
										您的浏览器不支持 HTML5 canvas 标签。
										</canvas>
										<br><br>
										<canvas id="voltageTrend" width="1000" height="300" style="border:1px solid #c3c3c3;">
										您的浏览器不支持 HTML5 canvas 标签。
										</canvas>
									</p>
									`
					this.$Modal.success({
						title: title,
						content: content,
						width: 1200
					})
				} else {
					return
				}
				this.setDefaultTime()
			},

			setDefaultTime() {
				var myDate = new Date()
				var year = myDate.getFullYear().toString()
				var month = (myDate.getMonth()+1).toString()
				var day = myDate.getDate().toString()
				var hour = myDate.getHours().toString()
				var minute = myDate.getMinutes().toString()
				var second = myDate.getSeconds().toString()

				var day2 = day
				var month2 = month
				var year2 = year

				if (month.length == 1) {
					month = "0" + month
				}

				if (day.length == 1) {
					day = "0" + day
					if (day == "01") {
						if (month == "01") {
							month2 = "12"
							year2 = (year-1).toString()
							day2 = "31"
						} else {
							if (["02", "04", "06", "08", "09", "11"].indexOf(month) >= 0) {
								day2 = "31"
								month2 = (month-1).toString()
								if (month2.length == 1) {
									month2 = "0" + month2
								}
							} else if (month == "03"){
								month2 = "02"
								//判断是否为闰年
								if ((year%400==0) || (year%4==0 && year %100!=0)) {
									day2 = "29"
								} else {
									day2 = "28"
								}
							} else {
								month2 = (month-1).toString()
								if (month2.length == 1) {
									month2 = "0" + month2
								}
								day2 = "30"
							}
						}
					} else {
						day2 = "0" + (day-1).toString()
						if (month2.length == 1) {
							month2 = "0" + month2
						}
					}
				} else if (day == "10") {
					day2 = "09"
				} else {
					day2 = (day-1).toString()
				}

				if (hour.length == 1) {
					hour = "0" + hour
				}
				if (minute.length == 1) {
					minute = "0" + minute
				}
				if (second.length == 1) {
					second = "0" + second
				}

				this.startTime = year2 + "-" + month2 + "-" + day2 + "T" + hour + ":" + minute + ":" + second
				this.endTime = year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second
				alert(this.startTime + "&" + this.endTime)
			},

			//通过自定义时间段展示数据趋势
			drawByTime() {
				if (document.getElementById("startTime").value == "" || document.getElementById("endTime").value == "") {
					return
				} else {
					var yearScope = []
					var monthScope = []
					var dayScope = []
					var hourScope = []
					var minuteScope = []
					var secondScope = []
					var startTime = document.getElementById("startTime").value
					var endTime = document.getElementById("endTime").value

					startTime = startTime.replace("T", "-")
					endTime = endTime.replace("T", "-")
					var reg = new RegExp( ':' , "g" )
					startTime = startTime.replace(reg, "-")
					endTime = endTime.replace(reg, "-")

					var judgeTime = this.compareTime(startTime, endTime)
					
					if (judgeTime) {
						var judge = sessionStorage.getItem('select_Button');
						sessionStorage.setItem("startTime", document.getElementById("startTime").value)
						sessionStorage.setItem("endTime", document.getElementById("endTime").value)
						let amplitude = []
						let frequency = []
						let adc = []
						this.globalVar = []
						var num = 0	
						if (judge){
							client.getTweetsForPicBytime(judge, startTime, endTime, (errors, tweets) => {
								for(var i = 0; i < tweets.length; i++) {
									amplitude.push(tweets[i]["AMPLITUDE"])
									frequency.push(tweets[i]["FREQUENCY"])
									adc.push(tweets[i]["ADC"].toFixed(2))
									this.globalVar.push(tweets[i]["READTIME"].substring(4))
								}
								this.opinionData4 = amplitude
								this.opinionData5 = frequency
								this.opinionData6 = adc
								document.getElementById("number").innerHTML = "个数：" + tweets.length
							})
						} else {
							return
						}
					} else {
						alert("请选择合理时间段！")
					}
				}

						
			},

			//根据ID进行修改
			alterData(id) {
				client.getSearchSingleTweets(id, (errors, tweets) => {
					if (errors.length == 0) {
						this.createdAt = tweets.createdAt
					} else {
						console.log(errors)
					}
					this.modifyId = id
					this.editDialogVisible = true
				})
			},

			//对接受的json数据加工处理
			modifyTweet() {
				client.modifyTweet(
					this.modifyId,
					this.accountId,
					this.modifyMessage,
					this.createdAt,
					this.modifyOrders,
					this.modifyPayMethod,
					(errors, modifyId) => {
						if (errors.length == 0) {
							this.$message({
								message: "Modify success！",
								type: "success",
							})
							//添加后再此调用改方法，显示最新数据
							this.showTweet()
						} else {
							this.errors = errors
							this.$message.error("Add fali")
						}
					}
				)
			},

			// 格式化tweets的json文件，通过获取的tweets数据显示到网页上的表格
			formattweets(tweets) {
				for (let i in tweets) {
					// 添加电量比例
					let valtocent = [4.011, 4.006, 4.004, 4.002, 3.997, 3.992, 3.988, 3.985, 3.984, 3.982, 3.980, 3.978,
						3.978, 3.976, 3.976, 3.973, 3.971, 3.970, 3.969, 3.969, 3.968, 3.968, 3.968, 3.967, 3.966,
						3.965, 3.963, 3.960, 3.957, 3.956, 3.954, 3.952, 3.949, 3.946, 3.942, 3.938, 3.936, 3.933,
						3.930, 3.927, 3.924, 3.922, 3.918, 3.915, 3.913, 3.911, 3.909, 3.906, 3.904, 3.900, 3.892,
						3.887, 3.884, 3.881, 3.876, 3.872, 3.868, 3.861, 3.857, 3.852, 3.845, 3.840, 3.837, 3.835,
						3.833, 3.828, 3.823, 3.816, 3.812, 3.807, 3.798, 3.792, 3.789, 3.787, 3.783, 3.779, 3.777,
						3.771, 3.765, 3.760, 3.751, 3.746, 3.742, 3.733, 3.728, 3.725, 3.721, 3.716, 3.707, 3.702,
						3.698, 3.691, 3.680, 3.654, 3.621, 3.571, 3.524, 3.472, 3.403, 3.311, 3.156
					]
					// 添加电量图片ADCPIC
					for (let j = 0; j <= 100; j++) {
						if (1.224 * 4095 / tweets[i]["ADC"] > valtocent[j]) {
							tweets[i]["Adc"] = 100 - j
							if (tweets[i]["Adc"] > 90) {
								tweets[i]["ADCPIC"] = accur4
								tweets[i]["AMPPIC"] = amp001
							} else if (tweets[i]["Adc"] > 75) {
								tweets[i]["ADCPIC"] = accur3
								tweets[i]["AMPPIC"] = amp003
							} else if (tweets[i]["Adc"] > 30) {
								tweets[i]["ADCPIC"] = accur2
								tweets[i]["AMPPIC"] = amp006
							} else {
								tweets[i]["ADCPIC"] = accur1
								tweets[i]["AMPPIC"] = amp010
							}
							break
						} else {
							tweets[i]["ADCPIC"] = accur4
							tweets[i]["Adc"] = "100"
						}
					}

					if (tweets[i]["AMPLITUDE"] < 20) {
						tweets[i]["AMPPIC"] = amp001
					} else if (tweets[i]["AMPLITUDE"] < 50) {
						tweets[i]["AMPPIC"] = amp002
					} else if (tweets[i]["AMPLITUDE"] < 100) {
						tweets[i]["AMPPIC"] = amp003
					} else if (tweets[i]["AMPLITUDE"] < 150) {
						tweets[i]["AMPPIC"] = amp004
					} else if (tweets[i]["AMPLITUDE"] < 200) {
						tweets[i]["AMPPIC"] = amp005
					} else if (tweets[i]["AMPLITUDE"] < 300) {
						tweets[i]["AMPPIC"] = amp006
					} else if (tweets[i]["AMPLITUDE"] < 500) {
						tweets[i]["AMPPIC"] = amp007
					} else if (tweets[i]["AMPLITUDE"] < 800) {
						tweets[i]["AMPPIC"] = amp008
					} else if (tweets[i]["AMPLITUDE"] < 1500) {
						tweets[i]["AMPPIC"] = amp009
					} else {
						tweets[i]["AMPPIC"] = amp010
					}

					tweets[i]["ADC"] = tweets[i]["ADC"].toFixed(2) + " V" 

					// for (let j = 0; j <= 100; j++) {
					// 	if (1.224 * 4095 / tweets[i]["ADC"] > valtocent[j]) {
					// 		tweets[i]["ADC"] = 100 - j
					// 		if (tweets[i]["ADC"] > 90) {
					// 			tweets[i]["AMPPIC"] = amp001
					// 		} else if (tweets[i]["ADC"] > 75) {
					// 			tweets[i]["AMPPIC"] = amp003
					// 		} else if (tweets[i]["ADC"] > 30) {
					// 			tweets[i]["AMPPIC"] = amp006
					// 		} else {
					// 			tweets[i]["AMPPIC"] = amp010
					// 		}
					// 		break
					// 	}
					// }
					// 设备ID到位置ID
					var MACADDRESS = tweets[i]["MACADDRESS"]
					tweets[i]["MACAddress"] = sessionStorage.getItem(MACADDRESS)

					// if (tweets[i]["MACADDRESS"] == "4da44e23004b1200") {
					// tweets[i]["ADC"] = 1.224*4095/tweets[i]["ADC"]
				}
				return tweets
			},

			sessionStorageMtoA() {
				client.getAll((error, tweets) => {
					for (var i in tweets) {
						sessionStorage.setItem(tweets[i]["SUBMACADDRESS"], tweets[i]["ADDRESS"])
					}
				})
			},

			//绘制x轴的加速度曲线
			drawAccelerationOfX(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['近七日收益']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},

					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15",
							"16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
							"30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43",
							"44", "45", "46", "47", "48"
						]

					},
					yAxis: {
						type: 'value'
					},

					series: [{
						name: '加速度',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData
					}]
				})
			},
			drawAccelerationOfY(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['近七日收益']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
			
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15",
							"16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
							"30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43",
							"44", "45", "46", "47", "48"
						]
			
					},
					yAxis: {
						type: 'value'
					},
			
					series: [{
						name: '加速度',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData2
					}]
				})
			},
			
			drawAccelerationOfZ(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['近七日收益']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
			
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15",
							"16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
							"30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43",
							"44", "45", "46", "47", "48"
						]
			
					},
					yAxis: {
						type: 'value'
					},
			
					series: [{
						name: '加速度',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData3
					}]
				})
			},
			
			drawAmplitude(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					title:{
						show: true,
						text: "振幅分析图",
						top: "top",
						left: "center"
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7958'
							}
						}
					},
					legend: {
						data: ['趋势分析']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
			
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						name: '时间',
						boundaryGap: false,
						data: this.globalVar
			
					},
					yAxis: {
						type: 'value',
						name: '振幅'
					},
					dataZoom:[{
						type:"inside"         
					}],
			
					series: [{
						name: '振幅',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData4
					}]
				})
			},

			drawFrequency(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					title:{
						show: true,
						text: "频率分析图",
						top: "top",
						left: "center"
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7958'
							}
						}
					},
					legend: {
						data: ['趋势分析']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
			
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						name: '时间',
						boundaryGap: false,
						data: this.globalVar
			
					},
					yAxis: {
						type: 'value',
						name: '频率'
					},
					dataZoom:[{
						type:"inside"         
					}],
			
					series: [{
						name: '频率',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData5
					}]
				})
			},
			drawVoltage(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					title:{
						show: true,
						text: "电压分析图",
						top: "top",
						left: "center"
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7958'
							}
						}
					},
					legend: {
						data: ['趋势分析']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
			
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						name: '时间',
						boundaryGap: false,
						data: this.globalVar
			
					},
					yAxis: {
						type: 'value',
						name: '电压'
					},
					dataZoom:[{
						type:"inside"         
					}],
					series: [{
						name: '电压',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData6
					}]
				})
			},
			
			
		},
		//定时刷新 创建网页后执行
		mounted() {
			this.setButtons()
			this.sessionStorageMtoA()
			this.createMacAddressArr()
			//判断是否需要刷新创建mac地址：主节点编号：子节点mac地址
			setInterval(() => {
				if (this.refreshStatusMacArr == 1) {
					this.createMacAddressArr()
					this.refreshStatusMacArr = 0
				}
			}, 1000)
			setInterval(() => {
				//定时刷新按钮状态
				client.getRecTweets3((errors, tweets) => {
					if (errors.length == 0) {
						//先将所有按钮默认变为灰色，然后根据数据库中数据更新颜色
						/*for (var j = 0; j < Object.keys(addressArr).length; j++) {
							var all = document.getElementB yId("subNode" + addressArr[Object.keys(addressArr)[j]])
							all.setAttribute("state", 0)
						}*/
						// this.dataList2 = tweets
						let id = 0
						let valtocent = [4.011, 4.006, 4.004, 4.002, 3.997, 3.992, 3.988, 3.985, 3.984,
							3.982, 3.980, 3.978,
							3.978, 3.976, 3.976, 3.973, 3.971, 3.970, 3.969, 3.969, 3.968, 3.968,
							3.968, 3.967, 3.966,
							3.965, 3.963, 3.960, 3.957, 3.956, 3.954, 3.952, 3.949, 3.946, 3.942,
							3.938, 3.936, 3.933,
							3.930, 3.927, 3.924, 3.922, 3.918, 3.915, 3.913, 3.911, 3.909, 3.906,
							3.904, 3.900, 3.892,
							3.887, 3.884, 3.881, 3.876, 3.872, 3.868, 3.861, 3.857, 3.852, 3.845,
							3.840, 3.837, 3.835,
							3.833, 3.828, 3.823, 3.816, 3.812, 3.807, 3.798, 3.792, 3.789, 3.787,
							3.783, 3.779, 3.777,
							3.771, 3.765, 3.760, 3.751, 3.746, 3.742, 3.733, 3.728, 3.725, 3.721,
							3.716, 3.707, 3.702,
							3.698, 3.691, 3.680, 3.654, 3.621, 3.571, 3.524, 3.472, 3.403, 3.311, 3.156
						]
						for (let i = 62; i >= 0; i--) {
							let valuecent = 0
							for (let j = 0; j <= 100; j++) {
								if (1.224 * 4095 / tweets[i]["ADC"] > valtocent[j]) {
									valuecent = 100 - j
									break
								}
							}
							let MACADDRESS = tweets[i]["MACADDRESS"]

							id = this.getIdFromMac(MACADDRESS)
							if (id.indexOf("_") >= 0) {
								id = "subNode" + id
							} else {
								id = "priNode" + id
							}

							if (MACADDRESS == "005a002c0847363530323532") {
								
							}
										
							let state = tweets[i]["ADC"] % 4
							console.log("id:" + id + " adc:" + state)
							// 通过id锁定相应创建出来的div块
							let amptemp = -1
							amptemp = tweets[i]["AMPLITUDE"]	

							let button = document.getElementById(id)
			
							if (button){
								if (amptemp > this.alarmThreshold1) {
									button.setAttribute("state", 1);
								} else if (amptemp > this.alarmThreshold2) {
									button.setAttribute("state", 2);
								} else if (amptemp > this.alarmThreshold3) {
									button.setAttribute("state", 3);
								} else if (amptemp > -1) {
									button.setAttribute("state", 4);
								} else {
									button.setAttribute("state", 0);
								}
								console.log(id)
								console.log("$$$")
								console.log(state)
							}
							
						}
					} else {
						this.errors = errors
					}
				})
				console.log("typeOfShowingButton: " + typeOfShowingButton)

				// 刷新表格的作用
				// 当点击某一按钮时，globaladdress等于按钮的id，显示该按钮的相关数据
				if (typeOfShowingButton.indexOf("subNode") >= 0) {
					client.getSpecIdTweets2(typeOfShowingButton, globalindex, (errors, tweets) => {
					if (errors.length == 0) {
						tweets = this.formattweets(tweets)
						this.dataList = tweets		
					} else {
						this.errors = errors
					}
				})
				// 如果没有点击按钮，默认显示最新所有数据
				} else if (typeOfShowingButton == "all") {
					this.electricity = "--"
					this.temper = "--"
					client.getRecTweets4(globalindex, (errors, tweets) => {
						if (errors.length == 0) {
							tweets = this.formattweets(tweets)
							this.dataList = tweets
						} else {
							this.errors = errors
						}
					})
				} else if (typeOfShowingButton.indexOf("priNode") >= 0) {
					client.getPriNodeTweet(typeOfShowingButton, globalindex, (errors, tweet) => {
						if (errors.length == 0) {
							for (var i = 0; i < tweet.length; i++) {
								tweet[i]["ADC_MAIN"] = tweet[i]["ADC_MAIN"].toFixed(2) + " V"
								//tweet[i]["TEMPER_MAIN"] = (Math.abs(tweet[i]["TEMPER_MAIN"]).toFixed(2)) - 300 + " °C"
								tweet[i]["TEMPER_MAIN"] = Math.floor((Math.abs(tweet[i]["TEMPER_MAIN"]) - 300) * 100) / 100  + " °C"
							}
							this.dataList2 = tweet
						} else {
							this.errors = errors
						}
					})
				}
			}, 1000)
			setInterval(() => {
				if (typeOfShowingButton != "all") {
					//刷新显示主节点电量温度
					client.getPriData(typeOfShowingButton, (errors, tweets) => {
						this.electricity = tweets[0]["ADC_MAIN"].toFixed(2)
						this.temper = (Math.abs(tweets[0]["TEMPER_MAIN"]) - 300).toFixed(2)
					})
				}
			}, 500)
			setInterval(() => {
				if (document.getElementById("settingCorresponsence")) {
					if (this.refreshStatusAddress == 1){
						var myOptions = document.getElementById("adress")
						var index = myOptions.selectedIndex
						var address = myOptions.options[index].value

						client.getMacByAddress(address, (error, tweet) => {
							if (document.getElementById("macAddress")) {
								document.getElementById("macAddress").value = tweet[0]["SUBMACADDRESS"]
							}
						})
					}
				}
				if (document.getElementById("alarmThreshold")) {
					if (this.refreshStatusAlarm == 1) {
						document.getElementById("alarmThreshold1").value = this.alarmThreshold1
						document.getElementById("alarmThreshold2").value = this.alarmThreshold2
						document.getElementById("alarmThreshold3").value = this.alarmThreshold3
					}
				}
				if (document.getElementById("startTime")) {
					var time = document.getElementById("startTime")
					time.setAttribute("value", this.startTime)
				}
				if (document.getElementById("endTime")) {
					var time = document.getElementById("endTime")
					time.setAttribute("value", this.endTime)
				}
				if (document.getElementById("accelerationOfX")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("accelerationOfX"))
					if (myChart == null) { // 如果不存在，就进行初始化
						this.drawAccelerationOfX("accelerationOfX")
					}
				}
				if (document.getElementById("accelerationOfY")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("accelerationOfY"))
					if (myChart == null) { // 如果不存在，就进行初始化
						this.drawAccelerationOfY("accelerationOfY")
					}
				}
				if (document.getElementById("accelerationOfZ")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("accelerationOfZ"))
					if (myChart == null) { // 如果不存在，就进行初始化
						this.drawAccelerationOfZ("accelerationOfZ")
					}
				}
				if (document.getElementById("amplitudeTrend")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("amplitudeTrend"))
					
					this.drawAmplitude("amplitudeTrend")
					
				}
				if (document.getElementById("frequencyTrend")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("frequencyTrend"))
					
					this.drawFrequency("frequencyTrend")
					
				}
				if (document.getElementById("voltageTrend")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("voltageTrend"))

					this.drawVoltage("voltageTrend")
					
				}
			}, 500)
		},
		//当页面不是登录页，及时更新用户信息
		watch: {
			"$route.path"(newVal, oldVal) {
				if (newVal !== "/") {
					this.getUserName()
				} else {
					return false
				}
			},
		},
	}
</script>

<style lang='scss'>
	.skill {
		width: 100%;
		display: block;
		justify-content: center;
		align-items: center;
		background-image: url("../assets/CRUD.png");
		background-attachment: fixed;
		background-size: cover;

		h1 {
			&:nth-child(1) {
				font-style:italic;
				font-weight: 500;
				position: absolute;
				top: 40px;
				right: 150px;
			}
		}
		
		.h2 {
			position: absolute;
			top: 100px;
			right: 120px;
			font-size:1.5em;
		}

		.ivu-icon {
			position: absolute;
			top: 45px;
			right: 100px;

			&:hover {
				cursor: pointer;
			}
		}

		.showPic {
			width: 90%;
			margin-top: 100px;
		}

		.showInfo {
			width: 90%;
			margin-top: 30px;

		}

		.addInfo {
			width: 80%;
			height: 50px;
			position: absolute;
			top: 130px;

			.firstItem,
			.secondItem,
			.thirdItem {
				width: 200px;
				padding-right: 20px;
			}

			.searchItem {
				width: 200px;
				height: 30px;
				margin-left: 252px;
			}
		}

		.beautifyBtn {
			width: 60px;
			height: 30px;
			background: #fc5c7d;
			/* fallback for old browsers */
			background: -webkit-linear-gradient(to right,
					#6a82fb,
					#fc5c7d);
			/* Chrome 10-25, Safari 5.1-6 */
			background: linear-gradient(to right,
					#6a82fb,
					#fc5c7d);
			/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
			color: white;
			border: none;
			border-radius: 5px;
		}

		.beautifyBtn2 {
			width: 90px;
			height: 30px;
			background: #fc5c7d;
			/* fallback for old browsers */
			background: -webkit-linear-gradient(to right,
					#6a82fb,
					#fc5c7d);
			/* Chrome 10-25, Safari 5.1-6 */
			background: linear-gradient(to right,
					#6a82fb,
					#fc5c7d);
			/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
			color: white;
			border: none;
			border-radius: 5px;
		}

		.beautifyBtn3 {
			width: 600px;
			border: none;
		}

		.update {
			color: white;
			background: #fc5c7d;
			background: -webkit-linear-gradient(to right, #6a82fb, #fc5c7d);
			background: linear-gradient(to right, #6a82fb, #fc5c7d);
		}

		.delete {
			color: white;
			background: #ff512f;
			background: -webkit-linear-gradient(to right, #dd2476, #ff512f);
			background: linear-gradient(to right, #dd2476, #ff512f);
		}

		.actionScope {
			width: 60px;
			height: 30px;
			position: absolute;
			opacity: 50;
			z-index: 999;
			top: 2px;
			right: -240px;
            border:2px solid darkslategray;
            box-shadow: darkgrey 10px 10px 30px 5px ;//边框阴影
		}

		.showUDP1 {
			display: none;
		}
		
		.showbutton1 {

			text-align:center
			/* margin-left: 150px; */

		}

		// 灰色
		.QPushbutton[state="0"] {
			border: 2px solid;
			display: inline-block;
			font: bold 12px/25px Arial, sans-serif;
			text-decoration: none;
			text-align: center;
			font-size: 1em;
			line-height: 50px;
			width: 50px;
			height: 50px;
			margin: 10px;
			border-radius: 25px;
			color: black;
			background: linear-gradient(to top, rgba(240, 240, 237, 1.0) 0%, rgba(255, 255, 255, 1) 100%);
		}
		// 红色
		.QPushbutton[state="1"] {
			border: 2px solid;
			display: inline-block;
			font: bold 12px/25px Arial, sans-serif;
			text-decoration: none;
			text-align: center;
			font-size: 1em;
			line-height: 50px;
			width: 50px;
			height: 50px;
			margin: 10px;
			border-radius: 25px;
			color: black;
			background: linear-gradient(to top, rgba(240, 0, 0, 1.0) 0%, rgba(255, 255, 255, 1) 100%);

		}
		// 橙色
		.QPushbutton[state="2"] {
			border: 2px solid;
			display: inline-block;
			font: bold 12px/25px Arial, sans-serif;
			text-decoration: none;
			text-align: center;
			font-size: 1em;
			line-height: 50px;
			width: 50px;
			height: 50px;
			margin: 10px;
			border-radius: 25px;
			color: black;
			background: linear-gradient(to top, rgba(255, 150, 2, 1.0) 0%, rgba(255, 255, 255, 1) 100%);
		}
		// 黄色
		.QPushbutton[state="3"] {
			border: 2px solid;
			display: inline-block;
			font: bold 12px/25px Arial, sans-serif;
			text-decoration: none;
			text-align: center;
			font-size: 1em;
			line-height: 50px;
			width: 50px;
			height: 50px;
			margin: 10px;
			border-radius: 25px;
			color: black;
			background: linear-gradient(to top, rgba(240, 240, 0, 1.0) 0%, rgba(255, 255, 255, 1) 100%);
		}
		// 绿色
		.QPushbutton[state="4"] {
			border: 2px solid;
			display: inline-block;
			font: bold 12px/25px Arial, sans-serif;
			text-decoration: none;
			text-align: center;
			font-size: 1em;
			line-height: 50px;
			width: 50px;
			height: 50px;
			margin: 10px;
			border-radius: 25px;
			color: black;
			background: linear-gradient(to top, rgba(25, 240, 0, 1) 0%, rgba(255, 255, 255, 1) 100%);
		}


		.QAccuary[state="0"] {
			border: 2px solid;
			display: inline-block;
			font: bold 12px/25px Arial, sans-serif;
			text-decoration: none;
			text-align: center;
			font-size: 1em;
			line-height: 50px;
			width: 50px;
			height: 50px;
			margin: 10px;
			color: black;
			background-color: gray;
		}

		.QAccuary[state="1"] {
			border: 2px solid;
			display: inline-block;
			font: bold 12px/25px Arial, sans-serif;
			text-decoration: none;
			text-align: center;
			font-size: 1em;
			line-height: 50px;
			width: 50px;
			height: 50px;
			margin: 10px;
			color: black;
			background-color: red;
		}

		.QAccuary[state="2"] {
			border: 2px solid;
			display: inline-block;
			font: bold 12px/25px Arial, sans-serif;
			text-decoration: none;
			text-align: center;
			font-size: 1em;
			line-height: 50px;
			width: 50px;
			height: 50px;
			margin: 10px;
			color: black;
			background-color: orange;
		}

		.QAccuary[state="3"] {
			border: 2px solid;
			display: inline-block;
			font: bold 12px/25px Arial, sans-serif;
			text-decoration: none;
			text-align: center;
			font-size: 1em;
			line-height: 50px;
			width: 50px;
			height: 50px;
			margin: 10px;
			color: black;
			background-color: yellow;
		}

		.QAccuary[state="4"] {
			border: 2px solid;
			display: inline-block;
			font: bold 12px/25px Arial, sans-serif;
			text-decoration: none;
			text-align: center;
			font-size: 1em;
			line-height: 50px;
			width: 50px;
			height: 50px;
			margin: 10px;
			color: black;
			background-color: green;
		}


		.accupic {
			float: left; //添加float样式即可实现水平排列
			margin-right: 15px;
		}

		.accupic2 {
			float: left; //添加float样式即可实现水平排列
			margin-right: 15px;
		}

		.battery {
			float: left; //添加float样式即可实现水平排列
			margin-left: 15px;
			position: relative;
			display: inline-block;
			height: 40px;
			width: 64px;
			padding: 10px;
			background: rgba(0, 0, 0, 0.9);
			border: 3px solid transparent;
			border-radius: 7px;
			box-shadow: inset 0 0 22px -5px rgba(194, 254, 225, 0.58), 0 0 22px -5px rgba(194, 254, 225, 0.58);
		}

		.battery:before {
			content: "";
			position: absolute;
			background-color: #ffffff;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border-radius: 5px;
			box-shadow: inset 0 0 22px -5px rgba(194, 254, 225, 0.58);
		}

		.battery:after {
			content: "";
			position: absolute;
			top: calc(50% - 8px);
			right: -9px;
			height: 16px;
			width: 7px;
			border-radius: 0 4px 4px 0;
			background-color: rgba(85, 85, 127, 0.9);
			box-shadow: 0 0 22px -5px rgba(194, 254, 225, 0.68);
		}

		.power {
			background-color: white;
			display: block;
			position: absolute;
			top: 5px;
			left: 5px;
			bottom: 5px;
			right: 5px;
			border-radius: 5px;
			-webkit-transform: scaleX(0.5);
			transform: scaleX(0.8);
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			background: rgba(194, 254, 225, 0.88);
			-webkit-transition: -webkit-transform 1s cubic-bezier(0, 0, 0.28, 0.95);
			transition: -webkit-transform 1s cubic-bezier(0, 0, 0.28, 0.95);
			transition: transform 1s cubic-bezier(0, 0, 0.28, 0.95);
			transition: transform 1s cubic-bezier(0, 0, 0.28, 0.95), -webkit-transform 1s cubic-bezier(0, 0, 0.28, 0.95);
		}


		.button {
			display: inline-block;
			outline: none;
			cursor: pointer;
			text-align: center;
			text-decoration: none;
			font: 16px/100% 'Microsoft yahei',Arial, Helvetica, sans-serif;
			padding: .5em 2em .55em;
			text-shadow: 0 1px 1px rgba(0,0,0,.3);
			-webkit-border-radius: .5em; 
			-moz-border-radius: .5em;
			border-radius: .5em;
			-webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);
			-moz-box-shadow: 0 1px 2px rgba(0,0,0,.2);
			box-shadow: 0 1px 2px rgba(0,0,0,.2);
		}
		.button:hover {
			text-decoration: none;
		}
		.button:active {
			position: relative;
			top: 1px;
		}
		.white {
			color: #606060;
			border: solid 1px #b7b7b7;
			background: #fff;
			background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#ededed));
			background: -moz-linear-gradient(top,  #fff,  #ededed);
			filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#ededed');
		}
		.white:hover {
			background: #ededed;
			background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#dcdcdc));
			background: -moz-linear-gradient(top,  #fff,  #dcdcdc);
			filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dcdcdc');
		}
		.white:active {
			color: #999;
			background: -webkit-gradient(linear, left top, left bottom, from(#ededed), to(#fff));
			background: -moz-linear-gradient(top,  #ededed,  #fff);
			filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#ededed', endColorstr='#ffffff');
		}
	}
</style>
