<template>
    <div id="BtnPage">
        <el-container>
            <!-- 用户信息界面 -->
            <el-aside width="200px">
                <h2>用户名:&nbsp;{{user}}</h2>
                    <icon  type="md-power" size="30" @click="logout" style="cursor: pointer;"/><br>
                    <h3>协调器状态:<br>编号:{{" "+num+' 号'}}<br>电量:{{" "+electricity+' V'}}<br>温度:{{" "+temper+' °C'}}</h3>
            </el-aside>
            <!-- 按钮展示界面 -->
            <el-container>
                <!-- <el-header>按钮展示</el-header> -->
                <el-main>
                    <div class="coordinatorPart">
                        <h1>协调器</h1>
                        <MyButton v-for="obj in coordinatorData" :address="obj.MACADDRESS" :key="obj.ID" type="coordinator" matchId=""/>
                    </div>

                    <div v-for="(arr, index) of matchArr" :id="'classification:' + arr[0].CLASSIFICATION" :key="index" class="btnPart">
                        <h1>classification:{{arr[0].INSTALLADDRESS | addressSlice}}</h1>
                        <MyButton v-for="(obj, index) of matchArr[arr[0].CLASSIFICATION-1]" :matchId="obj.MACADDRESS" :address="obj.INSTALLADDRESS" ref="button" :key="index" type="node"/>
                    </div>
                </el-main>
            </el-container>
            <!-- 设置页面 -->
            <el-drawer
            title="设置页面"
            :before-close="handleClose"
            :visible.sync="dialog"
            direction="rtl"
            custom-class="demo-drawer"
            ref="drawer"
            >
            <div class="demo-drawer__content">
                <el-form :model="form">
                    <h2>报警阀值设置</h2>
                    <el-form-item label="alarmThreshold1:" style="margin-left: 20%; margin-right: 20%; margin-top: 20px">
                        <el-input v-model.number="form.alarmThreshold1" autocomplete="off" style="width: 50%;"></el-input>
                    </el-form-item>
                    <el-form-item label="alarmThreshold2:" style="margin-left: 20%; margin-right: 20%; margin-top: 20px">
                        <el-input v-model.number="form.alarmThreshold2" autocomplete="off" style="width: 50%;"></el-input>
                    </el-form-item>
                    <el-form-item label="alarmThreshold3:" style="margin-left: 20%; margin-right: 20%; margin-top: 20px">
                        <el-input v-model.number="form.alarmThreshold3" autocomplete="off" style="width: 50%;"></el-input>
                    </el-form-item>
                    <h2>子节点mac地址配置</h2>
                    <el-form-item label="阻尼器编号" style="margin-left: 25%; margin-right: 25%; margin-top: 20px">
                        <el-select v-model="form.selector">
                            <p v-for="(arr, index) in matchArr" :key="index"><el-option v-for="(obj, index) in matchArr[arr[0].CLASSIFICATION-1]" :label="obj.INSTALLADDRESS" :value="obj.INSTALLADDRESS" :key="index"></el-option></p>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="子字节mac地址:" style="margin-left: 10%; margin-right: 10%; margin-top: 20px">
                        <el-input v-model="macaddress" autocomplete="off" style="width: 70%;" ></el-input>
                    </el-form-item>
                </el-form>
                <div class="demo-drawer__footer" style="margin-left: 35%; margin-right: 35%; margin-top: 20%">
                    <el-button @click="cancelForm">取 消</el-button>
                    <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
                </div>
            </div>
            </el-drawer>
        </el-container>
        <p style="text-align: center; margin-top: 20px;">
            <button @click="dialog=true;alertDialog=false" class="settingBtn">设置</button>
            <button @click="showAllTweets" class="settingBtn">全部数据</button>
            </p>
    </div>
</template>

