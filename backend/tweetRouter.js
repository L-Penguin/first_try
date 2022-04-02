const express = require('express')
const db = require('./db')
const settings = require('./settings')
const jwt = require('jsonwebtoken')

const router = express.Router()

// init udp
var http = require("http")
var dgram = require('dgram');
const {
	EEXIST
} = require('constants')
const e = require('express')
const { match } = require('assert')
var server = dgram.createSocket('udp4');
var msgg = new Array();
var cnt = 0
server.on('message', function(msg, rinfo) {
	console.log('接收到消息：' + msg);
	// msgg[cnt] = '{"type":"Buffer","data":[' + msg + ']}';
	msgtemp = msg + '';
	msgtemp2 = {
		"type": cnt,
		"data": msgtemp
	}


	msgg[cnt] = msgtemp2;
	cnt = cnt + 1;
	console.log(rinfo);

});
server.on('listening', function() {
	console.log('服务器开始监听');
});
server.bind(8085);



//根据ID对tweets信息进行删除
router.delete("/:id", function(request, response) {
	const id = request.params.id
	db.deleteTweetById(id, function(error, tweet) {
		if (error) {
			response.status(500).end()
		} else if (tweet) {
			response.status(200).json(tweet)
		} else {
			response.status(404).end()
		}
	})
})

//添加tweets信息
router.post("/", function(request, response) {
	let payload = null
	try {
		const authorizationHeader = request.get("Authorization")
		const accessToken = authorizationHeader.substr("Bearer ".length)
		payload = jwt.verify(accessToken, settings.accessTokenSecret)
	} catch (error) {
		response.status(401).end()
		return
	}
	const {
		accountId,
		message,
		createdAt,
		orders,
		payMethod,
	} = request.body
	if (payload == null || payload.accountId != accountId) {
		response.status(401).end()
		return
	}
	const errors = []
	if (0 < errors.length) {
		response.status(400).json(errors)
		return
	}
	db.createTweet(accountId, message, createdAt, orders, payMethod, function(error, id) {
		if (error) {
			if (error.message == "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed") {
				response.status(400).json(["accountDoesNotExist"])
			} else {
				response.status(500).end()
			}
		} else {
			response.setHeader("Location", "/tweets/" + id)
			response.status(201).end()
		}
	})
})

//根据ID修改tweets信息
router.put("/:id", function(request, response) {
	const id = request.params.id
	const updatedAccountId = request.body.accountId
	const updatedMessage = request.body.message
	const updateCreatedAt = request.body.createdAt
	const updatedOrders = request.body.orders
	const updatedPayMethod = request.body.payMethod
	db.updateTweetById(id, updatedAccountId, updatedMessage, updateCreatedAt, updatedOrders, updatedPayMethod,
		function(error) {
			if (error) {
				if (error.message == "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed") {
					response.status(400).json(["accountDoesNotExist"])
				} else {
					response.status(500).end()
				}
			} else {
				response.status(204).end()
			}
		})
})

//获取所有tweets信息
router.get("/", function(request, response) {
	db.getAllTweets(function(error, tweets) {
		if (error) {
			response.status(500).end()
		} else {
			response.status(200).json(tweets)
		}
	})
})



//获取udp信息
router.get("/rec2", function(request, response) {
	db.getRecTweets2(function(error, tweets) {
		if (error) {
			response.status(500).end()
		} else {
			response.status(200).json(msgg)
			console.log("msgg: ", msgg)
		}
	})
})

//获取 阻尼器编号，主节点编号，子节点mac地址 对应关系
//通过mac地址得到该行数据
router.get("/correspondence", function(request, response) {
	db.getHash(function(error, tweet) {
		if (error) {
			response.status(500).end()
		} else if (tweet) {
			response.status(200).json(tweet)
		} else {
			response.status(404).end()
		}
	})
})

