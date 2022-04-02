const jwtDecode = require('jwt-decode')
let accessToken = null


//获取所有tweets信息接口
/* export const getAllTweets = function(callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets")
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				global.console.log(tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}
 */
//获取udp信息接口
export const getRecTweets2 = function(callback) {
	console.log("部分信息2")
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/rec2")
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				global.console.log(tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//获取最近tweets信息接口+翻页
export const getRecTweets4 = function(searchId, callback) {
	console.log("最近信息4")
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/rec4/" + searchId)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				global.console.log(tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//获取所有spectweets信息接口
export const getSpecTweets = function(matchId, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/matchId=" + matchId)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}


//根据ID搜索单行列表tweets所有信息接口
export const getSearchTweets = function(searchId, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/" + searchId)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				global.console.log("client spec data")
				global.console.log(tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//根据ID搜索单行列表tweets所有信息接口
export const getSearchSingleTweets = function(searchId, callback) {
	const request = new XMLHttpRequest()
	console.log("getSearchSingleTweets  " + searchId)
	request.open("GET", "http://localhost:3000/tweets/singleID/" + searchId)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//根据ButtonID搜索tweets信息接口
export const getSpecIdTweets = function(searchId, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/button/" + searchId)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				global.console.log("client spec data3")
				global.console.log(tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//根据ButtonID搜索tweets信息接口
export const getSpecIdTweets2 = function(searchId, searchIndex, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/button/" + searchId + "/" + searchIndex)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				global.console.log("client spec data3")
				global.console.log(tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//根据ButtonID获取所有tweets数据
export const getTweetsForPicBytime = function(matchId, startTime, endTime, callback) {
	const request = new XMLHttpRequest()

	request.open("GET", "http://localhost:3000/tweets/getTweetsForPicBytime/" + "matchId=" + matchId + "/startTime=" + startTime + "/endTime=" + endTime)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				console.log(tweets)
				break
			case 500:
				callback(["Server error"])
				console.log(44)
				break
			default:
				callback(["Server error"])
				console.log(55)
		}
	})
}

//根据所选择的子节点所在的主节点显示温度和电量信息接口
export const getPriData = function(searchId, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/getPriData/" + "node=" + searchId)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				global.console.log("getPriData")
				global.console.log(tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//获取 阻尼器编号，主节点编号，子节点mac地址 对应关系
export const getAll = function(callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/correspondence")
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				global.console.log("getHash")
				global.console.log(tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//获取 阻尼器编号，主节点编号，子节点mac地址 对应关系
export const getMacByAddress = function(address, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/getMacByAddress/address=" + address)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				global.console.log("getMacByAddress")
				global.console.log(tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}


//根据ID对tweets信息进行删除
export const getDelTweets = function(infoId, callback) {
	const request = new XMLHttpRequest()
	request.open("DELETE", "http://localhost:3000/tweets/" + infoId)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				callback(["Delete success"])
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//修改tweets信息接口
export const modifyTweet = function(id, accountId, message, createdAt, orders, payMethod, callback) {
	const tweet = {
		id,
		accountId,
		message,
		createdAt,
		orders,
		payMethod
	}
	const request = new XMLHttpRequest()
	request.open("PUT", "http://localhost:3000/tweets/" + id)
	request.send(JSON.stringify(tweet))
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 201:
				const location = request.getResponseHeader("Location")
				callback([], location)
				break
			case 400:
				const errors = JSON.parse(request.responseText)
				callback(errors)
				break
			case 500:
				callback(["Unknown server error"])
				break
			default:
				callback(["Unknown server error"])
		}
	})
}

//修改CORRESPONDRENCE中SUBMACADDRESS
export const modifyMacAddress = function(installAddress, macAddress, callback) {
	const tweet = {
			"installAddress" : installAddress,
			"macAddress" : macAddress
	}
	
	const request = new XMLHttpRequest()
	request.open("PUT", "http://localhost:3000/tweets/modifyMacAddress/installAddress=" + installAddress + "&macAddress=" + macAddress)
	request.send(JSON.stringify(tweet))
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 201:
				const location = request.getResponseHeader("Location")
				callback([], location)
				break
			case 400:
				const errors = JSON.parse(request.responseText)
				callback(errors)
				break
			case 500:
				callback(["Unknown server error1"])
				break
			default:
				callback(["Unknown server error2"])
		}
	})
}

export const getPriNodeTweet = function(id, index, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/getPriNodeTweet/id=" + id + "&index=" + index)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				global.console.log("getPriNodeTweet")
				global.console.log(tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//添加tweets信息接口
export const createTweet = function(accountId, message, orders, payMethod, callback) {
	const tweet = {
		accountId,
		message,
		orders,
		payMethod,
		createdAt: Date.now()
	}
	const request = new XMLHttpRequest()
	request.open("POST", "http://localhost:3000/tweets")
	request.setRequestHeader("Content-Type", "application/json")
	request.setRequestHeader("Authorization", "Bearer " + accessToken)
	request.send(JSON.stringify(tweet))
	global.console.log(JSON.stringify(tweet))
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 201:
				const location = request.getResponseHeader("Location")
				callback([], location)
				break
			case 400:
				const errors = JSON.parse(request.responseText)
				callback(errors)
				break
			case 401:
				callback(["unauthorired"])
				break
			case 500:
				callback(["Unknown server error"])
				break
			default:
				callback(["Unknown server error"])
		}
	})
}

//用户注册接口
export const createAccount = function(username, password, passwordRepeat, email, callback) {
	const account = {
		username,
		password,
		passwordRepeat,
		email
	}
	const request = new XMLHttpRequest()
	request.open("POST", "http://localhost:3000/accounts")
	request.setRequestHeader("Content-Type", "application/json")
	request.send(JSON.stringify(account))
	global.console.log(account)
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 201:
				const location = request.getResponseHeader("Location")
				callback([], location)
				break
			case 400:
				const errors = JSON.parse(request.responseText)
				callback(errors)
				break
			case 500:
				callback(["Unknown server error"])
				break
			default:
				callback(["Unknown server error"])
		}
	})
}

//用户登录接口
export const login = function(username, password, callback) {
	const request = new XMLHttpRequest()
	request.open("POST", "http://localhost:3000/tokens")
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	request.send("grant_type=password&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(
		password))
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				var body = JSON.parse(request.responseText)
				const idToken = body.id_token
				accessToken = body.access_token
				const userInfo = jwtDecode(idToken)
				const id = userInfo.sub
				const username = userInfo.preferred_username
				callback([], id, username)
				break
			case 400:
				var body = JSON.parse(request.responseText)
				callback([body.error])
				break
			case 500:
				callback(["Unknown server error"])
				break
			default:
				callback(["Unknown server error"])
		}
	})
}