<script>
    import MyButton from "./MyButton.vue"

    const client = require("../client")
    export default {
        name: "BtnPage",
        data() {
            return {
                alertDialog: false, // 设置界面 是否修改
                dialog: false,      // 设置界面是否弹出
                loading: false,     // 设置界面确定按钮是否加载中字样
                user: "--",     // 用户名
                btnPartNum: 4,  // 协调器数量
                btnNum: 36,     // 子节点数量
                num: "--",
                electricity: "--",
                temper: "--",
                error: "",
                // 报警阀值
                alarmThreshold1: localStorage.getItem("alarmThreshold1") || 150,   
				alarmThreshold2: localStorage.getItem("alarmThreshold2") || 100,
				alarmThreshold3: localStorage.getItem("alarmThreshold3") || 70,
                // 设置页面中显示
                form: {
                    alarmThreshold1: null,
                    alarmThreshold2: null,
                    alarmThreshold3: null,

                    selector: "",
                },
                macaddress: "",
                timer: null,
                // 匹配信息数据
                matchData: [],
                // 协调器信息数据
                coordinatorData: [],
                refresh: true,
            }
        },
        computed: {
            // 依据CLASSIFICATION进行分类得到所有种类的CLASSICFICATION数组
            classificationArr() {
                let arr = []
                this.matchData.forEach((obj)=> {
                    if (arr.indexOf(obj.CLASSIFICATION) < 0 || arr.length == 0) {
                        arr.push(obj.CLASSIFICATION)
                    }
                })
                return arr.sort()
            },
            // 按照classification编号分类形成数组后组合的大数组
            matchArr() {
                let arrTotal = []
                let arr = []
                this.classificationArr.forEach((num)=> {
                    this.matchData.forEach((obj)=> {
                        if (obj.CLASSIFICATION === num) {
                            arr.push(obj)
                        }
                    })
                    // 给arr进行降序，arr存储节点数据
                    arr.sort(function(m, n) {
                        if (m.INSTALLADDRESS.split("-")[3] < n.INSTALLADDRESS.split("-")[3]) return -1
                        else if (m.INSTALLADDRESS.split("-")[3] > n.INSTALLADDRESS.split("-")[3]) return 1
                        else return 0
                    })

                    arrTotal.push(arr)
                    arr = []
                })
                return arrTotal
            },
            // 根据matchArr中的分类顺序形成一个关于macaddress的数组，顺序很重要，顺序为按钮的布置顺序
            matchIdArr() {
                let matchIdArr = []
                this.matchArr.forEach((arr)=> {
                    arr.forEach((obj)=> {
                        matchIdArr.push(obj.MACADDRESS)
                    })
                })
                return matchIdArr
            },        
        },
        components: {MyButton},
        methods: {
            //退出登录，清除localStorage中的用户信息并跳转到登录页
			logout() {
				localStorage.removeItem("persons")
				this.$router.push("/")
			},
            // 设置界面
            setting() {
                console.log(this.$refs)
                this.openDialog = true
                this.$nextTick(()=>{
                    this.refs.testDialog.init()
                })

            },

            // 关闭设置页面前执行
            handleClose(done) {
                if (this.loading) {
                    return;
                }
                // 如果数据没有修改，直接退出
                if (!this.alertDialog) {
                    this.dialog = false
                    return
                }
                //数据被修改，询问是否保存数据
                this.$confirm('确定要提交表单吗？')
                    .then(_ => {
                    this.loading = true;
                    // 同步改动的报警阀值
                    this.alarmThreshold1 = this.form.alarmThreshold1
                    this.alarmThreshold2 = this.form.alarmThreshold2
                    this.alarmThreshold3 = this.form.alarmThreshold3

                    localStorage.setItem("alarmThreshold1", this.form.alarmThreshold1)
                    localStorage.setItem("alarmThreshold2", this.form.alarmThreshold2)
                    localStorage.setItem("alarmThreshold3", this.form.alarmThreshold3)

                    // 修改数据库中的macaddress
                    client.modifyMacAddress(this.form.selector, this.macaddress, (error)=> {
                        this.refresh = !this.refresh
                        if (error.length !== 0) {
                            console.log(error)
                        }
                    })

                    this.timer = setTimeout(() => {
                            done();
                            // 动画关闭需要一定的时间
                            setTimeout(() => {
                                this.loading = false;
                            }, 400);
                        }, 500);
                    })
                    .catch(_ => {});
            },
            // 退出设置界面
            cancelForm() {
                this.loading = false;
                this.dialog = false;
                // 当未确认退出时候，同步form和实际的阀值
                this.form.alarmThreshold1 = this.alarmThreshold1
                this.form.alarmThreshold2 = this.alarmThreshold2
                this.form.alarmThreshold3 = this.alarmThreshold3

                this.form.selector = this.matchArr[0][0].INSTALLADDRESS
                clearTimeout(this.timer);
            },

            // 显示所有数据
            showAllTweets() {
                this.$router.push({name:'nodeTablePage', params: {matchId: "all"}})
            }
        },
        created() {
            // 将form中报警阀值同步
            this.form.alarmThreshold1 = this.alarmThreshold1
            this.form.alarmThreshold2 = this.alarmThreshold2
            this.form.alarmThreshold3 = this.alarmThreshold3


            //如果用户名未登录， 返回空。做判断防止报错
            let judegExist = JSON.parse(localStorage.getItem("persons"))
            if (judegExist) {
                this.user = JSON.parse(localStorage.getItem("persons"))[0].user
            } else {
                this.user = "未登录!"
            }

            // 从数据库获取的位置 mac地址 所属协调器信息
            client.getMatchData((error, matchData)=> {
                if (error.length == 0) {
                    this.matchData = matchData
                } else {
                    this.error = error
                    console.log(error)
                }
            })

            // 从数据库获取的协调器信息
            client.getCoordinatorData((error, coordinatorData)=> {
                if (error.length == 0) {
                    // 排序后赋值给coordinatorData
                    this.coordinatorData = coordinatorData.sort(function(m, n) {
                        if (m.MACADDRESS < n.MACADDRESS) return -1
                        else if (m.MACADDRESS > n.MACADDRESS) return 1
                        else return 0
                    })
                } else {
                    this.error = error
                    console.log(error)
                }
            })

            client.getRecTweets((error, tweets)=> {
                let index = 0
                if (error.length == 0) {
                    tweets.forEach((tweet)=> {
                        index = 0
                        index = this.matchIdArr.indexOf(tweet.MACADDRESS)
                        console.log(index)
                        if (index >= 0) {
                            if (tweet.AMPLITUDE > this.alarmThreshold1) {
                                this.$refs.button[index].state = 1
                            } else if (tweet.AMPLITUDE > this.alarmThreshold2) {
                                this.$refs.button[index].state = 2
                            } else if (tweet.AMPLITUDE > this.alarmThreshold3) {
                                this.$refs.button[index].state = 3
                            } else if (tweet.AMPLITUDE > -1) {
                                this.$refs.button[index].state = 4
                            } else {
                                this.$refs.button[index].state = 0
                            }
                        }
                    })
                } else {
                    this.error = error
                    console.log(this.error)
                }
            })
        },
        mounted() {
            setInterval(()=> {
                // 根据数据库信息判断按钮颜色
                client.getRecTweets((error, tweets)=> {
                    let index = 0
                    if (error.length == 0) {
                        tweets.forEach((tweet)=> {
                            index = 0
                            index = this.matchIdArr.indexOf(tweet.MACADDRESS)
                            if (index >= 0) {
                                if (tweet.AMPLITUDE > this.alarmThreshold1) {
                                    this.$refs.button[index].state = 1
                                } else if (tweet.AMPLITUDE > this.alarmThreshold2) {
                                    this.$refs.button[index].state = 2
                                } else if (tweet.AMPLITUDE > this.alarmThreshold3) {
                                    this.$refs.button[index].state = 3
                                } else if (tweet.AMPLITUDE > -1) {
                                    this.$refs.button[index].state = 4
                                } else {
                                    this.$refs.button[index].state = 0
                                }
                            }
                        })
                    } else {
                        this.error = error
                        console.log(this.error)
                    }
                })
            }, 100)   
        },
        watch: {
            form: {
                deep: true,
                handler() {
                    this.alertDialog = true
                    this.matchArr.forEach((arr)=> {
                        arr.forEach((obj)=> {
                            if (obj.INSTALLADDRESS === this.form.selector) {
                                this.macaddress = obj.MACADDRESS
                                return
                            }
                        })
                    })
                }
            },
            matchArr: {
                deep: true,
                handler() {
                    this.form.selector = this.matchArr[0][0].INSTALLADDRESS
                    this.macaddress = this.matchArr[0][0].MACADDRESS
                }
            },
            macaddress() {
                // 当切换选项也会触发提交
                this.alertDialog = true
            },
            // refresh变化时更新matchData、classificationArr、matchArr、matchIdArr
            refresh() {
                // 从数据库获取的位置 mac地址 所属协调器信息
                client.getMatchData((error, matchData)=> {
                    if (error.length == 0) {
                        this.matchData = matchData
                    } else {
                        this.error = error
                        console.log(error)
                    }
                })
                console.log(this.$refs)
                // 全部按钮置灰色
                for (let i = 0; i < this.$refs.button.length; i++) {
                    this.$refs.button[i].state = 0
                }
            }
        }
    }

</script>

<style lang="css" scoped>

    h2 {
        text-align: center;
        font-size: 25px;
        margin-top: 25px;
        margin-bottom: 25px;
    }

    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
        font-size: 35px;
        font-style: italic;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 30px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 50px;
    }

    /* body > .el-container {
        
    } */

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .coordinatorPart {
        width: 90%;
        margin: auto;
        margin-top: 10px;
        border: 2px groove red; 
    }

    .btnPart {
        width: 90%;
        margin: auto;
        margin-top: 10px;
        border: 2px groove blue; 
    }

    /* 设置按钮样式 */
    .settingBtn {
        cursor: pointer;
        width: 200px;
        width: 100px;
        margin-right: 50px;
        margin-bottom: 25px;
    }
</style>