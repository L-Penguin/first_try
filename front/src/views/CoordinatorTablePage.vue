<template>
    <div id="coordinatorTablePart">
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
    </div>
</template>

<script>
    const client = require("../client")

    export default {
        name: "CoordinatorTablePage",
        data() {
            return {
                reset: true,
                loading: false,
                tableColumn: [
                    {key: 1, field: "ID_MAIN", title: "协调器ID"},
                    {key: 2, field: "AMOUNT", title: "一次接收的数量"},
                    {key: 3, field: "ADC_MAIN", title: "电量"},
                    {key: 4, field: "TEMPER_MAIN", title: "温度"},
                    {key: 5, field: "READTIME", title: "时间"}
                ],
                tableData: [],
                tablePage: {
                    currentPage: 1,	// 当前页
                    pageSize: 10,	// 每页数据个数
                    totalResult: 100	// 总共数据个数
                },
                
            }
        },
        methods: {
            handlePageChange({ currentPage, pageSize }) {
                this.tablePage.currentPage = currentPage
                this.tablePage.pageSize = pageSize

                client.getCoordinatorTweets(this.matchId, this.tablePage.currentPage, this.tablePage.pageSize, (error, tweets)=> {
                    if (error.length == 0) {
                            tweets.forEach((obj)=> {
                                obj.ADC_MAIN = obj.ADC_MAIN.toFixed(2)
                                obj.TEMPER_MAIN = (Math.abs(obj.TEMPER_MAIN) - 320).toFixed(2)
                            })
                            this.tableData = tweets
                            this.loading = false
                        } else {
                            this.error = error
                            console.log(error)
                        }
                })

                // 获取该matchId数据总数
                client.getTotalCoordinatorAccount(this.matchId, (error, length)=> {
                    if (error.length == 0) {
                        this.tablePage.totalResult = length
                    } else {
                        this.error = error
                        console.log(error)
                    }
                })
            }
        },
        computed: {
            matchId() {
                this.reset = !this.reset
                return this.$route.params.Id
            }
        },
        created() {
            client.getCoordinatorTweets(this.matchId, this.tablePage.currentPage, this.tablePage.pageSize, (error, tweets)=> {
                if (error.length == 0) {
                        tweets.forEach((obj)=> {
                            obj.ADC_MAIN = obj.ADC_MAIN.toFixed(2)
                            obj.TEMPER_MAIN = (Math.abs(obj.TEMPER_MAIN) - 320).toFixed(2)
                        })
                        this.tableData = tweets
                        this.loading = false
                    } else {
                        this.error = error
                        console.log(error)
                    }
            })

            // 获取该matchId数据总数
            client.getTotalCoordinatorAccount(this.matchId, (error, length)=> {
                if (error.length == 0) {
                    this.tablePage.totalResult = length
                } else {
                    this.error = error
                    console.log(error)
                }
            })
        },
        mounted() {
            setInterval(()=> {
                client.getCoordinatorTweets(this.matchId, this.tablePage.currentPage, this.tablePage.pageSize, (error, tweets)=> {
                    if (error.length == 0) {
                        tweets.forEach((obj)=> {
                            obj.ADC_MAIN = obj.ADC_MAIN.toFixed(2)
                            obj.TEMPER_MAIN = (Math.abs(obj.TEMPER_MAIN) - 320).toFixed(2)
                        })
                        this.tableData = tweets
                        this.loading = false
                    } else {
                        this.error = error
                        console.log(error)
                    }
                })

                // 获取该matchId数据总数
                client.getTotalCoordinatorAccount(this.matchId, (error, length)=> {
                    if (error.length == 0) {
                        this.tablePage.totalResult = length
                    } else {
                        this.error = error
                        console.log(error)
                    }
                })
            }, 10000)
        },
        watch: {
            reset() {
                this.tableData = []
				this.loading = true

				// 将页码恢复
				this.tablePage.currentPage = 1
				this.tablePage.pageSize = 10

                if (this.reset === false) {
                    client.getCoordinatorTweets(this.matchId, this.tablePage.currentPage, this.tablePage.pageSize, (error, tweets)=> {
                        if (error.length == 0) {
                            tweets.forEach((obj)=> {
                                obj.ADC_MAIN = obj.ADC_MAIN.toFixed(2)
                                obj.TEMPER_MAIN = (Math.abs(obj.TEMPER_MAIN) - 320).toFixed(2)
                            })

                            this.tableData = tweets
                            this.loading = false
                        } else {
                            this.error = error
                            console.log(error)
                        }
                    })

                    // 获取该matchId数据总数
                    client.getTotalCoordinatorAccount(this.matchId, (error, length)=> {
                        if (error.length == 0) {
                            this.tablePage.totalResult = length
                        } else {
                            this.error = error
                            console.log(error)
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>
    #coordinatorTablePart {
        width: 75%;
        height: auto;
        margin: auto;
        margin-top: 100px;
    }
</style>