//根据ID获取Tweet信息
router.get("/matchId=:matchId", function(request, response) {
	const matchId = request.params.matchId
	// 如果页面切换，则matchId变成"undefined"
	if (matchId === "undefined") return
	console.log("执行getTweetsById matchId="+matchId)
	db.getTweetsById(matchId, function(errors, tweets) {
		if (errors) {
			response.status(500).end()
		} else if (tweets) {
			response.status(200).json(tweets)
		} else {
			response.status(404).end()
		}
	})
	
})

//根据address修改subMacAddress
router.put("/modifyMacAddress/installAddress=:installAddress&macAddress=:macAddress", function(request, response) {
	const installAddress = request.params.installAddress
	const macAddress = request.params.macAddress
	//const updatedSubMacAddress = JSON.parse(request.body).subMacAddress
	db.modifyMacAddress(installAddress, macAddress, function(error) {
			if (error) {
				if (error.message == "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed") {
					response.status(400).json(["rowDataDoesNotExist"])
				} else {
					response.status(500).end()
				}
			} else {
				response.status(204).end()
			}
		})
})

//通过mac地址得到该行数据
router.get("/getMacByAddress/address=:address", function(request, response) {
	const address = request.params.address
	db.getMacByAddress(address, function(error, tweet) {
		if (error) {
			response.status(500).end()
		} else if (tweet) {
			response.status(200).json(tweet)
		} else {
			response.status(404).end()
		}
	})
})

//获取最近tweets信息
router.get("/rec4/:index", function(request, response) {
	const index = request.params.index
	db.getRecTweets4(index, function(error, tweets) {
		if (error) {
			response.status(500).end()
		} else {
			response.status(200).json(tweets)
		}
	})
})



//根据ButtonID获取Tweet信息
router.get("/button/:id", function(request, response) {
	const id = request.params.id
	console.log("select id：", id)
	
	db.getTweetByButtonId(id, function(error, tweet) {
		if (error) {
			response.status(500).end()
		} else if (tweet) {
			// }else if(tweets){
			response.status(200).json(tweet)
			// response.status(200).json(tweets)
		} else {
			response.status(404).end()
		}
	})
})

//根据ButtonID获取该mac地址所有Tweet数据绘图
router.get("/getTweetsForPicByTime/matchId=:matchId/startTime=:startTime/endTime=:endTime", function(request, response) {
	const matchId = request.params.matchId
	const startTime = request.params.startTime
	const endTime = request.params.endTime
	db.getTweetsForPicByTime(matchId, startTime, endTime, function(error, tweet) {
		if (error) {
			response.status(500).end()
		} else if (tweet) {
			response.status(200).json(tweet)
		} else {
			response.status(404).end()
		}
	})
})

//根据所对应的主节点反馈该主节点下所有最新的一个tweets数据，得到该主节点最新的温度和电量
router.get("/getPriData/node=:id", function(request, response) {
	const id = request.params.id
	db.getPriData(id, function(error, tweet) {
		if (error) {
			response.status(500).end()
		} else if (tweet) {
			response.status(200).json(tweet)
		} else {
			response.status(404).end()
		}
	})
})

//获取主节点信息展示在表格上
router.get("/getPriNodeTweet/id=:id&index=:index", function(request, response) {
		const id = request.params.id
		const index = request.params.index
		console.log("获取主节点数据：" + id)
		console.log(index)
	db.getPriNodeTweet(id, index, function(error, tweet) {
		if (error) {
			response.status(500).end()
		} else if (tweet) {
			response.status(200).json(tweet)
		} else {
			response.status(404).end()
		}
	})
})


//根据列表单行ID获取Tweet信息
router.get("/singleID/:id", function(request, response) {
	const id = request.params.id
	db.getTweetByListId(id, function(error, tweet) {
		if (error) {
			response.status(500).end()
		} else if (tweet) {
			// }else if(tweets){
			response.status(200).json(tweet)
			// response.status(200).json(tweets)
		} else {
			response.status(404).end()
		}
	})
})

