const sqlite3 = require('sqlite3')
const db = new sqlite3.Database("../tensor0103.db")


//var schedule = require("node-schedule")

var sqlite = require("sqlite-sync")
sqlite.connect("../tensor5.db")

db.run("PRAGMA foreign_keys = ON")

//CONSTRAINT unique_username UNIQUE(username)  对username做了唯一约束
// 创建accounts用户表格的命令
// CreationTime为创建时间
db.run(`
	CREATE TABLE IF NOT EXISTS accounts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT,
		password TEXT,
		passwordRepeat TEXT,
		email TEXT,
		creationTime TEXT,
		CONSTRAINT unique_username UNIQUE(username)
	)
`)
// 创建Tweets表格的命令
// id INTEGER主键自动递增
db.run(`
	CREATE TABLE IF NOT EXISTS tweets (
		ID INTEGER PRIMARY KEY     AUTOINCREMENT,
		READTIME        DATETIME ,
		COUNTER         INT      ,
		DIVECEID        INT      ,
		MACADDRESS      CHAR(8)  ,
		ADC             INT      ,
		SENSORDATA      CHAR(48) 
	)
`)

//创建Tweets表格
//阻尼器编号，主节点编号，子节点mac地址
/* db.run(`
	CREATE TABLE IF NOT EXISTS CORRESPONDENCE (
	ID INTEGER PRIMARY KEY     AUTOINCREMENT,
		ADDRESS 		VARCHAR(9),
		PRINUM			CHAR(2),
		SUBMACADDRESS	CHAR(24)
	)
`) */

