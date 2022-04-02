<template>
    <el-tooltip :content="address" placement="bottom" effect="light">
        <button class="QPushbutton" :state="state" @click="jumpPage()">{{address.split("-")[3] || address.substr(4, 2)}}</button>
    </el-tooltip>
</template>

<script>
    export default {
        name: "MyButton",
        props:["matchId", "address", "type"],
        data() {
            return {
                state: 0
            }
        },
        methods: {
            jumpPage() {
                if (this.type == "node") {
                    this.$router.push({name:'nodeTablePage', params: {matchId: this.matchId, address: this.address}})
                } else if (this.type == "coordinator") {
                    this.$router.push({name:'coordinatorTablePage', params: {Id: this.address}})
                }
            }
        },
    }
</script>

<style scoped>
    .QPushbutton {
        cursor: pointer;
    }

    /* 灰色 */
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
    /* 红色 */
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
    /* 橙色 */
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
    /* 黄色 */
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
    /* 绿色 */
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
</style>