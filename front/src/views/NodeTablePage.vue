<template>
    <div id="nodeTablePart">
		<h2 v-if="matchId=='all'">所有数据展示</h2>
		<h2 v-if="matchId!=='all'">mac地址:{{matchId}}</h2>
		<h2 v-if="matchId!=='all'">地址标号:{{address}}</h2>
		<br>
        <vxe-table
          border
          round
          ref="xTable"
          height="665" 
          :loading="loading"
          :column-config="{resizable: false, isCurrent: true, isHover: true}"
          :row-config="{isCurrent: true, isHover: true}"
          :data="tableData" style="font-size: 18px">
          <vxe-column
            v-for="config in tableColumn"
            :key="config.key"
            :type="config.type"
            :field="config.field"
            :title="config.title"
            :fixed="config.fixed"
            :width="config.width">
            <template #default="{ row }">
                <div v-if="config.key===1"><strong>&nbsp;{{address || row.ADDRESS}}</strong></div>
                <div v-else-if="config.key===2">
                    <img :src="row.AMPIMAGE" height="30" width="150">
                    <strong>&nbsp;{{row.AMPLITUDE}}</strong>
                </div>
                <div v-else-if="config.key===3"><strong>&nbsp;{{row.FREQUENCY}}</strong></div>
                <div v-else-if="config.key==4">
                    <img :src="row.ACCURIMAGE" height="30" width="80">
                    <strong>&nbsp;{{row.ELECTRICITY}}</strong>
                </div>
                <div v-else-if="config.key===5"><strong>&nbsp;{{row.VOLTAGE | userSlice}}V</strong></div>
                <div v-else-if="config.key===6"><strong>&nbsp;{{row.READTIME}}</strong></div>
                <!-- <div v-else><button @click="drawAcceleration(row.ID)" class="showDataBtn">显示数据</button></div> -->
                <div v-else><button @click="showData(row.ID, row.READTIME, row.MACADDRESS)" class="showDataBtn">显示数据</button></div>
            </template>
          </vxe-column>

          <template #empty>
            <span style="color: red;">
              <img src="../assets/img1.gif">
              <p>没有更多数据了！</p>
            </span>
          </template>
        </vxe-table>

        <vxe-pager
          border
		  background
		  perfect
          size="medium"
		  align="left"
          :loading="loading"
          :current-page="tablePage.currentPage"
          :page-size="tablePage.pageSize"
          :total="tablePage.totalResult"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handlePageChange"
		  style="font-size: 16px; height: 60px">
        </vxe-pager>
		<p style="text-align: center; margin-top: 20px;"><button @click="drawTrends" style="width: 150px; height: 50px" v-if="matchId!=='all'">趋势分析</button></p>

		<!-- 振幅变化 -->
		<Modal
        v-model="modal1"
        title="三维振幅图"
		width=1000
        >
			<p>ID：{{msgId}}</p><p>时间：{{msgTime}}</p>
			<p>Mac地址：{{macaddress}}</p>
			<p>
				<br>
				<canvas id="accelerationOfX" width="800" height="300">
				您的浏览器不支持 HTML5 canvas 标签。
				</canvas>
				<br>
				<canvas id="accelerationOfY" width="800" height="300">
				您的浏览器不支持 HTML5 canvas 标签。
				</canvas>
				<br>
				<canvas id="accelerationOfZ" width="800" height="300">
				您的浏览器不支持 HTML5 canvas 标签。
				</canvas>
				<br>
				<canvas id="accelerationOfAll" width="800" height="300">
				您的浏览器不支持 HTML5 canvas 标签。
				</canvas>
			</p>
    	</Modal>

		<!-- 趋势分析 -->
		<Modal
        v-model="modal2"
        title="趋势分析图"
		width=1200
        >
			<p style="font-weight:bold;">位置: {{address}}</p>
			<p style="font-weight:bold;">Mac地址：{{matchId}}</p>
			<p id = "number" style="font-weight:bold;">个数：</p>
			
			<div>
				<input type="datetime-local" id="startTime" step="1"/>
				&nbsp;&nbsp;至&nbsp;&nbsp;
				<input type="datetime-local" id="endTime" step="1"/>		
				<button onclick="drawByTime()" style="width: 90px">搜索</button>

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
			
		</Modal>
	</div>