//根据ButtonID、index获取Tweet信息
router.get("/button/:id/:index", function(request, response) {
	const id = request.params.id
	const index = request.params.index
	db.getTweetByButtonId2(id, index, function(error, tweet) {
		if (error) {
			response.status(500).end()
		} else if (tweet) {
			// }else if(tweets){
			response.status(200).json(tweet)
			// response.status(200).json(tweets)
		} else {
			response.status(404).end()
		}
	})
})

//获取最近数据信息
router.get("/rec", function(request, response) {
	// console.log("正在执行getRecTweets，发送最近信息以修改按钮颜色！")
	db.getRecTweets(function(errors, tweets) {
		if (errors) {
			response.status(500).end()
		} else {
			response.status(200).json(tweets)
		}
	})
})

// 获取某一matchId的所有数据的个数
router.get("/getTotalNodeAccount/matchId=:matchId", function(request, response) {
	const matchId = request.params.matchId
	db.getTotalNodeAccount(matchId, function(error, tweets) {
		if (error) {
			response.status(500).end()
		} else if (tweets) {
			response.status(200).json(tweets)
		} else {
			response.status(404).end()
		}
	})
})

// 通过当前页数和每页多少数据获取数据
router.get("/getNodeTweets/matchId=:matchId&currentPage=:currentPage&pageSize=:pageSize", function(request, response) {
	const matchId = request.params.matchId
	const currentPage = request.params.currentPage
	const pageSize = request.params.pageSize
	db.getNodeTweets(matchId, currentPage, pageSize, function(error, tweets) {
		if (error) {
			response.status(500).end()
		} else if (tweets) {
			response.status(200).json(tweets)
		} else {
			response.status(404).end()
		}
	})
})

// 获取mac地址 位置 所属协调器对应数据
router.get("/getMatchData", function(request, response) {
	db.getMatchData(function(error, matchData) {
		if (error) {
			response.status(500).end()
		} else if (matchData) {
			response.status(200).json(matchData)
		} else {
			response.status(404).end()
		}
	})
})

// 获取协调器个数信息
router.get("/getCoordinatorData", function(request, response) {
	db.getCoordinatorData(function(error, coordinatorData) {
		if (error) {
			response.status(500).end()
		} else if (coordinatorData) {
			response.status(200).json(coordinatorData)
		} else {
			response.status(404).end()
		}
	})
})

// 获取协调器数据
router.get("/getCoordinatorTweets/matchId=:matchId&currentPage=:currentPage&pageSize=:pageSize", function(request, response) {
	const matchId = request.params.matchId
	const currentPage = request.params.currentPage
	const pageSize = request.params.pageSize
	db.getCoordinatorTweets(matchId, currentPage, pageSize, function(error, tweets) {
		if (error) {
			response.status(500).end()
		} else if (tweets) {
			response.status(200).json(tweets)
		} else {
			response.status(404).end()
		}
	})
})

// 获取协调器数据的个数
router.get("/getTotalCoordinatorAccount/matchId=:matchId", function(request, response) {
	const matchId = request.params.matchId
	db.getTotalCoordinatorAccount(matchId, function(error, tweets) {
		if (error) {
			response.status(500).end()
		} else if (tweets) {
			response.status(200).json(tweets)
		} else {
			response.status(404).end()
		}
	})
})

// 获取所有数据
router.get("/getAllTweets/currentPage=:currentPage&pageSize=:pageSize", function(request, response) {
	const currentPage = request.params.currentPage
	const pageSize = request.params.pageSize
	db.getAllTweets(currentPage, pageSize, function(error, allTweets) {
		if (error) {
			response.status(500).end()
		} else if (allTweets) {
			response.status(200).json(allTweets)
		} else {
			response.status(404).end()
		}
	})
})

// 获取所有数据的个数
router.get("/getAllTweetsAccount", function(request, response) {
	db.getAllTweetsAccount(function(error, length) {
		if (error) {
			response.status(500).end()
		} else if (length) {
			response.status(200).json(length)
		} else {
			response.status(404).end()
		}
	})
})

module.exports = router
