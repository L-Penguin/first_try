const fs = require('fs')
const coordinatorNum = 4

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


for (let index in matchIdArrTemp) {
    temp.ADDRESS = matchIdArrTemp[index][2]
    temp.MACADDRESS = matchIdArrTemp[index][0]
    temp.CLASSIFICATION = matchIdArrTemp[index][3]
    matchIdArr.push(temp)
}


console.log(matchIdArr.length)