//获取指示灯状态信息
export const getRecTweets = function(callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/rec")
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

// 获得某一按钮所有信息的个数
export const getTotalNodeAccount = function(matchId, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/getTotalNodeAccount/matchId=" + matchId)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				break
			case 500:
				callback(["Server error1"])
				break
			default:
				callback(["Server error2"])
		}
	})
}

// 根据当前页数和每页数据量来获取数据
export const getNodeTweets = function(matchId, currentPage, pageSize, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/getNodeTweets/matchId="+matchId+"&currentPage="+currentPage+"&pageSize=" + pageSize)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				break
			case 500:
				callback(["Server error1"])
				break
			default:
				callback(["Server error2"])
		}
	})
}

// 获取匹配数据
export const getMatchData = function(callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/getMatchData")
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const matchData = JSON.parse(bodyAsString)
				callback([], matchData)
				break
			case 500:
				callback(["Server error1"])
				break
			default:
				callback(["Server error2"])
		}
	})
}

// 获取协调器信息
export const getCoordinatorData = function(callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/getCoordinatorData")
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const coordinatorData = JSON.parse(bodyAsString)
				callback([], coordinatorData)
				break
			case 500:
				callback(["Server error1"])
				break
			default:
				callback(["Server error2"])
		}
	})
}

// 获取协调器数据
export const getCoordinatorTweets = function(matchId, currentPage, pageSize, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/getCoordinatorTweets/matchId="+matchId+"&currentPage="+currentPage+"&pageSize=" + pageSize)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				break
			case 500:
				callback(["Server error1"])
				break
			default:
				callback(["Server error2"])
		}
	})
}

// 获取协调器数据个数
export const getTotalCoordinatorAccount = function(matchId, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/getTotalCoordinatorAccount/matchId=" + matchId)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				break
			case 500:
				callback(["Server error1"])
				break
			default:
				callback(["Server error2"])
		}
	})
}

// 获取所有数据
export const getAllTweets = function(currentPage, pageSize, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/getAllTweets/currentPage="+currentPage+"&pageSize=" + pageSize)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const allTweets = JSON.parse(bodyAsString)
				callback([], allTweets)
				break
			case 500:
				callback(["Server error1"])
				break
			default:
				callback(["Server error2"])
		}
	})
}

// 获取所有数据的个数
export const getAllTweetsAccount = function(callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/getAllTweetsAccount")
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const length = JSON.parse(bodyAsString)
				callback([], length)
				break
			case 500:
				callback(["Server error1"])
				break
			default:
				callback(["Server error2"])
		}
	})
}

