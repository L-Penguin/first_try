const sqlite3 = require('./backend/node_modules/sqlite3')
const db = new sqlite3.Database("./tensor0103.db")

/* var sqlite = require("./backend/node_modules/sqlite-sync")
sqlite.connect("../tensor5.db") */


db.run("PRAGMA foreign_keys = ON")

db.run(`
	CREATE TABLE IF NOT EXISTS COORDINATORDATA (
		ID INTEGER PRIMARY KEY     AUTOINCREMENT,
        MACADDRESS  CHAR(24)
	)
`)

const matchIdArr = [
    {MACADDRESS: "303336"},
    {MACADDRESS: "303337"},
    {MACADDRESS: "303338"},
    {MACADDRESS: "303339"},
]

const query = "INSERT INTO COORDINATORDATA (MACADDRESS) VALUES (?)"
let values = []

matchIdArr.forEach((item, index)=> {
    values = [item.MACADDRESS]
    db.run(query, values, function(error) {
        if (!error) {
            console.log("第"+(index+1)+"条信息创建成功")
        } else {
            console.log(error)
        }
    }) 
})

console.log("创建完成")