</template>

<script>
    import * as echarts from 'echarts'

    import MyButton from "./MyButton.vue"

	import {calxyzs} from "../findpink.js"

    const client = require("../client")

    export default {
        name: "NodeTablePage",
        components: {MyButton},
        data() {
            return {
				// 判断现阶段页面是否使用该组件
                reset: true,
				// 判断表格是否显示加载界面
                loading: false,
				accelerationReset: false,
				trendReset: false,
                tableColumn: [  // 表格标题
                    {key: 1, field: 'ADDRESS', title: '位置', width: "12%"},
                    {key: 2, field: 'AMPLITUDE', title: '振幅', width: "24%"},
                    {key: 3, field: 'FREQUENCY', title: '频率', width: "5%"},
                    {key: 4, field: 'ELECTRICITY', title: '电量', width: "15%"},
                    {key: 5, field: 'VOLTAGE', title: '电压', width: "10%"},
                    {key: 6, field: 'READTIME', title: '时间', width: "24%"},
                    {key: 7, field: 'SHOWDATA', title: '查看数据', width: "10%"},
                ],
                tableData: [],  // 表格数据
				// 分页组件数据
                tablePage: {
                    currentPage: 1,	// 当前页
                    pageSize: 10,	// 每页数据个数
                    totalResult: 100	// 总共数据个数
                },
				opinionData1: [],
				opinionData2: [],
				opinionData3: [],
				opinionData4: [],
				opinionData5: [],
				opinionData6: [],
				opinionData7: [],
				globalVar1: [],
				globalVar2: [],
				startTime: "",
				endTime: "",
				charts: null,
				modal1: false,
				modal2: false,
				msgId: null,
				msgTime: null,
				matchData: [],
				macaddress: "",
            }
        },
        computed: {
            // 将matchId放入computed计算属性中，这样点击一个按钮后返回按钮界面再次点击按钮才能触发matchId更新
            matchId() {
                this.reset = !this.reset
                return this.$route.params.matchId
            },
			address() {
				return this.$route.params.address
			}
        },
        methods: {
			showData(id, time, mac) {
				this.macaddress = mac

				this.msgId = id
				this.msgTime = time
				this.modal1 = true

				let judegExist = JSON.parse(localStorage.getItem("persons"))
				if (judegExist) {
					client.getSearchSingleTweets(id, (error, tweets) => {
						if (error.length == 0) {
							let readData = tweets[0]["SENSORDATA"]
						
							this.globalVar2 = []
							var obj = calxyzs(readData)
							this.opinionData1 = obj.x
							this.opinionData2 = obj.y
							this.opinionData3 = obj.z

							for (let i = 0; i < this.opinionData1.length; i++) {
								this.opinionData7[i] = Math.sqrt(Math.pow(this.opinionData1[i], 2) + Math.pow(this.opinionData2[i], 2) + Math.pow(this.opinionData3[i], 2))
							}

							for (let i = 1; i <= this.opinionData1.length; i++) {
								this.globalVar2.push(i.toString())
							}

							this.accelerationReset = !this.accelerationReset
						} else {
							this.$message.error("Query Fali Please Login First")
						}
					})
				}
			},

            //绘制x轴的加速度曲线
			drawAccelerationOfX(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: "cross",
							label: {
								backgroundColor: "#6a7958"
							}
						}
					},
					legend: {
						data: ['加速度x'],
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
						data: this.globalVar2

					},
					yAxis: {
						type: 'value'
					},
					dataZoom: [{
						type: "inside"
					}],

					series: [{
						name: '加速度x',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData1
					}]
				})
			},

			drawAccelerationOfY(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: "cross",
							label: {
								backgroundColor: "#6a7958"
							}
						}
					},
					legend: {
						data: ['加速度y']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					dataZoom: [{
						type: "inside"
					}],
			
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.globalVar2
			
					},
					yAxis: {
						type: 'value'
					},
			
					series: [{
						name: '加速度y',
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
						trigger: 'axis',
						axisPointer: {
							type: "cross",
							label: {
								backgroundColor: "#6a7958"
							}
						}
					},
					legend: {
						data: ['加速度z']
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
					dataZoom: [{
						type: "inside"
					}],
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.globalVar2
			
					},
					yAxis: {
						type: 'value'
					},
			
					series: [{
						name: '加速度z',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData3
					}]
				})
			},
			
			drawComprehensiveAcceleration(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: "cross",
							label: {
								backgroundColor: "#6a7958"
							}
						}
					},
					legend: {
						data: ['综合加速度']
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
					dataZoom: [{
						type: "inside"
					}],
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.globalVar2
			
					},
					yAxis: {
						type: 'value'
					},
			
					series: [{
						name: '综合加速度',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData7
					}]
				})
			},

            // 翻页功能
            handlePageChange({ currentPage, pageSize }) {
                this.tablePage.currentPage = currentPage
                this.tablePage.pageSize = pageSize

				if (this.matchId === "all") {
					client.getAllTweets(this.tablePage.currentPage, this.tablePage.pageSize, (error, tweets)=> {
						if (error.length == 0) {
								this.tableData = this.formattweets(tweets)

								this.tableData.forEach((obj1)=> {
									this.matchData.forEach((obj2)=> {
										if (obj1.MACADDRESS === obj2.MACADDRESS) {
											obj1.ADDRESS = obj2.INSTALLADDRESS
										}
									})
									if (!obj1.ADDRESS) {
										obj1.ADDRESS = "undefined"
									}
								})

								this.loading = false
							} else {
								this.error = error
								console.log(error)
							}
					})
				} else {
					client.getNodeTweets(this.matchId, this.tablePage.currentPage, this.tablePage.pageSize, (error, tweets)=> {
						if (error.length == 0) {
								this.tableData = this.formattweets(tweets)
								this.loading = false
							} else {
								this.error = error
								console.log(error)
							}
					})
				}
                
            },

			//通过自定义时间段展示数据趋势
			drawByTime() {
				if (document.getElementById("startTime").value == "" || document.getElementById("endTime").value == "") {
					return
				} else {
					var startTime = document.getElementById("startTime").value
					var endTime = document.getElementById("endTime").value

					this.startTime = startTime
					this.endTime = endTime

					startTime = startTime.replace("T", "-")
					endTime = endTime.replace("T", "-")
					var reg = new RegExp( ':' , "g" )
					startTime = startTime.replace(reg, "-")
					endTime = endTime.replace(reg, "-")

					var judgeTime = this.compareTime(startTime, endTime)
					
					if (judgeTime) {
						let amplitude = []
						let frequency = []
						let adc = []
						this.globalVar1 = []	
						client.getTweetsForPicBytime(this.matchId, startTime, endTime, (errors, tweets) => {
							for(var i = 0; i < tweets.length; i++) {
								amplitude.push(tweets[i]["AMPLITUDE"])
								frequency.push(tweets[i]["FREQUENCY"])
								adc.push(tweets[i]["ADC"].toFixed(2))
								this.globalVar1.push(tweets[i]["READTIME"].substring(4))
							}
							this.opinionData4 = amplitude
							this.opinionData5 = frequency
							this.opinionData6 = adc
							document.getElementById("number").innerHTML = "个数：" + tweets.length
							// 触发画图
							this.trendReset = !this.trendReset
						})
					} else {
						alert("请选择合理时间段！")
					}
				}
			},

			//显示趋势图的窗口
			drawTrends() {
				this.modal2 = true
				// 避免观看两个按钮时，当搜索第一个按钮一段时间电压变化，然后点击第二个按钮观察趋势，电压图会显示为上一个按钮的电压图，reset。
				this.opinionData4 = []	
				this.opinionData5 = []
				this.opinionData6 = []
				this.globalVar1 = []
	
				var macaddress = this.matchId
				var address = this.address
								
				/* const title = "Query Success"
				const content = `
				<p style="font-weight:bold;">位置: ${address}</p>
				<p style="font-weight:bold;">Mac地址：${macaddress}</p>
				<p id = "number" style="font-weight:bold;">个数：<p>
				<p>
					<div>
						<input type="datetime-local" id="startTime" step="1"/>
						&nbsp;&nbsp;至&nbsp;&nbsp;
						<input type="datetime-local" id="endTime" step="1"/>		
						<button onclick="drawByTime()" style="width: 90px">搜索</button>

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
				}) */
				
				this.setDefaultTime()
			},
			
			// 设置默认时间，即当前时间 时间段一天
			setDefaultTime() {
				var myDate = new Date()
				var year = myDate.getFullYear().toString()
				var month = (myDate.getMonth()+1).toString()
				var day = myDate.getDate().toString()
				// 时分秒开始与结束时间相同
				var hour = myDate.getHours().toString()
				var minute = myDate.getMinutes().toString()
				var second = myDate.getSeconds().toString()

				// 开始时间数据，需要判断月份(结束为1时，开始为12)，判读日子(结束为1，需判断开始为28、29、30、31)
				var day2 = day
				var month2 = month
				var year2 = year

				// 判断月份是否为个位数，是则前面添加"0"
				if (month.length == 1) {
					month = "0" + month
					month2 = "0" + month2
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

				document.getElementById("startTime").value = this.startTime
				document.getElementById("endTime").value = this.endTime
				this.drawByTime()
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
						data: ['振幅']
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
						data: this.globalVar1
			
					},
					yAxis: {
						type: 'value',
						name: '振幅'
					},
					dataZoom:[{
						type:"inside"         
					}],
			
					series: [{
						// name: '振幅',
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
						data: ['频率']
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
						data: this.globalVar1
			
					},
					yAxis: {
						type: 'value',
						name: '频率'
					},
					dataZoom:[{
						type:"inside"         
					}],
			
					series: [{
						// name: '频率',
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
						data: ['电压']
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
						data: this.globalVar1
			
					},
					yAxis: {
						type: 'value',
						name: '电压'
					},
					dataZoom:[{
						type:"inside"         
					}],
					series: [{
						// name: '电压',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData6
					}]
				})
			},
        },
        created() {                                         
            window.drawByTime = this.drawByTime

			client.getMatchData((error, matchData)=> {
                if (error.length == 0) {
                    this.matchData = matchData
                } else {
                    this.error = error
                    console.log(error)
                }
            })

			if (this.matchId === "all") {
				this.loading = true
				client.getAllTweets(this.tablePage.currentPage, this.tablePage.pageSize, (error, tweets)=> {
					if (error.length == 0) {
							this.tableData = this.formattweets(tweets)

							this.tableData.forEach((obj1)=> {
									this.matchData.forEach((obj2)=> {
										if (obj1.MACADDRESS === obj2.MACADDRESS) {
											obj1.ADDRESS = obj2.INSTALLADDRESS
										}
									})
									if (!obj1.ADDRESS) {
										obj1.ADDRESS = "undefined"
									}
								})

							this.loading = false
						} else {
							this.error = error
							console.log(error)
						}
				})

				// 获取该matchId数据总数
				client.getAllTweetsAccount((error, length)=> {
					if (error.length == 0) {
						this.tablePage.totalResult = length
					} else {
						this.error = error
						console.log(error)
					}
				})
			} else {
				this.loading = true
				client.getNodeTweets(this.matchId, this.tablePage.currentPage, this.tablePage.pageSize, (error, tweets)=> {
					if (error.length == 0) {
							this.tableData = this.formattweets(tweets)
							this.loading = false
						} else {
							this.error = error
							console.log(error)
						}
				})

				// 获取该matchId数据总数
				client.getTotalNodeAccount(this.matchId, (error, length)=> {
					if (error.length == 0) {
						this.tablePage.totalResult = length
					} else {
						this.error = error
						console.log(error)
					}
				})
			}
            
        },
        // 页面挂载完成后执行
        mounted() {
			// 刷新表格数据
            setInterval(()=> {
				if (this.matchId === "all") {
					client.getAllTweets(this.tablePage.currentPage, this.tablePage.pageSize, (error, tweets)=> {
						if (error.length == 0) {
								this.tableData = this.formattweets(tweets)

								this.tableData.forEach((obj1)=> {
									this.matchData.forEach((obj2)=> {
										if (obj1.MACADDRESS === obj2.MACADDRESS) {
											obj1.ADDRESS = obj2.INSTALLADDRESS
										}
									})
									if (!obj1.ADDRESS) {
										obj1.ADDRESS = "undefined"
									}
								})

								this.loading = false
							} else {
								this.error = error
								console.log(error)
							}
					})

					// 获取该matchId数据总数
					client.getAllTweetsAccount((error, length)=> {
						if (error.length == 0) {
							this.tablePage.totalResult = length
						} else {
							this.error = error
							console.log(error)
						}
					})
				} else {
					client.getNodeTweets(this.matchId, this.tablePage.currentPage, this.tablePage.pageSize, (error, tweets)=> {
						if (error.length == 0) {
								this.tableData = this.formattweets(tweets)
								this.loading = false
							} else {
								this.error = error
								console.log(error)
							}
					})

					// 获取该matchId数据总数
					client.getTotalNodeAccount(this.matchId, (error, length)=> {
						if (error.length == 0) {
							this.tablePage.totalResult = length
						} else {
							this.error = error
							console.log(error)
						}
					})
				}
			}, 10000)
        },
		// 监测
		watch: {
			reset() {
				this.tableData = []
				this.loading = true

				// 将页码恢复
				this.tablePage.currentPage = 1
				this.tablePage.pageSize = 10

				if (this.reset === false) {
					if (this.matchId === "all") {
				
						client.getAllTweets(this.tablePage.currentPage, this.tablePage.pageSize, (error, tweets)=> {
							if (error.length == 0) {
									this.tableData = this.formattweets(tweets)

									this.tableData.forEach((obj1)=> {
									this.matchData.forEach((obj2)=> {
										if (obj1.MACADDRESS === obj2.MACADDRESS) {
											obj1.ADDRESS = obj2.INSTALLADDRESS
										}
									})
									if (!obj1.ADDRESS) {
										obj1.ADDRESS = "undefined"
									}
								})

									this.loading = false
								} else {
									this.error = error
									console.log(error)
								}
						})

						// 获取该matchId数据总数
						client.getAllTweetsAccount((error, length)=> {
							if (error.length == 0) {
								this.tablePage.totalResult = length
							} else {
								this.error = error
								console.log(error)
							}
						})
					} else {
						client.getNodeTweets(this.matchId, this.tablePage.currentPage, this.tablePage.pageSize, (error, tweets)=> {
							if (error.length == 0) {
									this.tableData = this.formattweets(tweets)
									this.loading = false
								} else {
									this.error = error
									console.log(error)
								}
						})

						// 获取该matchId数据总数
						client.getTotalNodeAccount(this.matchId, (error, length)=> {
							if (error.length == 0) {
								this.tablePage.totalResult = length
							} else {
								this.error = error
								console.log(error)
							}
						})
					}

					client.getMatchData((error, matchData)=> {
						if (error.length == 0) {
							this.matchData = matchData
						} else {
							this.error = error
							console.log(error)
						}
					})
				}
			},
			// 对画图界面进行监视
			accelerationReset() {
				if (document.getElementById("accelerationOfX")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("accelerationOfX"))
					this.drawAccelerationOfX("accelerationOfX")
					
				}
				if (document.getElementById("accelerationOfY")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("accelerationOfY"))
					this.drawAccelerationOfY("accelerationOfY")
					
				}
				if (document.getElementById("accelerationOfZ")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("accelerationOfZ"))
					this.drawAccelerationOfZ("accelerationOfZ")
				}
				if (document.getElementById("accelerationOfAll")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("accelerationOfAll"))
					this.drawComprehensiveAcceleration("accelerationOfAll")			
				}
			},
			trendReset() {
				if (document.getElementById("startTime")) {
						var time = document.getElementById("startTime")
						time.setAttribute("value", this.startTime)
					}
				if (document.getElementById("endTime")) {
					var time = document.getElementById("endTime")
					time.setAttribute("value", this.endTime)
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
			},
		}
    }
</script>

<style lang="css" scoped>
    #nodeTablePart {
        width: 75%;
        height: auto;
        margin: auto;
        margin-top: 100px;
    }

	/* 显示数据按钮样式 */
    .showDataBtn {
        cursor: pointer;
    }

	h2 {
		text-align: center;
	}

	canvas {
		margin: 0 auto;
	}

</style>