var monthArr = [0, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
var priMacAddress = ["main_73", "main_74", "main_72"]

//比较两时间先后，time1先，返回true，反之，返回false，time时间格式为YY-MM-DD—HH-MM-SS
function compareTime(time1, time2) {
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
}

//获取Tweet表格中的所有数据
/* exports.getAllTweets = function(callback) {
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS NOT IN ('main_72', 'main_73', 'main_74') ORDER BY ID DESC, ID LIMIT 0,10"
	db.all(query, function(error, tweets) {
		callback(error, tweets)
	})
} */

//获取Tweet表格中的最近数据
exports.getRecTweets2 = function(callback) {
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS NOT IN ('main_72', 'main_73', 'main_74') ORDER BY ID DESC, ID LIMIT 0,10"
	db.all(query, function(error, tweets) {
		callback(error, tweets)
	})
}


//获取Tweet表格中的所有数据+页码
exports.getRecTweets4 = function(index, callback) {
	// const query = "SELECT * FROM tweets WHERE id = ?"
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS NOT IN ('main_72', 'main_73', 'main_74') ORDER BY ID DESC, ID LIMIT ?,10"
	const values = [index * 10]
	db.all(query, values, function(error, tweets) {
		callback(error, tweets)
	})
}

//通过ID来查看Tweet表格中的多个数据
exports.getTweetsById = function(matchId, callback) {
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS = ? ORDER BY ID DESC, ID LIMIT 0,10"
	const values = [matchId]
	db.all(query, values, function(error, tweets) {
		callback(error, tweets)
	})
}

//通过ID来查看Tweet表格中的多个数据
exports.getTweetByButtonId = function(id, callback) {
	// const query = "SELECT * FROM tweets WHERE id = ?"
	// const query = "SELECT * FROM TENSOR WHERE MACADDRESS = ?"
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS = ? ORDER BY ID DESC, ID LIMIT 0,10"
	const MACADDRESS = fromIdGetMac(id)

	const values = [MACADDRESS]
	db.all(query, values, function(error, tweets) {
		callback(error, tweets)
	})
}


//通过ID,Index来查看Tweet表格中的多个数据
exports.getTweetByButtonId2 = function(id, index, callback) {
	// const query = "SELECT * FROM tweets WHERE id = ?"
	// const query = "SELECT * FROM TENSOR WHERE MACADDRESS = ?"
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS = ? ORDER BY ID DESC, ID LIMIT ?,?"
	const MACADDRESS = fromIdGetMac(id)

	const values = [MACADDRESS, index * 10, 10]
	db.all(query, values, function(error, tweets) {
		callback(error, tweets)
	})
}

//通过列表单行ID来查看Tweet表格中的多个数据
exports.getTweetByListId = function(id, callback) {
	// const query = "SELECT * FROM tweets WHERE id = ?"
	// const query = "SELECT * FROM TENSOR WHERE MACADDRESS = ?"
	const query = "SELECT * FROM TENSOR WHERE ID = ? ORDER BY ID DESC"
	const values = [id]
	db.all(query, values, function(error, tweets) {
		callback(error, tweets)
	})
}

//通过ID获取Tweet表格中一段时间内的的数据
exports.getTweetsForPicByTime = function(matchId, startTime, endTime, callback) {
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS = ?"

	const values = [matchId]
	db.all(query, values, function(error, tweets) {
		var tweetsLength = tweets.length
		var outTimeNum = 0
		var outRangeNum = 0
		var arr = []
		for (var i in tweets) {
			var year = tweets[i]["READTIME"].substr(20, 4)
			var month = (monthArr.indexOf(tweets[i]["READTIME"].substr(4,3))).toString()
			var day = tweets[i]["READTIME"].substr(8, 2).replace(" ", '')
			var hour = tweets[i]["READTIME"].substr(11, 2)
			var minute = tweets[i]["READTIME"].substr(14, 2)
			var second = tweets[i]["READTIME"].substr(17,2)
			var formatTime = year+"-"+month+"-"+day+"-"+hour+"-"+minute+"-"+second

			var judge1 = compareTime(startTime, formatTime)
			var judge2 = compareTime(formatTime, endTime)

			if (judge1 && judge2) {
				if (tweets[i]["ADC"] >= 3 && tweets[i]["ADC"] <= 5) {
					arr.push(tweets[i])
				} else {
					outRangeNum += 1
				}
			} else {
				outTimeNum += 1
			}
		}
		callback(error, arr)
		console.log("索取数据时间段： " + startTime + " to " + endTime)
		console.log("MacAddress： " + matchId)
		console.log("所有数据个数： " + tweetsLength)
		console.log("超出时间范围个数： " + outTimeNum)
		console.log("超出电压范围个数： " + outRangeNum)
		console.log("符合要求数据个数： " + arr.length)
		if (arr.length != 0) {
			console.log("符合要求数据起始时间为： " + arr[0]["READTIME"] + " to " + arr.pop()["READTIME"])
		}
	})
}

//通过所对应的主节点获取该主节点下子节点的最新一个数据
exports.getPriData = function(id, callback) {
	var query = "SELECT * FROM TENSOR WHERE MACADDRESS IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ORDER BY ID DESC, ID LIMIT 0, 1"
	
	if (id.indexOf("subNode") >= 0) {
		var priId = "priNode" + id.split("subNode")[1].split("_")[0]	
	} else {
		var priId = id
	}

	const MACADDRESS = macAddressArr[priId]

	const value = [MACADDRESS[0], MACADDRESS[1], MACADDRESS[2], MACADDRESS[3], MACADDRESS[4], MACADDRESS[5], MACADDRESS[6], MACADDRESS[7], MACADDRESS[8], MACADDRESS[9]]

	db.all(query, value, function(error, tweets) {
		callback(error, tweets)
	})
}

//获取主节点信息
exports.getPriNodeTweet = function(id, index, callback) {
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS = ? ORDER BY ID DESC, ID LIMIT ?, 10"
	var index1 = macAddressKeys.indexOf(id)
	var value = [priMacAddress[index1], index * 10]

	db.all(query, value, function(error, tweet) {
		callback(error, tweet)
	})
}

//获取 阻尼器编号，主节点编号，子节点mac地址 对应关系
exports.getHash = function(callback) {
	const query = "SELECT * FROM CORRESPONDENCE"
	db.all(query,function(error, tweets) {	
		callback(error, tweets)
	})
}

//通过位置来获取mac地址
exports.getMacByAddress = function(address, callback) {
	const query = "SELECT * FROM CORRESPONDENCE WHERE ADDRESS = ?"
	const value = [address]
	db.all(query, value, function(error, tweets) {	
		callback(error, tweets)
	})
}

//通过ID来删除Tweet表格中的数据
exports.deleteTweetById = function(id, callback) {
	const query = "DELETE FROM TENSOR WHERE ID = ?"
	const values = [id]
	db.run(query, values, function(error) {
		callback(error)
	})
}

//创建Tweet表格
exports.createTweet = function(accountId, message, createdAt, orders, payMethod, callback) {
	const query = "INSERT INTO tweets (accountId, message, createdAt, orders, payMethod) VALUES (?, ?, ?, ?, ?)"
	const values = [accountId, message, createdAt, orders, payMethod]
	db.run(query, values, function(error) {
		callback(error, this.lastID)
	})
}

//通过ID来更新Tweet表格中的数据
exports.updateTweetById = function(id, updatedAccountId, updatedMessage, updateCreatedAt, updatedOrders,
	updatedPayMethod, callback) {
	const query = `
	UPDATE tweets SET
		accountId = ?,
		message = ?,
		createdAt = ?,
		orders = ?,
		payMethod = ?
	WHERE
		id = ?
	`
	console.log(updatedAccountId, updatedMessage, updateCreatedAt, updatedOrders, updatedPayMethod, id);
	// const values = [updatedAccountId, updatedMessage, updateCreatedAt, updatedOrders, updatedPayMethod, id]
	const values = [1, 2, 3, 4, 5, id]
	db.run(query, values, function(error) {
		callback(error)
	})

}

//通过address更新CORRESPONDENCE中的SUBMACADDRESS
exports.modifyMacAddress = function(installAddress, macAddress, callback) {
	const query = `
		UPDATE MATCHDATA 
		SET MACADDRESS = ?
	WHERE
		INSTALLADDRESS = ?
	`
	const values = [macAddress, installAddress]
	db.run(query, values, function(error) {
		console.log("mac地址修改完成", installAddress, macAddress)
		
		callback(error)
	})
}

//将前端传过来的用户信息插入
exports.createAccount = function(username, password, passwordRepeat, email, creationTime, callback) {
	const query =
		"INSERT INTO accounts (username, password, passwordRepeat, email, creationTime) VALUES (?, ?, ?, ?, ?)"
	const values = [username, password, passwordRepeat, email, creationTime]
	db.run(query, values, function(error) {
		callback(error, this.lastID)
	})
}

//通过姓名查找用户信息
exports.getAccountByUsername = function(username, callback) {
	const query = "SELECT * FROM accounts WHERE username = ?"
	const values = [username]
	db.get(query, values, function(error, account) {
		callback(error, account)
	})
}


// 获取最近的子节点数据
exports.getRecTweets = function(callback) {
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS NOT IN ('main_72', 'main_73', 'main_74') ORDER BY ID DESC, ID LIMIT 0,63"
	db.all(query, function(error, tweets) {
		callback(error, tweets)
	})
}

// 通过matchId获取所有数据的个数
exports.getTotalNodeAccount = function(matchId, callback) {
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS = ?"
	const values = [matchId]
	db.all(query, values, function(error, tweets) {
		callback(error, tweets.length)
	})
}

// 通过页数和页面数据量获取节点数据
exports.getNodeTweets = function(matchId, currentPage, pageSize, callback) {
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS = ? ORDER BY ID DESC, ID LIMIT ?, ?"
	var values = [matchId, (currentPage-1)*pageSize, pageSize]
	db.all(query, values, function(error, tweets) {
		callback(error, tweets)
	})
}

// 获取mac地址 位置 所属协调器对应数据
exports.getMatchData = function(callback) {
	const query = "SELECT * FROM MATCHDATA"
	db.all(query, function(error, matchData) {
		callback(error, matchData)
	})
}

// 获取协调器信息
exports.getCoordinatorData = function(callback) {
	const query = "SELECT * FROM COORDINATORDATA"
	db.all(query, function(error, coordinatorData) {
		callback(error, coordinatorData)
	})
}

// 获取协调器数据
exports.getCoordinatorTweets = function(matchId, currentPage, pageSize, callback) {
	const query = "SELECT * FROM ROUTER WHERE ID_MAIN = ? ORDER BY ID DESC, ID LIMIT ?, ?"
	var values = [matchId, (currentPage-1)*pageSize, pageSize]
	db.all(query, values, function(error, tweets) {
		callback(error, tweets)
	})
}

// 获取协调器数据的个数
exports.getTotalCoordinatorAccount = function(matchId, callback) {
	const query = "SELECT * FROM ROUTER WHERE ID_MAIN = ?"
	const values = [matchId]
	db.all(query, values, function(error, tweets) {
		callback(error, tweets.length)
	})
}

// 获取所有数据
exports.getAllTweets = function(currentPage, pageSize, callback) {
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS NOT IN ('main_72', 'main_73', 'main_74') ORDER BY ID DESC, ID LIMIT ?,?"
	var values = [(currentPage-1)*pageSize, pageSize]
	db.all(query, values, function(error, allTweets) {
		callback(error, allTweets)
	})
}

// 获取所有数据的个数
exports.getAllTweetsAccount = function(callback) {
	const query = "SELECT * FROM TENSOR WHERE MACADDRESS NOT IN ('main_72', 'main_73', 'main_74')"
	db.all(query, function(error, tweets) {
		callback(error, tweets.length)
	})
}


