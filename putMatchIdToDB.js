const sqlite3 = require('./backend/node_modules/sqlite3')
const db = new sqlite3.Database("./tensor0103.db")
const fs = require('fs')
const coordinatorNum = 4

var sqlite = require("./backend/node_modules/sqlite-sync")
sqlite.connect("../tensor5.db")

db.run("PRAGMA foreign_keys = ON")

db.run(`
	CREATE TABLE IF NOT EXISTS MATCHDATA (
		ID INTEGER PRIMARY KEY     AUTOINCREMENT,
		INSTALLADDRESS  VARCHAR(10),
        MACADDRESS      CHAR(24),
        CLASSIFICATION  INT
	)
`)

/* const matchIdArr = [
    {ADDRESS: "29-M-X-1", MACADDRESS: "003a00280e47363530323532", CLASSIFICATION: 1},
    {ADDRESS: "29-M-X-8", MACADDRESS: "0061001a1847373033353732", CLASSIFICATION: 1},
    {ADDRESS: "29-M-X-14", MACADDRESS: "007300231847373134303234", CLASSIFICATION: 1},
    {ADDRESS: "29-M-X-27", MACADDRESS: "002b00240f47363530323532", CLASSIFICATION: 1},
    {ADDRESS: "29-M-X-36", MACADDRESS: "003a005b1547363438303038", CLASSIFICATION: 1},
    {ADDRESS: "29-M-S-1", MACADDRESS: "006a00320d47373135383230", CLASSIFICATION: 2},
    {ADDRESS: "29-M-S-10", MACADDRESS: "0022002e1147363332383634", CLASSIFICATION: 2},
    {ADDRESS: "29-M-S-19", MACADDRESS: "006a002f1847373036353034", CLASSIFICATION: 2},
    {ADDRESS: "29-M-S-28", MACADDRESS: "007900310a47363530323532", CLASSIFICATION: 2},
    {ADDRESS: "29-M-S-36", MACADDRESS: "005a002c0847363530323532", CLASSIFICATION: 2},
    {ADDRESS: "29-S-X-1", MACADDRESS: "003300310f47363530323532", CLASSIFICATION: 3},
    {ADDRESS: "29-S-X-7", MACADDRESS: "008600371147373135383230", CLASSIFICATION: 3},
    {ADDRESS: "29-S-X-14", MACADDRESS: "004400240347363034303735", CLASSIFICATION: 3},
    {ADDRESS: "29-S-X-28", MACADDRESS: "007100340d47363530323532", CLASSIFICATION: 3},
    {ADDRESS: "29-S-X-36", MACADDRESS: "002400331647373134303234", CLASSIFICATION: 3},
    {ADDRESS: "29-S-S-1", MACADDRESS: "008000541147373135383230", CLASSIFICATION: 4},
    {ADDRESS: "29-S-S-13", MACADDRESS: "002c003f1347383235323737", CLASSIFICATION: 4},
    {ADDRESS: "29-S-S-25", MACADDRESS: "004f005b0f47373135383230", CLASSIFICATION: 4},
    {ADDRESS: "29-S-S-36", MACADDRESS: "007900560e47383137333835", CLASSIFICATION: 4},
    {ADDRESS: "桥下工务段", MACADDRESS: "003500281147373139303133", CLASSIFICATION: 4}
] */

var matchIdArrTemp = []
var temp = {}
var matchIdArr = []

for (let j = 1; j <= coordinatorNum; j++) {
    try {
        const data = fs.readFileSync('./macid3'+ j + '.txt', 'utf8')
        const lines = data.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
            let item = lines[i].split(" ### ")
            item.push(j)
            matchIdArrTemp.push(item)
        }
    } catch (err) {
        console.error(err)
    }
}

console.log(matchIdArrTemp)

for (let index in matchIdArrTemp) {
    temp.ADDRESS = matchIdArrTemp[index][2]
    temp.MACADDRESS = matchIdArrTemp[index][0]
    temp.CLASSIFICATION = matchIdArrTemp[index][3]
    matchIdArr.push(temp)
    temp = {}
}

const query = "INSERT INTO MATCHDATA (INSTALLADDRESS, MACADDRESS, CLASSIFICATION) VALUES (?, ?, ?)"
let values = []

matchIdArr.forEach((item, index)=> {
    values = [item.ADDRESS, item.MACADDRESS, item.CLASSIFICATION]
    db.run(query, values, function(error) {
        if (!error) {
            console.log("第"+(index+1)+"条信息创建成功")
        } else {
            console.log(error)
        }
    }) 
})

console.log("创建完成")