function betrecordObj() {
	var mPage = new Activity("betrecordDiv", "投注记录");
	var mTable = null;
	var startData;
	var endData;
	var selectvalue;
	var requestTime = new Date();
	var select;

	this.init = function () {
		mPage.init();
		$("#betrecordDiv_content").css({
			"background-color": mainBackColor
		});
		$("#betrecordDiv_content_list").css({
			"height": screenH - topH - 105
		});
	}

	this.show = function () {
		mPage.show(function () {
			if (select != null) {
				select.unShowSelect();
			}
		});
		if (select == null) {
			bindBar();
		}
		if (startData == null || endData == null) {
			var date = new Date();
			date.setDate(date.getDate() - 0);
			date = getTimeZoneE8(8, date);
			startData = date.format("yyyy-MM-dd");
			endData = date.format("yyyy-MM-dd");
		}
		setTimeout(bindList, 500);
	}

	function bindBar() {
		var times = {
			"list": [{
				"text": "今天",
				"value": "0"
			},
			{
				"text": "昨天",
				"value": "yesterday"
			},
			{
				"text": "最近7天",
				"value": "7"
			}
			]
		};

		select = new tSelect("betrecordDiv_timeSelect", "betrecordDiv",
			screenW, 50, times,
			function (index) {
				var dateNow = new Date();
				dateNow = getTimeZoneE8(8, dateNow);
				selectvalue = times["list"][index].value;
				if (selectvalue == "yesterday") {
					dateNow.setDate(dateNow.getDate() - 1);
					startData = dateNow.format("yyyy-MM-dd");
					endData = startData;
				} else {
					dateNow.setDate(dateNow.getDate() + (-1) * times["list"][index].value);
					startData = dateNow.format("yyyy-MM-dd");
					endData = getTimeZoneE8(8, (new Date())).format("yyyy-MM-dd");
				}
				var now = new Date();
				if ((now - requestTime) > 5000) {
					bindList(500);
				} else {
					bindList(5000);
				}
			});
	}

	function bindList(outTime) {
		var winamount = 0;
		var validamount = 0;
		var columns = [{
			"title": "游戏",
			"code": "game",
			"width": "25%",
			"align": "center"
		},
		{
			"title": "总投注",
			"code": "total",
			"width": "25%",
			"align": "center"
		},
		{
			"title": "有效投注",
			"code": "valid",
			"width": "25%",
			"align": "center"
		},
		{
			"title": "输赢",
			"code": "winloss",
			"width": "25%",
			"align": "center"
		},
		];
		var mData = "requestType=json&start=" + startData + "&end=" + endData;
		if (mTable != null) {
			mTable.loadData(SERVER_ADD + "gameRecordStat/userRecordStatsGroupByGameNo", mData);
			return;
		}
		mTable = new tTable("betrecordDiv_content_list", columns, 20);
		mTable.init();
		mTable.setOutTime(outTime);
		mTable.itemClickFunction(function (itemData, objId) {
			if (itemData["total"] == 0 && itemData["valid"] == 0) { return; }
			var code = itemData["gameCode"];
			if (code == "lmg") {
				mBetrecordLmgObj.show(itemData, selectvalue);
			} else if (code == "ky") {
				mBetrecordKyObj.show(itemData, selectvalue);
			} else if (code == "gm") {
				mBetrecordGmObj.show(itemData, selectvalue);
			} else if (code == "lottery") {
				mBetrecordIgObj.show(itemData, selectvalue);
			} else if (code == "cmd") {
				mBetrecordCmdObj.show(itemData, selectvalue);
			} else if (code == "nn") {
				mBetrecordJPNNObj.show(itemData, selectvalue);
			}
		});
		mTable.setLoadOKFunction(function () {
			var v = validamount.toString();
			var vIndex = v.indexOf(".");
			if (vIndex != -1 && vIndex != v.length - 1) {
				v = v.substring(0, vIndex + 3);
			}
			var w = winamount.toString();
			var wIndex = w.indexOf(".");
			if (wIndex != -1 && wIndex != w.length - 1) {
				w = w.substring(0, wIndex + 3);
			}
			requestTime = new Date();
			$("#betrecordDiv_stats_bottom").css({
				"display": "flex"
			});
			$("#betrecordDiv_validSum").html("有效投注额：" + doubleValue(v));
			var winOrLoss = "";
			if (winamount < 0) {
				winOrLoss = "<font color=" + mainColor + ">" + doubleValue(w) + "</font>";
			} else {
				winOrLoss = "<font color=" + winFontColor + ">" + doubleValue(w) + "</font>";
			}
			$("#betrecordDiv_winorloss").html("输赢：" + winOrLoss);
		});
		mTable.setParseFunction(function (gamesData, mode) {
			if (mode) {
				winamount = gamesData.result.stats.winamount;
				validamount = gamesData.result.stats.validamount;
			} else {
				winamount = winamount + gamesData.result.stats.winamount;
				validamount = validamount + gamesData.result.stats.validamount;
			}

			var datas = new Array();
			var objList = gamesData.result.games;
			var len = objList.length;
			for (var i = 0; i < len; i++) {
				var listItem = objList[i];
				var classList = listItem.games;
				var classLen = classList.length;
				for (var j = 0; j < classLen; j++) {
					var classItem = classList[j];
					var item = new Object();
					item["game"] = classItem.name.replace("CMD", ""); //CMD
					item["gameCode"] = classItem["apicode"];
					item["gameNo"] = classItem["no"];
					item["gameId"] = classItem["id"];
					try {
						item["total"] = doubleValue(classItem.stats.betamount);
						item["valid"] = doubleValue(classItem.stats.validamount);
						var winloss = doubleValue(classItem.stats.winamount);
						if (winloss > 0) {
							winloss = "<font color=" + winFontColor + ">" + "+" + winloss + "</font>";
						} else if (winloss < 0) {
							winloss = "<font color=" + lossFontColor + ">" + winloss + "</font>";
						} else {
							winloss = "<font color=white>" + winloss + "</font>";
						}
						item["winloss"] = winloss;
					} catch (e) {
						item["total"] = 0;
						item["valid"] = 0;
						item["winloss"] = 0;
					}
					item["arrow"] = '<div style="width:15px"></div>';
					datas.push(item);
				}
			}
			var returnObj = new Object();
			returnObj["result"] = new Object();
			returnObj["result"]["list"] = datas;
			return returnObj;
		});
		mTable.setIsLoadMore(false);
		mTable.loadData(SERVER_ADD + "gameRecordStat/userRecordStatsGroupByGameNo", mData);
	}
}
function betrecordLmgObj() {
	var itemData;
	var mPage = new Activity("betrecordInfoDiv", "投注详情");
	var mTable = null;
	var startData;
	var endData;
	var requestTime = new Date();
	var select;

	this.init = function () {
		mPage.init();
		$("#betrecordInfoDiv_content").css({
			"background-color": mainBackColor
		});
		$("#betrecordInfoDiv_content_list").css({
			"height": screenH - topH - 105
		});
	}

	this.show = function (data, dateType) {
		itemData = data;
		mPage.show(function () {
			if (select != null) {
				select.unShowSelect();
			}
		});
		if (select == null) {
			bindBar();
		}
		if (dateType != null) {
			select.setSelectValue(dateType);
		} else if (startData == null || endData == null) {
			var date = new Date();
			date.setDate(date.getDate() - 0);
			date = getTimeZoneE8(8, date);
			startData = date.format("yyyy-MM-dd");
			endData = date.format("yyyy-MM-dd");
			setTimeout(bindList, 500);
		} else {
			setTimeout(bindList, 500);
		}
	}

	function bindBar() {
		var times = {
			"list": [{
				"text": "今天",
				"value": "0"
			},
			{
				"text": "昨天",
				"value": "yesterday"
			},
			{
				"text": "最近7天",
				"value": "7"
			}
			]
		};

		select = new tSelect("betrecordInfoDiv_select_date", "betrecordInfoDiv",
			screenW, 50, times,
			function (index) {
				var dateNow = new Date();
				dateNow = getTimeZoneE8(8, dateNow);
				var dateValue = times["list"][index].value;
				if (dateValue == "yesterday") {
					dateNow.setDate(dateNow.getDate() - 1);
					startData = dateNow.format("yyyy-MM-dd");
					endData = startData;
				} else {
					dateNow.setDate(dateNow.getDate() + (-1) * times["list"][index].value);
					startData = dateNow.format("yyyy-MM-dd");
					endData = getTimeZoneE8(8, (new Date())).format("yyyy-MM-dd");
				}
				var now = new Date();
				if ((now - requestTime) > 5000) {
					bindList(500);
				} else {
					bindList(5000);
				}
			});
	}

	function bindList(outTime) {
		var validamount = 0; // 有效投注
		var winamount = 0; // 输赢
		var columns = [{
			"title": "投注",
			"code": "total",
			"width": "32.5%",
			"align": "center"
		}, {
			"title": "有效投注",
			"code": "valid",
			"width": "32.5%",
			"align": "center"
		}, {
			"title": "输赢",
			"code": "winloss",
			"width": "32.5%",
			"align": "center"
		},];
		var mData = "requestType=json&start=" + startData + "&end=" + endData +
			"&code=" + itemData.gameCode + "&gameNoP1=" + itemData.gameNo;
		if (mTable != null) {
			mTable.loadData(SERVER_ADD + "/gameApi/getRecords", mData);
			return;
		}
		mTable = new eTable("betrecordInfoDiv_content_list", columns, 20);

		mTable.init();

		mTable.setOutTime(outTime);

		mTable.itemClickFunction(function (itemData, objId) {
			mBetLmgRemakeObj.show(itemData);
		});

		mTable.setLoadOKFunction(function () {
			requestTime = new Date();
			var v = validamount.toString();
			var vIndex = v.indexOf(".");
			if (vIndex != -1 && vIndex != v.length - 1) {
				v = v.substring(0, vIndex + 3);
			}
			var w = winamount.toString();
			var wIndex = w.indexOf(".");
			if (wIndex != -1 && wIndex != w.length - 1) {
				w = w.substring(0, wIndex + 3);
			}
			// 显示模式为flex弹性盒子(横向),none为不显示
			$("#betrecordInfoDiv_content_bottom").css({
				"display": "flex"
			});
			$("#betrecordInfoDiv_validSum").html("有效投注额：" + doubleValue(v));
			var winOrLoss = winamount;
			if (winOrLoss < 0) {
				winOrLoss = "<font color=" + mainColor + ">" + doubleValue(w) + "</font>";
			} else {
				winOrLoss = "<font color=" + winFontColor + ">" + doubleValue(w) + "</font>";
			}
			$("#betrecordInfoDiv_winorloss").html("输赢：" + winOrLoss);
		});

		mTable.setParseFunction(function (theDatas, mode) {
			// console.log(theDatas);
			return parseGamesData(theDatas, mode);
		});

		mTable.setIsLoadMore(true);

		mTable.loadData(SERVER_ADD + "/gameApi/getRecords", mData);

		function parseGamesData(gamesData, mode) {
			var datas = new Array();
			var dateUtil = new Date();
			var objList = gamesData.result.list;
			var len = objList.length;
			if (mode) {
				validamount = 0;
				winamount = 0;
			}
			for (var i = 0; i < len; i++) {
				var objItem = objList[i];
				var item = new Object();
				try {
					dateUtil.setTime(objItem.endtime);
					item["date"] = "<font color=white>" + getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm") + "</font>";
					item["gameName"] = "<font color=#ee6934>真人 </font>" +
						"<font color=" + winFontColor + ">" + objItem.dt.game_no.sname + "</font>";
					if (objItem.shoeinfoid != 0) {
						item["period"] = "<font color=white>" + objItem.shoeinfoid + "靴</font>";
					}
					var total = doubleValue(objItem.stakeamount);
					var valid = objItem.validstake;
					var winloss = objItem.winloss;
					validamount += valid;
					winamount += winloss;
					total = "<font color=white>" + total + "</font>";
					valid = "<font color=white>" + doubleValue(valid) + "</font>";
					item["total"] = total;
					item["valid"] = valid;
					if (winloss > 0.00) {
						winloss = "<font color=" + winFontColor + ">" + "+" + doubleValue(winloss) + "</font>";
					} else {
						winloss = "<font color=" + lossFontColor + ">" + doubleValue(winloss) + "</font>";
					}
					item["winloss"] = winloss;
					// 详情属性
					var lmgGameObj = new lmgGame();
					var pokerList = objItem["pokerlist"];
					if (pokerList != null) {
						item["poker"] = JSON.parse(pokerList);
					}
					item["result"] = JSON.parse(objItem["resultlist"]);
					// 使用默认column标题栏code时可用,否则需要自行解析
					item["betLive"] = lmgGameObj.parsingBetLive(objItem["livememberreportdetails"], objItem["gametype"]);
					item["gameType"] = objItem["gametype"];
					// 是否显示item右侧箭头
					item["arrow"] = true;
				} catch (e) {
					item["date"] = 0.00;
					item["gameName"] = "";
					item["total"] = 0.00;
					item["valid"] = 0.00;
					item["winloss"] = 0.00;
					item["arrow"] = false;
				}
				datas.push(item);
			}
			var returnObj = new Object();
			returnObj["result"] = new Object();
			returnObj["result"]["list"] = datas;
			return returnObj;
		}
	}
}
function betLmgRemakeObj() {
	var mPage = new Activity("betLmgRemakeDiv", "注单详情");
	var itemData;
	var lmgRemake;

	this.init = function () {
		mPage.init();
		$("#betLmgRemakeDiv_content").css({
			"background-color": mainBackColor
		});
		$("#betLmgRemakeDiv_content").css({
			"height": screenH - topH - 60
		});
		$("#betLmgRemakeDiv_backdom").css({
			"width": "100%",
			"height": "60px",
			"display": "flex",
			"justify-content": "center",
			"align-items": "center",
			"padding-left": "10px",
			"padding-right": "10px",
			"box-sizing": "border-box",
			"background": mainBackColor
		});
		var buttonObj = $("#betLmgRemakeDiv_button");
		buttonObj.css({
			"width": "100%",
			"height": "40px",
			"display": "flex",
			"justify-content": "center",
			"align-items": "center",
			"padding": "5px",
			"background": mainColor,
			"border-radius": "25px",
			"box-sizing": "border-box",
			"font-size": "14px"
		});
		buttonObj.html("<font color=white>返回</font>");
		buttonObj.each(function () {
			setBtnOnTouchEvent($(this), function (mObj) {
				backClickFun();
				focusHiddenBox();
			}, mainColorDeep, mainColor, null);
		});
	}

	this.show = function (data) {
		itemData = data;
		mPage.show(function () {
			$("#betLmgRemakeDiv_content").html("");
		});
		if (lmgRemake == null) {
			lmgRemake = new lmgGame();
		}
		lmgRemake.showInfo("betLmgRemakeDiv_content", itemData, lmgRemake.getDefColumn());
	}
}
function betrecordGmObj() {
	var itemData;
	var mPage = new Activity("betrecordGmDiv", "投注详情");
	var mTable = null;
	var startData;
	var endData;
	var requestTime = new Date();
	var select;

	this.init = function () {
		mPage.init();
		$("#betrecordGmDiv_content").css({
			"background-color": mainBackColor
		});
		$("#betrecordGmDiv_content_list").css({
			"height": screenH - topH - 105
		});
	}

	this.show = function (data, dateType) {
		itemData = data;
		mPage.show(function () {
			if (select != null) {
				select.unShowSelect();
			}
		});
		if (select == null) {
			bindBar();
		}
		if (dateType != null) {
			select.setSelectValue(dateType);
		} else if (startData == null || endData == null) {
			var date = new Date();
			date.setDate(date.getDate() - 0);
			date = getTimeZoneE8(8, date);
			startData = date.format("yyyy-MM-dd");
			endData = date.format("yyyy-MM-dd");
			setTimeout(bindList, 500);
		} else {
			setTimeout(bindList, 500);
		}
	}

	function bindBar() {
		var times = {
			"list": [{
				"text": "今天",
				"value": "0"
			},
			{
				"text": "昨天",
				"value": "yesterday"
			},
			{
				"text": "最近7天",
				"value": "7"
			}
			]
		};

		select = new tSelect("betrecordGmDiv_select_date", "betrecordGmDiv",
			screenW, 50, times,
			function (index) {
				var dateNow = new Date();
				dateNow = getTimeZoneE8(8, dateNow);
				var dateValue = times["list"][index].value;
				if (dateValue == "yesterday") {
					dateNow.setDate(dateNow.getDate() - 1);
					startData = dateNow.format("yyyy-MM-dd");
					endData = startData;
				} else {
					dateNow.setDate(dateNow.getDate() + (-1) * times["list"][index].value);
					startData = dateNow.format("yyyy-MM-dd");
					endData = getTimeZoneE8(8, (new Date())).format("yyyy-MM-dd");
				}
				var now = new Date();
				if ((now - requestTime) > 5000) {
					bindList(500);
				} else {
					bindList(5000);
				}
			});
	}

	function bindList(outTime) {
		var validamount = 0; // 有效投注
		var winamount = 0; // 输赢
		var columns = [{
			"title": "局号",
			"code": "gameid",
			"width": "65%",
			"align": "center"
		},
		{
			"title": "输赢",
			"code": "winloss",
			"width": "34%",
			"align": "center"
		},];
		var mData = "requestType=json&start=" + startData + "&end=" + endData +
			"&code=" + itemData.gameCode + "&gameNoP1=" + itemData.gameNo;
		if (mTable != null) {
			mTable.loadData(SERVER_ADD + "/gameApi/getRecords", mData);
			return;
		}
		mTable = new eTable("betrecordGmDiv_content_list", columns, 20);
		mTable.init();
		mTable.setOutTime(outTime);
		mTable.itemClickFunction(function (itemData, objId) {
			mBetGmRemakeObj.show(itemData);
		});
		mTable.setLoadOKFunction(function () {
			requestTime = new Date();
			var v = validamount.toString();
			var vIndex = v.indexOf(".");
			if (vIndex != -1 && vIndex != v.length - 1) {
				v = v.substring(0, vIndex + 3);
			}
			var w = winamount.toString();
			var wIndex = w.indexOf(".");
			if (wIndex != -1 && wIndex != w.length - 1) {
				w = w.substring(0, wIndex + 3);
			}
			// 显示模式为flex弹性盒子(横向),none为不显示
			$("#betrecordGmDiv_content_bottom").css({
				"display": "flex"
			});
			$("#betrecordGmDiv_validSum").html("有效投注额：" + doubleValue(v));
			var winOrLoss = winamount;
			if (winOrLoss < 0) {
				winOrLoss = "<font color=" + mainColor + ">" + doubleValue(w) + "</font>";
			} else {
				winOrLoss = "<font color=" + winFontColor + ">" + doubleValue(w) + "</font>";
			}
			$("#betrecordGmDiv_winorloss").html("输赢：" + winOrLoss);
		});
		mTable.setParseFunction(function (datas, mode) {
			return parseGamesData(datas, mode);
		});
		mTable.setIsLoadMore(true);
		mTable.loadData(SERVER_ADD + "/gameApi/getRecords", mData);

		function parseGamesData(gamesData, mode) {
			var datas = new Array();
			var GmGameParsing = new GmGame();
			var dateUtil = new Date();
			var objList = gamesData.result.list;
			var len = objList.length;
			if (mode) {
				validamount = 0;
				winamount = 0;
			}
			for (var i = 0; i < len; i++) {
				var objItem = objList[i];
				var item = new Object();
				try {
					dateUtil.setTime(objItem.opentime);
					item["date"] = "<font color=white>" + getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm") + "</font>";

					item["gameName"] = "<font color=#ee6934>GM棋牌 </font>" +
						"<font color=" + winFontColor + ">" +
						GmGameParsing.parsingKindId(objItem.gameid) + "</font>";

					item["period"] = "<font color=white>" +
						GmGameParsing.parsingRoomType(objItem.gameid, objItem.roomid) + "</font>";

					var gameid = objItem.dealid;
					var winloss = objItem.winlost;
					validamount += objItem.totalbet;
					winamount += winloss;
					gameid = "<font color=white>" + gameid + " 局" + "</font>";
					item["gameid"] = gameid;
					if (winloss > 0) {
						winloss = "<font color=" + winFontColor + ">" + "+" + doubleValue(winloss) + "</font>";
					} else {
						winloss = "<font color=" + lossFontColor + ">" + doubleValue(winloss) + "</font>";
					}
					item["winloss"] = winloss;
					item["arrow"] = true;

					item["betLives"] = GmGameParsing.parsingBetLives(objItem);
				} catch (e) {
					item["date"] = 0.00;
					item["gameName"] = "";
					item["gameid"] = "";
					item["winloss"] = 0.00;
					item["arrow"] = true;
					console.log("GmGameParsingError: " + e);
				}
				datas.push(item);
			}
			var returnObj = new Object();
			returnObj["result"] = new Object();
			returnObj["result"]["list"] = datas;
			return returnObj;
		}
	}
}
function betGmRemakeObj() {
	var mPage = new Activity("betGmRemakeDiv", "注单详情");
	var itemData;
	var kyRemake;

	this.init = function () {
		mPage.init();
		$("#betGmRemakeDiv_content").css({
			"background-color": "#383838"
		});
		$("#betGmRemakeDiv_content").css({
			"height": screenH - topH - 60
		});
		$("#betGmRemakeDiv_backdom").css({
			"width": "100%",
			"height": "60px",
			"display": "flex",
			"justify-content": "center",
			"align-items": "center",
			"padding-left": "10px",
			"padding-right": "10px",
			"box-sizing": "border-box",
			"background": "#383838"
		});
		var buttonObj = $("#betGmRemakeDiv_button");
		buttonObj.css({
			"width": "100%",
			"height": "40px",
			"display": "flex",
			"justify-content": "center",
			"align-items": "center",
			"padding": "5px",
			"background": mainColor,
			"border-radius": "25px",
			"box-sizing": "border-box",
			"font-size": "14px"
		});
		buttonObj.html("<font color=white>返回</font>");
		buttonObj.each(function () {
			setBtnOnTouchEvent($(this), function (mObj) {
				backClickFun();
				focusHiddenBox();
			}, mainColorDeep, mainColor, null);
		});
	}

	this.show = function (data) {
		itemData = data;
		mPage.show(function () {
			$("#betGmRemakeDiv_content").html("");
		});
		if (kyRemake == null) {
			kyRemake = new GmGame();
		}
		kyRemake.showInfo("betGmRemakeDiv_content", itemData);
	}
}
function betrecordKyObj() {
	var itemData;
	var mPage = new Activity("betrecordKyDiv", "投注详情");
	var mTable = null;
	var startData;
	var endData;
	var requestTime = new Date();
	var select;

	this.init = function () {
		mPage.init();
		$("#betrecordKyDiv_content").css({
			"background-color": mainBackColor
		});
		$("#betrecordKyDiv_content_list").css({
			"height": screenH - topH - 105
		});
	}

	this.show = function (data, dateType) {
		itemData = data;
		mPage.show(function () {
			if (select != null) {
				select.unShowSelect();
			}
		});
		if (select == null) {
			bindBar();
		}
		if (dateType != null) {
			select.setSelectValue(dateType);
		} else if (startData == null || endData == null) {
			var date = new Date();
			date.setDate(date.getDate() - 0);
			date = getTimeZoneE8(8, date);
			startData = date.format("yyyy-MM-dd");
			endData = date.format("yyyy-MM-dd");
			setTimeout(bindList, 500);
		} else {
			setTimeout(bindList, 500);
		}
	}

	function bindBar() {
		var times = {
			"list": [{
				"text": "今天",
				"value": "0"
			},
			{
				"text": "昨天",
				"value": "yesterday"
			},
			{
				"text": "最近7天",
				"value": "7"
			}
			]
		};

		select = new tSelect("betrecordKyDiv_select_date", "betrecordKyDiv",
			screenW, 50, times,
			function (index) {
				var dateNow = new Date();
				dateNow = getTimeZoneE8(8, dateNow);
				var dateValue = times["list"][index].value;
				if (dateValue == "yesterday") {
					dateNow.setDate(dateNow.getDate() - 1);
					startData = dateNow.format("yyyy-MM-dd");
					endData = startData;
				} else {
					dateNow.setDate(dateNow.getDate() + (-1) * times["list"][index].value);
					startData = dateNow.format("yyyy-MM-dd");
					endData = getTimeZoneE8(8, (new Date())).format("yyyy-MM-dd");
				}
				var now = new Date();
				if ((now - requestTime) > 5000) {
					bindList(500);
				} else {
					bindList(5000);
				}
			});
	}

	function bindList(outTime) {
		var validamount = 0; // 有效投注
		var winamount = 0; // 输赢
		var columns = [{
			"title": "局号",
			"code": "gameid",
			"width": "65%",
			"align": "center"
		},
		{
			"title": "输赢",
			"code": "winloss",
			"width": "34%",
			"align": "center"
		},];
		var mData = "requestType=json&start=" + startData + "&end=" + endData +
			"&code=" + itemData.gameCode + "&gameNoP1=" + itemData.gameNo;
		if (mTable != null) {
			mTable.loadData(SERVER_ADD + "/gameApi/getRecords", mData);
			return;
		}
		mTable = new eTable("betrecordKyDiv_content_list", columns, 20);
		mTable.init();
		mTable.setOutTime(outTime);
		mTable.itemClickFunction(function (itemData, objId) {
			mBetKyRemakeObj.show(itemData);
		});
		mTable.setLoadOKFunction(function () {
			requestTime = new Date();
			var v = validamount.toString();
			var vIndex = v.indexOf(".");
			if (vIndex != -1 && vIndex != v.length - 1) {
				v = v.substring(0, vIndex + 3);
			}
			var w = winamount.toString();
			var wIndex = w.indexOf(".");
			if (wIndex != -1 && wIndex != w.length - 1) {
				w = w.substring(0, wIndex + 3);
			}
			// 显示模式为flex弹性盒子(横向),none为不显示
			$("#betrecordKyDiv_content_bottom").css({
				"display": "flex"
			});
			$("#betrecordKyDiv_validSum").html("有效投注额：" + doubleValue(v));
			var winOrLoss = winamount;
			if (winOrLoss < 0) {
				winOrLoss = "<font color=" + mainColor + ">" + doubleValue(w) + "</font>";
			} else {
				winOrLoss = "<font color=" + winFontColor + ">" + doubleValue(w) + "</font>";
			}
			$("#betrecordKyDiv_winorloss").html("输赢：" + winOrLoss);
		});
		mTable.setParseFunction(function (datas, mode) {
			return parseGamesData(datas, mode);
		});
		mTable.setIsLoadMore(true);
		mTable.loadData(SERVER_ADD + "/gameApi/getRecords", mData);

		function parseGamesData(gamesData, mode) {
			var datas = new Array();
			var kyGameParsing = new kyGame();
			var dateUtil = new Date();
			var objList = gamesData.result.list;
			var len = objList.length;
			if (mode) {
				validamount = 0;
				winamount = 0;
			}
			for (var i = 0; i < len; i++) {
				var objItem = objList[i];
				var item = new Object();
				try {
					dateUtil.setTime(objItem.gameendtime);
					item["date"] = "<font color=white>" + getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm") + "</font>";

					item["gameName"] = "<font color=#ee6934>KY棋牌 </font>" +
						"<font color=" + winFontColor + ">" +
						kyGameParsing.parsingKindId(objItem.kindid) + "</font>";

					item["period"] = "<font color=white>" +
						kyGameParsing.parsingRoomType(objItem.kindid, objItem.serverid) + "</font>";

					var gameid = objItem.gameid;
					var winloss = objItem.profit;
					validamount += objItem.allbet;
					winamount += winloss;
					gameid = "<font color=white>" + gameid + " 局" + "</font>";
					item["gameid"] = gameid;
					if (winloss > 0) {
						winloss = "<font color=" + winFontColor + ">" + "+" + doubleValue(winloss) + "</font>";
					} else {
						winloss = "<font color=" + lossFontColor + ">" + doubleValue(winloss) + "</font>";
					}
					item["winloss"] = winloss;
					item["arrow"] = true;

					item["betLives"] = kyGameParsing.parsingBetLives(objItem);
				} catch (e) {
					item["date"] = 0.00;
					item["gameName"] = "";
					item["gameid"] = "";
					item["winloss"] = 0.00;
					item["arrow"] = true;
					console.log("kyGameParsingError: " + e);
				}
				datas.push(item);
			}
			var returnObj = new Object();
			returnObj["result"] = new Object();
			returnObj["result"]["list"] = datas;
			return returnObj;
		}
	}
}
function betKyRemakeObj() {
	var mPage = new Activity("betKyRemakeDiv", "注单详情");
	var itemData;
	var kyRemake;

	this.init = function () {
		mPage.init();
		$("#betKyRemakeDiv_content").css({
			"background-color": "#383838"
		});
		$("#betKyRemakeDiv_content").css({
			"height": screenH - topH - 60
		});
		$("#betKyRemakeDiv_backdom").css({
			"width": "100%",
			"height": "60px",
			"display": "flex",
			"justify-content": "center",
			"align-items": "center",
			"padding-left": "10px",
			"padding-right": "10px",
			"box-sizing": "border-box",
			"background": "#383838"
		});
		var buttonObj = $("#betKyRemakeDiv_button");
		buttonObj.css({
			"width": "100%",
			"height": "40px",
			"display": "flex",
			"justify-content": "center",
			"align-items": "center",
			"padding": "5px",
			"background": mainColor,
			"border-radius": "25px",
			"box-sizing": "border-box",
			"font-size": "14px"
		});
		buttonObj.html("<font color=white>返回</font>");
		buttonObj.each(function () {
			setBtnOnTouchEvent($(this), function (mObj) {
				backClickFun();
				focusHiddenBox();
			}, mainColorDeep, mainColor, null);
		});
	}

	this.show = function (data) {
		itemData = data;
		mPage.show(function () {
			$("#betKyRemakeDiv_content").html("");
		});
		if (kyRemake == null) {
			kyRemake = new kyGame();
		}
		kyRemake.showInfo("betKyRemakeDiv_content", itemData);
	}
}
function betrecordIgObj() {
	var itemData;
	var mPage = new Activity("betrecordIgDiv", "投注详情");
	var mTable = null;
	var startData;
	var endData;
	var requestTime = new Date();
	var select;

	this.init = function () {
		mPage.init();
		$("#betrecordIgDiv_content").css({
			"background-color": mainBackColor
		});
		$("#betrecordIgDiv_content_list").css({
			"height": screenH - topH - 105
		});
	}

	this.show = function (data, dateType) {
		itemData = data;
		mPage.show(function () {
			if (select != null) {
				select.unShowSelect();
			}
		});
		if (select == null) {
			bindBar();
		}
		if (dateType != null) {
			select.setSelectValue(dateType);
		} else if (startData == null || endData == null) {
			var date = new Date();
			date.setDate(date.getDate() - 0);
			date = getTimeZoneE8(8, date);
			startData = date.format("yyyy-MM-dd");
			endData = date.format("yyyy-MM-dd");
			setTimeout(bindList, 500);
		} else {
			setTimeout(bindList, 500);
		}
	}

	function bindBar() {
		var times = {
			"list": [{
				"text": "今天",
				"value": "0"
			},
			{
				"text": "昨天",
				"value": "yesterday"
			},
			{
				"text": "最近7天",
				"value": "7"
			}]
		};

		select = new tSelect("betrecordIgDiv_select_date", "betrecordIgDiv",
			screenW, 50, times,
			function (index) {
				var dateNow = new Date();
				dateNow = getTimeZoneE8(8, dateNow);
				var dateValue = times["list"][index].value;
				if (dateValue == "yesterday") {
					dateNow.setDate(dateNow.getDate() - 1);
					startData = dateNow.format("yyyy-MM-dd");
					endData = startData;
				} else {
					dateNow.setDate(dateNow.getDate() + (-1) * times["list"][index].value);
					startData = dateNow.format("yyyy-MM-dd");
					endData = getTimeZoneE8(8, (new Date())).format("yyyy-MM-dd");
				}
				var now = new Date();
				if ((now - requestTime) > 5000) {
					bindList(500);
				} else {
					bindList(5000);
				}
			});
	}

	function bindList(outTime) {
		var validamount = 0; // 有效投注
		var winamount = 0; // 输赢
		var columns = [{
			"title": "下注项目",
			"code": "project",
			"width": "32%",
			"align": "center"
		},
		{
			"title": "投注额",
			"code": "total",
			"width": "21.5%",
			"align": "center"
		},
		{
			"title": "有效投注",
			"code": "valid",
			"width": "21.5%",
			"align": "center"
		},
		{
			"title": "输赢",
			"code": "winloss",
			"width": "21%",
			"align": "center"
		},
		];
		var mData = "requestType=json&start=" + startData + "&end=" + endData +
			"&code=" + itemData.gameCode + "&gameNoP1=" + itemData.gameNo;
		if (mTable != null) {
			mTable.loadData(SERVER_ADD + "/gameApi/getRecords", mData);
			return;
		}
		mTable = new eTable("betrecordIgDiv_content_list", columns, 20);

		mTable.init();

		mTable.setOutTime(outTime);

		mTable.setLoadOKFunction(function () {
			requestTime = new Date();
			var v = validamount.toString();
			var vIndex = v.indexOf(".");
			if (vIndex != -1 && vIndex != v.length - 1) {
				v = v.substring(0, vIndex + 3);
			}
			var w = winamount.toString();
			var wIndex = w.indexOf(".");
			if (wIndex != -1 && wIndex != w.length - 1) {
				w = w.substring(0, wIndex + 3);
			}
			// 显示模式为flex弹性盒子(横向),none为不显示
			$("#betrecordIgDiv_content_bottom").css({
				"display": "flex"
			});
			$("#betrecordIgDiv_validSum").html("有效投注额：" + doubleValue(v));
			var winOrLoss = winamount;
			if (winOrLoss < 0) {
				winOrLoss = "<font color=" + mainColor + ">" + doubleValue(w) + "</font>";
			} else {
				winOrLoss = "<font color=" + winFontColor + ">" + doubleValue(w) + "</font>";
			}
			$("#betrecordIgDiv_winorloss").html("输赢：" + winOrLoss);
		});

		mTable.setParseFunction(function (theDatas, mode) {
			// console.log(theDatas);
			return parseGamesData(theDatas, mode);
		});

		mTable.setIsLoadMore(true);

		mTable.loadData(SERVER_ADD + "/gameApi/getRecords", mData);

		function parseGamesData(gamesData, mode) {
			var datas = new Array();
			var dateUtil = new Date();
			var objList = gamesData.result.list;
			var len = objList.length;
			if (mode) {
				validamount = 0;
				winamount = 0;
			}
			for (var i = 0; i < len; i++) {
				var objItem = objList[i];
				var item = new Object();
				try {
					dateUtil.setTime(objItem.bettime);
					item["date"] = "<font color=white>" + getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm") + "</font>";
					item["period"] = "<font color=white>" + objItem.gameno + "期</font>";
					item["order"] = "<font color=#ee6934>单号:" + objItem.id + "</font>";
					var total = objItem.stakeamount; // 投注
					var valid = objItem.validstake; // 有效投注
					var winloss = objItem.winloss; // 输赢
					item["total"] = "<font color=white>" + doubleValue(total) + "</font>";
					item["valid"] = "<font color=white>" + doubleValue(valid) + "</font>";
					validamount += valid;
					winamount += winloss;
					if (winloss > 0) {
						winloss = "<font color=" + winFontColor + ">" + "+" + doubleValue(winloss) + "</font>";
					} else {
						winloss = "<font color=" + lossFontColor + ">" + doubleValue(winloss) + "</font>";
					}
					item["winloss"] = winloss;
					var beton = objItem.beton;
					var bettype = objItem.bettype;
					var odds = objItem.odds;
					var gameInfoId = objItem.gameinfoid;
					var gamePars = new lotteryGame();
					beton = gamePars.parsingBetOn(beton, gameInfoId);
					bettype = gamePars.parsingBetType(bettype, beton, gameInfoId);
					if (bettype != null && bettype.length != 0) {
						bettype = "<font color=red>‐</font>" + bettype;
					} else {
						bettype = "";
					}
					var gameName = gamePars.parsingGameInfoId(gameInfoId);
					item["gameName"] =
						"<font color=" + winFontColor + ">" + gameName + "</font>";
					var one = "<font color=white>" + beton + bettype + "</font>";
					var two = "<font color=red> @" + odds + "</font>";
					item["project"] = one + two;
					item["arrow"] = false;
				} catch (e) {
					item["arrow"] = false;
				}
				datas.push(item);
			}
			var returnObj = new Object();
			returnObj["result"] = new Object();
			returnObj["result"]["list"] = datas;
			return returnObj;
		}
	}
}
function betrecordCmdObj() {
	var itemData;
	var mPage = new Activity("betrecordCmdDiv", "投注详情");
	var mTable = null;
	var startData;
	var endData;
	var requestTime = new Date();
	var select;

	this.init = function () {
		mPage.init();
		$("#betrecordCmdDiv_content").css({
			"background-color": mainBackColor
		});
		$("#betrecordCmdDiv_content_list").css({
			"height": screenH - topH - 105
		});
	}

	this.show = function (data, dateType) {
		itemData = data;
		mPage.show(function () {
			if (select != null) {
				select.unShowSelect();
			}
		});
		if (select == null) {
			bindBar();
		}
		if (dateType != null) {
			select.setSelectValue(dateType);
		} else if (startData == null || endData == null) {
			var date = new Date();
			date.setDate(date.getDate() - 0);
			date = getTimeZoneE8(8, date);
			startData = date.format("yyyy-MM-dd");
			endData = date.format("yyyy-MM-dd");
			setTimeout(bindList, 500);
		} else {
			setTimeout(bindList, 500);
		}
	}

	function bindBar() {
		var times = {
			"list": [{
				"text": "今天",
				"value": "0"
			},
			{
				"text": "昨天",
				"value": "yesterday"
			},
			{
				"text": "最近7天",
				"value": "7"
			}
			]
		};

		select = new tSelect("betrecordCmdDiv_select_date", "betrecordCmdDiv",
			screenW, 50, times,
			function (index) {
				var dateNow = new Date();
				dateNow = getTimeZoneE8(8, dateNow);
				var dateValue = times["list"][index].value;
				if (dateValue == "yesterday") {
					dateNow.setDate(dateNow.getDate() - 1);
					startData = dateNow.format("yyyy-MM-dd");
					endData = startData;
				} else {
					dateNow.setDate(dateNow.getDate() + (-1) * times["list"][index].value);
					startData = dateNow.format("yyyy-MM-dd");
					endData = getTimeZoneE8(8, (new Date())).format("yyyy-MM-dd");
				}
				var now = new Date();
				if ((now - requestTime) > 5000) {
					bindList(500);
				} else {
					bindList(5000);
				}
			});
	}

	function bindList(outTime) {
		var validamount = 0; // 有效投注
		var winamount = 0; // 输赢
		var columns = [{
			"title": "投注项目",
			"code": "project",
			"width": "40%",
			"align": "center"
		},
		{
			"title": "有效投注",
			"code": "valid",
			"width": "28%",
			"align": "center"
		},
		{
			"title": "输赢",
			"code": "winloss",
			"width": "28%",
			"align": "center"
		},
		];
		var mData = "requestType=json&start=" + startData + "&end=" + endData +
			"&code=" + itemData.gameCode + "&gameNoP1=" + itemData.gameNo;

		if (mTable != null) {
			mTable.loadData(SERVER_ADD + "/gameApi/getRecords", mData);
			return;
		}
		mTable = new eTable("betrecordCmdDiv_content_list", columns, 20);

		mTable.init();

		mTable.setOutTime(outTime);

		mTable.itemClickFunction(function (itemData, objId) {
			mBetCmdRemakeObj.show(itemData);
		});

		mTable.setLoadOKFunction(function () {
			requestTime = new Date();
			var v = validamount.toString();
			var vIndex = v.indexOf(".");
			if (vIndex != -1 && vIndex != v.length - 1) {
				v = v.substring(0, vIndex + 3);
			}
			var w = winamount.toString();
			var wIndex = w.indexOf(".");
			if (wIndex != -1 && wIndex != w.length - 1) {
				w = w.substring(0, wIndex + 3);
			}
			// 显示模式为flex弹性盒子(横向),none为不显示
			$("#betrecordCmdDiv_content_bottom").css({
				"display": "flex"
			});
			$("#betrecordCmdDiv_validSum").html("有效投注额：" + doubleValue(v));
			var winOrLoss = winamount;
			if (winOrLoss < 0) {
				winOrLoss = "<font color=" + mainColor + ">" + doubleValue(w) + "</font>";
			} else {
				winOrLoss = "<font color=" + winFontColor + ">" + doubleValue(w) + "</font>";
			}
			$("#betrecordCmdDiv_winorloss").html("输赢：" + winOrLoss);
		});

		mTable.setParseFunction(function (theDatas, mode) {
			// console.log(theDatas);
			return parseGamesData(theDatas, mode);
		});

		mTable.setIsLoadMore(true);

		mTable.loadData(SERVER_ADD + "/gameApi/getRecords", mData);

		function parseGamesData(gamesData, mode) {
			var datas = new Array();
			var dateUtil = new Date();
			var cmdParsing = new cmdGame();
			var objList = gamesData.result.list;
			var len = objList.length;
			if (mode) {
				validamount = 0;
				winamount = 0;
			}
			for (var i = 0; i < len; i++) {
				var objItem = objList[i];
				var item = new Object();
				var hunheList = objItem.parlaybetrecord;
				try {
					if (hunheList != null && hunheList.length != 0) {
						dateUtil.setTime(objItem.transdate);
						item["date"] = "<font color=white>" + getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm") + "</font>";
						item["gameName"] = "<font color=#ee6934>体育 </font>" +
							"<font color=" + winFontColor + ">" +
							cmdParsing.parsingSportType(objItem.sporttype) + "</font>";
						var transLayout = "<div class=\"cmdItem\">%content%</div>";
						var transType = "<font color=#ee6934>混合过关</font>";
						item["project"] = transLayout.replace("%content%", transType);
						var betamount = objItem.betamount;
						item["valid"] = "<font color=white>" + doubleValue(betamount) + "</font>";
						validamount += betamount;
						var stats = objItem.winlosestatus;
						if (stats == "P") {
							item["winloss"] = "<font color=#ee6934>未结算</font>";
						} else {
							var winloss = objItem.winamount;
							winamount += winloss;
							if (winloss > 0) {
								winloss = "<font color=" + winFontColor + ">" + "+" + doubleValue(winloss) + "</font>";
							} else {
								winloss = "<font color=" + lossFontColor + ">" + doubleValue(winloss) + "</font>";
							}
							item["winloss"] = winloss;
						}
						var betLiveList = new Array();
						var betLen = hunheList.length;
						for (var p = 0; p < betLen; p++) {
							var betItem = hunheList[p];
							var betLiveObj = new Object();
							// leftText
							var betDui = "";
							var isBetHome = betItem.isbethome;
							if (isBetHome == 1) {
								betDui = betItem.dt.homeid.name;
							} else {
								betDui = betItem.dt.awayid.name;
							}
							var hdp = betItem.hdp;
							if (hdp != null) {
								hdp = " " + hdp;
							} else {
								hdp = "";
							}
							var odds = "<font color=red> @" + betItem.odds + "</font>"; // 赔率
							betLiveObj["leftText"] = "<font color=white>" + betDui + hdp + "</font>" + odds;

							// rightText
							var homeDui = betItem.dt.homeid.name;
							var keDui = betItem.dt.awayid.name;
							if (homeDui.length > 6) {
								homeDui = homeDui.substring(0, 6);
							}
							if (keDui.length > 6) {
								keDui = keDui.substring(0, 6);
							}
							betLiveObj["rightText"] = "<font color=#898989>" + homeDui + " v " + keDui + "</font>";
							betLiveList.push(betLiveObj);
						}
						item["betLiveList"] = betLiveList;
						item["arrow"] = true;
					} else {
						dateUtil.setTime(objItem.transdate);
						item["date"] = "<font color=white>" + getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm") + "</font>";
						item["gameName"] = "<font color=#ee6934>体育 </font>" +
							"<font color=" + winFontColor + ">" +
							cmdParsing.parsingSportType(objItem.sporttype) + "</font>";
						var betamount = objItem.betamount;
						item["valid"] = "<font color=white>" + doubleValue(betamount) + "</font>";
						validamount += betamount;
						var stats = objItem.winlosestatus;
						if (stats == "P") {
							item["winloss"] = "<font color=#ee6934>未结算</font>";
						} else {
							var winloss = objItem.winamount;
							winamount += winloss;
							if (winloss > 0) {
								winloss = "<font color=" + winFontColor + ">" + "+" + doubleValue(winloss) + "</font>";
							} else {
								winloss = "<font color=" + lossFontColor + ">" + doubleValue(winloss) + "</font>";
							}
							item["winloss"] = winloss;
						}
						var transLayout = "<div class=\"cmdItem\">%content%</div>";
						var isRun = objItem.isrunning;
						if (isRun == "0") {
							isRun = "";
						} else {
							isRun = "滚球 ";
						}
						var transType = "<font color=#ee6934>" + isRun +
							cmdParsing.parsingTransType(objItem.transtype) + " </font>"; // 玩法
						item["project"] = transLayout.replace("%content%", transType);
						// 设置betLiveList
						// leftText
						var betLiveObj = new Object();
						var betDui = "";
						var isBetHome = objItem.isbethome;
						if (isBetHome == 1) {
							betDui = objItem.dt.hometeamid.name;
						} else {
							betDui = objItem.dt.awayteamid.name;
						}
						var hdp = objItem.hdp;
						if (hdp != null) {
							hdp = " " + hdp;
						} else {
							hdp = "";
						}
						var odds = "<font color=red> @" + objItem.odds + "</font>"; // 赔率
						betLiveObj["leftText"] = "<font color=white>" + betDui + hdp + "</font>" + odds;
						// rightText
						var homeDui = objItem.dt.hometeamid.name;
						var keDui = objItem.dt.awayteamid.name;
						if (homeDui.length > 6) {
							homeDui = homeDui.substring(0, 6);
						}
						if (keDui.length > 6) {
							keDui = keDui.substring(0, 6);
						}
						betLiveObj["rightText"] = "<font color=#898989>" + homeDui + " v " + keDui + "</font>";
						var betLiveList = new Array();
						betLiveList.push(betLiveObj);
						item["betLiveList"] = betLiveList;
						item["arrow"] = true;
					}
					item["betLives"] = cmdParsing.parsingBetLive(objItem);
				} catch (e) {
					item["arrow"] = true;
				}
				datas.push(item);
			}
			var returnObj = new Object();
			returnObj["result"] = new Object();
			returnObj["result"]["list"] = datas;
			return returnObj;
		}
	}
}
function betCmdRemakeObj() {
	var mPage = new Activity("betCmdRemakeDiv", "注单详情");
	var itemData;
	var cmdRemake;

	this.init = function () {
		mPage.init();
		$("#betCmdRemakeDiv_content").css({
			"background-color": "#383838"
		});
		$("#betCmdRemakeDiv_content").css({
			"height": screenH - topH - 60
		});
		$("#betCmdRemakeDiv_backdom").css({
			"width": "100%",
			"height": "60px",
			"display": "flex",
			"justify-content": "center",
			"align-items": "center",
			"padding-left": "10px",
			"padding-right": "10px",
			"box-sizing": "border-box",
			"background": "#383838"
		});
		var buttonObj = $("#betCmdRemakeDiv_button");
		buttonObj.css({
			"width": "100%",
			"height": "40px",
			"display": "flex",
			"justify-content": "center",
			"align-items": "center",
			"padding": "5px",
			"background": mainColor,
			"border-radius": "25px",
			"box-sizing": "border-box",
			"font-size": "14px"
		});
		buttonObj.html("<font color=white>返回</font>");
		buttonObj.each(function () {
			setBtnOnTouchEvent($(this), function (mObj) {
				backClickFun();
				focusHiddenBox();
			}, mainColorDeep, mainColor, null);
		});
	}

	this.show = function (data) {
		itemData = data;
		mPage.show(function () {
			$("#betCmdRemakeDiv_content").html("");
		});
		if (cmdRemake == null) {
			cmdRemake = new cmdGame();
		}
		cmdRemake.showInfo("betCmdRemakeDiv_content", itemData);
	}
}
function betrecordJPNNObj() {
	var itemData;
	var mPage = new Activity("betrecordJPNNDiv", "投注详情");
	var mTable = null;
	var startData;
	var endData;
	var requestTime = new Date();
	var select;

	this.init = function () {
		mPage.init();
		$("#betrecordJPNNDiv_content").css({
			"background-color": mainBackColor
		});
		$("#betrecordJPNNDiv_content_list").css({
			"height": screenH - topH - 105
		});
	}

	this.show = function (data, dateType) {
		itemData = data;
		mPage.show(function () {
			if (select != null) {
				select.unShowSelect();
			}
		});
		if (select == null) {
			bindBar();
		}
		if (dateType != null) {
			select.setSelectValue(dateType);
		} else if (startData == null || endData == null) {
			var date = new Date();
			date.setDate(date.getDate() - 0);
			date = getTimeZoneE8(8, date);
			startData = date.format("yyyy-MM-dd");
			endData = date.format("yyyy-MM-dd");
			setTimeout(bindList, 500);
		} else {
			setTimeout(bindList, 500);
		}
	}

	function bindBar() {
		var times = {
			"list": [{
				"text": "今天",
				"value": "0"
			},
			{
				"text": "昨天",
				"value": "yesterday"
			},
			{
				"text": "最近7天",
				"value": "7"
			}
			]
		};
		select = new tSelect("betrecordJPNNDiv_select_date", "betrecordJPNNDiv",
			screenW, 50, times,
			function (index) {
				var dateNow = new Date();
				dateNow = getTimeZoneE8(8, dateNow);
				var dateValue = times["list"][index].value;
				if (dateValue == "yesterday") {
					dateNow.setDate(dateNow.getDate() - 1);
					startData = dateNow.format("yyyy-MM-dd");
					endData = startData;
				} else {
					dateNow.setDate(dateNow.getDate() + (-1) * times["list"][index].value);
					startData = dateNow.format("yyyy-MM-dd");
					endData = getTimeZoneE8(8, (new Date())).format("yyyy-MM-dd");
				}
				var now = new Date();
				if ((now - requestTime) > 5000) {
					bindList(500);
				} else {
					bindList(5000);
				}
			});
	}

	function bindList(outTime) {
		var jpnnObj = new jpnnGame();
		var validamount = 0; // 有效投注
		var winamount = 0; // 输赢
		var columns = [{
			"title": "投注",
			"code": "total",
			"width": "32.5%",
			"align": "center"
		},
		{
			"title": "有效投注",
			"code": "valid",
			"width": "32.5%",
			"align": "center"
		},
		{
			"title": "输赢",
			"code": "winloss",
			"width": "32.5%",
			"align": "center"
		},
		];
		var mData = "requestType=json&start=" + startData + "&end=" + endData +
			"&code=" + itemData["gameCode"] + "&gameNoP1=" + itemData["gameNo"];
		if (mTable != null) {
			mTable.loadData(SERVER_ADD + "gameApi/getRecords", mData);
			return;
		}
		mTable = new eTable("betrecordJPNNDiv_content_list", columns, 20);
		mTable.init();
		mTable.setOutTime(outTime);
		mTable.itemClickFunction(function (item, objId) {
			mBetJPNNRemakeObj.show(item);
		});
		mTable.setLoadOKFunction(function () {
			requestTime = new Date();
			$("#betrecordJPNNDiv_content_bottom").css({ "display": "flex" });
			$("#betrecordJPNNDiv_validSum").html("有效投注额：" + doubleValue(validamount));
			var winOrLoss = winamount;
			if (winOrLoss < 0) {
				winOrLoss = "<font color=" + mainColor + ">" + doubleValue(winamount) + "</font>";
			} else {
				winOrLoss = "<font color=" + winFontColor + ">" + doubleValue(winamount) + "</font>";
			}
			$("#betrecordJPNNDiv_winorloss").html("输赢: " + winOrLoss);
		});
		mTable.setParseFunction(function (theDatas, mode) {
			return parseGamesData(theDatas, mode);
		});
		mTable.setIsLoadMore(true);
		mTable.loadData(SERVER_ADD + "gameApi/getRecords", mData);
		function parseGamesData(gamesData, mode) {
			var datas = new Array();
			var objList = gamesData["result"]["list"];
			var len = objList["length"];
			var gameId = itemData["gameId"];
			if (mode) {
				validamount = 0;
				winamount = 0;
			}
			for (var i = 0; i < len; i++) {
				var objItem = objList[i];
				var item;
				if (gameId == "NN") {
					item = parseNN(objItem);
				} else if (gameId == "JACKPOT") {
					item = parseJACKPot(objItem);
				}
				datas.push(item);
			}
			var returnObj = new Object();
			returnObj["result"] = new Object();
			returnObj["result"]["list"] = datas;
			return returnObj;
		}
		function parseNN(objItem) {
			var dateUtil = new Date();
			var item = new Object();
			try {
				var jackpotImg = "<img src=\"" + themPath + "JackpotBuy.png\" style=\"width:30px\" />";
				if (objItem["buyjackpot"] <= 0) {
					jackpotImg = "";
				}
				dateUtil.setTime(objItem["begintime"]);
				item["date"] = "<font color=white>" + getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm") + "</font>";
				item["gameName"] = "<font color=" + winFontColor + ">" + objItem["dt"]["game_no"]["sname"] + "</font>" + jackpotImg;
				item["period"] = "<font color=white>" + objItem["roomid"] + "号房间</font>";
				var total = doubleValue(objItem["betvalue"]);
				var valid = doubleValue(objItem["validbetvalue"]);
				var winloss = doubleValue(objItem["realvalue"]);
				validamount = doubleValue(validamount) + doubleValue(valid);
				winamount = doubleValue(winamount) + doubleValue(winloss);
				total = "<font color=white>" + total + "</font>";
				valid = "<font color=white>" + valid + "</font>";
				item["total"] = total;
				item["valid"] = valid;
				if (winloss > 0.00) {
					winloss = "<font color=" + winFontColor + ">+" + winloss + "</font>";
				} else {
					winloss = "<font color=" + lossFontColor + ">" + winloss + "</font>";
				}
				item["winloss"] = winloss;
				objItem["cardList"] = jpnnObj.parsingCard(objItem);
				item["betLives"] = objItem;
				item["arrow"] = true;
			} catch (e) {
				item["date"] = 0.00;
				item["gameName"] = "";
				item["total"] = 0.00;
				item["valid"] = 0.00;
				item["winloss"] = 0.00;
				item["arrow"] = false;
			}
			return item;
		}
		function parseJACKPot(objItem) {
			var dateUtil = new Date();
			var item = new Object();
			try {
				dateUtil.setTime(objItem["begintime"]);
				item["date"] = "<font color=white>" + getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm") + "</font>";
				item["gameName"] = "<font color=" + winFontColor + ">JACKPOT</font>";
				item["period"] = "<font color=white>" + objItem["roomid"] + "号房间</font>";
				var total = doubleValue(objItem["buyjackpot"]);
				var valid = doubleValue(objItem["buyjackpot"]);
				var winloss = doubleValue(objItem["jackpotrealvalue"]);
				validamount = doubleValue(validamount) + doubleValue(valid);
				winamount = doubleValue(winamount) + doubleValue(winloss);
				total = "<font color=white>" + total + "</font>";
				valid = "<font color=white>" + valid + "</font>";
				item["total"] = total;
				item["valid"] = valid;
				if (winloss > 0.00) {
					winloss = "<font color=" + winFontColor + ">+" + winloss + "</font>";
				} else {
					winloss = "<font color=" + lossFontColor + ">" + winloss + "</font>";
				}
				item["winloss"] = winloss;
				objItem["cardList"] = jpnnObj.parsingCard(objItem);
				item["betLives"] = objItem;
				item["arrow"] = true;
			} catch (e) {
				item["date"] = 0.00;
				item["gameName"] = "";
				item["total"] = 0.00;
				item["valid"] = 0.00;
				item["winloss"] = 0.00;
				item["arrow"] = false;
			}
			return item;
		}
	}
}
function betJPNNRemakeObj() {
	var mPage = new Activity("betJPNNRemakeDiv", "注单详情");
	var itemData;
	var jpnnRemake;
	this.init = function () {
		mPage.init();
		$("#betJPNNRemakeDiv_content").css({
			"background-color": mainBackColor
		});
		$("#betJPNNRemakeDiv_content").css({
			"height": screenH - topH - 60
		});
		$("#betJPNNRemakeDiv_backdom").css({
			"width": "100%",
			"height": "60px",
			"display": "flex",
			"justify-content": "center",
			"align-items": "center",
			"padding-left": "10px",
			"padding-right": "10px",
			"box-sizing": "border-box",
			"background": mainBackColor
		});
		var buttonObj = $("#betJPNNRemakeDiv_button");
		buttonObj.css({
			"width": "100%",
			"height": "40px",
			"display": "flex",
			"justify-content": "center",
			"align-items": "center",
			"padding": "5px",
			"background": mainColor,
			"border-radius": "25px",
			"box-sizing": "border-box",
			"font-size": "14px"
		});
		buttonObj.html("<font color=white>返回</font>");
		buttonObj.each(function () {
			setBtnOnTouchEvent($(this), function (mObj) {
				backClickFun();
				focusHiddenBox();
			}, mainColorDeep, mainColor, null);
		});
	}
	this.show = function (data) {
		itemData = data;
		mPage.show(function () {
			$("#betJPNNRemakeDiv_content").html("");
		});
		if (jpnnRemake == null) {
			jpnnRemake = new jpnnGame();
		}
		jpnnRemake.showInfo("betJPNNRemakeDiv_content", itemData);
	}
}
function cmdGame() {
	var layoutId;
	var layoutObj;
	var dataItem;

	this.showInfo = function (id, item) {
		layoutId = id;
		dataItem = item;
		layoutObj = $("#" + layoutId);
		layoutObj.css({
			"overflow-x": "hidden",
			"overflow-y": "auto"
		});
		var head = "<div id=" + layoutId + "_head></div>";
		var list = "<div id=" + layoutId + "_list></div>";
		layoutObj.html(head + list);
		bindHeadView();
		bindListView();
	}

	this.parsingBetLive = parsingBetLive;

	function bindHeadView() {
		var obj = $("#" + layoutId + "_head");

		var rootHeadDiv = "<div class=cmdBetLiveRootHead>%content%</div>";
		var titleDiv = "<div class=cmdBetLiveTitle>%content%</div>";
		var betDiv = "<div class=cmdBetLiveBet>%content%</div>";

		var gameName = dataItem["gameName"];
		gameName = "<div class=cmdBetLiveTitleGameName>" + gameName + "</div>";
		var date = dataItem["date"];
		date = "<div class=cmdBetLiveTitleDate>" + date + "</div>";
		titleDiv = titleDiv.replace("%content%", gameName + date);

		var project = dataItem["project"];
		project = "<div class=cmdBetLiveBetProject>" + project + "</div>";
		var valid = dataItem["valid"];
		valid = "<div class=cmdBetLiveBetValid>" + valid + "</div>";
		var winloss = dataItem["winloss"];
		winloss = "<div class=cmdBetLiveBetWinloss>" + winloss + "</div>";
		betDiv = betDiv.replace("%content%", project + valid + winloss);

		rootHeadDiv = rootHeadDiv.replace("%content%", titleDiv + betDiv);
		obj.html(rootHeadDiv);

		setHeadStyle();
	}

	// justify-content的使用(弹性子元素在父容器中的位置)
	// justify-content属性
	// flex-start:从左到右排列
	// flex-end:从右到左排列
	// center:中间开始排列
	// space-between:平分
	// space-around:平分且两边占1/2
	// align-items属性:垂直方向的对齐方式
	function setHeadStyle() {
		// 根item布局
		$(".cmdBetLiveRootHead").css({
			"align-items": "center",
			"text-align": "center",
			"width": "auto",
			"height": "auto",
			"background": "#4c4c4c",
			"border-radius": "5px",
			"margin-left": "5px",
			"margin-right": "5px",
			"margin-top": "15px",
			"padding-top": "5px",
			"padding-bottom": "5px",
			"padding-left": "8px",
			"padding-right": "8px",
			"box-sizing": "border-box"
		});

		// 标题行
		$(".cmdBetLiveTitle").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto",
			"box-sizing": "border-box"
		});
		$(".cmdBetLiveTitleGameName").css({
			"text-align": "left",
			"width": "50%",
			"font-size": "10px"
		});
		$(".cmdBetLiveTitleDate").css({
			"text-align": "right",
			"width": "50%",
			"font-size": "10px"
		});

		// 投注结果行
		$(".cmdBetLiveBet").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto",
			"margin-top": "5px",
			"box-sizing": "border-box"
		});
		$(".cmdBetLiveBetProject").css({
			"text-align": "center",
			"align-items": "center",
			"display": "flex",
			"justify-content": "center",
			"font-size": "12px",
			"background": "#2E2E2E",
			"padding-top": "2px",
			"padding-bottom": "2px",
			"width": "33%",
			"height": "auto",
			"box-sizing": "border-box"
		});
		$(".cmdBetLiveBetValid").css({
			"text-align": "center",
			"align-items": "center",
			"display": "flex",
			"justify-content": "center",
			"font-size": "12px",
			"background": "#2E2E2E",
			"padding-top": "2px",
			"padding-bottom": "2px",
			"width": "33%",
			"height": "auto",
			"box-sizing": "border-box"
		});
		$(".cmdBetLiveBetWinloss").css({
			"text-align": "center",
			"align-items": "center",
			"display": "flex",
			"justify-content": "center",
			"font-size": "12px",
			"background": "#2E2E2E",
			"padding-top": "2px",
			"padding-bottom": "2px",
			"width": "33%",
			"height": "auto",
			"box-sizing": "border-box"
		});
	}

	function bindListView() {
		var betLives = dataItem["betLives"];
		if (betLives != null) {
			var obj = $("#" + layoutId + "_list");
			var betLiveRootDiv = "<div class=cmdBetLiveListRoot>%content%</div>";
			var betEntryDiv = "<div class=cmdBetLiveListEntry>%content%</div>";
			var betEntryBottomDiv = "<div class=cmdBetLiveListEntryBottom>%content%</div>";
			var betEntryLeftDiv = "<div class=cmdBetLiveListEntryLeft>%content%</div>";
			var betEntryRightDiv = "<div class=cmdBetLiveListEntryRight>%content%</div>";
			var betDivs = "";
			var betLen = betLives.length;
			for (var i = 0; i < betLen; i++) {
				var betItem = betLives[i];

				var bettype = betItem["bettype"];
				bettype = betEntryLeftDiv.replace("%content%", bettype);
				var vs = betItem["vs"];
				vs = betEntryRightDiv.replace("%content%", vs);
				var entry1 = betEntryDiv.replace("%content%", bettype + vs);

				var siTxt = "<font color=#898989>赛果:</font>";
				siTxt = betEntryLeftDiv.replace("%content%", siTxt);
				var saiguo = betItem["saiguo"];
				saiguo = betEntryRightDiv.replace("%content%", saiguo);
				var entry2 = betEntryDiv.replace("%content%", siTxt + saiguo);

				var syTxt = "<font color=#898989>输赢:</font>";
				syTxt = betEntryLeftDiv.replace("%content%", syTxt);
				var winloss = betItem["winlose"];
				winloss = betEntryRightDiv.replace("%content%", winloss);

				var lsTxt = "<font color=#898989>联赛:</font>";
				lsTxt = betEntryLeftDiv.replace("%content%", lsTxt);
				var ls = betItem["liansai"];
				ls = betEntryRightDiv.replace("%content%", ls);
				var entry3 = betEntryDiv.replace("%content%", lsTxt + ls);

				var ksDateTxt = "<font color=#898989>开始时间:</font>";
				ksDateTxt = betEntryLeftDiv.replace("%content%", ksDateTxt);
				var ksdate = betItem["ksdate"];
				ksdate = betEntryRightDiv.replace("%content%", ksdate);
				var entry4 = betEntryDiv.replace("%content%", ksDateTxt + ksdate);

				var pktypeTxt = "<font color=#898989>盘口类型:</font>";
				pktypeTxt = betEntryLeftDiv.replace("%content%", pktypeTxt);
				var pktype = betItem["pktype"];
				pktype = betEntryRightDiv.replace("%content%", pktype);
				var entry5 = betEntryBottomDiv.replace("%content%", pktypeTxt + pktype);

				betDivs += betLiveRootDiv.replace("%content%", entry1 + entry2 +
					entry3 + entry4 + entry5);
			}
			obj.html(betDivs);
		}
		setListStyle();
	}

	function setListStyle() {
		$(".cmdBetLiveListRoot").css({
			"align-items": "center",
			"text-align": "center",
			"width": "100%",
			"height": "auto",
			"background": "#222222",
			"margin-top": "15px",
			"padding": "10px",
			"box-sizing": "border-box"
		});
		$(".cmdBetLiveListEntry").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto",
			"margin-bottom": "10px",
			"box-sizing": "border-box"
		});
		$(".cmdBetLiveListEntryBottom").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto",
			"box-sizing": "border-box"
		});
		$(".cmdBetLiveListEntryLeft").css({
			"text-align": "left",
			"width": "50%",
			"font-size": "12px"
		});
		$(".cmdBetLiveListEntryRight").css({
			"text-align": "right",
			"width": "50%",
			"font-size": "12px"
		});
	}

	//球类标识转换
	this.parsingSportType = function (sporttype) {
		var sportTypeMsg = "";
		switch (sporttype) {
			case "S":
				sportTypeMsg = "足球 ";
				break;
			case "34D":
				sportTypeMsg = "3D/4D 游戏 ";
				break;
			case "12D":
				sportTypeMsg = "1D/2D 游戏 ";
				break;
			case "BB":
				sportTypeMsg = "篮球 ";
				break;
			case "FS":
				sportTypeMsg = "室内足球 ";
				break;
			case "BC":
				sportTypeMsg = "海滩足球 ";
				break;
			case "UF":
				sportTypeMsg = "美式足球 ";
				break;
			case "BE":
				sportTypeMsg = "棒球 ";
				break;
			case "IH":
				sportTypeMsg = "冰球 ";
				break;
			case "TN":
				sportTypeMsg = "网球 ";
				break;
			case "FB":
				sportTypeMsg = "金融投注 ";
				break;
			case "BA":
				sportTypeMsg = "羽毛球 ";
				break;
			case "GF":
				sportTypeMsg = "高尔夫球";
				break;
			case "CK":
				sportTypeMsg = "板球 ";
				break;
			case "VB":
				sportTypeMsg = "排球";
				break;
			case "HB":
				sportTypeMsg = "手球 ";
				break;
			case "PL":
				sportTypeMsg = "撞球 ";
				break;
			case "BL":
				sportTypeMsg = "台球 ";
				break;
			case "NS":
				sportTypeMsg = "桌球 ";
				break;
			case "RB":
				sportTypeMsg = "橄榄球 ";
				break;
			case "GP":
				sportTypeMsg = "汽车运动 ";
				break;
			case "DT":
				sportTypeMsg = "飞镖 ";
				break;
			case "BX":
				sportTypeMsg = "拳击 ";
				break;
			case "AT":
				sportTypeMsg = "田径 ";
				break;
			case "AR":
				sportTypeMsg = "射箭 ";
				break;
			case "CH":
				sportTypeMsg = "棋 ";
				break;
			case "DV":
				sportTypeMsg = "跳水 ";
				break;
			case "EQ":
				sportTypeMsg = "马术 ";
				break;
			case "ET":
				sportTypeMsg = "综艺 ";
				break;
			case "CN":
				sportTypeMsg = "皮划艇 ";
				break;
			case "CS":
				sportTypeMsg = "格斗体育 ";
				break;
			case "CY":
				sportTypeMsg = "骑自行车 ";
				break;
			case "HK":
				sportTypeMsg = "曲棍球 ";
				break;
			case "GM":
				sportTypeMsg = "体操 ";
				break;
			case "FL":
				sportTypeMsg = "地板球 ";
				break;
			case "NT":
				sportTypeMsg = "Novelties ";
				break;
			case "OL":
				sportTypeMsg = "奥林匹克 ";
				break;
			case "OT":
				sportTypeMsg = "其他 ";
				break;
			case "PO":
				sportTypeMsg = "政治 ";
				break;
			case "QQ":
				sportTypeMsg = "壁球 ";
				break;
			case "MN":
				sportTypeMsg = "游泳 ";
				break;
			case "RU":
				sportTypeMsg = "橄榄球联盟 ";
				break;
			case "TT":
				sportTypeMsg = "乒乓球 ";
				break;
			case "WG":
				sportTypeMsg = "举重 ";
				break;
			case "WI":
				sportTypeMsg = "冬季运动 ";
				break;
			case "WP":
				sportTypeMsg = "水球 ";
				break;
			case "WS":
				sportTypeMsg = "赛道 ";
				break;
			case "ES":
				sportTypeMsg = "电子竞技 ";
				break;
			case "MT":
				sportTypeMsg = "泰拳 ";
				break;
		}
		return sportTypeMsg;
	}

	//玩法类型转换
	this.parsingTransType = function (pType) {
		var playTpyeMsg = "";
		switch (pType) {
			case "1":
				playTpyeMsg = "1X2下注1";
				break;
			case "1D":
				playTpyeMsg = "12D球赛 下注HDP(让球)";
				break;
			case "2":
				playTpyeMsg = "1X2下注2";
				break;
			case "2D":
				playTpyeMsg = "12D球赛 下注OU(大小)";
				break;
			case "3D":
				playTpyeMsg = "34D球赛 下注HDP(让球)";
				break;
			case "4D":
				playTpyeMsg = "34D球赛 下注OU(大/小)";
				break;
			case "CS":
				playTpyeMsg = "波胆";
				break;
			case "FLG":
				playTpyeMsg = "最先/最后进球";
				break;
			case "HDP":
				playTpyeMsg = "让球";
				break;
			case "HFT":
				playTpyeMsg = "半场/全场";
				break;
			case "OE":
				playTpyeMsg = "单/双";
				break;
			case "OU":
				playTpyeMsg = "大/小";
				break;
			case "OUT":
				playTpyeMsg = "优胜冠军";
				break;
			case "PAR":
				playTpyeMsg = "混合过关";
				break;
			case "TG":
				playTpyeMsg = "总进球";
				break;
			case "X":
				playTpyeMsg = "1X2下注X";
				break;
			case "1X":
				playTpyeMsg = "双重机会(DC) 下注1X";
				break;
			case "12":
				playTpyeMsg = "双重机会(DC) 下注12";
				break;
			case "X2":
				playTpyeMsg = "双重机会(DC) 下注X2";
				break;
		}
		return playTpyeMsg;
	}

	function parsingBetLive(itemData) {
		var betLives = new Array();
		var cmdParsing = new cmdGame();
		var dateUtil = new Date();
		var betList = itemData.parlaybetrecord;
		if (betList != null && betList.length != 0) {
			var betLen = betList.length;
			for (var i = 0; i < betLen; i++) {
				var betItem = betList[i];
				var betObj = new Object();

				// 下注类型
				var isRun = betItem.isrun;
				if (isRun == "0") {
					isRun = "";
				} else {
					isRun = "滚球 ";
				}
				var transType = cmdParsing.parsingTransType(betItem.transtype);
				var hdp = betItem.hdp;
				if (hdp != null) {
					hdp = " " + hdp;
				} else {
					hdp = "";
				}
				var odds = "<font color=red> @" + betItem.odds + "</font>";
				betObj["bettype"] = "<font color=white>" + isRun + transType + hdp + "</font>" + odds;

				// 对阵
				var homeDui = betItem.dt.homeid.name;
				var keDui = betItem.dt.awayid.name;
				if (homeDui.length > 6) {
					homeDui = homeDui.substring(0, 6);
				}
				if (keDui.length > 6) {
					keDui = keDui.substring(0, 6);
				}
				betObj["vs"] = "<font color=#898989>" + homeDui + " v " + keDui + "</font>";

				// 赛果
				var saiguo = betItem.ftscore;
				if (saiguo == null) {
					saiguo = betItem.htscore;
				}
				betObj["saiguo"] = "<font color=white>" + saiguo.replace("-", " : ") + "</font>";

				// 输赢
				betObj["winlose"] = winLoseStatus(betItem.parstatus);

				// 联赛
				var liansai = betItem.dt.leagueid.name;
				betObj["liansai"] = "<font color=white>" + liansai + "</font>";

				// 开始时间
				dateUtil.setTime(betItem.ctime);
				var ksDate = getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm");
				betObj["ksdate"] = "<font color=white>" + ksDate + "</font>";

				// 盘口类型
				var pkType = oddsType(itemData.oddstype);
				pkType = "<font color=white>" + pkType + "</font>";
				betObj["pktype"] = pkType;

				betLives.push(betObj);
			}
		} else {
			var betObj = new Object();
			// 下注类型
			var isRun = itemData.isrunning;
			if (isRun == "0") {
				isRun = "";
			} else {
				isRun = "滚球 ";
			}
			var transType = cmdParsing.parsingTransType(itemData.transtype);
			var hdp = itemData.hdp;
			if (hdp != null) {
				hdp = " " + hdp;
			} else {
				hdp = "";
			}
			var odds = "<font color=red> @" + itemData.odds + "</font>";
			betObj["bettype"] = "<font color=white>" + isRun + transType + hdp + "</font>" + odds;

			// 对阵
			var homeDui = itemData.dt.hometeamid.name;
			var keDui = itemData.dt.awayteamid.name;
			if (homeDui.length > 6) {
				homeDui = homeDui.substring(0, 6);
			}
			if (keDui.length > 6) {
				keDui = keDui.substring(0, 6);
			}
			betObj["vs"] = "<font color=#898989>" + homeDui + " v " + keDui + "</font>";

			// 赛果
			var saiguo = itemData.homescore + " : " + itemData.awayscore;
			betObj["saiguo"] = "<font color=white>" + saiguo + "</font>";

			// 输赢
			betObj["winlose"] = winLoseStatus(itemData.winlosestatus);

			// 联赛
			var liansai = itemData.dt.leagueid.name;
			betObj["liansai"] = "<font color=white>" + liansai + "</font>";

			// 开始时间
			dateUtil.setTime(itemData.matchdate);
			var ksDate = getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm");
			betObj["ksdate"] = "<font color=white>" + ksDate + "</font>";

			// 盘口类型
			var pkType = oddsType(itemData.oddstype);
			pkType = "<font color=white>" + pkType + "</font>";
			betObj["pktype"] = pkType;

			betLives.push(betObj);
		}
		return betLives;
	}

	//输赢状态转换
	function winLoseStatus(wlStatus) {
		switch (wlStatus) {
			case "WA":
				return "<font color=" + winFontColor + ">全赢</font>";
			case "WH":
				return "<font color=" + winFontColor + ">赢一半</font>";
			case "LA":
				return "<font color=red>全输</font>";
			case "LH":
				return "<font color=red>输一半</font>";
			case "D":
				return "<font color=white>平局</font>";
			case "P":
				return "<font color=white>未开奖</font>";
		}
	}

	//盘口类型转换
	function oddsType(oType) {
		var oddsTpyeMsg = "";
		switch (oType) {
			case "MY":
				oddsTpyeMsg = " 马来盘";
				break;
			case "ID":
				oddsTpyeMsg = " 印尼盘";
				break;
			case "HK":
				oddsTpyeMsg = " 香港盘";
				break;
			case "DE":
				oddsTpyeMsg = " 欧洲盘";
				break;
		}
		return oddsTpyeMsg;
	}
}
function lmgGame() {
	var layoutId;
	var rootView;
	var itemData;
	var columnDatas;

	this.showInfo = function (id, item, column) {
		layoutId = id;
		rootView = $("#" + layoutId);
		rootView.css({
			"overflow-x": "hidden",
			"overflow-y": "auto"
		});
		var headDiv = "<div id=" + layoutId + "_head></div>";
		var asy = "<div id=" + layoutId + "_aye></div>";
		rootView.html(headDiv + asy);
		itemData = item;
		columnDatas = column;
		bindHeadView();
		bindBetLiveView();
	}

	this.getDefColumn = getDefColumn;

	this.parsingBetLive = parsingBetLive;

	function bindHeadView() {
		var headView = $("#" + layoutId + "_head");
		// 标题栏
		var len = columnDatas.length;
		var barDivs = "<table cellpadding=0 cellspacing=0 style=\"width:100%\"><tr>%content%</tr></table>";
		var content = "";
		for (var i = 0; i < len; i++) {
			var item = columnDatas[i];
			var align = item["align"];
			var width = item["width"];
			var title = item["title"];
			if (align == null) {
				align = "center";
			}
			var td = "<td align=center class=" + layoutId + "_head_bar width=" +
				width + ">%content%</td>";
			var title = "<div style=\"text-align:" + align + ";width:100%\">" +
				title + "</div>";
			td = td.replace("%content%", title);
			content += td;
		}
		barDivs = barDivs.replace("%content%", content);
		// 展示item
		var allDivs = "<div class=" + layoutId + "_head_all>%content%</div>";
		// allDiv顶部布局
		var gameName = itemData["gameName"];
		var period = itemData["period"]; // 靴号
		if (period == null) {
			period = "";
		}
		var date = itemData["date"];
		var divsName = "<div class=" + layoutId + "_all_name>" + gameName + "</div>";
		var divsPeriod = "<div class=" + layoutId + "_all_period>" + period + "</div>";
		var divsDate = "<div class=" + layoutId + "_all_date>" + date + "</div>";
		var allTopDivs = "<div class=" + layoutId + "_all_top>%content%</div>";
		allTopDivs = allTopDivs.replace("%content%", divsName + divsPeriod + divsDate);
		// allDiv底部布局
		var allBottomDivs = "<div class=" + layoutId + "_all_bottom>%content%</div>";
		var info = "";
		for (var i = 0; i < len; i++) {
			var item = columnDatas[i];
			var code = item["code"];
			if (i == 0) { // 投注项目
				info += "<div class=" + layoutId + "_all_info_" + i +
					"><font color=white>合计</font></div>";
			} else {
				var value = itemData[code];
				info += "<div class=" + layoutId + "_all_info_" + i +
					">" + value + "</div>";
			}
		}
		allBottomDivs = allBottomDivs.replace("%content%", info);
		allDivs = allDivs.replace("%content%", allTopDivs + allBottomDivs);
		headView.html(barDivs + allDivs);

		setHeadStyle();
	}

	function setHeadStyle() {
		// 标题栏
		$("." + layoutId + "_head_bar").css({
			"word-wrap": "break-word",
			"word-break": "break-all",
			"text-align": "center",
			"height": "35px",
			"color": mainFontColorDeep,
			"font-size": "12px",
			"box-sizing": "border-box"
		});

		// 展示item布局
		$("." + layoutId + "_head_all").css({
			"align-items": "center",
			"width": "auto",
			"height": "auto",
			"background": "#4c4c4c",
			"padding-top": "6px",
			"padding-bottom": "6px",
			"padding-left": "10px",
			"padding-right": "10px",
			"border-radius": "5px",
			"margin-left": "5px",
			"margin-right": "5px",
			"margin-bottom": "5px",
			"box-sizing": "border-box"
		});

		// 展示itemTop布局
		$("." + layoutId + "_all_top").css({
			"display": "flex",
			"justify-content": "center",
			"align-items": "center",
			"width": "100%"
		});
		$("." + layoutId + "_all_name").css({
			"text-align": "left",
			"width": "33.3%",
			"font-size": "12px",
			"color": "#ee6934"
		});
		$("." + layoutId + "_all_period").css({
			"text-align": "center",
			"width": "33.3%",
			"font-size": "12px",
			"color": "white"
		});
		$("." + layoutId + "_all_date").css({
			"text-align": "right",
			"width": "33.3%",
			"font-size": "12px",
			"color": "white"
		});

		// 展示itemBottom布局
		$("." + layoutId + "_all_bottom").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"margin-top": "5px",
			"width": "100%",
			"height": "auto",
			"box-sizing": "border-box"
		});
		var len = columnDatas.length;
		for (var i = 0; i < len; i++) {
			var item = columnDatas[i];
			var w = item["width"]; // 必选项(百分比)
			var h = item["height"]; // 可选项(px)
			var infoObj = $("." + layoutId + "_all_info_" + i);
			if (h != null) { // 指定高度
				infoObj.css({
					"text-align": "center",
					"align-items": "center",
					"display": "flex",
					"justify-content": "center",
					"font-size": "12px",
					"background": "#2E2E2E",
					"width": w,
					"height": h,
					"box-sizing": "border-box"
				});
			} else { // 未指定高度
				infoObj.css({
					"text-align": "center",
					"align-items": "center",
					"display": "flex",
					"justify-content": "center",
					"font-size": "12px",
					"background": "#2E2E2E",
					"padding-top": "2px",
					"padding-bottom": "2px",
					"width": w,
					"height": "auto",
					"box-sizing": "border-box"
				});
			}
		}
	}

	function bindBetLiveView() {
		var ayeView = $("#" + layoutId + "_aye");
		// 牌值展示
		var gameDivs = "<div id=" + layoutId + "_aye_game></div>";
		// 投注详细展示
		var betList = itemData["betLive"];
		var betLen = betList.length;
		var columnLen = columnDatas.length;
		var allBetDivs = "";
		for (var i = 0; i < betLen; i++) {
			var betItem = betList[i];
			var betDivs = "<div class=" + layoutId + "_aye_bet>%content%</div>";
			var msg = "";
			for (var p = 0; p < columnLen; p++) {
				var columnItem = columnDatas[p];
				var code = columnItem["code"];
				var value = betItem[code];
				msg += "<div class=" + layoutId + "_bet_info_" + p + ">" + value + "</div>";
			}
			allBetDivs += betDivs.replace("%content%", msg);
		}
		ayeView.html(gameDivs + allBetDivs);
		setBetLiveStyle();
		bindGameView(itemData["gameType"]);
	}

	function setBetLiveStyle() {
		// betItem布局
		$("." + layoutId + "_aye_bet").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"background": "#4c4c4c",
			"width": "auto",
			"height": "auto",
			"padding-top": "5px",
			"padding-bottom": "5px",
			"padding-left": "10px",
			"padding-right": "10px",
			"border-radius": "5px",
			"margin": "5px",
			"box-sizing": "border-box"
		});

		// gameview根布局
		$("#" + layoutId + "_aye_game").css({
			"width": "100%",
			"height": "auto",
			"padding-left": "5px",
			"padding-right": "5px",
			"padding-top": "15px",
			"padding-bottom": "15px",
			"margin-top": "15px",
			"margin-bottom": "15px",
			"background": "#462318",
			"box-sizing": "border-box",
		});

		// 注单column列
		var len = columnDatas.length;
		for (var i = 0; i < len; i++) {
			var item = columnDatas[i];
			var w = item["width"]; // 必选项(百分比)
			var h = item["height"]; // 可选项(px)
			var infoObj = $("." + layoutId + "_bet_info_" + i);
			if (h != null) { // 指定高度
				infoObj.css({
					"text-align": "center",
					"align-items": "center",
					"display": "flex",
					"justify-content": "center",
					"font-size": "12px",
					"background": "#2E2E2E",
					"width": w,
					"height": h
				});
			} else { // 未指定高度
				infoObj.css({
					"text-align": "center",
					"align-items": "center",
					"display": "flex",
					"justify-content": "center",
					"font-size": "12px",
					"background": "#2E2E2E",
					"padding-top": "2px",
					"padding-bottom": "2px",
					"width": w,
					"height": "auto"
				});
			}
		}
	}

	// bind游戏结果展示
	function bindGameView(type) {
		switch (type) {
			case "BACCARAT":
				bindBaccaratView();
				break;
			case "BULL_BULL":
				bindNiuniuView();
				break;
			case "DRAGON_TIGER":
				bindDragonTigerView();
				break;
			case "ROULETTE":
				bindRouletteView();
				break;
			case "SICBO":
				bindSicboView();
				break;
			case "XOC_DIA":
				bindXocDiaView();
				break;
			case "BACCARAT_INSURANCE":
				bindBaccaratView();
				break;
			default:
				break;
		}
	}

	// justify-content的使用(弹性子元素在父容器中的位置)
	// justify-content属性
	// flex-start:从左到右排列
	// flex-end:从右到左排列
	// center:中间开始排列
	// space-between:平分
	// space-around:平分且两边占1/2
	// align-items属性:垂直方向的对齐方式
	function bindBaccaratView() {
		var poker = itemData["poker"];
		if (poker != null) {
			poker = pokerReset(poker);
			var obj = $("#" + layoutId + "_aye_game");
			var rootDivs = "<div class=baccarat_poker_root>%content%</div>";
			var leftDivs = "<div class=baccarat_poker_left>%content%</div>";
			var rightDivs = "<div class=baccarat_poker_right>%content%</div>";
			var len = poker.length;
			for (var i = 0; i < len; i++) {
				var pokerIndex = poker[i];
				var inLen = pokerIndex.length;
				var sum = 0; // 庄闲点数
				var pokerList = new Array();
				for (var p = 0; p < inLen; p++) {
					var pk = pokerIndex[p];
					var num = pk % 13;
					if (num > 10 || num == 0) {
						num = 10;
					}
					sum += num;
					var src = "https://media.pjd96.com/images/game/pk/" + pk + ".png";
					var imgDiv = "";
					if ((inLen == 3) && ((i == 0 && p == 0) ||
						(i == 1 && p == inLen - 1))) { // 需要将牌旋转90度
						imgDiv = "<div class=pokerLevelDiv><img class=pokerLevel src=\"" + src + "\"/></div>";
					} else {
						imgDiv = "<div class=pokerDiv><img class=pokerNormal src=\"" + src + "\"/></div>";
					}
					pokerList.push(imgDiv);
				}
				sum = sum % 10;
				var zxSum = "<div class=%clazz%>%content%</div>";
				if (i == 0) {
					var ms = "<font color=" + winFontColor + ">闲 </font>";
					var sum = "<font style=\"font-weight:bold\" color=white>" + sum + "</font>";
					zxSum = zxSum.replace("%clazz%", "zxSumLeft").replace("%content%", ms + sum);
				} else {
					var ms = "<font color=red> 庄</font>";
					var sum = "<font style=\"font-weight:bold\" color=white>" + sum + "</font>";
					zxSum = zxSum.replace("%clazz%", "zxSumRight").replace("%content%", sum + ms);
				}
				var pLen = pokerList.length;
				var pokerDivs = "";
				for (var p = 0; p < pLen; p++) {
					var itemPokerDiv = pokerList[p];
					if (pLen == 3 && i == 0 && p == 0) { // 闲牌
						var xDiv = "<div class=levelPokerLeft>%content%</div>";
						xDiv = xDiv.replace("%content%", zxSum + itemPokerDiv);
						pokerDivs += xDiv;
					} else if (pLen == 3 && i == 1 && p == pLen - 1) { // 庄牌
						var xDiv = "<div class=levelPokerRight>%content%</div>";
						xDiv = xDiv.replace("%content%", zxSum + itemPokerDiv);
						pokerDivs += xDiv;
					} else {
						pokerDivs += itemPokerDiv;
					}
				}
				if (pLen != 3) {
					if (i == 0) {
						pokerDivs = zxSum + pokerDivs;
						leftDivs = leftDivs.replace("%content%", pokerDivs);
					} else {
						pokerDivs = pokerDivs + zxSum;
						rightDivs = rightDivs.replace("%content%", pokerDivs);
					}
				} else {
					if (i == 0) {
						leftDivs = leftDivs.replace("%content%", pokerDivs);
					} else {
						rightDivs = rightDivs.replace("%content%", pokerDivs);
					}
				}
			}
			rootDivs = rootDivs.replace("%content%", leftDivs + rightDivs);
			obj.html(rootDivs);
			setStyle();
		}

		function setStyle() {
			// 扑克根布局
			$(".baccarat_poker_root").css({
				"display": "flex",
				"justify-content": "space-between",
				"align-items": "center",
				"width": "100%",
				"height": "auto",
				"box-sizing": "border-box"
			});

			// 扑克左布局
			$(".baccarat_poker_left").css({
				"display": "flex",
				"justify-content": "space-around",
				"align-items": "center",
				"background": "#000000",
				"width": "49%",
				"height": "90px",
				"padding": "5px",
				"border-radius": "5px",
				"box-sizing": "border-box",
			});

			// 扑克右布局
			$(".baccarat_poker_right").css({
				"display": "flex",
				"justify-content": "space-around",
				"align-items": "center",
				"background": "#000000",
				"width": "49%",
				"height": "90px",
				"padding": "5px",
				"border-radius": "5px",
				"box-sizing": "border-box",
			});

			// 水平扑克左布局
			$(".levelPokerLeft").css({
				"align-items": "center",
				"text-align": "center",
				"width": "68px",
				"height": "100%",
				"box-sizing": "border-box"
			});

			// 水平扑克右布局
			$(".levelPokerRight").css({
				"align-items": "center",
				"text-align": "center",
				"width": "68px",
				"height": "100%",
				"box-sizing": "border-box"
			});

			// 庄闲和左布局
			$(".zxSumLeft").css({
				"align-items": "center",
				"text-align": "left",
				"width": "auto",
				"height": "auto",
				"font-size": "20px",
			});

			// 庄闲和右布局
			$(".zxSumRight").css({
				"align-items": "center",
				"text-align": "right",
				"width": "auto",
				"height": "auto",
				"font-size": "20px",
			});
		}

		function pokerReset(pk) {
			var pLen = pk.length;
			var dList = new Array();
			for (var i = 0; i < pLen; i++) {
				if (i == 0) {
					var oneItem = pk[i];
					var iLen = oneItem.length;
					for (var p = 0; p < iLen; p++) {
						var pItem = oneItem[iLen - (p + 1)];
						dList.push(pItem);
					}
					break;
				}
			}
			pk[0] = dList;
			return pk;
		}
	}

	function bindNiuniuView() {
		var poker = itemData["poker"];
		if (poker != null) {
			var obj = $("#" + layoutId + "_aye_game");
			var rootDivs = "<div class=niuniuRootDiv>%content%</div>";
			var headDivs = "<div class=headPokerDiv>%content%</div>"; // 头牌
			var zxDiv = "<div class=zxPokerDiv>%content%</div>"; // 庄闲牌
			var pkDivList = new Array();
			var pLen = poker.length;
			for (var i = 0; i < pLen; i++) {
				var pItem = poker[i];
				var pxLen = pItem.length;
				var pokers = "";
				var pokerNumberList = new Array();
				for (var p = 0; p < pxLen; p++) {
					var pokerNum = pItem[p];
					pokerNumberList.push(getPokerByNum(pokerNum));
					var src = "https://media.pjd96.com/images/game/pk/" + pokerNum + ".png";
					var imgDiv = "";
					if (p == 0) {
						imgDiv = "<div class=pokerNormal><img class=pokerNormal src=\"" +
							src + "\"/></div>";
					} else {
						imgDiv = "<div class=niuPokerDiv><img class=pokerNormal src=\"" +
							src + "\"/></div>";
					}
					pokers += imgDiv;
				}
				var pokertype = parsingNiuniuPokerNumber(pokerNumberList);
				if (i == 0) {
					var txtDivs = "<div class=headTxtDiv><font color=#CC9445>头\n牌</font></div>";
					var pkDivs = "<div class=headPokerRootDiv>" + pokers + "</div>";
					headDivs = headDivs.replace("%content%", txtDivs + pkDivs);
				} else {
					var txtDivs = "<div class=zxTxtRootDiv>%content%</div>";
					if (i == 1) {
						var zxTxt = "<div class=zxIndexTxtDiv><font color=red>庄</font></div>";
						var placeholderDev = "<div class=placeholderDiv></div>";
						var sumTxt = "<div class=sumTxtDiv><font color=white>" +
							pokertype + "</font></div>";
						txtDivs = txtDivs.replace("%content%", zxTxt + placeholderDev + sumTxt);
					} else {
						var zxTxt = "<div class=zxIndexTxtDiv><font color=" +
							winFontColor + ">闲" + (i - 1) + "</font></div>";
						var placeholderDev = "<div class=placeholderDiv></div>";
						var sumTxt = "<div class=sumTxtDiv><font color=white>" +
							pokertype + "</font></div>";
						txtDivs = txtDivs.replace("%content%", zxTxt + placeholderDev + sumTxt);
					}
					var pkDivs = "<div class=zxPokerRootDiv>" + pokers + "</div>";
					pkDivList.push(zxDiv.replace("%content%", txtDivs + pkDivs));
				}
			}

			var pdLen = pkDivList.length;
			var isOs = pdLen % 2 == 0 ? true : false;
			var han = 0;
			if (isOs) {
				han = pdLen / 2;
			} else {
				han = (pdLen + 1) / 2;
			}
			var pokershowDivs = "";
			for (var i = 0; i < han; i++) {
				var index = (i + 1) * 2 - 2;
				var itemDiv1 = pkDivList[index];
				var itemDiv2 = "";
				if (index + 1 < pdLen) {
					itemDiv2 = pkDivList[index + 1];
				}
				var hanDiv = "<div class=zxHanPokerDiv>" + itemDiv1 + itemDiv2 + "</div>";
				pokershowDivs += hanDiv;
			}
			rootDivs = rootDivs.replace("%content%", headDivs + pokershowDivs);
			obj.html(rootDivs);
			setStyle();
		}

		function setStyle() {
			var w = $(window).width();
			// 牛牛根布局
			$(".niuniuRootDiv").css({
				"align-items": "center",
				"text-align": "center",
				"width": "100%",
				"height": "auto"
			});
			// 头牌布局
			$(".headPokerDiv").css({
				"display": "flex",
				"justify-content": "flex-start",
				"align-items": "center",
				"background": "#000000",
				"width": "100%",
				"height": "90px",
				"padding-top": "5px",
				"padding-bottom": "5px",
				"padding-left": "15px",
				"padding-right": "15px",
				"border-radius": "5px",
				"box-sizing": "border-box"
			});
			// 头牌标题
			$(".headTxtDiv").css({
				"text-align": "left",
				"width": "16px",
				"height": "auto",
				"font-size": "16px"
			});
			var headPokerRootWidth = w - 5 - 5 - 15 - 15 - 32;
			// 头牌扑克
			$(".headPokerRootDiv").css({
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"text-align": "center",
				"width": headPokerRootWidth,
				"height": "auto"
			});
			// 庄闲和扑克展示布局
			$(".zxPokerDiv").css({
				"display": "flex",
				"justify-content": "space-between",
				"align-items": "center",
				"background": "#000000",
				"width": "49%",
				"height": "90px",
				"padding": "5px",
				"border-radius": "5px",
				"box-sizing": "border-box"
			});
			// 庄闲和标题
			$(".zxTxtRootDiv").css({
				"align-items": "center",
				"text-align": "center",
				"width": "auto",
				"height": "100%",
				"font-size": "16px"
			});
			// 庄闲和
			$(".zxIndexTxtDiv").css({
				"align-items": "center",
				"text-align": "center",
				"width": "auto",
				"height": "16px",
				"font-size": "16px",
				"margin-top": "3px"
			});
			// 占位
			$(".placeholderDiv").css({
				"width": "auto",
				"height": "43%"
			});
			// 庄闲和点数
			$(".sumTxtDiv").css({
				"align-items": "center",
				"text-align": "center",
				"width": "auto",
				"height": "16px",
				"font-size": "16px"
			});
			// 庄闲和扑克
			$(".zxPokerRootDiv").css({
				"display": "flex",
				"justify-content": "flex-end",
				"align-items": "center",
				"text-align": "right",
				"width": "auto",
				"height": "auto"
			});
			// 庄闲和行
			$(".zxHanPokerDiv").css({
				"display": "flex",
				"justify-content": "space-between",
				"align-items": "center",
				"width": "100%",
				"height": "auto",
				"margin-top": "10px",
				"box-sizing": "border-box"
			});
			// 牌堆叠
			$(".niuPokerDiv").css({
				"text-align": "center",
				"width": "auto",
				"height": "auto",
				"margin-left": "-25px"
			});
		}
	}

	function bindDragonTigerView() {
		var poker = itemData["poker"];
		if (poker != null) {
			var obj = $("#" + layoutId + "_aye_game");
			var rootDivs = "<div class=dtRootDiv>%content%</div>";
			var longDivs = "<div class=longPokerDiv>%content%</div>"; // 龙牌
			var huDiv = "<div class=huPokerDiv>%content%</div>"; // 虎牌
			var pLen = poker.length;
			for (var i = 0; i < pLen; i++) {
				var pItem = poker[i];
				var pxLen = pItem.length;
				var pokers = "";
				var zxSum = 0;
				for (var p = 0; p < pxLen; p++) {
					var pokerNum = pItem[p];
					var num = pokerNum % 13;
					if (num == 0) {
						num = 13;
					}
					zxSum += num;
					var src = "https://media.pjd96.com/images/game/pk/" + pokerNum + ".png";
					var imgDiv = "";
					if (p == 0) {
						imgDiv = "<div class=pokerNormal><img class=pokerNormal src=\"" +
							src + "\"/></div>";
					} else {
						imgDiv = "<div class=dtPokerImgDiv><img class=pokerNormal src=\"" +
							src + "\"/></div>";
					}
					pokers += imgDiv;
				}
				if (i == 0) {
					var txtDivs = "<div class=longTxtDiv><font color=red>龙 </font>" +
						"<font color=white style=\"font-weight:bold\">" + zxSum + "</font></div>";
					var pkDivs = "<div class=longPokerRootDiv>" + pokers + "</div>";
					longDivs = longDivs.replace("%content%", txtDivs + pkDivs);
				} else {
					var txtDivs = "<div class=huTxtDiv><font color=white style=\"font-weight:bold\">" +
						zxSum + " </font><font color=" + winFontColor + ">虎</font></div>";
					var pkDivs = "<div class=huPokerRootDiv>" + pokers + "</div>";
					huDiv = huDiv.replace("%content%", pkDivs + txtDivs);
				}
			}
			rootDivs = rootDivs.replace("%content%", longDivs + huDiv);
			obj.html(rootDivs);
			setStyle();
		}

		function setStyle() {
			var w = $(window).width();
			// 龙虎根布局
			$(".dtRootDiv").css({
				"display": "flex",
				"justify-content": "space-between",
				"align-items": "center",
				"text-align": "center",
				"width": "100%",
				"height": "auto"
			});

			// 龙牌布局
			$(".longPokerDiv").css({
				"display": "flex",
				"justify-content": "space-between",
				"align-items": "center",
				"background": "#000000",
				"width": "49%",
				"height": "90px",
				"padding": "5px",
				"border-radius": "5px",
				"box-sizing": "border-box"
			});
			// 龙牌标题
			$(".longTxtDiv").css({
				"text-align": "center",
				"width": "40%",
				"height": "100%",
				"font-size": "22px"
			});
			// 龙牌扑克
			$(".longPokerRootDiv").css({
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"text-align": "center",
				"width": "60%",
				"height": "auto"
			});

			// 虎牌布局
			$(".huPokerDiv").css({
				"display": "flex",
				"justify-content": "space-between",
				"align-items": "center",
				"background": "#000000",
				"width": "49%",
				"height": "90px",
				"padding": "5px",
				"border-radius": "5px",
				"box-sizing": "border-box"
			});
			// 虎牌标题
			$(".huTxtDiv").css({
				"text-align": "center",
				"width": "40%",
				"height": "100%",
				"font-size": "22px"
			});
			// 虎牌扑克
			$(".huPokerRootDiv").css({
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"text-align": "center",
				"width": "60%",
				"height": "auto"
			});

			// 牌堆叠
			$(".dtPokerImgDiv").css({
				"text-align": "center",
				"width": "auto",
				"height": "auto",
				"margin-left": "-25px"
			});
		}
	}

	function bindRouletteView() {
		var result = itemData["result"];
		var colors = "";
		if (result != null) {
			var obj = $("#" + layoutId + "_aye_game");
			var num = result[0];
			if ((num == 1) || (num == 3) || (num == 5) ||
				(num == 7) || (num == 9) || (num == 12) ||
				(num == 14) || (num == 16) || (num == 18) ||
				(num == 19) || (num == 21) || (num == 23) ||
				(num == 25) || (num == 27) || (num == 30) ||
				(num == 32) || (num == 34) || (num == 36)
			) {
				colors = "red";
			} else if (num == 0) {
				colors = "green";
			} else {
				colors = "black";
			}
			var rootDiv = "<div class=rouletteRootDiv>%content%</div>";
			var wWDiv = "<div class=rtWWDiv>%content%</div>";
			var nWDiv = "<div class=rtnWDiv>%content%</div>";
			var numDiv = "<div class=rtnumDiv><font color=white style=\"font-weight:bold\">" +
				num + "</font></div>";
			nWDiv = nWDiv.replace("%content%", numDiv);
			wWDiv = wWDiv.replace("%content%", nWDiv);
			rootDiv = rootDiv.replace("%content%", wWDiv);
			obj.html(rootDiv);
			setStyle();
		}

		function setStyle() {
			$(".rouletteRootDiv").css({
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"width": "100%",
				"height": "55px",
				"box-sizing": "border-box"
			});
			$(".rtWWDiv").css({
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"text-align": "center",
				"width": "55px",
				"height": "55px",
				"padding": "1px",
				"background": colors,
				"border-radius": "5px",
				"box-sizing": "border-box"
			});
			$(".rtnWDiv").css({
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"text-align": "center",
				"width": "100%",
				"height": "100%",
				"padding": "2px",
				"background": colors,
				"border-radius": "5px",
				"box-sizing": "border-box"
			});
			$(".rtnumDiv").css({
				"text-align": "center",
				"width": "auto",
				"height": "auto",
				"font-size": "28px"
			});
		}
	}

	function bindSicboView() {
		var result = itemData["result"];
		if (result != null) {
			var obj = $("#" + layoutId + "_aye_game");
			var len = result.length;
			var rootDiv = "<div class=sicboRootDiv>%content%</div>";
			var sicboImgDivs = "";
			for (var i = 0; i < len; i++) {
				var item = result[i];
				var src = "https://media.pjd96.com/images/game/shaizi/" + item + ".png";
				var sicImg = "";
				if (i == 0) {
					sicImg = "<div class=sicboImgT><img class=sicboImg src=\"" + src + "\"/></div>";
				} else {
					sicImg = "<div class=sicboImgN><img class=sicboImg src=\"" + src + "\"/></div>";
				}
				sicboImgDivs += sicImg;
			}
			rootDiv = rootDiv.replace("%content%", sicboImgDivs);
			obj.html(rootDiv);
			setStyle();
		}

		function setStyle() {
			$(".sicboRootDiv").css({
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"width": "100%",
				"height": "50px",
				"box-sizing": "border-box"
			});
			$(".sicboImgT").css({
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"text-align": "center",
				"width": "auto",
				"height": "auto",
				"box-sizing": "border-box"
			});
			$(".sicboImgN").css({
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"text-align": "center",
				"width": "auto",
				"height": "auto",
				"margin-left": "5px",
				"box-sizing": "border-box"
			});
		}
	}

	function bindXocDiaView() {
		function setStyle() { }
	}

	var columnCodeOne = "project";
	var columnCodeTwo = "total";
	var columnCodeThree = "valid";
	var columnCodeFour = "winloss";

	function getDefColumn() {
		// 每个下标值为一个对象
		var column = [{
			"title": "投注项",
			"code": columnCodeOne,
			"width": "24%",
			"align": "center"
		},
		{
			"title": "投注",
			"code": columnCodeTwo,
			"width": "24%",
			"align": "center"
		},
		{
			"title": "有效投注",
			"code": columnCodeThree,
			"width": "24%",
			"align": "center"
		},
		{
			"title": "输赢",
			"code": columnCodeFour,
			"width": "24%",
			"align": "center"
		},
		];
		return column;
	}

	// 解析betLive,仅限于使用默认column标题栏(data必选为原始字符串)
	function parsingBetLive(data, gametype) {
		var resultList = new Array();
		var betList = JSON.parse(data);
		var dateUtil = new Date();
		var len = betList.length;
		for (var i = 0; i < len; i++) {
			var item = betList[i];
			var betProject = getBetProject(item.betType, gametype);
			if (betProject != null) {
				var obj = new Object();
				obj[columnCodeOne] = "<font color=white>" + betProject + "</font>";
				obj[columnCodeTwo] = "<font color=white>" + item.betAmount + "</font>";
				obj[columnCodeThree] = "<font color=white>" + item.betAmount + "</font>";
				if (item.winLossAmount < 0) {
					obj[columnCodeFour] = "<font color=red>" + item.winLossAmount + "</font>";
				} else {
					obj[columnCodeFour] = "<font color=" + winFontColor + ">" + item.winLossAmount + "</font>";
				}
				dateUtil.setTime(item.betTime);
				obj["date"] = getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm");
				resultList.push(obj);
			}
		}
		return resultList;
	}

	// 获取下注项目
	function getBetProject(value, type) {
		switch (type) {
			case "BACCARAT":
				return baccaratDetails(value);
			case "BULL_BULL":
				return niuniuDetails(value);
			case "DRAGON_TIGER":
				return dragonTigerDetails(value);
			case "ROULETTE":
				return rouletteDetails(value);
			case "SICBO":
				return sicboDetails(value);
			case "XOC_DIA":
				return xocDiaDetails(value);
			case "BACCARAT_INSURANCE":
				return baccaratDetails(value);
			default:
				return null;
		}
	}

	//百家乐下注详情
	function baccaratDetails(value) {
		var result = "";
		switch (value) {
			case "BC_BANKER":
				result = "庄";
				break;
			case "BC_BANKER_NC":
				result = "庄免佣";
				break;
			case "BC_PLAYER":
				result = "闲";
				break;
			case "BC_TIE":
				result = "和";
				break;
			case "BC_BANKER_PAIR":
				result = "庄对";
				break;
			case "BC_PLAYER_PAIR":
				result = "闲对";
				break;
			case "BC_ARBITRARILY_PAIR":
				result = "任意对子";
				break;
			case "BC_PERFECT_PAIR":
				result = "完美对子";
				break;
			case "BC_BIG":
				result = "大";
				break;
			case "BC_SMALL":
				result = "小";
				break;
			case "BC_BANKER_SUPER_SIX":
				result = "超级六点";
				break;
			case "BC_BANKER_INSURANCE":
				result = "庄保险";
				break;
			case "BC_PLAYER_INSURANCE":
				result = "闲保险";
				break;

		}
		return result;
	}

	//牛牛下注详情
	function niuniuDetails(value) {
		var result = "";
		switch (value) {
			case "BB_PALYER1_EQUAL":
				result = "闲1平倍";
				break;
			case "BB_PALYER1_DOUBLE":
				result = "闲1翻倍";
				break;
			case "BB_PALYER1_MANY":
				result = "闲1多倍 ";
				break;
			case "BB_PALYER2_EQUAL":
				result = "闲2平倍";
				break;
			case "BB_PALYER2_DOUBLE":
				result = "闲2翻倍";
				break;
			case "BB_PALYER2_MANY":
				result = "闲2多倍";
				break;
			case "BB_PALYER3_EQUAL":
				result = "闲3平倍";
				break;
			case "BB_PALYER3_DOUBLE":
				result = "闲3翻倍";
				break;
			case "BB_PALYER3_MANY":
				result = "闲3多倍";
				break;
		}
		return result;
	}

	//龙虎下注详情
	function dragonTigerDetails(value) {
		var result = "";
		switch (value) {
			case "DT_DRAGON":
				result = "龙";
				break;
			case "DT_TIGER":
				result = "虎";
				break;
			case "DT_TIE":
				result = "和";
				break;
			case "DT_DRAGON_RED":
				result = "龙红";
				break;
			case "DT_DRAGON_BLACK":
				result = "龙黑";
				break;
			case "DT_DRAGON_ONE":
				result = "龙单";
				break;
			case "DT_DRAGON_DOUBLE":
				result = "龙双";
				break;
			case "DT_TIGER_RED":
				result = "虎红";
				break;
			case "DT_TIGER_BLACK":
				result = "虎黑";
				break;
			case "DT_TIGER_ONE":
				result = "虎单";
				break;
			case "DT_TIGER_DOUBLE":
				result = "虎双";
				break;
		}

		return result;
	}

	// 轮盘
	function rouletteDetails(value) {
		var result = "";
		switch (value) {
			case "RL_EVEN":
				return "双";
			case "RL_RED":
				return "红";
			case "RL_BLACK":
				return "黑";
			case "RL_ODD":
				return "单";
			case "RL_BIG":
				return "大";
			case "RL_SMALL":
				return "小";
		}
		if (value.indexOf("COL") != -1) {
			return "打注";
		} else if (value.indexOf("ROW") != -1) {
			return "列注";
		}

		// 分割判断
		var len = value.split("_").length;
		if (len == 7) {
			result = "线注";
		} else if (len == 5) {
			result = "角注";
		} else if (len == 4) {
			result = "衔注";
		} else if (len = 3) {
			result = "分注";
		} else if (len == 2) {
			result = "直注";
		}
		return result;
	}

	// 骰宝
	function sicboDetails(value) {
		var result = "";
		if (value == "SB_SMALL") {
			result = "小";
		} else if (value == "SB_BIG") {
			result = "大";
		} else if (value == "SB_ODD") {
			result = "单";
		} else if (value == "SB_EVEN") {
			result = "双";
		} else if (value == "SB_ANYTRIPLE") {
			result = "全围";
		} else if (value.indexOf("PAIR") != -1) {
			var arr = value.split("_");
			var len = arr.length;
			result = "对" + arr[len - 1];
		} else if (value.indexOf("TRIPLE") != -1) {
			var arr = value.split("_");
			var len = arr.length;
			result = "围骰" + arr[len - 1];
		} else if (value.indexOf("TWO") != -1) {
			var arr = value.split("_");
			var len = arr.length;
			result = "组合" + arr[len - 2] + "-" + arr[len - 1];
		} else if (value.indexOf("ANYONE") != -1) {
			var arr = value.split("_");
			var len = arr.length;
			result = "三军" + arr[len - 1];
		} else if (value.indexOf("SUM") != -1) {
			var arr = value.split("_");
			var len = arr.length;
			result = arr[len - 1] + "点";
		}
		return result;
	}

	// 色碟
	function xocDiaDetails(value) {
		switch (value) {
			case "XOC_ZERO":
				return "全白";
			case "XOC_ONE":
				return "3白1红";
			case "XOC_TWO":
				return "2白2红";
			case "XOC_THREE":
				return "1白3红";
			case "XOC_FOUR":
				return "全红";
			case "XOC_ODD":
				return "单";
			case "XOC_EVEN":
				return "双";
		}
	}

	// 牛牛牌型算法解析
	function parsingNiuniuPokerNumber(pokerNumList) {
		var sumList = new Array();
		var desColorSum = 0;
		var is10Num = false;
		var len = pokerNumList.length;
		for (var i = 0; i < len; i++) {
			var numItem = pokerNumList[i];
			if (numItem.number > 10) {
				desColorSum++;
			} else if (numItem.number == 10) {
				is10Num = true;
			}
		}
		if (desColorSum == 5) {
			return "五花";
		} else if (desColorSum == 4 && is10Num) {
			return "四花";
		}
		for (var i = 0; i < len; i++) {
			for (var p = 0; p < len; p++) {
				for (var m = 0; m < len; m++) {
					// 3张不一样的牌序号
					if (i != p && p != m && i != m) {
						var pokerNumObjItem1 = pokerNumList[i];
						var pknum1 = pokerNumObjItem1.number;
						if (pknum1 > 10) {
							pknum1 = 10;
						}
						var pokerNumObjItem2 = pokerNumList[p];
						var pknum2 = pokerNumObjItem2.number;
						if (pknum2 > 10) {
							pknum2 = 10;
						}
						var pokerNumObjItem3 = pokerNumList[m];
						var pknum3 = pokerNumObjItem3.number;
						if (pknum3 > 10) {
							pknum3 = 10;
						}
						var mainSum = pknum1 + pknum2 + pknum3;
						var otherSum = 0;
						for (var n = 0; n < len; n++) {
							// 计算另外的牌值和
							if (n != i && n != p && n != m) {
								var otherItem = pokerNumList[n];
								var num = otherItem.number;
								if (num > 10) {
									num = 10;
								}
								otherSum += num;
							}
						}
						var sumobj = new Object();
						sumobj.mainSum = mainSum;
						sumobj.otherSum = otherSum;
						sumList.push(sumobj);
					}
				}
			}
		}
		var maxDs = 0; // 0无牛,100牛牛,其他点数
		var sumLen = sumList.length;
		for (var i = 0; i < sumLen; i++) {
			var sumItemObj = sumList[i];
			var mainSum = sumItemObj.mainSum;
			var otherSum = sumItemObj.otherSum;
			if ((mainSum % 10) == 0) {
				var ds = otherSum % 10;
				if (ds == 0) {
					maxDs = 100;
					break;
				} else {
					if (ds > maxDs) {
						maxDs = ds;
					}
				}
			}
		}
		if (maxDs == 100) {
			return "牛牛";
		} else if (maxDs == 0) {
			return "无牛";
		} else {
			return "牛" + maxDs;
		}
	}

	function getPokerByNum(pokerNum) {
		var pokerObj = new Object();
		var num = pokerNum % 13;
		if (num == 0) {
			num = 13;
		}
		pokerObj.number = num;
		if (pokerNum <= 13) {
			pokerObj.design = "1";
		} else if (pokerNum >= 14 && pokerNum <= 26) {
			pokerObj.design = "2";
		} else if (pokerNum >= 27 && pokerNum <= 39) {
			pokerObj.design = "3";
		} else if (pokerNum >= 40 && pokerNum <= 52) {
			pokerObj.design = "4";
		} else if (pokerNum == 53) {
			pokerObj.design = "sKing";
		} else if (pokerNum == 54) {
			pokerObj.design = "bKing";
		}
		return pokerObj;
	}
}
function lotteryGame() {

	// 下注类型
	this.parsingBetOn = function (value, gameInfoId) {
		var result = "";
		if (gameInfoId == 1 || gameInfoId == 5 || gameInfoId == 11 ||
			gameInfoId == 13 || gameInfoId == 38 || gameInfoId == 52 || gameInfoId == 67) {
			switch (value) {
				case "BALL_1":
					result = "第一球";
					break;
				case "BALL_2":
					result = "第二球";
					break;
				case "BALL_3":
					result = "第三球";
					break;
				case "BALL_4":
					result = "第四球";
					break;
				case "BALL_5":
					result = "第五球";
					break;
				case "BALL_6":
					result = "第六球";
					break;
				case "BALL_7":
					result = "第七球";
					break;
				case "BALL_8":
					result = "第八球";
					break;
				case "ANYONE":
					result = "正码";
					break;
				case "TOTAL":
					result = "总和";
					break;
				case "D_T_T":
					result = "龙虎";
					break;
				case "SERIAL":
					result = "连码";
					break;
			}
		} else if (gameInfoId == 2 || gameInfoId == 6 || gameInfoId == 7 ||
			gameInfoId == 8 || gameInfoId == 9 || gameInfoId == 49 || gameInfoId == 51 || gameInfoId == 74 || gameInfoId == 66) {
			switch (value) {
				case "BALL_1":
					result = "第一球";
					break;
				case "BALL_2":
					result = "第二球";
					break;
				case "BALL_3":
					result = "第三球";
					break;
				case "BALL_4":
					result = "第四球";
					break;
				case "BALL_5":
					result = "第五球";
					break;
				case "BALL_6":
					result = "第六球";
					break;
				case "TOTAL":
					result = "总和";
					break;
				case "D_T_T":
					result = "龙虎和";
					break;
				case "FIRST3":
					result = "前三";
					break;
				case "MIDDLE3":
					result = "中三";
					break;
				case "LAST3":
					result = "后三";
					break;
				case "SERIAL":
					result = "连码";
					break;
				case "SPAN_FIRST3":
					result = "跨度前三";
					break;
				case "SPAN_MIDDLE3":
					result = "跨度中三";
					break;
				case "SPAN_LAST3":
					result = "跨度后三";
					break;
				case "SUM_OOXXX":
					result = "万千位和";
					break;
				case "SUM_OXOXX":
					result = "万百位和";
					break;
				case "SUM_OXXOX":
					result = "万十位和";
					break;
				case "SUM_OXXXO":
					result = "万个位和";
					break;
				case "SUM_XOOXX":
					result = "千佰位和";
					break;
				case "SUM_XOXOX":
					result = "千拾位和";
					break;
				case "SUM_XOXXO":
					result = "千个位和";
					break;
				case "SUM_XXOOX":
					result = "佰拾位和";
					break;
				case "SUM_XXOXO":
					result = "佰个位和";
					break;
				case "SUM_XXXOO":
					result = "拾个位和";
					break;
			}
		} else if (gameInfoId == 3 || gameInfoId == 17 || gameInfoId == 48 || gameInfoId == 50 || gameInfoId == 65 || gameInfoId == 73 || gameInfoId == 77) {
			switch (value) {
				case "BALL_1":
					result = "冠军";
					break;
				case "BALL_2":
					result = "亚军";
					break;
				case "BALL_3":
					result = "第三名";
					break;
				case "BALL_4":
					result = "第四名";
					break;
				case "BALL_5":
					result = "第五名";
					break;
				case "BALL_6":
					result = "第六名";
					break;
				case "BALL_7":
					result = "第七名";
					break;
				case "BALL_8":
					result = "第八名";
					break;
				case "BALL_9":
					result = "第九名";
					break;
				case "BALL_10":
					result = "第十名";
					break;
				case "GOLD_SILVER":
					result = "冠亚";
					break;
			}
		} else if (gameInfoId == 4 || gameInfoId == 14 || gameInfoId == 15 ||
			gameInfoId == 16 || gameInfoId == 54) {
			switch (value) {
				case "ANYONE":
					result = "三军";
					break;
				case "TRIPLE":
					result = "围骰";
					break;
				case "ANY_TRIPLE":
					result = "全骰";
					break;
				case "SPEC_TWO":
					result = "长牌";
					break;
				case "PAIR":
					result = "短牌";
					break;
				case "TOTAL_BIG_SMALL":
					result = "大小";
					break;
				case "TOTAL_NUMBER":
					result = "点数";
					break;
				case "TOTAL":
					result = "总和";
					break;
			}
		} else if (gameInfoId == 12) {
			switch (value) {
				case "BALL_1":
					result = "第一球";
					break;
				case "BALL_2":
					result = "第二球";
					break;
				case "BALL_3":
					result = "第三球";
					break;
				case "BALL_4":
					result = "第四球";
					break;
				case "BALL_5":
					result = "第五球";
					break;
				case "ANYONE":
					result = "正码";
					break;
				case "TOTAL":
					result = "总和";
					break;
				case "D_T_T":
					result = "龙虎";
					break;
			}
		} else if (gameInfoId == 10) {
			switch (value) {
				case "BALL_1":
					result = "第一球";
					break;
				case "BALL_2":
					result = "第二球";
					break;
				case "BALL_3":
					result = "第三球";
					break;
				case "D_T_T":
					result = "龙虎和";
					break;
				case "SERIAL":
					result = "连码";
					break;
				case "SPAN":
					result = "跨度";
					break;
				case "TOTAL":
					result = "总和";
					break;
				case "SUM_OOX":
					result = "佰拾位和";
					break;
				case "SUM_OXO":
					result = "佰个位和";
					break;
				case "SUM_XOO":
					result = "拾个位和";
					break;
			}
		} else if (gameInfoId == 18 || gameInfoId == 19 || gameInfoId == 20 ||
			gameInfoId == 21 || gameInfoId == 22 || gameInfoId == 23 ||
			gameInfoId == 24 || gameInfoId == 25 || gameInfoId == 26 ||
			gameInfoId == 53 || gameInfoId == 69) {
			switch (value) {
				case "BALL_1":
					result = "第一球";
					break;
				case "BALL_2":
					result = "第二球";
					break;
				case "BALL_3":
					result = "第三球";
					break;
				case "BALL_4":
					result = "第四球";
					break;
				case "BALL_5":
					result = "第五球";
					break;
				case "TOTAL":
					result = "总和";
					break;
				case "D_T_T":
					result = "龙虎和";
					break;
				case "ANYONE":
					result = "正码";
					break;
				case "SERIAL":
					result = "连码";
					break;
			}
		} else if (gameInfoId == 27 || gameInfoId == 28 || gameInfoId == 29 ||
			gameInfoId == 30 || gameInfoId == 31 || gameInfoId == 32 ||
			gameInfoId == 33 || gameInfoId == 34 || gameInfoId == 35 ||
			gameInfoId == 55 || gameInfoId == 71) {
			switch (value) {
				case "TOTAL":
					result = "总和";
					break;
				case "BEFORE_AFTER":
					result = "前后";
					break;
				case "ODD_EVEN":
					result = "单双";
					break;
				case "ANYONE":
					result = "正码";
					break;
			}
		} else if (gameInfoId == 36 || gameInfoId == 37 || gameInfoId == 56 || gameInfoId == 70) {
			switch (value) {
				case "BALL_1":
					result = "第一球";
					break;
				case "BALL_2":
					result = "第二球";
					break;
				case "BALL_3":
					result = "第三球";
					break;
				case "TOTAL":
					result = "总和";
					break;
				case "D_T_T":
					result = "龙虎和";
					break;
				case "ANYONE":
					result = "正码";
					break;
				case "SERIAL3":
					result = "连3";
					break;
				case "SPAN":
					result = "跨度";
					break;
				case "SUM_OOX":
					result = "佰拾和";
					break;
				case "SUM_OXO":
					result = "佰个和";
					break;
				case "SUM_XOO":
					result = "个拾和";
					break;
				case "TOTAL_TAIL":
					result = "总和尾";
					break;
				case "SERIAL":
					result = "连码";
					break;
				case "SUM_OOX_TAIL":
					result = "佰拾和尾";
					break;
				case "SUM_OXO_TAIL":
					result = "佰个和尾";
					break;
				case "SUM_XOO_TAIL":
					result = "个拾和尾";
					break;
			}
		} else if (gameInfoId == 39 || gameInfoId == 40 || gameInfoId == 41 ||
			gameInfoId == 42 || gameInfoId == 43 || gameInfoId == 44 ||
			gameInfoId == 45 || gameInfoId == 46 || gameInfoId == 47 ||
			gameInfoId == 57 || gameInfoId == 72) {
			switch (value) {
				case "TOTAL":
					result = "总和";
					break;
				case "SERIAL":
					result = "连码";
					break;
			}
		} else if (gameInfoId == 58 || gameInfoId == 75 || gameInfoId == 76) {
			switch (value) {
				case "TEMA_A":
					result = "特码A";
					break;
				case "TEMA_B":
					result = "特码B";
					break;
				case "ZHENGMA_A":
					result = "正码A";
					break;
				case "ZHENGMA_B":
					result = "正码B";
					break;
				case "ZHENGTE_1":
					result = "正1特";
					break;
				case "ZHENGTE_2":
					result = "正2特";
					break;
				case "ZHENGTE_3":
					result = "正3特";
					break;
				case "ZHENGTE_4":
					result = "正4特";
					break;
				case "ZHENGTE_5":
					result = "正5特";
					break;
				case "ZHENGTE_6":
					result = "正6特";
					break;
				case "SERIAL_3_3":
					result = "三全中";
					break;
				case "SERIAL_3_2_3":
					result = "三中二[中二]";
					break;
				case "SERIAL_3_2_3":
					result = "三中二[中三]";
					break;
				case "SERIAL_2_2":
					result = "二全中";
					break;
				case "SERIAL_2_TE":
					result = "二中特[中二]";
					break;
				case "SERIAL_2_TE_TE":
					result = "二中特[中特]";
					break;
				case "SERIAL_TE":
					result = "特串";
					break;
				case "GUOGUAN":
					result = "过关";
					break;
				case "SHENXIAO_TE":
					result = "特肖";
					break;
				case "TEMA_TOU":
					result = "特码头";
					break;
				case "TEMA_WEI":
					result = "特码尾";
					break;
				case "WUXING":
					result = "五行";
					break;
				case "BANBO":
					result = "半波";
					break;
				case "QIMA_ODD":
					result = "七码单";
					break;
				case "QIMA_EVEN":
					result = "七码双";
					break;
				case "QIMA_BIG":
					result = "七码大";
					break;
				case "QIMA_SMALL":
					result = "七码小";
					break;
				case "SHENXIAO6_2":
					result = "二肖";
					break;
				case "SHENXIAO6_3":
					result = "三肖";
					break;
				case "SHENXIAO6_4":
					result = "四肖";
					break;
				case "SHENXIAO6_5":
					result = "五肖";
					break;
				case "SHENXIAO6_6":
					result = "六肖";
					break;
				case "SHENXIAO_1_Y":
					result = "一肖中";
					break;
				case "SHENXIAO_1_N":
					result = "一肖不中";
					break;
				case "WEISHU_Y":
					result = "尾数中";
					break;
				case "WEISHU_N":
					result = "尾数不中";
					break;
				case "SHENXIAOLIAN_Y_2":
					result = "二肖连中";
					break;
				case "SHENXIAOLIAN_Y_3":
					result = "三肖连中";
					break;
				case "SHENXIAOLIAN_Y_4":
					result = "四肖连中";
					break;
				case "SHENXIAOLIAN_Y_5":
					result = "五肖连中";
					break;
				case "SHENXIAOLIAN_N_2":
					result = "二肖连不中";
					break;
				case "SHENXIAOLIAN_N_3":
					result = "三肖连不中";
					break;
				case "SHENXIAOLIAN_N_4":
					result = "四肖连不中";
					break;
				case "SHENXIAOLIAN_N_5":
					result = "五肖连不中";
					break;
				case "WEISHULIAN_Y_2":
					result = "二尾连中";
					break;
				case "WEISHULIAN_Y_3":
					result = "三尾连中";
					break;
				case "WEISHULIAN_Y_4":
					result = "四尾连中";
					break;
				case "WEISHULIAN_N_2":
					result = "二尾连不中";
					break;
				case "WEISHULIAN_N_3":
					result = "三尾连不中";
					break;
				case "WEISHULIAN_N_4":
					result = "四尾连不中";
					break;
				case "BUZHONG_5":
					result = "五不中";
					break;
				case "BUZHONG_6":
					result = "六不中";
					break;
				case "BUZHONG_7":
					result = "七不中";
					break;
				case "BUZHONG_8":
					result = "八不中";
					break;
				case "BUZHONG_9":
					result = "九不中";
					break;
				case "BUZHONG_10":
					result = "十不中";
					break;
				case "ZHONG1_5":
					result = "五选中一";
					break;
				case "ZHONG1_6":
					result = "六选中一";
					break;
				case "ZHONG1_7":
					result = "七选中一";
					break;
				case "ZHONG1_8":
					result = "八选中一";
					break;
				case "ZHONG1_9":
					result = "九选中一";
					break;
				case "ZHONG1_10":
					result = "十选中一";
					break;
				case "TEPING_1":
					result = "特平中一";
					break;
				case "TEPING_2":
					result = "特平中二";
					break;
				case "TEPING_3":
					result = "特平中三";
					break;
				case "TEPING_4":
					result = "特平中四";
					break;
				case "TEPING_5":
					result = "特平中五";
					break;
			}
		} else if (gameInfoId == 59 || gameInfoId == 60 || gameInfoId == 61 || gameInfoId == 62 || gameInfoId == 63 || gameInfoId == 68) {
			switch (value) {
				case "ANYONE":
					result = "三军";
					break;
				case "TRIPLE":
					result = "围骰";
					break;
				case "ANY_TRIPLE":
					result = "全骰";
					break;
				case "SPEC_TWO":
					result = "长牌";
					break;
				case "PAIR":
					result = "短牌";
					break;
				case "TOTAL":
					result = "大小、点数";
					break;
			}
		}
		return result;
	}

	// 下注类型详细
	this.parsingBetType = function (betType, betOn, gameInfoId) {
		var result = "";
		if (gameInfoId == 1 || gameInfoId == 5 || gameInfoId == 11 ||
			gameInfoId == 13 || gameInfoId == 38 || gameInfoId == 52 || gameInfoId == 67) {
			result = numChange(betType);
			switch (betType) {
				case "BIG":
					result = "大";
					break;
				case "SMALL":
					result = "小";
					break;
				case "ODD":
					result = "单";
					break;
				case "EVEN":
					result = "双";
					break;
				case "TAIL_BIG":
					result = "尾大";
					break;
				case "TAIL_SMALL":
					result = "尾小";
					break;
				case "SUM_ODD":
					result = "合单";
					break;
				case "SUM_EVEN":
					result = "合双";
					break;
				case "ZHONG":
					result = "中";
					break;
				case "FA":
					result = "发";
					break;
				case "BAI":
					result = "白";
					break;
				case "EAST":
					result = "东";
					break;
				case "SOUTH":
					result = "南";
					break;
				case "WEST":
					result = "西";
					break;
				case "NORTH":
					result = "北";
					break;
				case "DRAGON":
					result = "龙";
					break;
				case "TIGER":
					result = "虎";
					break;
				case "OPTIONAL_2":
					result = "任选二";
					break;
				case "OPTIONAL_2_GROUP_STR":
					result = "选二连直";
					break;
				case "GROUP_2":
					result = "选二连组";
					break;
				case "OPTIONAL_3":
					result = "任选三";
					break;
				case "OPTIONAL_FIRST3_STR":
					result = "选三前直";
					break;
				case "GROUP_FIRST3":
					result = "选三前组";
					break;
				case "OPTIONAL_4":
					result = "任选四";
					break;
				case "OPTIONAL_5":
					result = "任选五";
					break;
			}
		} else if (gameInfoId == 2 || gameInfoId == 6 || gameInfoId == 7 ||
			gameInfoId == 8 || gameInfoId == 9 || gameInfoId == 49 || gameInfoId == 51 || gameInfoId == 74 || gameInfoId == 66) {
			result = numChange(betType);
			switch (betType) {
				case "BIG":
					result = "大";
					break;
				case "SMALL":
					result = "小";
					break;
				case "ODD":
					result = "单";
					break;
				case "EVEN":
					result = "双";
					break;
				case "DRAGON":
					result = "龙";
					break;
				case "TIGER":
					result = "虎";
					break;
				case "TIE":
					result = "和";
					break;
				case "THREE_EQUAL":
					result = "豹子";
					break;
				case "THREE_STRAIGHT":
					result = "顺子";
					break;
				case "THREE_PAIR":
					result = "对子";
					break;
				case "THREE_HALF_STRAIGHT":
					result = "半顺";
					break;
				case "THREE_CHAOS":
					result = "杂六";
					break;
				case "ZHI":
					result = "质";
					break;
				case "HE":
					result = "和";
					break;
				case "COMBIN_1_FIRST3":
					result = "一字前三";
					break;
				case "COMBIN_1_MIDDLE3":
					result = "一字中三";
					break;
				case "COMBIN_1_LAST3":
					result = "一字后三";
					break;
				case "COMBIN_1_5":
					result = "全五";
					break;
				case "COMBIN_2_FIRST3":
					result = "二字前三";
					break;
				case "COMBIN_2_MIDDLE3":
					result = "二字中三";
					break;
				case "COMBIN_2_LAST3":
					result = "二字后三";
					break;
				case "COMBIN_3_FIRST3":
					result = "三字前三";
					break;
				case "COMBIN_3_MIDDLE3":
					result = "三字中三";
					break;
				case "COMBIN_3_LAST3":
					result = "三字后三";
					break;
				case "COMBIN_2_2_FIRST3":
					result = "二字前三对子";
					break;
				case "COMBIN_2_2_MIDDLE3":
					result = "二字中三对子";
					break;
				case "COMBIN_2_2_LAST3":
					result = "二字后三对子";
					break;
				case "COMBIN_3_2_FIRST3":
					result = "三字前三对子";
					break;
				case "COMBIN_3_2_MIDDLE3":
					result = "三字中三对子";
					break;
				case "COMBIN_3_2_LAST3":
					result = "三字后三对子";
					break;
				case "COMBIN_3_3_FIRST3":
					result = "三字前三豹子";
					break;
				case "COMBIN_3_3_MIDDLE3":
					result = "三字中三豹子";
					break;
				case "COMBIN_3_3_LAST3":
					result = "三字后三豹子";
					break;
				case "OOXXX":
					result = "二定位万千位";
					break;
				case "OXOXX":
					result = "二定位万佰位";
					break;
				case "OXXOX":
					result = "二定位万拾位";
					break;
				case "OXXXO":
					result = "二定位万个位";
					break;
				case "XOOXX":
					result = "二定位千佰位";
					break;
				case "XOXOX":
					result = "二定位千拾位";
					break;
				case "XOXXO":
					result = "二定位千个位";
					break;
				case "XXOOX":
					result = "二定位佰拾位";
					break;
				case "XXOXO":
					result = "二定位佰个位";
					break;
				case "XXXOO":
					result = "二定位拾个位";
					break;
				case "OOOXX":
					result = "三定位前三";
					break;
				case "XOOOX":
					result = "三定位中三";
					break;
				case "XXOOO":
					result = "三定位后三";
					break;
				case "GROUP3_FIRST3":
					result = "组选三前三";
					break;
				case "GROUP3_MIDDLE3":
					result = "组选三中三";
					break;
				case "GROUP3_LAST3":
					result = "组选三后三";
					break;
				case "GROUP6_FIRST3":
					result = "组选六前三";
					break;
				case "GROUP6_MIDDLE3":
					result = "组选六中三";
					break;
				case "GROUP6_LAST3":
					result = "组选六后三";
					break;
			}
		} else if (gameInfoId == 3 || gameInfoId == 17 || gameInfoId == 48 || gameInfoId == 50 || gameInfoId == 65 || gameInfoId == 73 || gameInfoId == 77) {
			result = numChange(betType);
			switch (betType) {
				case "BIG":
					result = "大";
					break;
				case "SMALL":
					result = "小";
					break;
				case "ODD":
					result = "单";
					break;
				case "EVEN":
					result = "双";
					break;
				case "DRAGON":
					result = "龙";
					break;
				case "TIGER":
					result = "虎";
					break;
				case "BIG_ODD":
					result = "大单";
					break;
				case "BIG_EVEN":
					result = "大双";
					break;
				case "SMALL_ODD":
					result = "小单";
					break;
				case "SMALL_EVEN":
					result = "小双";
					break;
			}
		} else if (gameInfoId == 4 || gameInfoId == 14 || gameInfoId == 15 ||
			gameInfoId == 16 || gameInfoId == 54 || gameInfoId == 59 || gameInfoId == 60 || gameInfoId == 61 || gameInfoId == 62 || gameInfoId == 63 || gameInfoId == 68) {
			result = numChange(betType);
			switch (betType) {
				case "BIG":
					result = "大";
					break;
				case "SMALL":
					result = "小";
					break;
				case "SPEC_1_2":
					result = "12";
					break;
				case "SPEC_1_3":
					result = "13";
					break;
				case "SPEC_1_4":
					result = "14";
					break;
				case "SPEC_1_5":
					result = "15";
					break;
				case "SPEC_1_6":
					result = "16";
					break;
				case "SPEC_2_3":
					result = "23";
					break;
				case "SPEC_2_4":
					result = "24";
					break;
				case "SPEC_2_5":
					result = "25";
					break;
				case "SPEC_2_6":
					result = "26";
					break;
				case "SPEC_3_4":
					result = "34";
					break;
				case "SPEC_3_5":
					result = "35";
					break;
				case "SPEC_3_6":
					result = "36";
					break;
				case "SPEC_4_5":
					result = "45";
					break;
				case "SPEC_4_6":
					result = "46";
					break;
				case "SPEC_5_6":
					result = "56";
					break;
			}
		} else if (gameInfoId == 12) {
			result = numChange(betType);
			switch (betType) {
				case "BIG":
					result = "大";
					break;
				case "SMALL":
					result = "小";
					break;
				case "ODD":
					result = "单";
					break;
				case "EVEN":
					result = "双";
					break;
				case "TAIL_BIG":
					result = "尾大";
					break;
				case "TAIL_SMALL":
					result = "尾小";
					break;
				case "SUM_ODD":
					result = "合单";
					break;
				case "SUM_EVEN":
					result = "合双";
					break;
				case "RED":
					result = "红";
					break;
				case "BLUE":
					result = "蓝";
					break;
				case "GREEN":
					result = "绿";
					break;
				case "CHUN":
					result = "春";
					break;
				case "XIA":
					result = "夏";
					break;
				case "QIU":
					result = "秋";
					break;
				case "DONG":
					result = "冬";
					break;
				case "DRAGON12":
					result = "龙(1-2)";
					break;
				case "DRAGON13":
					result = "龙(1-3)";
					break;
				case "DRAGON14":
					result = "龙(1-4)";
					break;
				case "DRAGON15":
					result = "龙(1-5)";
					break;
				case "DRAGON23":
					result = "龙(2-3)";
					break;
				case "DRAGON24":
					result = "龙(2-4)";
					break;
				case "DRAGON25":
					result = "龙(2-5)";
					break;
				case "DRAGON34":
					result = "龙(3-4)";
					break;
				case "DRAGON35":
					result = "龙(3-5)";
					break;
				case "DRAGON45":
					result = "龙(4-5)";
					break;
				case "TIGER12":
					result = "虎(1-2)";
					break;
				case "TIGER13":
					result = "虎(1-3)";
					break;
				case "TIGER14":
					result = "虎(1-4)";
					break;
				case "TIGER15":
					result = "虎(1-5)";
					break;
				case "TIGER23":
					result = "虎(2-3)";
					break;
				case "TIGER24":
					result = "虎(2-4)";
					break;
				case "TIGER25":
					result = "虎(2-5)";
					break;
				case "TIGER34":
					result = "虎(3-4)";
					break;
				case "TIGER35":
					result = "虎(3-5)";
					break;
				case "TIGER45":
					result = "虎(4-5)";
					break;
				case "TIGER":
					result = "虎";
					break;
				case "JIN":
					result = "金";
					break;
				case "MU":
					result = "木";
					break;
				case "SHUI":
					result = "水";
					break;
				case "HUO":
					result = "火";
					break;
				case "TU":
					result = "土";
					break;
			}
		} else if (gameInfoId == 10) {
			result = numChange(betType);
			switch (betType) {
				case "BIG":
					result = "大";
					break;
				case "SMALL":
					result = "小";
					break;
				case "ODD":
					result = "单";
					break;
				case "EVEN":
					result = "双";
					break;
				case "ZHI":
					result = "质";
					break;
				case "HE":
					result = "合";
					break;
				case "DRAGON":
					result = "龙";
					break;
				case "TIGER":
					result = "虎";
					break;
				case "TIE":
					result = "和";
					break;
				case "COMBIN_1":
					result = "一字";
					break;
				case "COMBIN_2":
					result = "二字";
					break;
				case "COMBIN_3":
					result = "三字";
					break;
				case "COMBIN_2_2":
					result = "二字组合对子";
					break;
				case "COMBIN_3_2":
					result = "三字对子";
					break;
				case "COMBIN_3_3":
					result = "三字豹子";
					break;
				case "OOX":
					result = "二定位佰拾位";
					break;
				case "OXO":
					result = "二定位佰个位";
					break;
				case "XOO":
					result = "二定位拾个位";
					break;
				case "OOO":
					result = "三定位";
					break;
				case "GROUP3":
					result = "组选3";
					break;
				case "GROUP6":
					result = "组选6";
					break;
				case "TAIL_BIG":
					result = "尾大";
					break;
				case "TAIL_SMALL":
					result = "尾小";
					break;
				case "TAIL_ZHI":
					result = "尾质";
					break;
				case "TAIL_HE":
					result = "尾合";
					break;
			}
		} else if (gameInfoId == 18 || gameInfoId == 19 || gameInfoId == 20 ||
			gameInfoId == 21 || gameInfoId == 22 || gameInfoId == 23 ||
			gameInfoId == 24 || gameInfoId == 25 || gameInfoId == 26 ||
			gameInfoId == 53 || gameInfoId == 69) {
			result = numChange(betType);
			switch (betType) {
				case "BIG":
					result = "大";
					break;
				case "SMALL":
					result = "小";
					break;
				case "ODD":
					result = "单";
					break;
				case "EVEN":
					result = "双";
					break;
				case "TAIL_BIG":
					result = "尾大";
					break;
				case "TAIL_SMALL":
					result = "尾小";
					break;
				case "OPTIONAL_2":
					result = "任选二中二";
					break;
				case "OPTIONAL_3":
					result = "任选三中三";
					break;
				case "OPTIONAL_4":
					result = "任选4中4";
					break;
				case "OPTIONAL_5":
					result = "任选5中5";
					break;
				case "OPTIONAL_6":
					result = "任选6中5";
					break;
				case "OPTIONAL_7":
					result = "任选7中5";
					break;
				case "OPTIONAL_8":
					result = "任选8中5";
					break;
				case "GROUP_2":
					result = "组选前二";
					break;
				case "GROUP_FIRST3":
					result = "组选前三";
					break;
				case "OPTIONAL_2_GROUP_STR":
					result = "直选前二";
					break;
				case "OPTIONAL_FIRST3_STR":
					result = "直选前三";
					break;
				case "DRAGON":
					result = "龙";
					break;
				case "TIGER":
					result = "虎";
					break;
				case "TIE":
					result = "和";
					break;
			}
		} else if (gameInfoId == 27 || gameInfoId == 28 || gameInfoId == 29 ||
			gameInfoId == 30 || gameInfoId == 31 || gameInfoId == 32 ||
			gameInfoId == 33 || gameInfoId == 34 || gameInfoId == 35 ||
			gameInfoId == 55 || gameInfoId == 71) {
			result = numChange(betType);
			switch (betType) {
				case "BIG":
					result = "大";
					break;
				case "SMALL":
					result = "小";
					break;
				case "ODD":
					result = "单";
					break;
				case "EVEN":
					result = "双";
					break;
				case "BEFORE_MORE":
					result = "前多";
					break;
				case "AFTER_MORE":
					result = "后多";
					break;
				case "BEFORE_AFTER_TIE":
					result = "前后和";
					break;
				case "ODD_MORE":
					result = "单和";
					break;
				case "EVEN_MORE":
					result = "双和";
					break;
				case "ODD_EVEN_TIE":
					result = "单双和";
					break;
				case "JIN":
					result = "金";
					break;
				case "MU":
					result = "木";
					break;
				case "SHUI":
					result = "水";
					break;
				case "HUO":
					result = "火";
					break;
				case "TU":
					result = "土";
					break;
				case "SUM_810":
					result = "810";
					break;
				case "BIG_ODD":
					result = "大单";
					break;
				case "BIG_EVEN":
					result = "大双";
					break;
				case "SMALL_ODD":
					result = "小单";
					break;
				case "SMALL_EVEN":
					result = "小双";
					break;
			}
		} else if (gameInfoId == 36 || gameInfoId == 37 || gameInfoId == 56 || gameInfoId == 70) {
			result = numChange(betType);
			switch (betType) {
				case "BIG":
					result = "大";
					break;
				case "SMALL":
					result = "小";
					break;
				case "ODD":
					result = "单";
					break;
				case "EVEN":
					result = "双";
					break;
				case "DRAGON":
					result = "龙";
					break;
				case "TIGER":
					result = "虎";
					break;
				case "TIE":
					result = "和";
					break;
				case "THREE_EQUAL":
					result = "豹子";
					break;
				case "THREE_STRAIGHT":
					result = "顺子";
					break;
				case "THREE_PAIR":
					result = "对子";
					break;
				case "THREE_HALF_STRAIGHT":
					result = "半顺";
					break;
				case "THREE_CHAOS":
					result = "杂六";
					break;
				case "ZHI":
					result = "质";
					break;
				case "HE":
					result = "合";
					break;
				case "TAIL_BIG":
					result = "尾大";
					break;
				case "TAIL_SMALL":
					result = "尾小";
					break;
				case "TAIL_ZHI":
					result = "尾质";
					break;
				case "TAIL_HE":
					result = "尾和";
					break;
				case "COMBIN_2":
					result = "二字";
					break;
				case "COMBIN_2_2":
					result = "二字组合对子";
					break;
				case "COMBIN_3_2":
					result = "三字组合对子";
					break;
				case "COMBIN_3_3":
					result = "三字组合豹子";
					break;
				case "OOX":
					result = "二定位佰拾位";
					break;
				case "OXO":
					result = "二定位佰个位";
					break;
				case "XOO":
					result = "二定位拾个位";
					break;
				case "OOO":
					result = "三定位";
					break;
				case "GROUP3_OPTION_5":
					result = "5位数组选3";
					break;
				case "GROUP3_OPTION_6":
					result = "6位数组选3";
					break;
				case "GROUP3_OPTION_7":
					result = "7位数组选3";
					break;
				case "GROUP3_OPTION_8":
					result = "8位数组选3";
					break;
				case "GROUP3_OPTION_9":
					result = "9位数组选3";
					break;
				case "GROUP3_OPTION_10":
					result = "10位数组选3";
					break;
				case "GROUP6_OPTION_4":
					result = "4位数组选6";
					break;
				case "GROUP6_OPTION_5":
					result = "5位数组选6";
					break;
				case "GROUP6_OPTION_6":
					result = "6位数组选6";
					break;
				case "GROUP6_OPTION_7":
					result = "7位数组选6";
					break;
				case "GROUP6_OPTION_8":
					result = "8位数组选6";
					break;
				case "COMBIN_COMPLEX":
					result = "复式组合";
					break;
				case "NO_0_4":
					result = "二定位和0~4";
					break;
				case "NO_14_18":
					result = "二定位和14~18";
					break;
				case "NO_0_6":
					result = "总和0~6";
					break;
				case "NO_21_27":
					result = "总和21~27";
					break;
			}
		} else if (gameInfoId == 39 || gameInfoId == 40 || gameInfoId == 41 ||
			gameInfoId == 42 || gameInfoId == 43 || gameInfoId == 44 ||
			gameInfoId == 45 || gameInfoId == 46 || gameInfoId == 47 ||
			gameInfoId == 57 || gameInfoId == 72) {
			result = numChange(betType);
			switch (betType) {
				case "BIG":
					result = "大";
					break;
				case "SMALL":
					result = "小";
					break;
				case "ODD":
					result = "单";
					break;
				case "EVEN":
					result = "双";
					break;
				case "MIN":
					result = "极小";
					break;
				case "MAX":
					result = "极大";
					break;
				case "BIG_ODD":
					result = "大单";
					break;
				case "BIG_EVEN":
					result = "大双";
					break;
				case "SMALL_ODD":
					result = "小单";
					break;
				case "SMALL_EVEN":
					result = "小双";
					break;
				case "GREEN":
					result = "绿";
					break;
				case "BLUE":
					result = "蓝";
					break;
				case "RED":
					result = "红";
					break;
				case "THREE_EQUAL":
					result = "豹子";
					break;
				case "GROUP_3_TE":
					result = "特码包三";
					break;
			}
		} else if (gameInfoId == 58 || gameInfoId == 75 || gameInfoId == 76) {
			if (betOn == "SHENXIAO_TE") {
				switch (betType) {
					case "SHU":
						result = "鼠";
						break;
					case "NIU":
						result = "牛";
						break;
					case "HU":
						result = "虎";
						break;
					case "LONG":
						result = "龙";
						break;
					case "SHE":
						result = "蛇";
						break;
					case "MA":
						result = "马";
						break;
					case "TU":
						result = "兔";
						break;
					case "YANG":
						result = "羊";
						break;
					case "HOU":
						result = "猴";
						break;
					case "JI":
						result = "鸡";
						break;
					case "GOU":
						result = "狗";
						break;
					case "ZHU":
						result = "猪";
						break;
				}
			} else if (betOn == "WUXING") {
				switch (betType) {
					case "JIN":
						result = "金";
						break;
					case "MU":
						result = "木";
						break;
					case "SHUI":
						result = "水";
						break;
					case "HUO":
						result = "火";
						break;
					case "TU":
						result = "土";
						break;
				}
			} else {
				result = numChange(betType);
				switch (betType) {
					case "ODD":
						result = "单";
						break;
					case "EVEN":
						result = "双";
						break;
					case "BIG":
						result = "大";
						break;
					case "SMALL":
						result = "小";
						break;
					case "SUM_ODD":
						result = "合单";
						break;
					case "SUM_EVEN":
						result = "合双";
						break;
					case "TAIL_BIG":
						result = "尾大";
						break;
					case "TAIL_SMALL":
						result = "尾小";
						break;
					case "RED":
						result = "红";
						break;
					case "GREEN":
						result = "绿";
						break;
					case "BLUE":
						result = "蓝";
						break;
					case "RED_ODD":
						result = "红单";
						break;
					case "NO_29":
						result = "红双";
						break;
					case "NO_30":
						result = "红大";
						break;
					case "NO_31":
						result = "红小";
						break;
					case "NO_32":
						result = "蓝单";
						break;
					case "NO_33":
						result = "蓝双";
						break;
					case "NO_34":
						result = "蓝大";
						break;
					case "NO_35":
						result = "蓝小";
						break;
					case "NO_36":
						result = "绿单";
						break;
					case "NO_37":
						result = "绿双";
						break;
					case "NO_38":
						result = "绿大";
						break;
					case "NO_39":
						result = "绿小";
						break;
					case "NO_40":
						result = "正1单";
						break;
					case "NO_41":
						result = "正2单";
						break;
					case "NO_42":
						result = "正3单";
						break;
					case "NO_43":
						result = "正4单";
						break;
					case "NO_44":
						result = "正5单";
						break;
					case "NO_45":
						result = "正6单";
						break;
					case "NO_40":
						result = "正1双";
						break;
					case "NO_41":
						result = "正2双";
						break;
					case "NO_42":
						result = "正3双";
						break;
					case "NO_43":
						result = "正4双";
						break;
					case "NO_44":
						result = "正5双";
						break;
					case "NO_45":
						result = "正6双";
						break;
					case "NO_40":
						result = "正1大";
						break;
					case "NO_41":
						result = "正2大";
						break;
					case "NO_42":
						result = "正3大";
						break;
					case "NO_43":
						result = "正4大";
						break;
					case "NO_44":
						result = "正5大";
						break;
					case "NO_45":
						result = "正6大";
						break;
					case "NO_40":
						result = "正1小";
						break;
					case "NO_41":
						result = "正2小";
						break;
					case "NO_42":
						result = "正3小";
						break;
					case "NO_43":
						result = "正4小";
						break;
					case "NO_44":
						result = "正5小";
						break;
					case "NO_45":
						result = "正6小";
						break;
					case "NO_40":
						result = "正1红";
						break;
					case "NO_41":
						result = "正2红";
						break;
					case "NO_42":
						result = "正3红";
						break;
					case "NO_43":
						result = "正4红";
						break;
					case "NO_44":
						result = "正5红";
						break;
					case "NO_45":
						result = "正6红";
						break;
					case "NO_40":
						result = "正1蓝";
						break;
					case "NO_41":
						result = "正2蓝";
						break;
					case "NO_42":
						result = "正3蓝";
						break;
					case "NO_43":
						result = "正4蓝";
						break;
					case "NO_44":
						result = "正5蓝";
						break;
					case "NO_45":
						result = "正6蓝";
						break;
					case "NO_40":
						result = "正1绿";
						break;
					case "NO_41":
						result = "正2绿";
						break;
					case "NO_42":
						result = "正3绿";
						break;
					case "NO_43":
						result = "正4绿";
						break;
					case "NO_44":
						result = "正5绿";
						break;
					case "NO_45":
						result = "正6绿";
						break;
				}
			}
		}
		return result;
	}

	// 游戏类型
	this.parsingGameInfoId = function (gameInfoId) {
		var value = "";
		switch (gameInfoId) {
			case 1:
				value = "广东快乐十分";
				break;
			case 2:
				value = "重庆时时彩";
				break;
			case 3:
				value = "北京赛车(PK10)";
				break;
			case 4:
				value = "江苏骰宝(快 3)";
			case 5:
				value = "幸运农场";
				break;
			case 6:
				value = "天津时时彩";
				break;
			case 7:
				value = "新疆时时彩";
				break;
			case 8:
				value = "江西时时彩";
				break;
			case 9:
				value = "云南时时彩";
				break;
			case 10:
				value = "上海时时彩";
				break;
			case 11:
				value = "天津快乐十分";
				break;
			case 12:
				value = "广西快乐十分";
				break;
			case 13:
				value = "湖南快乐十分";
				break;
			case 14:
				value = "安徽快 3";
				break;
			case 15:
				value = "广西快 3";
				break;
			case 16:
				value = "吉林快 3";
				break;
			case 17:
				value = "幸运飞艇";
				break;
			case 18:
				value = "广东 11 选 5";
				break;
			case 19:
				value = "江西 11 选 5";
				break;
			case 20:
				value = "山东 11 选 5";
				break;
			case 21:
				value = "北京 11 选 5";
				break;
			case 22:
				value = "上海 11 选 5";
				break;
			case 23:
				value = "辽宁 11 选 5";
				break;
			case 24:
				value = "湖北 11 选 5";
				break;
			case 25:
				value = "江苏 11 选 5";
				break;
			case 26:
				value = "安徽 11 选 5";
				break;
			case 27:
				value = "北京快乐 8";
				break;
			case 28:
				value = "澳洲快乐 8";
				break;
			case 29:
				value = "韩国快乐 8";
				break;
			case 30:
				value = "加拿大卑斯快乐 8";
				break;
			case 31:
				value = "加拿大西部快乐 8";
				break;
			case 32:
				value = "斯洛伐克快乐 8";
				break;
			case 33:
				value = "马耳他快乐 8";
				break;
			case 34:
				value = "台湾宾果";
				break;
			case 35:
				value = "东京快乐 8";
				break;
			case 36:
				value = "福彩 3D";
				break;
			case 37:
				value = "体彩 3D";
				break;
			case 38:
				value = "云南快乐十分";
				break;
			case 39:
				value = "北京快 8PC 蛋蛋";
				break;
			case 40:
				value = "澳洲快 8PC 蛋蛋";
				break;
			case 41:
				value = "韩国快 8PC 蛋蛋";
				break;
			case 42:
				value = "加拿大快 8PC 蛋蛋";
				break;
			case 43:
				value = "加拿大大西部快 8PC 蛋蛋";
				break;
			case 44:
				value = "斯洛伐克 PC 蛋蛋";
				break;
			case 45:
				value = "马耳他 PC 蛋蛋";
				break;
			case 46:
				value = "台湾宾果 PC 蛋蛋";
				break;
			case 47:
				value = "东京快乐 8PC 蛋蛋";
				break;
			case 48:
				value = "极速赛车";
				break;
			case 49:
				value = "极速时时彩";
				break;
			case 50:
				value = "一分赛车";
				break;
			case 51:
				value = "一分时时彩";
				break;
			case 52:
				value = "极速快乐十分";
				break;
			case 53:
				value = "极速十一选五";
				break;
			case 54:
				value = "极速快三";
				break;
			case 55:
				value = "极速快乐 8";
				break;
			case 56:
				value = "极速 3D";
				break;
			case 57:
				value = "极速 PC 蛋蛋";
				break;
			case 58:
				value = "极速六合彩";
				break;
			case 59:
				value = "北京快三";
				break;
			case 60:
				value = "上海快三";
				break;
			case 61:
				value = "湖北快三";
				break;
			case 62:
				value = "河北快三";
				break;
			case 63:
				value = "甘肃快三";
				break;
			case 65:
				value = "三分赛车";
				break;
			case 66:
				value = "三分时时彩";
				break;
			case 67:
				value = "三分快乐十分";
				break;
			case 68:
				value = "三分快三";
				break;
			case 69:
				value = "三分十一选五";
				break;
			case 70:
				value = "三分 3D";
				break;
			case 71:
				value = "三分快乐 8";
				break;
			case 72:
				value = "三分 PC 蛋蛋";
				break;
			case 73:
				value = "IG赛车";
				break;
			case 74:
				value = "IG时时彩";
				break;
			case 75:
				value = "IG六合彩";
				break;
			case 76:
				value = "十分六合彩";
				break;
			case 77:
				value = "IG飞艇";
				break;
		}
		return value;
	}

	function numChange(no) {
		var number = "";
		if (no.indexOf("NO") != -1) {
			var noList = no.split("_");
			var len = noList.length;
			number = noList[len - 1];
			return number + "号";
		}
		return "";
	}

}
function GmGame() {
	var layoutId;
	var layoutObj;
	var itemData; // itemData["betLives"];

	this.showInfo = function (id, item) {
		layoutId = id;
		layoutObj = $("#" + layoutId);
		itemData = item;
		var headDiv = "<div id=" + layoutId + "_head></div>";
		var listDiv = "<div id=" + layoutId + "_list></div>";
		layoutObj.css({
			"overflow-x": "hidden",
			"overflow-y": "auto"
		});
		layoutObj.html(headDiv + listDiv);
		bindHeadView();
		bindListView();
	}

	this.parsingKindId = parsingKindId;

	this.parsingRoomType = parsingRoomType;

	this.parsingBetLives = parsingBetLives;

	function bindHeadView() {
		var objHead = $("#" + layoutId + "_head");

		var entryDiv = "<div class=kyGameBetInfoEntryDiv>%content%</div>";
		var titleRootDiv = "<div class=kyGameBetInfoTitleRootDiv>%content%</div>";
		var betRootDiv = "<div class=kyGameBetInfoBetRootDiv>%content%</div>";

		var gameInfoDiv = "<div class=kyGameBetInfoGameInfoDiv>%content%</div>"
		var infoItemDiv = "<div class=kyGameBetInfoGameInfoItemDiv>%content%</div>";
		var infoItemStopDiv = "<div class=kyGameBetInfoGameInfoItemStopDiv>%content%</div>";
		var infoLeftDiv = "<div class=kyGameBetInfoGameInfoLeftDiv>%content%</div>";
		var infoRightDiv = "<div class=kyGameBetInfoGameInfoRightDiv>%content%</div>";

		// bind Item标题
		var gameName = itemData["gameName"];
		var nameDiv = "<div class=kyGameBetInfoTitleRootDiv_name>" + gameName + "</div>";

		var period = itemData["period"];
		if (period == null) {
			period = "";
		}
		var periodDiv = "<div class=kyGameBetInfoTitleRootDiv_period>" + period + "</div>";

		var date = itemData["date"];
		var dateDiv = "<div class=kyGameBetInfoTitleRootDiv_date>" + date + "</div>";
		titleRootDiv = titleRootDiv.replace("%content%", nameDiv + periodDiv + dateDiv);

		// bind Item游戏结果
		var gameid = itemData["gameid"];
		var gameidDiv = "<div class=kyGameBetInfoBetRootDiv_gameid>" + gameid + "</div>";

		var winloss = itemData["winloss"];
		var winlossDiv = "<div class=kyGameBetInfoBetRootDiv_winloss>" + winloss + "</div>";
		betRootDiv = betRootDiv.replace("%content%", gameidDiv + winlossDiv);

		entryDiv = entryDiv.replace("%content%", titleRootDiv + betRootDiv);

		// bind 游戏结果信息
		var betLiveObj = itemData["betLives"];
		var betdivs = "";
		var leftTxt = "";
		var rightTxt = "";

		var zuoNum = betLiveObj["zuoNum"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>桌子号:</font>");
		rightTxt = infoRightDiv.replace("%content%", zuoNum);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var payNum = betLiveObj["payNum"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>玩家座位号:</font>");
		rightTxt = infoRightDiv.replace("%content%", payNum);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var yxBet = betLiveObj["yxBet"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>有效下注:</font>");
		rightTxt = infoRightDiv.replace("%content%", yxBet);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var allBet = betLiveObj["allBet"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>总下注:</font>");
		rightTxt = infoRightDiv.replace("%content%", allBet);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var profit = betLiveObj["profit"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>盈利:</font>");
		rightTxt = infoRightDiv.replace("%content%", profit);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var revenue = betLiveObj["revenue"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>抽水:</font>");
		rightTxt = infoRightDiv.replace("%content%", revenue);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var gamestarttime = betLiveObj["gamestarttime"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>游戏开始时间:</font>");
		rightTxt = infoRightDiv.replace("%content%", gamestarttime);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var gameendtime = betLiveObj["gameendtime"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>游戏结束时间:</font>");
		rightTxt = infoRightDiv.replace("%content%", gameendtime);
		betdivs += infoItemStopDiv.replace("%content%", leftTxt + rightTxt);

		gameInfoDiv = gameInfoDiv.replace("%content%", betdivs);

		objHead.html(entryDiv + gameInfoDiv);

		setHeadStyle();
	}

	// justify-content的使用(弹性子元素在父容器中的位置)
	// justify-content属性
	// flex-start:从左到右排列
	// flex-end:从右到左排列
	// center:中间开始排列
	// space-between:平分
	// space-around:平分且两边占1/2
	// align-items属性:垂直方向的对齐方式
	function setHeadStyle() {
		// 根布局
		$(".kyGameBetInfoEntryDiv").css({
			"align-items": "center",
			"text-align": "center",
			"width": "auto",
			"height": "auto",
			"background": "#4c4c4c",
			"border-radius": "5px",
			"padding": "5px",
			"margin-left": "5px",
			"margin-right": "5px",
			"margin-top": "10px",
			"margin-bottom": "10px",
			"box-sizing": "border-box"
		});

		// 标题布局
		$(".kyGameBetInfoTitleRootDiv").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto"
		});
		$(".kyGameBetInfoTitleRootDiv_name").css({
			"text-align": "left",
			"width": "33.3%",
			"font-size": "10px"
		});
		$(".kyGameBetInfoTitleRootDiv_period").css({
			"text-align": "center",
			"width": "33.3%",
			"font-size": "10px"
		});
		$(".kyGameBetInfoTitleRootDiv_date").css({
			"text-align": "right",
			"width": "33.3%",
			"font-size": "10px"
		});

		// 结果布局
		$(".kyGameBetInfoBetRootDiv").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto",
			"margin-top": "5px",
			"box-sizing": "border-box"
		});
		$(".kyGameBetInfoBetRootDiv_gameid").css({
			"text-align": "center",
			"align-items": "center",
			"display": "flex",
			"justify-content": "center",
			"font-size": "12px",
			"background": "#2E2E2E",
			"padding-top": "2px",
			"padding-bottom": "2px",
			"width": "65%",
			"height": "auto"
		});
		$(".kyGameBetInfoBetRootDiv_winloss").css({
			"text-align": "center",
			"align-items": "center",
			"display": "flex",
			"justify-content": "center",
			"font-size": "12px",
			"background": "#2E2E2E",
			"padding-top": "2px",
			"padding-bottom": "2px",
			"width": "34%",
			"height": "auto"
		});

		// 游戏信息
		$(".kyGameBetInfoGameInfoDiv").css({
			"align-items": "center",
			"text-align": "center",
			"width": "100%",
			"height": "auto",
			"padding-left": "15px",
			"padding-right": "15px",
			"box-sizing": "border-box"
		});
		$(".kyGameBetInfoGameInfoItemDiv").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"margin-bottom": "10px",
			"width": "100%",
			"height": "auto"
		});
		$(".kyGameBetInfoGameInfoItemStopDiv").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto"
		});
		$(".kyGameBetInfoGameInfoLeftDiv").css({
			"text-align": "left",
			"width": "50%",
			"font-size": "12px"
		});
		$(".kyGameBetInfoGameInfoRightDiv").css({
			"text-align": "right",
			"width": "50%",
			"font-size": "12px"
		});
	}

	function bindListView() {
		var objList = $("#" + layoutId + "_list");

		var betLivesObj = itemData["betLives"];
		var cardList = betLivesObj["cardList"];
		var rootDiv = "<div class=kyGameCardListRootDiv>%content%</div>";
		var txtDiv = "<div class=kyGameCardListItemDiv>%content%</div>";
		var txtStopDiv = "<div class=kyGameCardListItemStopDiv>%content%</div>";
		var cLen = cardList.length;
		var ms = "";
		for (var i = 0; i < cLen; i++) {
			var value = cardList[i];
			if (i != cLen - 1) {
				ms += txtDiv.replace("%content%", "<font color=#B4B4B4>" + value + "</font>");
			} else {
				ms += txtStopDiv.replace("%content%", "<font color=#B4B4B4>" + value + "</font>");
			}
		}
		rootDiv = rootDiv.replace("%content%", ms);
		objList.html(rootDiv);

		setListStyle();
	}

	function setListStyle() {
		$(".kyGameCardListRootDiv").css({
			"align-items": "center",
			"text-align": "center",
			"width": "100%",
			"height": "auto",
			"padding-left": "15px",
			"padding-right": "15px",
			"padding-top": "10px",
			"padding-bottom": "10px",
			"margin-top": "10px",
			"background": "#222222",
			"box-sizing": "border-box"
		});
		$(".kyGameCardListItemDiv").css({
			"text-align": "left",
			"width": "100%",
			"font-size": "12px",
			"margin-bottom": "8px",
			"box-sizing": "border-box"
		});
		$(".kyGameCardListItemStopDiv").css({
			"text-align": "left",
			"width": "100%",
			"font-size": "12px",
			"box-sizing": "border-box"
		});
	}

	function parsingBetLives(item) {

		var resultObj = new Object();
		var dateUtil = new Date();
		var zuoNum = item["deskid"];
		zuoNum = "<font color=white>" + zuoNum + "</font>";
		resultObj["zuoNum"] = zuoNum; // 桌子号

		var payNum = item["seatid"];
		payNum = "<font color=white>" + payNum + "</font>";
		resultObj["payNum"] = payNum; // 玩家桌位号

		var yxBet = item["effectbet"];
		yxBet = "<font color=white>" + doubleValue(yxBet) + "</font>";
		resultObj["yxBet"] = yxBet; // 有效下注

		var allBet = item["totalbet"];
		allBet = "<font color=white>" + doubleValue(allBet) + "</font>";
		resultObj["allBet"] = allBet; // 总下注

		var profit = item["winlost"];
		var proColor = "white";
		if (profit > 0) {
			proColor = winFontColor;
		} else if (profit < 0) {
			proColor = lossFontColor;
		}
		profit = "<font color=" + proColor + ">" + doubleValue(profit) + "</font>";
		resultObj["profit"] = profit; // 盈利

		var revenue = item["fee"];
		revenue = "<font color=white>" + doubleValue(revenue) + "</font>";
		resultObj["revenue"] = revenue; // 抽水

		var gamestarttime = item["opentime"];
		dateUtil.setTime(gamestarttime);
		gamestarttime = "<font color=white>" + getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm:ss") + "</font>";
		resultObj["gamestarttime"] = gamestarttime; //游戏开始时间

		var gameendtime = item["endtime"];
		dateUtil.setTime(gameendtime);
		gameendtime = "<font color=white>" + getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm:ss") + "</font>";
		resultObj["gameendtime"] = gameendtime; // 游戏结束时间

		// 分析牌值
		var cardvalue = item["details"];
		var cardList;
		var kindid = parseInt(item["gameid"]);
		switch (kindid) {
			case 0:
				break;
			case 3008:
				cardList = parsingThreeCattle(cardvalue); //牛牛三合一1
				break;
			case 3002:
				cardList = parsingThreeCattle(cardvalue); //牛牛三合一1
				break;
			case 3001:
				cardList = parsingThreeCattle(cardvalue); //牛牛三合一1
				break;
			case 1001:
				cardList = parsingFriedGoldenFlower(cardvalue); //炸金花1
				break;
			case 23001:
				cardList = parsingPeopleFriedGoldenFlower(cardvalue); //百人炸金花1
				break;
			case 3003:
				cardList = parsingPeopleCattle(cardvalue); //百人牛牛1
				break;
			case 2006:
				cardList = parsingPeopleTexsas(cardvalue); //百人德州1
				break;
			case 9001:
				cardList = parsingFightingLandlords(cardvalue); //斗地主1
				break;
			case 9004:
				cardList = parsingFightingLandlords(cardvalue);//二人斗地主1
				break;
			case 24001:
				cardList = parsingBaccarat(cardvalue);//百家乐1
				break;
			case 22001:
				cardList = parsingDragonTiger(cardvalue);//百人龙虎1
				break;
			case 10103:
				cardList = parsingTwoPeopleMahjong(cardvalue);//二人麻将1
				break;
			case 10102:
				cardList = parsingOveturnHu(cardvalue);//推倒胡1
				break;
			case 10104:
				cardList = parsingLightGunHu(cardvalue); // 点炮胡1
				break;
			case 15003:
				cardList = parsingThreePublic(cardvalue);//三公1
				break;
			case 25001:
				cardList = parsingThirteenWater(cardvalue);//十三水1
				break;
			case 1002:
				cardList = parsingTopspeedFriedGoldenFlower(cardvalue);//快速炸金花1
				break;
			case 2001:
				cardList = parsingTexasPoker(cardvalue);//德州扑克1
				break;
			case 26001:
				cardList = parsingTwoEightBars(cardvalue);//二八杠1
				break;
		}
		resultObj["cardList"] = cardList; // 牌结果列表
		return resultObj;
	}

	// 解析GM游戏名
	function parsingKindId(gameid) {
		var newGameId = parseInt(gameid);
		var value = "";
		switch (newGameId) {
			case 0:
				value = "游戏大厅";
				break;
			case 1001:
				value = "炸金花";
				break;
			case 1002:
				value = "极速炸金花";
				break;
			case 2001:
				value = "德州扑克";
				break;
			case 2006:
				value = "百人德州";
				break;
			case 3001:
				value = "随机庄家牛牛";
				break;
			case 3002:
				value = "看牌抢庄牛牛";
				break;
			case 3003:
				value = "百人牛牛";
				break;
			case 3008:
				value = "通比牛牛";
				break;
			case 9001:
				value = "斗地主";
				break;
			case 9004:
				value = "二人斗地主";
				break;
			case 10104:
				value = "点炮胡";
				break;
			case 10102:
				value = "推倒胡";
				break;
			case 10103:
				value = "二人麻将";
				break;
			case 15003:
				value = "三公";
				break;
			case 22001:
				value = "百人龙虎";
				break;
			case 23001:
				value = "百人炸金花";
				break;
			case 24001:
				value = "百家乐";
				break;
			case 25001:
				value = "十三水";
				break;
			case 26001:
				value = "二八杠";
				break;
		}
		return value;
	}

	// 解析GM游戏名
	function parsingRoomType(gameid, roomid) {
		var newGameId = parseInt(gameid);
		var strRoomId = roomid.toString();
		var newRoomId = strRoomId.slice(strRoomId.length - 2);
		var value = "";
		if (newGameId != 3003) {
			if (newRoomId == "01") {
				value = "小资场";
			} else if (newRoomId == "02") {
				value = "老板场";
			} else if (newRoomId == "03") {
				value = "土豪场";
			} else if (newRoomId == "04") {
				value = "试玩场";
			} else if (newRoomId == "05") {
				value = "至尊场";
			} else if (newRoomId == "06") {
				value = "皇家场";
			}
		} else {
			if (newRoomId == "01") {
				value = "三倍场";
			} else if (newRoomId == "02") {
				value = "五倍场";
			} else if (newRoomId == "03") {
				value = "十倍场";
			} else if (newRoomId == "04") {
				value = "试玩场";
			}
		}
		return value;
	}

	// 通用解析牌值
	function parsingCommonPoker(pkMsg) {

		var Poker = pkMsg.split("");
		var len = Poker.length;
		var count = 0;
		var King = 0;
		var ms = "";
		for (var i = 0; i < len; i++) {
			if (Poker[i] == "[" || Poker[i] == "]") {
				continue;
			}
			if (count == 0) {
				if (Poker[i] == 1) {
					ms += "♦";
				} else if (Poker[i] == 2) {
					ms += "♣";
				} else if (Poker[i] == 3) {
					ms += "♥";
				} else if (Poker[i] == 4) {
					ms += "♠";
				} else if (Poker[i] == 5) {
					King = 1;
				};
				count = 1;
			} else {
				if (King == 0) {
					if (Poker[i] == "1") {
						ms += "A";
					} else if (Poker[i] == "A") {
						ms += "10";
					} else if (Poker[i] == "B") {
						ms += "J";
					} else if (Poker[i] == "C") {
						ms += "Q";
					} else if (Poker[i] == "D") {
						ms += "K";
					} else {
						ms += Poker[i];
					}
				} else {
					if (Poker[i] == "E") {
						ms += "小王";
					} else if (Poker[i] == "F") {
						ms += "大王";
					}
					King = 0;
				}
				count = 0;
			}

		}
		return ms;
	}

	//通用解析麻将
	function parsingMahjong(pkMsg) {
		var ms = "";
		if (pkMsg == "" || pkMsg[0] == "]") {
			ms = "";
			return ms;
		}
		if (pkMsg[0] == "[") {
			pkMsg = pkMsg.substr(1);
		}
		var pz = pkMsg.split("");
		var len = pz.length;

		for (var i = 0; i < len; i += 2) {
			if (pz[i] == "]") {
				break;
			}
			var b = pz[i] + pz[i + 1];
			switch (b) {
				case "01":
					ms += "一万";
					break;
				case "02":
					ms += "二万";
					break;
				case "03":
					ms += "三万";
					break;
				case "04":
					ms += "四万";
					break;
				case "05":
					ms += "五万";
					break;
				case "06":
					ms += "六万";
					break;
				case "07":
					ms += "七万";
					break;
				case "08":
					ms += "八万";
					break;
				case "09":
					ms += "九万";
					break;
				case "11":
					ms += "一筒";
					break;
				case "12":
					ms += "二筒";
					break;
				case "13":
					ms += "三筒";
					break;
				case "14":
					ms += "四筒";
					break;
				case "15":
					ms += "五筒";
					break;
				case "16":
					ms += "六筒";
					break;
				case "17":
					ms += "七筒";
					break;
				case "18":
					ms += "八筒";
					break;
				case "19":
					ms += "九筒";
					break;
				case "21":
					ms += "一条";
					break;
				case "22":
					ms += "二条";
					break;
				case "23":
					ms += "三条";
					break;
				case "24":
					ms += "四条";
					break;
				case "25":
					ms += "五条";
					break;
				case "26":
					ms += "六条";
					break;
				case "27":
					ms += "七条";
					break;
				case "28":
					ms += "八条";
					break;
				case "29":
					ms += "九条";
					break;
				case "31":
					ms += "东风";
					break;
				case "32":
					ms += "南风";
					break;
				case "33":
					ms += "西风";
					break;
				case "34":
					ms += "北风";
					break;
				case "35":
					ms += "红中";
					break;
				case "36":
					ms += "发财";
					break;
				case "37":
					ms += "白板";
					break;
				case "38":
					ms += "春";
					break;
				case "39":
					ms += "夏";
					break;
				case "34":
					ms += "秋";
					break;
				case "35":
					ms += "冬";
					break;
				case "36":
					ms += "梅";
					break;
				case "37":
					ms += "兰";
					break;
				case "38":
					ms += "竹";
					break;
				case "39":
					ms += "菊";
					break;
			}
		}

		return ms;
	}

	//德州扑克
	function parsingTexasPoker(msg) {
		try {
			var pzList = new Array();
			var newstatus;
			var publicPz = "  公共牌: " + parsingCommonPoker(msg[0].cardex);
			pzList.push(publicPz);
			for (var i = 0; i < msg.length; i++) {
				var status = JSON.parse(msg[i].cardstate);
				newstatus = "";
				if (status == 1) {
					newstatus = "(弃牌)";
				}
				if (i == 0) {
					var myPz = " 我的牌: " + parsingCommonPoker(msg[i].card) + newstatus;
					pzList.push(myPz);
				} else {
					var otherPz = msg[i].seat + "座玩家的牌: " + parsingCommonPoker(msg[i].card) + newstatus;
					pzList.push(otherPz);
				}
			}

			pzList.sort();
			return pzList;
		} catch (error) {
			console.log(error);
		}
	}

	//十三水
	function parsingThirteenWater(msg) {
		var pzList = new Array();
		for (var i = 0; i < msg.length; i++) {
			var len = msg[i].card.length;
			var allPz = msg[i].card.substr(1, len - 2);
			var top = parsingCommonPoker(allPz.substr(0, 6));
			var centre = parsingCommonPoker(allPz.substr(6, 10));
			var tail = parsingCommonPoker(allPz.substr(16, 25));
			if (i == 0) {
				var myPz = " 我的牌:<br>";
				myPz += "头墩: " + top + "<br>";
				myPz += "中墩: " + centre + "<br>";
				myPz += "尾墩: " + tail + "<br>";
				pzList.push(myPz);
			} else {
				var otherPz = msg[i].seat + "座玩家的牌:<br>";
				otherPz += "头墩: " + top + "<br>";
				otherPz += "中墩: " + centre + "<br>";
				otherPz += "尾墩: " + tail + "<br>";
				pzList.push(otherPz);
			}
		}
		pzList.sort();
		return pzList;
	}

	//极速炸金花
	function parsingTopspeedFriedGoldenFlower(msg) {
		var pzList = new Array();
		var winL = JSON.parse(msg[0].winlost);
		if (winL > 0) {
			winL = "我赢了!";
		} else {
			winL = "我输了!";
		}
		pzList.push(winL);
		var pz = "我的手牌: " + parsingCommonPoker(msg[0].card);
		pzList.push(pz);

		return pzList;

	}

	//三公
	function parsingThreePublic(msg) {
		var pzList = new Array();
		var banker;
		for (var i = 0; i < msg.length; i++) {
			var pz = parsingCommonPoker(msg[i].card);
			if (msg[i].banker == msg[i].usercode && i == 0) {
				banker = "  我是庄家!";
				pzList.push(banker);
			} else if (msg[i].banker == msg[i].usercode) {
				banker = "  " + msg[i].seat + "座的玩家是庄家!";
				pzList.push(banker);
			}
			if (i == 0) {
				var myPz = " 我的手牌: " + pz;
				pzList.push(myPz);
			} else {
				var otherPz = msg[i].seat + "座的玩家的手牌: " + pz;
				pzList.push(otherPz);
			}
		}
		pzList.sort();
		return pzList;

	}

	//二八杠
	function parsingTwoEightBars(msg) {
		try {
			var pzList = new Array();
			var Pz;
			var banker;

			for (var i = 0; i < msg.length; i++) {
				Pz = msg[i].card;
				if (msg[i].banker == msg[i].usercode && i == 0) {
					banker = "  我是庄家!";
					pzList.push(banker);
				} else if (msg[i].banker == msg[i].usercode) {
					banker = "  " + (i + 1) + "号玩家是庄家!";
					pzList.push(banker);
				}

				if (i == 0) {
					var myPz = " 我的手牌: " + parsingMahjong(Pz);
					pzList.push(myPz);
				} else {
					var otherPz = i + 1 + "号玩家的手牌: " + parsingMahjong(Pz);
					pzList.push(otherPz);
				}
			}
			pzList.sort();
		} catch (error) {
			console.log(error);
		}

		return pzList;
	}

	//点炮胡
	function parsingLightGunHu(msg) {
		try {

			var pzList = new Array();
			var Pz;
			for (var i = 0; i < msg.length; i++) {
				Pz = msg[i].card.split(",");
				if (parsingMahjong(Pz[4]) != "") {
					var winL;
					if (i == 0) {
						winL = "  我赢了!";
					} else {
						winL = " " + msg[i].seat + "号座赢了!";
					}
					pzList.push(winL);
				}
				if (i == 0) {
					var myAllPz = " 我的手牌: <br>" + parsingMahjong(Pz[0]) + "<br>";
					myAllPz += "吃牌区: " + parsingMahjong(Pz[1]) + "<br>";
					myAllPz += "碰牌区: " + parsingMahjong(Pz[2]) + "<br>";
					myAllPz += "杠牌区: " + parsingMahjong(Pz[3]) + "<br>";
					myAllPz += "种马区: " + parsingMahjong(Pz[4]) + "<br>";
					pzList.push(myAllPz);
				} else {
					var otherAllPz = msg[i].seat + "座玩家的手牌: <br>" + parsingMahjong(Pz[0]) + "<br>";
					otherAllPz += "吃牌区: " + parsingMahjong(Pz[1]) + "<br>";
					otherAllPz += "碰牌区: " + parsingMahjong(Pz[2]) + "<br>";
					otherAllPz += "杠牌区: " + parsingMahjong(Pz[3]) + "<br>";
					otherAllPz += "种马区: " + parsingMahjong(Pz[4]) + "<br>";

					pzList.push(otherAllPz);
				}
			}
			pzList.sort();
		} catch (error) {
			console.log(error);
		}

		return pzList;
	}

	//推倒胡
	function parsingOveturnHu(msg) {
		try {

			var pzList = new Array();
			var Pz;
			for (var i = 0; i < msg.length; i++) {
				Pz = msg[i].card.split(",");
				if (parsingMahjong(Pz[4]) != "") {
					var winL;
					if (i == 0) {
						winL = "  我赢了!";
					} else {
						winL = " " + msg[i].seat + "号座赢了!";
					}
					pzList.push(winL);
				}
				if (i == 0) {
					var myAllPz = " 我的手牌: <br>" + parsingMahjong(Pz[0]) + "<br>";
					myAllPz += "吃牌区: " + parsingMahjong(Pz[1]) + "<br>";
					myAllPz += "碰牌区: " + parsingMahjong(Pz[2]) + "<br>";
					myAllPz += "杠牌区: " + parsingMahjong(Pz[3]) + "<br>";
					myAllPz += "种马区: " + parsingMahjong(Pz[4]) + "<br>";
					pzList.push(myAllPz);
				} else {
					var otherAllPz = msg[i].seat + "座玩家的手牌: <br>" + parsingMahjong(Pz[0]) + "<br>";
					otherAllPz += "吃牌区: " + parsingMahjong(Pz[1]) + "<br>";
					otherAllPz += "碰牌区: " + parsingMahjong(Pz[2]) + "<br>";
					otherAllPz += "杠牌区: " + parsingMahjong(Pz[3]) + "<br>";
					otherAllPz += "种马区: " + parsingMahjong(Pz[4]) + "<br>";

					pzList.push(otherAllPz);
				}
			}
			pzList.sort();
		} catch (error) {
			console.log(error);
		}

		return pzList;
	}

	//二人麻将
	function parsingTwoPeopleMahjong(msg) {
		var pzList = new Array();
		var myPz = msg[0].card.split(",");
		var otherPz = msg[1].card.split(",");
		var myWinL = JSON.parse(msg[0].winlost);
		var otherWinL = JSON.parse(msg[1].winlost);
		if (myWinL > otherWinL) {
			var winL = "我赢了!";
		} else if (myWinL < otherWinL) {
			var winL = "对手赢了!";
		} else {
			var winL = "和局!";
		}
		pzList.push(winL);
		try {

			var myAllPz = "我的手牌: <br>" + parsingMahjong(myPz[0]) + "<br>";
			myAllPz += "吃牌区: " + parsingMahjong(myPz[1]) + "<br>";
			myAllPz += "碰牌区: " + parsingMahjong(myPz[2]) + "<br>";
			myAllPz += "杠牌区: " + parsingMahjong(myPz[3]) + "<br>";
			myAllPz += "种马区: " + parsingMahjong(myPz[4]) + "<br>";

			var otherAllPz = "对手手牌: <br>" + parsingMahjong(otherPz[0]) + "<br>";
			otherAllPz += "吃牌区: " + parsingMahjong(otherPz[1]) + "<br>";
			otherAllPz += "碰牌区: " + parsingMahjong(otherPz[2]) + "<br>";
			otherAllPz += "杠牌区: " + parsingMahjong(otherPz[3]) + "<br>";
			otherAllPz += "种马区: " + parsingMahjong(otherPz[4]) + "<br>";

			pzList.push(myAllPz);
			pzList.push(otherAllPz);
		} catch (error) {
			console.log(error);
		}

		return pzList;
	}

	//百人龙虎
	function parsingDragonTiger(msg) {
		var pzList = new Array();
		var winLost = "本局: 和!";
		var pz = msg[0].cardex.split(", ");
		var Dragon = "龙牌: " + parsingCommonPoker(pz[0]);
		var Tiger = "虎牌: " + parsingCommonPoker(pz[1]);
		if (pz[0].substr(2) > pz[1].substr(1)) {
			winLost = "本局: 龙赢!";
		} else if (pz[0].substr(2) < pz[1].substr(1)) {
			winLost = "本局: 虎赢!";
		}
		pzList.push(winLost);
		pzList.push(Dragon);
		pzList.push(Tiger);

		return pzList;
	}

	//百家乐
	function parsingBaccarat(msg) {
		try {

			var zj;
			var pzList = new Array();
			var pz = msg[0].cardex.split(", ");

			if (msg[0].banker != msg[0].usercode) {
				zj = "庄家System!";
			} else {
				zj = "我是庄家!";
			}
			var banker = "庄家: " + parsingCommonPoker(pz[0]);
			var ms = "闲家: " + parsingCommonPoker(pz[1]);

			pzList.push(zj);
			pzList.push(banker);
			pzList.push(ms);
		} catch (error) {
			console.log(error);
		}

		return pzList;
	}

	//斗地主
	function parsingFightingLandlords(msg) {
		var pzList = new Array();

		try {
			var ist = true;
			for (var i = 0; i < msg.length; i++) {
				if (msg[i].banker == msg[i].usercode && ist) {

					var winU;
					var winL = JSON.parse(msg[i].winlost);

					var Landlords = " 地主牌:" + parsingCommonPoker(msg[i].cardex);
					var banker = " " + msg[i].seat + "座的玩家是庄家!";
					var ms = msg[i].seat + "座的地主手牌<br>" + parsingCommonPoker(msg[i].card);
					if (winL > 0) {
						winU = " 地主胜利!<hr>";
					} else {
						winU = " 农民胜利!<hr>";
					}
					i = -1;
					ist = false;

					pzList.push(banker);
					pzList.push(winU);
					pzList.push(Landlords);
					pzList.push(ms);
				} else if (!ist && msg[i].banker != msg[i].usercode) {
					var ms = msg[i].seat + "座的农民手牌<br>" + parsingCommonPoker(msg[i].card);
					pzList.push(ms);
				}
			}
		} catch (error) {
			console.log(error);
		}
		return pzList;
	}

	//百人德州
	function parsingPeopleTexsas(msg) {
		var pzList = new Array();
		var banker = msg[0].cardex.split(", ");

		var allPz = " 公共牌：" + parsingCommonPoker(banker[2])
		pzList.push(allPz);

		var pzRed = " 红方：" + parsingCommonPoker(banker[0]);
		pzList.push(pzRed);

		var pzBlack = " 蓝方：" + parsingCommonPoker(banker[1]);
		pzList.push(pzBlack);

		return pzList;
	}

	//百人炸金花
	function parsingPeopleFriedGoldenFlower(msg) {
		var pzList = new Array();
		var banker = "";
		var pzBlack;
		var pzRed;
		var pz = msg[0].cardex.split(", ");
		if (msg[0].banker != msg[0].usercode) {
			banker = " 我是庄家!";
		} else {
			banker = " 庄家System!";
		}
		pzList.push(banker);

		pzBlack = " 黑方手牌" + parsingCommonPoker(pz[0]);
		pzRed = " 红方手牌" + parsingCommonPoker(pz[1]);
		pzList.push(pzBlack);
		pzList.push(pzRed);

		return pzList;

	}

	//三牛和一
	function parsingThreeCattle(msg) {
		var rzList = new Array();
		try {
			for (var i = 0; i < msg.length; i++) {
				var banker;
				var qPz = "";

				if (msg[i].banker == msg[i].usercode && i == 0) {
					banker = "  我是庄家!";
					rzList.push(banker);
				} else if (msg[i].banker == msg[i].usercode) {
					banker = " " + msg[i].seat + "座的玩家是庄家!";
					rzList.push(banker);
				}

				if (msg[i].cardstate[0] == 1) {
					qPz = "(弃牌)";
				}
				if (i == 0) {
					var ms = " 我的手牌: " + parsingCommonPoker(msg[i].card) + qPz;
				} else {
					var ms = msg[i].seat + "座的玩家手牌: " + parsingCommonPoker(msg[i].card) + qPz;
				}

				rzList.push(ms);
			}
		} catch (error) {
			console.log(error);
		}
		rzList.sort();
		return rzList;
	}

	//百人牛牛
	function parsingPeopleCattle(msg) {
		var pzList = new Array();
		var banker = msg[0].cardex.split(", ");
		// var winL = JSON.parse(msg[0].winlost);
		// var bet = JSON.parse(msg[0].allbet);
		if (msg[0].banker == msg[0].usercode) {
			var newBanker = "我是庄家: " + parsingCommonPoker(banker[0]);
			// winL = "闲1: " + bet[0] + " 闲2: " + bet[1] + " 闲3: " + bet[2] + " 闲4: " + bet[3];

		} else {
			var newBanker = "庄家System: " + parsingCommonPoker(banker[0]);
			// bet = "下注闲1: " + bet[0] + "  下注闲2: " + bet[1] + " 下注闲3: " + bet[2] + " 下注闲4: " + bet[3];
			// winL = "闲1: " + winL[0] + " 闲2: " + winL[1] + " 闲3: " + winL[2] + " 闲4: " + winL[3];
		}
		pzList.push(newBanker);
		// pzList.push(bet);
		// pzList.push(winL);
		for (var i = 1; i < banker.length; i++) {
			var ms = "闲家" + i + ": " + parsingCommonPoker(banker[i]);
			pzList.push(ms);
		}
		return pzList;
	}

	// 炸金花
	function parsingFriedGoldenFlower(msg) {
		var rzList = new Array();

		for (var i = 0; i < msg.length; i++) {
			var zjWei;
			var qPz = "";
			if (msg[i].cardstate[0] == 1) {
				qPz = "(弃牌)";
			}
			if (i == 0 && msg[i].banker == msg[i].usercode) {
				zjWei = " 我是庄家!";
				rzList.push(zjWei);
			} else if (msg[i].banker == msg[i].usercode) {
				zjWei = " " + msg[i].seat + "座的玩家是庄家!";
				rzList.push(zjWei);
			}
			if (i == 0) {
				var ms = " 我的手牌: " + parsingCommonPoker(msg[i].card) + qPz;
			} else {
				var ms = msg[i].seat + "座的玩家手牌: " + parsingCommonPoker(msg[i].card) + qPz;
			}
			rzList.push(ms);
			rzList.sort();
		}
		return rzList;
	}
}
function kyGame() {
	var layoutId;
	var layoutObj;
	var itemData; // itemData["betLives"];

	this.showInfo = function (id, item) {
		layoutId = id;
		layoutObj = $("#" + layoutId);
		itemData = item;
		var headDiv = "<div id=" + layoutId + "_head></div>";
		var listDiv = "<div id=" + layoutId + "_list></div>";
		layoutObj.css({
			"overflow-x": "hidden",
			"overflow-y": "auto"
		});
		layoutObj.html(headDiv + listDiv);
		bindHeadView();
		bindListView();
	}

	this.parsingKindId = parsingKindId;

	this.parsingRoomType = parsingRoomType;

	this.parsingBetLives = parsingBetLives;

	function bindHeadView() {
		var objHead = $("#" + layoutId + "_head");

		var entryDiv = "<div class=kyGameBetInfoEntryDiv>%content%</div>";
		var titleRootDiv = "<div class=kyGameBetInfoTitleRootDiv>%content%</div>";
		var betRootDiv = "<div class=kyGameBetInfoBetRootDiv>%content%</div>";

		var gameInfoDiv = "<div class=kyGameBetInfoGameInfoDiv>%content%</div>"
		var infoItemDiv = "<div class=kyGameBetInfoGameInfoItemDiv>%content%</div>";
		var infoItemStopDiv = "<div class=kyGameBetInfoGameInfoItemStopDiv>%content%</div>";
		var infoLeftDiv = "<div class=kyGameBetInfoGameInfoLeftDiv>%content%</div>";
		var infoRightDiv = "<div class=kyGameBetInfoGameInfoRightDiv>%content%</div>";

		// bind Item标题
		var gameName = itemData["gameName"];
		var nameDiv = "<div class=kyGameBetInfoTitleRootDiv_name>" + gameName + "</div>";

		var period = itemData["period"];
		if (period == null) {
			period = "";
		}
		var periodDiv = "<div class=kyGameBetInfoTitleRootDiv_period>" + period + "</div>";

		var date = itemData["date"];
		var dateDiv = "<div class=kyGameBetInfoTitleRootDiv_date>" + date + "</div>";
		titleRootDiv = titleRootDiv.replace("%content%", nameDiv + periodDiv + dateDiv);

		// bind Item游戏结果
		var gameid = itemData["gameid"];
		var gameidDiv = "<div class=kyGameBetInfoBetRootDiv_gameid>" + gameid + "</div>";

		var winloss = itemData["winloss"];
		var winlossDiv = "<div class=kyGameBetInfoBetRootDiv_winloss>" + winloss + "</div>";
		betRootDiv = betRootDiv.replace("%content%", gameidDiv + winlossDiv);

		entryDiv = entryDiv.replace("%content%", titleRootDiv + betRootDiv);

		// bind 游戏结果信息
		var betLiveObj = itemData["betLives"];
		var betdivs = "";
		var leftTxt = "";
		var rightTxt = "";

		var zuoNum = betLiveObj["zuoNum"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>桌子号:</font>");
		rightTxt = infoRightDiv.replace("%content%", zuoNum);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var payNum = betLiveObj["payNum"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>玩家座位号:</font>");
		rightTxt = infoRightDiv.replace("%content%", payNum);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var paycount = betLiveObj["paycount"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>玩家数量:</font>");
		rightTxt = infoRightDiv.replace("%content%", paycount);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var yxBet = betLiveObj["yxBet"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>有效下注:</font>");
		rightTxt = infoRightDiv.replace("%content%", yxBet);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var allBet = betLiveObj["allBet"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>总下注:</font>");
		rightTxt = infoRightDiv.replace("%content%", allBet);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var profit = betLiveObj["profit"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>盈利:</font>");
		rightTxt = infoRightDiv.replace("%content%", profit);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var revenue = betLiveObj["revenue"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>抽水:</font>");
		rightTxt = infoRightDiv.replace("%content%", revenue);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var gamestarttime = betLiveObj["gamestarttime"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>游戏开始时间:</font>");
		rightTxt = infoRightDiv.replace("%content%", gamestarttime);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var gameendtime = betLiveObj["gameendtime"];
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>游戏结束时间:</font>");
		rightTxt = infoRightDiv.replace("%content%", gameendtime);
		betdivs += infoItemStopDiv.replace("%content%", leftTxt + rightTxt);

		gameInfoDiv = gameInfoDiv.replace("%content%", betdivs);

		objHead.html(entryDiv + gameInfoDiv);

		setHeadStyle();
	}

	// justify-content的使用(弹性子元素在父容器中的位置)
	// justify-content属性
	// flex-start:从左到右排列
	// flex-end:从右到左排列
	// center:中间开始排列
	// space-between:平分
	// space-around:平分且两边占1/2
	// align-items属性:垂直方向的对齐方式
	function setHeadStyle() {
		// 根布局
		$(".kyGameBetInfoEntryDiv").css({
			"align-items": "center",
			"text-align": "center",
			"width": "auto",
			"height": "auto",
			"background": "#4c4c4c",
			"border-radius": "5px",
			"padding": "5px",
			"margin-left": "5px",
			"margin-right": "5px",
			"margin-top": "10px",
			"margin-bottom": "10px",
			"box-sizing": "border-box"
		});

		// 标题布局
		$(".kyGameBetInfoTitleRootDiv").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto"
		});
		$(".kyGameBetInfoTitleRootDiv_name").css({
			"text-align": "left",
			"width": "33.3%",
			"font-size": "10px"
		});
		$(".kyGameBetInfoTitleRootDiv_period").css({
			"text-align": "center",
			"width": "33.3%",
			"font-size": "10px"
		});
		$(".kyGameBetInfoTitleRootDiv_date").css({
			"text-align": "right",
			"width": "33.3%",
			"font-size": "10px"
		});

		// 结果布局
		$(".kyGameBetInfoBetRootDiv").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto",
			"margin-top": "5px",
			"box-sizing": "border-box"
		});
		$(".kyGameBetInfoBetRootDiv_gameid").css({
			"text-align": "center",
			"align-items": "center",
			"display": "flex",
			"justify-content": "center",
			"font-size": "12px",
			"background": "#2E2E2E",
			"padding-top": "2px",
			"padding-bottom": "2px",
			"width": "65%",
			"height": "auto"
		});
		$(".kyGameBetInfoBetRootDiv_winloss").css({
			"text-align": "center",
			"align-items": "center",
			"display": "flex",
			"justify-content": "center",
			"font-size": "12px",
			"background": "#2E2E2E",
			"padding-top": "2px",
			"padding-bottom": "2px",
			"width": "34%",
			"height": "auto"
		});

		// 游戏信息
		$(".kyGameBetInfoGameInfoDiv").css({
			"align-items": "center",
			"text-align": "center",
			"width": "100%",
			"height": "auto",
			"padding-left": "15px",
			"padding-right": "15px",
			"box-sizing": "border-box"
		});
		$(".kyGameBetInfoGameInfoItemDiv").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"margin-bottom": "10px",
			"width": "100%",
			"height": "auto"
		});
		$(".kyGameBetInfoGameInfoItemStopDiv").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto"
		});
		$(".kyGameBetInfoGameInfoLeftDiv").css({
			"text-align": "left",
			"width": "50%",
			"font-size": "12px"
		});
		$(".kyGameBetInfoGameInfoRightDiv").css({
			"text-align": "right",
			"width": "50%",
			"font-size": "12px"
		});
	}

	function bindListView() {
		var objList = $("#" + layoutId + "_list");

		var betLivesObj = itemData["betLives"];
		var cardList = betLivesObj["cardList"];
		var rootDiv = "<div class=kyGameCardListRootDiv>%content%</div>";
		var txtDiv = "<div class=kyGameCardListItemDiv>%content%</div>";
		var txtStopDiv = "<div class=kyGameCardListItemStopDiv>%content%</div>";
		var cLen = cardList.length;
		var ms = "";
		for (var i = 0; i < cLen; i++) {
			var value = cardList[i];
			if (i != cLen - 1) {
				ms += txtDiv.replace("%content%", "<font color=#B4B4B4>" + value + "</font>");
			} else {
				ms += txtStopDiv.replace("%content%", "<font color=#B4B4B4>" + value + "</font>");
			}
		}
		rootDiv = rootDiv.replace("%content%", ms);
		objList.html(rootDiv);

		setListStyle();
	}

	function setListStyle() {
		$(".kyGameCardListRootDiv").css({
			"align-items": "center",
			"text-align": "center",
			"width": "100%",
			"height": "auto",
			"padding-left": "15px",
			"padding-right": "15px",
			"padding-top": "10px",
			"padding-bottom": "10px",
			"margin-top": "10px",
			"background": "#222222",
			"box-sizing": "border-box"
		});
		$(".kyGameCardListItemDiv").css({
			"text-align": "left",
			"width": "100%",
			"font-size": "12px",
			"margin-bottom": "8px",
			"box-sizing": "border-box"
		});
		$(".kyGameCardListItemStopDiv").css({
			"text-align": "left",
			"width": "100%",
			"font-size": "12px",
			"box-sizing": "border-box"
		});
	}

	function parsingBetLives(item) {
		var resultObj = new Object();
		var dateUtil = new Date();
		var zuoNum = item["tableid"];
		zuoNum = "<font color=white>" + zuoNum + "</font>";
		resultObj["zuoNum"] = zuoNum; // 桌子号

		var payNum = item["chairid"];
		payNum = "<font color=white>" + payNum + "</font>";
		resultObj["payNum"] = payNum; // 玩家桌位号

		var paycount = item["usercount"];
		paycount = "<font color=white>" + paycount + "</font>";
		resultObj["paycount"] = paycount; // 玩家数量

		var yxBet = item["cellscore"];
		yxBet = "<font color=white>" + doubleValue(yxBet) + "</font>";
		resultObj["yxBet"] = yxBet; // 有效下注

		var allBet = item["allbet"];
		allBet = "<font color=white>" + doubleValue(allBet) + "</font>";
		resultObj["allBet"] = allBet; // 总下注

		var profit = doubleValue(item["profit"]);
		if (profit > 0) {
			profit = "<font color=" + winFontColor + ">+" + profit + "</font>";
		} else {
			profit = "<font color=" + lossFontColor + ">" + profit + "</font>";
		}
		resultObj["profit"] = profit; // 盈利

		var revenue = item["revenue"];
		revenue = "<font color=white>" + doubleValue(revenue) + "</font>";
		resultObj["revenue"] = revenue; // 抽水

		var gamestarttime = item["gamestarttime"];
		dateUtil.setTime(gamestarttime);
		gamestarttime = "<font color=white>" + getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm") + "</font>";
		resultObj["gamestarttime"] = gamestarttime; //游戏开始时间

		var gameendtime = item["gameendtime"];
		dateUtil.setTime(gameendtime);
		gameendtime = "<font color=white>" + getTimeZoneE8(timeZone, dateUtil).format("yyyy-MM-dd hh:mm") + "</font>";
		resultObj["gameendtime"] = gameendtime; // 游戏结束时间

		// 分析牌值
		var cardvalue = item["cardvalue"];
		var cardList;
		var kindid = item["kindid"];
		switch (kindid) {
			case 0:
				break;
			case 620:
				cardList = parsingTexasPoker(cardvalue);
				break;
			case 720:
				cardList = parsingErqi(cardvalue);
				break;
			case 830:
				cardList = parsingRobZhuangNiuniu(cardvalue);
				break;
			case 220:
				cardList = parsingFriedGoldenFlower(cardvalue);
				break;
			case 860:
				cardList = parsingThreeFairs(cardvalue);
				break;
			case 900:
				cardList = parsingAndTigerZhuang(cardvalue);
				break;
			case 600:
				cardList = parsingTwPoints(cardvalue);
				break;
			case 870:
				cardList = parsingTbNiuniu(cardvalue);
				break;
			case 880:
				cardList = parsingHappyRedEnvelope(cardvalue);
				break;
			case 230:
				cardList = parsingFastFriedGoldenFlower(cardvalue);
				break;
			case 730:
				cardList = parsingGrabCard(cardvalue);
				break;
			case 630:
				cardList = parsingThirteenWater(cardvalue);
				break;
			case 380:
				cardList = parsingLuckyFive(cardvalue);
				break;
			case 610:
				cardList = parsingLandlord(cardvalue);
				break;
			case 390:
				cardList = parsingShootingGantry(cardvalue);
				break;
			case 910:
				cardList = parsingBaccarat(cardvalue);
				break;
			case 930:
				cardList = hundredCowGameInfo(cardvalue);
				break;
			case 920:
				cardList = forestPartyGameInfo(cardvalue);
				break;
		}
		resultObj["cardList"] = cardList; // 牌结果列表
		return resultObj;
	}

	// 通用解析KY游戏名
	function parsingKindId(id) {
		var value = "";
		switch (id) {
			case 0:
				value = "大厅";
				break;
			case 620:
				value = "德州扑克";
				break;
			case 720:
				value = "二八杠";
				break;
			case 830:
				value = "抢庄牛牛";
				break;
			case 220:
				value = "炸金花";
				break;
			case 860:
				value = "三公";
				break;
			case 900:
				value = "押庄龙虎";
				break;
			case 600:
				value = "21 点";
				break;
			case 870:
				value = "通比牛牛";
				break;
			case 880:
				value = "欢乐红包";
				break;
			case 230:
				value = "极速炸金花";
				break;
			case 730:
				value = "抢庄牌九";
				break;
			case 630:
				value = "十三水";
				break;
			case 380:
				value = "幸运五张";
				break;
			case 610:
				value = "斗地主";
				break;
			case 390:
				value = "射龙门";
				break;
			case 910:
				value = "百家乐";
				break;
			case 920:
				value = "森林舞会";
				break;
			case 930:
				value = "百人牛牛";
				break;
		}
		return value;
	}

	// 通用解析游戏房间类型名称
	function parsingRoomType(kindId, serviceId) {
		var value = "";
		if (kindId == 620) {
			switch (serviceId) {
				case 3600:
					value = "新手房";
					break;
				case 3601:
					value = "初级房";
					break;
				case 3602:
					value = "中级房";
					break;
				case 3603:
					value = "高级房";
					break;
				case 3700:
					value = "财大气粗房";
					break;
				case 3701:
					value = "腰缠万贯房";
					break;
				case 3702:
					value = "挥金如土房";
					break;
				case 3703:
					value = "富贵逼人房";
					break;
			}
		} else if (kindId == 720) {
			switch (serviceId) {
				case 7201:
					value = "体验房";
					break;
				case 7202:
					value = "初级房";
					break;
				case 7203:
					value = "中级房";
					break;
				case 7204:
					value = "高级房";
					break;
				case 7205:
					value = "至尊房";
					break;
			}
		} else if (kindId == 830) {
			switch (serviceId) {
				case 8301:
					value = "体验房";
					break;
				case 8302:
					value = "初级房";
					break;
				case 8303:
					value = "中级房";
					break;
				case 8304:
					value = "高级房";
					break;
				case 8305:
					value = "至尊房";
					break;
				case 8306:
					value = "王者房";
					break;
			}
		} else if (kindId == 220) {
			switch (serviceId) {
				case 2201:
					value = "体验房";
					break;
				case 2202:
					value = "初级房";
					break;
				case 2203:
					value = "中级房";
					break;
				case 2204:
					value = "高级房";
					break;
			}
		} else if (kindId == 860) {
			switch (serviceId) {
				case 8601:
					value = "体验房";
					break;
				case 8602:
					value = "初级房";
					break;
				case 8603:
					value = "中级房";
					break;
				case 8604:
					value = "高级房";
					break;
				case 8605:
					value = "至尊房";
					break;
			}
		} else if (kindId == 900) {
			switch (serviceId) {
				case 9001:
					value = "体验房";
					break;
				case 9002:
					value = "初级房";
					break;
				case 9003:
					value = "中级房";
					break;
				case 9004:
					value = "高级房";
					break;
			}
		} else if (kindId == 600) {
			switch (serviceId) {
				case 6001:
					value = "体验房";
					break;
				case 6002:
					value = "初级房";
					break;
				case 6003:
					value = "中级房";
					break;
				case 6004:
					value = "高级房";
					break;
			}
		} else if (kindId == 870) {
			switch (serviceId) {
				case 8701:
					value = "体验房";
					break;
				case 8702:
					value = "初级房";
					break;
				case 8703:
					value = "中级房";
					break;
				case 8704:
					value = "高级房";
					break;
				case 8705:
					value = "至尊房";
					break;
			}
		} else if (kindId == 880) {
			switch (serviceId) {
				case 8801:
					value = "体验房";
					break;
				case 8802:
					value = "初级房";
					break;
				case 8803:
					value = "中级房";
					break;
				case 8804:
					value = "高级房";
					break;
			}
		} else if (kindId == 230) {
			switch (serviceId) {
				case 2301:
					value = "新手房";
					break;
				case 2302:
					value = "初级房";
					break;
				case 2303:
					value = "中级房";
					break;
				case 2304:
					value = "高级房";
					break;
			}
		} else if (kindId == 730) {
			switch (serviceId) {
				case 7301:
					value = "新手房";
					break;
				case 7302:
					value = "初级房";
					break;
				case 7303:
					value = "中级房";
					break;
				case 7304:
					value = "高级房";
					break;
				case 7305:
					value = "高级房";
					break;
			}
		} else if (kindId == 610) {
			switch (serviceId) {
				case 6101:
					value = "体验房";
					break;
				case 6102:
					value = "初级房";
					break;
				case 6103:
					value = "中级房";
					break;
				case 6104:
					value = "高级房";
					break;
			}
		} else if (kindId == 630) {
			switch (serviceId) {
				case 6301:
					value = "常规场新手房";
					break;
				case 6302:
					value = "常规场初级房";
					break;
				case 6303:
					value = "常规场中级房";
					break;
				case 6304:
					value = "常规场高级房";
					break;
				case 6305:
					value = "极速场新手房";
					break;
				case 6306:
					value = "极速场初级房";
					break;
				case 6307:
					value = "极速场中级房";
					break;
				case 6308:
					value = "极速场高级房";
					break;
			}
		} else if (kindId == 380) {
			switch (serviceId) {
				case 3801:
					value = "体验房";
					break;
				case 3802:
					value = "初级房";
					break;
				case 3803:
					value = "中级房";
					break;
				case 3804:
					value = "高级房";
					break;
			}
		} else if (kindId == 390) {
			switch (serviceId) {
				case 3901:
					value = "经典房";
					break;
				case 3902:
					value = "暴击房";
					break;
			}
		} else if (kindId == 910) {
			switch (serviceId) {
				case 9101:
					value = "体验房";
					break;
				case 9102:
					value = "初级房";
					break;
				case 9103:
					value = "中级房";
					break;
				case 9104:
					value = "高级房";
					break;
			}
		}
		return value;
	}

	// 通用解析牌值
	function parsingCommonPoker(pkMsg) {
		var pokerArray = pkMsg.split("");
		var pLen = pokerArray.length;
		if (pLen == 0 || pLen % 2 != 0) {
			return;
		}
		var msg = "";
		var pkSum = pLen / 2; // 有几张牌
		for (var i = 1; i <= pkSum; i++) {
			var index = i * 2 - 2;
			var desColor = pokerArray[index];
			var value = pokerArray[index + 1];
			if (desColor == "4") {
				if (value == "2") {
					msg += "小王";
				} else if (value == "3") {
					msg += "大王";
				}
			} else {
				color = "";
				switch (desColor) {
					case "0":
						color = "♦";
						break;
					case "1":
						color = "♣";
						break;
					case "2":
						color = "♥";
						break;
					case "3":
						color = "♠";
						break;
				}
				switch (value) {
					case "1":
						value = "A";
						break;
					case "a":
						value = "10";
						break;
					case "b":
						value = "J";
						break;
					case "c":
						value = "Q";
						break;
					case "d":
						value = "K";
						break;
				}
				msg += color + value;
			}
		}
		return msg;
	}

	// 通用解析麻将
	function parsingCommonMahjong(msg) {
		var arr = msg.split("");
		var len = arr.length;
		var ms = "";
		for (var i = 0; i < len; i++) {
			switch (arr[i]) {
				case "1":
					ms += "一筒";
					break;
				case "2":
					ms += "二筒";
					break;
				case "3":
					ms += "三筒";
					break;
				case "4":
					ms += "四筒";
					break;
				case "5":
					ms += "五筒";
					break;
				case "6":
					ms += "六筒";
					break;
				case "7":
					ms += "七筒";
					break;
				case "8":
					ms += "八筒";
					break;
				case "9":
					ms += "九筒";
					break;
				case "a":
					ms += "白板";
					break;
			}
		}
		return ms;
	}

	// 通用解析开奖点
	function parsingCommonLotteryPoint(msg) {
		var ms = "";
		var kjdSum = msg.length / 2; // 有多少个开奖点
		for (var i = 1; i <= kjdSum; i++) {
			var index = i * 2 - 2;
			var kd = msg.substr(index, 2);
			switch (kd) {
				case "01":
					ms += "龙,";
					break;
				case "02":
					ms += "虎,";
					break;
				case "03":
					ms += "和,";
					break;
				case "04":
					ms += "龙-黑桃,";
					break;
				case "05":
					ms += "龙-红桃,";
					break;
				case "06":
					ms += "龙-梅花,";
					break;
				case "07":
					ms += "龙-方块,";
					break;
				case "08":
					ms += "虎-黑桃,";
					break;
				case "09":
					ms += "虎-红桃,";
					break;
				case "10":
					ms += "虎-梅花,";
					break;
				case "11":
					ms += "虎-方块,";
					break;
				case "12":
					ms += "押庄赢,";
					break;
				case "13":
					ms += "押庄输,";
					break;
			}
		}
		return ms.substr(0, ms.length - 1);
	}

	// 通用解析抢庄牌九
	function parsingCommonGrabCard(msg) {
		var weiSum = msg / 2;
		var ms = "";
		for (var i = 1; i <= weiSum; i++) {
			var index = i * 2 - 2;
			var qzpj = msg.substr(index, 2);
			switch (qzpj) {
				case "12":
					ms += "12 丁三 ";
					break;
				case "24":
					ms += "24 二四 ";
					break;
				case "23":
					ms += "23 杂五 ";
					break;
				case "14":
					ms += "14 杂五 ";
					break;
				case "25":
					ms += "25 杂七 ";
					break;
				case "34":
					ms += "34 杂七 ";
					break;
				case "26":
					ms += "26 杂八 ";
					break;
				case "35":
					ms += "35 杂八 ";
					break;
				case "36":
					ms += "36 杂九 ";
					break;
				case "45":
					ms += "45 杂九 ";
					break;
				case "15":
					ms += "15 零霖六 ";
					break;
				case "16":
					ms += "16 高脚七 ";
					break;
				case "46":
					ms += "46 红头十 ";
					break;
				case "56":
					ms += "56 斧头 ";
					break;
				case "22":
					ms += "22 板凳 ";
					break;
				case "33":
					ms += "33 长三 ";
					break;
				case "55":
					ms += "55 梅牌 ";
					break;
				case "33":
					ms += "33 鹅牌 ";
					break;
				case "44":
					ms += "44 人牌 ";
					break;
				case "11":
					ms += "11 地牌 ";
					break;
				case "66":
					ms += "66 天牌 ";
					break;
			}
		}
		return ms;
	}

	// 通用解析牌型
	function parsingCommonCardType(number) {
		var msg = "";
		switch (number) {
			case "0":
				msg = "乌龙";
				break;
			case "1":
				msg = "一对";
				break;
			case "2":
				msg = "两对";
				break;
			case "3":
				msg = "三条";
				break;
			case "4":
				msg = "顺子";
				break;
			case "5":
				msg = "同花";
				break;
			case "6":
				msg = "葫芦";
				break;
			case "7":
				msg = "铁支";
				break;
			case "8":
				msg = "同花顺";
				break;
			case "14":
				msg = "三同花";
				break;
			case "15":
				msg = "三顺子";
				break;
			case "16":
				msg = "六对半";
				break;
			case "17":
				msg = "五对三条";
				break;
			case "18":
				msg = "四套三条";
				break;
			case "19":
				msg = "凑一色";
				break;
			case "20":
				msg = "全小";
				break;
			case "21":
				msg = "全大";
				break;
			case "22":
				msg = "三分天下";
				break;
			case "23":
				msg = "三同花顺";
				break;
			case "24":
				msg = "十二皇族";
				break;
			case "25":
				msg = "十三水";
				break;
			case "26":
				msg = "至尊青龙";
				break;
		}
		return msg;
	}

	//通用百家乐下注点
	function parsingCommonBaccaratPoint(nums) {
		var betPointList = nums.split("");
		var ms = "";
		for (var i = 0; i < betPointList.length; i++) {
			var point = betPointList[i];
			switch (point) {
				case "1":
					ms += "闲胜  ";
					break;
				case "2":
					ms += "庄胜  ";
					break;
				case "3":
					ms += "和胜  ";
					break;
				case "4":
					ms += "押庄赢  ";
					break;
				case "5":
					ms += "庄对  ";
					break;
				case "6":
					ms += "闲对  ";
					break;
				case "7":
					ms += "大  ";
					break;
				case "8":
					ms += "小  ";
					break;
				case "9":
					ms += "押庄输  ";
					break;
			}
		}
		return ms;
	}

	//百人牛牛
	function hundredCowGameInfo(cardRes) {
		var pzList = new Array();
		var playerCarNum = cardRes.substr(0, cardRes.length);
		var lastCarNum = getWinInfo(cardRes.substr(cardRes.length - 8)) + "位置赢了";
		pzList.push(lastCarNum);
		for (var i = 1; i <= (playerCarNum.length / 11); i++) {
			var playerMsg = "";
			if (i == 1) {
				playerMsg = "<br>天号位玩家手牌：" + hundredCowChangePai(playerCarNum.substr(i * 11 - 11, 11)) + " <br>";
			} else if (i == 2) {
				playerMsg = "<br>地号位玩家手牌：" + hundredCowChangePai(playerCarNum.substr(i * 11 - 11, 11)) + " <br>";
			} else if (i == 3) {
				playerMsg = "<br>玄号位玩家手牌：" + hundredCowChangePai(playerCarNum.substr(i * 11 - 11, 11)) + " <br>";
			} else if (i == 4) {
				playerMsg = "<br>黄号位玩家手牌：" + hundredCowChangePai(playerCarNum.substr(i * 11 - 11, 11)) + " <br>";
			} else {
				playerMsg = "<br>庄号位玩家手牌：" + hundredCowChangePai(playerCarNum.substr(i * 11 - 11, 11)) + " <br>";
			}
			pzList.push(playerMsg);
		}
		console.log(lastCarNum);
		return pzList;
	}
	//百人牛牛哪个位置赢
	function getWinInfo(winNum) {
		var kjArr = new Array(winNum.substr(0, 2), winNum.substr(2, winNum.length - 6), winNum.substr(4, winNum.length - 6), winNum.substr(winNum.length - 2));
		var ms = "";
		for (var i = 0; i < kjArr.length; i++) {
			var kj = kjArr[i];
			switch (kj) {
				case "01": ms += "天号 "; break;
				case "02": ms += "地号 "; break;
				case "03": ms += "玄号 "; break;
				case "04": ms += "黄号 "; break;
				case "05": ms += "庄号 "; break;
			}
		}
		return ms;
	}
	//百人牛牛手牌转换方法
	function hundredCowChangePai(carArr) {
		var playerCarArr = carArr.substr(1, carArr.length - 1);
		if (playerCarArr == "0000") {
			return "没有玩家";
		} else if (playerCarArr == "000000") {
			return "没有玩家";
		} else if (playerCarArr == "0000000000") {
			return "没有玩家";
		}
		var playerArr = playerCarArr.split("");
		var playerMsg = "";
		for (var i = 0; i < playerArr.length; i++) {
			if ((i + 1) % 2 == 0) {
				if (playerArr[i] == "1") {
					playerArr[i] = "A";
				} else if (playerArr[i] == "a") {
					playerArr[i] = "10";
				} else if (playerArr[i] == "b") {
					playerArr[i] = "J";
				} else if (playerArr[i] == "c") {
					playerArr[i] = "Q";
				} else if (playerArr[i] == "d") {
					playerArr[i] = "K";
				}
			} else {
				if (playerArr[i] == 0) {
					playerArr[i] = "♦";
				} else if (playerArr[i] == 1) {
					playerArr[i] = "♣";
				} else if (playerArr[i] == 2) {
					playerArr[i] = "♥";
				} else if (playerArr[i] == 3) {
					playerArr[i] = "♠";
				}
			}
		}
		for (var k = 0; k < playerArr.length; k++) {
			playerMsg += playerArr[k];
		}
		return playerMsg + " ";
	}

	//森林舞会
	function forestPartyGameInfo(cardRes) {
		var pzList = new Array();
		var cardNum1 = getCardNum1Info(cardRes.substr(0, 1));
		var cardNum2 = "";
		var cardNum3 = "";
		var cardNum4 = "";
		var fpgiStr = "";
		if (cardNum1 == "无事件") {
			cardNum2 = getCardNum2Info(cardRes.substr(1, 1));
			cardNum3 = getCardNum3Info(cardRes.substr(2, 1));
			cardNum4 = getCardNum4Info(new Array(cardRes.substr(cardRes.length - 2)));
			cardNum1 += "," + cardNum2 + cardNum3 + " " + cardNum4;
			pzList.push(cardNum1);
			return pzList;
		} else if (cardNum1 == "大三元") {
			var playerMsg = "";
			var playerCarNum = cardRes.substr(1, cardRes.length - 1);
			for (var i = 1; i <= (playerCarNum.length / 4); i++) {
				playerMsg += getTriStarInfo(playerCarNum.substr(i * 4 - 4, 4)) + " <br>";
			}
			return "大三元 </br>" + playerMsg;
		} else if (cardNum1 == "大四喜") {

		} else if (cardNum1 == "霹雳闪电") {

		} else {

		}

		function getTriStarInfo(cardTriStar) {
			var cn2 = getCardNum2Info(cardTriStar.substr(0, 1));
			var cn3 = getCardNum3Info(cardTriStar.substr(1, 1));
			var cn4 = getCardNum4Info(new Array(cardTriStar.substr(cardTriStar.length - 2)));
			return cn2 + cn3 + cn4;
		}

		function getCardNum1Info(card1) {
			var card1Str = "";
			switch (card1) {
				case "1": card1Str += "无事件"; break;
				case "2": card1Str += "大三元"; break;
				case "3": card1Str += "大四喜"; break;
				case "4": card1Str += "霹雳闪电"; break;
				case "5": card1Str += "送灯"; break;
			}
			return card1Str;
		}
		function getCardNum2Info(card2) {
			var card2Str = "";
			switch (card2) {
				case "R": card2Str += "红色"; break;
				case "G": card2Str += "绿色"; break;
				case "Y": card2Str += "黄色"; break;
			}
			return card2Str;
		}
		function getCardNum3Info(card3) {
			var card3Str = "";
			switch (card3) {
				case "A": card3Str += "狮子"; break;
				case "B": card3Str += "熊猫"; break;
				case "C": card3Str += "猴子"; break;
				case "D": card3Str += "兔子"; break;
			}
			return card3Str;
		}
		function getCardNum4Info(card4) {
			var card4Str = "";
			switch (card4) {
				case card4: card4Str += +card4 + "倍";
			}
			return card4Str;
		}
		return fpgiStr;

	}

	// 解析德州扑克
	function parsingTexasPoker(msg) {
		var pokerList = new Array();
		var shoupai = msg.substr(0, 36);
		var commonpai = msg.substr(36, 10);
		commonpai = "公共牌: " + parsingCommonPoker(commonpai);
		pokerList.push(commonpai);
		var spLen = shoupai.length;
		var paySum = spLen / 4; // 玩家数量
		for (var i = 1; i <= paySum; i++) {
			var index = i * 4 - 4;
			var payPoker = shoupai.substr(index, 4);
			if (payPoker == "0000") {
				continue;
			}
			payPoker = i + "号位玩家手牌: " + parsingCommonPoker(payPoker);
			pokerList.push(payPoker);
		}
		return pokerList;
	}

	// 解析二八杆
	function parsingErqi(msg) {
		var erqiList = new Array();
		var zjWei = msg.substr(msg.length - 1);
		zjWei = zjWei + "号位是庄家";
		erqiList.push(zjWei);

		var mjpai = msg.substr(0, 8);
		var paySum = mjpai.length / 2; // 几个玩家
		for (var i = 1; i <= paySum; i++) {
			var index = i * 2 - 2;
			var ms = i + "号位玩家: " + parsingCommonMahjong(mjpai.substr(index, 2));
			erqiList.push(ms);
		}
		return erqiList;
	}

	// 抢庄牛牛
	function parsingRobZhuangNiuniu(msg) {
		var rzList = new Array();
		var zjWei = msg.substr(msg.length - 1);
		zjWei = zjWei + "号位是庄家";
		rzList.push(zjWei);

		var shoupai = msg.substr(0, msg.length - 1);
		var paySum = shoupai.length / 10; // 几个玩家
		for (var i = 1; i <= paySum; i++) {
			var index = i * 10 - 10;
			var pk = shoupai.substr(index, 10);
			var ms = "";
			if (pk != "0000000000") {
				ms = i + "号位玩家手牌: " + parsingCommonPoker(pk);
			} else {
				ms = i + "号位没有玩家";
			}
			rzList.push(ms);
		}
		return rzList;
	}

	// 炸金花
	function parsingFriedGoldenFlower(msg) {
		var rzList = new Array();
		var zjWei = msg.substr(msg.length - 1);
		zjWei = zjWei + "号位是赢家";
		rzList.push(zjWei);

		var shoupai = msg.substr(0, msg.length - 1);
		var paySum = shoupai.length / 6; // 几个玩家
		for (var i = 1; i <= paySum; i++) {
			var index = i * 6 - 6;
			var pk = shoupai.substr(index, 6);
			var ms = "";
			if (pk != "000000") {
				ms = i + "号位玩家手牌: " + parsingCommonPoker(pk);
			} else {
				ms = i + "号位没有玩家";
			}
			rzList.push(ms);
		}
		return rzList;
	}

	// 三公
	function parsingThreeFairs(msg) {
		var rzList = new Array();
		var zjWei = msg.substr(msg.length - 1);
		zjWei = zjWei + "号位是庄家";
		rzList.push(zjWei);

		var shoupai = msg.substr(0, msg.length - 1);
		var paySum = shoupai.length / 6; // 几个玩家
		for (var i = 1; i <= paySum; i++) {
			var index = i * 6 - 6;
			var pk = shoupai.substr(index, 6);
			var ms = "";
			if (pk != "000000") {
				ms = i + "号位玩家手牌: " + parsingCommonPoker(pk);
			} else {
				ms = i + "号位没有玩家";
			}
			rzList.push(ms);
		}
		return rzList;
	}

	// 压庄龙虎
	function parsingAndTigerZhuang(msg) {
		var rzList = new Array();
		var kjd = msg.substr(4);
		kjd = "本局" + parsingCommonLotteryPoint(kjd) + "获胜";
		rzList.push(kjd);

		var pk = parsingCommonPoker(msg.substr(0, 4));
		rzList.push("龙开牌: " + pk.substr(0, 2));
		rzList.push("虎开牌: " + pk.substr(2));
		return rzList;
	}

	// 21点
	function parsingTwPoints(msg) {
		var rzList = new Array();
		var payList = msg.split(",");
		var pLen = payList.length;
		for (var i = 0; i < pLen; i++) {
			var payPokerItem = payList[i];
			// 是否在其他位置下注
			if (payPokerItem.indexOf("|") != -1) {
				var weiz = payPokerItem.substr(0, 1);
				weiz = getPayLocation(weiz);
				var otherBetList = payPokerItem.split("|");
				var oLen = otherBetList.length;
				for (var p = 0; p < oLen; p++) {
					var oItem = otherBetList[p];
					// 是否分墩
					if (oItem.indexOf("-") != -1) {
						if (p != 0) {
							var oweiz = oItem.substr(0, 1);
							oweiz = getPayLocation(oweiz);
							rzList.push(weiz + "在" + oweiz + "进行了下注:");
						}
						pier(oItem);
					} else { // 未分墩
						if (p != 0) {
							var oweiz = oItem.substr(0, 1);
							oweiz = getPayLocation(oweiz);
							rzList.push(weiz + "在" + oweiz + "进行了下注:");
						}
						noPier(oItem);
					}
				}
			} else { // 未在其他位置下注
				// 是否分墩
				if (payPokerItem.indexOf("-") != -1) {
					pier(payPokerItem);
				} else { // 未分墩
					noPier(payPokerItem);
				}
			}
		}

		// 分墩
		function pier(item) {
			var weiz = item.substr(0, 1);
			if (weiz == "0") {
				weiz = "庄家";
			} else {
				weiz = weiz + "号位";
			}
			rzList.push(weiz + "进行了分牌: ");
			var dunPokerList = item.substr(1).split("-");
			var dLen = dunPokerList.length;
			// 分析每墩牌
			for (var p = 0; p < dLen; p++) {
				rzList.push("第" + (p + 1) + "墩牌: " +
					parsingCommonPoker(dunPokerList[p]));
			}
		}

		// 未分墩
		function noPier(item) {
			var weiz = item.substr(0, 1);
			if (weiz == "0") {
				weiz = "庄家牌: ";
			} else {
				weiz = weiz + "号位牌: ";
			}
			var pk = item.substr(1);
			pk = weiz + parsingCommonPoker(pk);
			rzList.push(pk);
		}

		function getPayLocation(weiz) {
			if (weiz == "0") {
				return "庄家位";
			} else {
				return weiz + "号位";
			}
		}

		return rzList;
	}

	// 通比牛牛
	function parsingTbNiuniu(msg) {
		var rzList = new Array();
		var zjWei = msg.substr(msg.length - 1);
		zjWei = zjWei + "号位是赢家";
		rzList.push(zjWei);

		var shoupai = msg.substr(0, msg.length - 1);
		var paySum = shoupai.length / 10; // 几个玩家
		for (var i = 1; i <= paySum; i++) {
			var index = i * 10 - 10;
			var pk = shoupai.substr(index, 6);
			var ms = "";
			if (pk != "0000000000") {
				ms = i + "号位玩家手牌: " + parsingCommonPoker(pk);
			} else {
				ms = i + "号位没有玩家";
			}
			rzList.push(ms);
		}
		return rzList;
	}

	// 欢乐红包
	function parsingHappyRedEnvelope(msg) {
		var rzList = new Array();
		var ds = msg.substr(0, msg.length - 2);
		var gz = msg.substr(msg.length - 2, 1);
		rzList.push("规则" + gz);
		var zjNum = msg.substr(msg.length - 1);
		rzList.push(zjNum + "号位是庄家");
		var dsLen = ds.length;
		for (var i = 0; i < dsLen; i++) {
			var value = ds.substr(i, 1);
			if (value != "0") {
				rzList.push((i + 1) + "号位玩家骰子: " + value);
			}
		}
		return rzList;
	}

	// 抢庄牌九
	function parsingGrabCard(msg) {
		var rzList = new Array();
		var zjWei = msg.substr(msg.length - 1);
		rzList.push(zjWei + "号位玩家是庄家");
		var shoupai = msg.substr(0, msg.length - 1);
		var paySum = shoupai.length / 4;
		for (var i = 1; i <= paySum; i++) {
			var index = i * 4 - 4;
			var gc = shoupai.substr(index, 4);
			if (gc != "0000") {
				rzList.push(i + "号位玩家手牌: " + parsingCommonGrabCard(gc));
			} else {
				rzList.push(i + "号位没有玩家");
			}
		}
		return rzList;
	}

	// 极速炸金花
	function parsingFastFriedGoldenFlower(msg) {
		var rzList = new Array();
		var zjWei = msg.substr(msg.length - 1);
		rzList.push(zjWei + "号位玩家是赢家");
		var shoupai = msg.substr(0, msg.length - 1);
		var paySum = shoupai.length / 6;
		for (var i = 1; i <= paySum; i++) {
			var index = i * 6 - 6;
			var gc = shoupai.substr(index, 6);
			if (gc != "000000") {
				rzList.push(i + "号位玩家手牌: " + parsingCommonPoker(gc));
			} else {
				rzList.push(i + "号位没有玩家");
			}
		}
		return rzList;
	}

	// 斗地主
	function parsingLandlord(msg) {
		var rzList = new Array();
		var dzWei = msg.substr(msg.length - 1);
		rzList.push(dzWei + "号位玩家是地主");
		var dzPai = msg.substr(msg.length - 7, 6);
		rzList.push("地主牌: " + parsingCommonPoker(dzPai));
		var shoupai = msg.substr(0, msg.length - 7);
		var paySum = shoupai.length / 34;
		for (var i = 1; i <= paySum; i++) {
			var index = i * 34 - 34;
			var gc = shoupai.substr(index, 34);
			rzList.push(i + "号位玩家手牌: " + parsingCommonPoker(gc));
		}
		return rzList;
	}

	// 十三水
	function parsingThirteenWater(msg) {
		var rzList = new Array();
		var payList = msg.split(";");
		var pLen = payList.length;
		for (var i = 0; i < pLen; i++) {
			var item = payList[i];
			if (item == "0") {
				continue;
			}
			// 是否分墩
			if (item.indexOf(",") != -1) {
				var dunList = item.split(",");
				var dunLen = dunList.length;
				var weiz = dunList[dunLen - 1];
				var pokmsg = "";
				for (var p = 0; p < dunLen - 1; p++) {
					var dunItem = dunList[p];
					if (p == 0) { // 首墩3张牌
						var pk = dunItem.substr(0, 6);
						pk = parsingCommonPoker(pk);
						var type = dunItem.substr(6);
						type = parsingCommonCardType(type);
						pokmsg += pk + " " + type + ",";
					} else { // 其他墩5张
						var pk = dunItem.substr(0, 10);
						pk = parsingCommonPoker(pk);
						var type = dunItem.substr(10);
						type = parsingCommonCardType(type);
						pokmsg += pk + " " + type + ",";
					}
				}
				pokmsg = pokmsg.substr(0, pokmsg.length - 1);
				rzList.push(weiz + "号玩家牌: " + pokmsg);
			} else { // 特殊牌型不分墩
				var weiz = item.substr(item.length - 1);
				var type = item.substr(item.length - 3, 2);
				type = parsingCommonCardType(type);
				var pok = item.substr(0, item.length - 3);
				pok = parsingCommonPoker(pok);
				rzList.push(weiz + "号玩家牌: " + pok + " " + type);
			}
		}
		return rzList;
	}

	// 幸运五张
	function parsingLuckyFive(msg) {
		var rzList = new Array();
		var pk;
		var mLen = msg.length;
		if (mLen >= 20) {
			pk = msg.substr(0, 20);
		} else {
			pk = msg.substr(0, 10);
		}
		var spSum = pk.length / 10;
		for (var i = 1; i <= spSum; i++) {
			var index = i * 10 - 10;
			var pokmsg = pk.substr(index, 10);
			if (i == 1) {
				rzList.push("换牌前手牌: " + parsingCommonPoker(pokmsg));
			} else {
				rzList.push("换牌后手牌: " + parsingCommonPoker(pokmsg));
			}
		}
		return rzList;
	}

	// 百家乐
	function parsingBaccarat(msg) {
		var rzList = new Array();
		var pk = msg.substr(0, 12);
		var betIds = msg.substr(12);
		betIds = parsingCommonBaccaratPoint(betIds);
		var pkSum = pk.length / 6;
		for (var i = 1; i <= pkSum; i++) {
			var index = i * 6 - 6;
			var pokmsg = pk.substr(index, 6);
			if (pokmsg.indexOf("00") != -1) {
				pokmsg = pokmsg.replace("00", "");
			}
			if (i == 1) {
				rzList.push("闲牌: " + parsingCommonPoker(pokmsg));
			} else {
				rzList.push("庄牌: " + parsingCommonPoker(pokmsg));
			}
		}
		return rzList;
	}

	// 射龙门
	function parsingShootingGantry(msg) {
		var rzList = new Array();
		var pk = msg.substr(0, msg.length - 1);
		rzList.push("此句玩家手牌: " + parsingCommonPoker(pk));
		return rzList;
	}
}
function jpnnGame() {
	var layoutId;
	var layoutObj;
	var itemData;
	this.showInfo = function (id, item) {
		layoutId = id;
		layoutObj = $("#" + layoutId);
		itemData = item;
		var headDiv = "<div id=" + layoutId + "_head></div>";
		var listDiv = "<div id=" + layoutId + "_list></div>";
		layoutObj.css({
			"overflow-x": "hidden",
			"overflow-y": "auto"
		});
		layoutObj.html(headDiv + listDiv);
		bindHeadView();
		bindListView();
	}
	this.parsingCard = parsingCard;
	function bindHeadView() {
		var objHead = $("#" + layoutId + "_head");

		var entryDiv = "<div class=kyGameBetInfoEntryDiv>%content%</div>";
		var titleRootDiv = "<div class=kyGameBetInfoTitleRootDiv>%content%</div>";
		var betRootDiv = "<div class=kyGameBetInfoBetRootDiv>%content%</div>";

		var gameInfoDiv = "<div class=kyGameBetInfoGameInfoDiv>%content%</div>"
		var infoItemDiv = "<div class=kyGameBetInfoGameInfoItemDiv>%content%</div>";
		var infoItemStopDiv = "<div class=kyGameBetInfoGameInfoItemStopDiv>%content%</div>";
		var infoLeftDiv = "<div class=kyGameBetInfoGameInfoLeftDiv>%content%</div>";
		var infoRightDiv = "<div class=kyGameBetInfoGameInfoRightDiv>%content%</div>";
		var fontDes = "<font color=white>[val]</font>";

		// bind Item标题
		var gameName = itemData["gameName"];
		var nameDiv = "<div class=kyGameBetInfoTitleRootDiv_name>" + gameName + "</div>";

		var period = itemData["period"];
		if (period == null) {
			period = "";
		}
		var periodDiv = "<div class=kyGameBetInfoTitleRootDiv_period>" + period + "</div>";

		var date = itemData["date"];
		var dateDiv = "<div class=kyGameBetInfoTitleRootDiv_date>" + date + "</div>";
		titleRootDiv = titleRootDiv.replace("%content%", nameDiv + periodDiv + dateDiv);

		// bind Item游戏结果
		var total = itemData["total"];
		var totalDiv = "<div class=kyGameBetInfoBetRootDiv_gameItem>" + total + "</div>";

		var valid = itemData["valid"];
		var validDiv = "<div class=kyGameBetInfoBetRootDiv_gameItem>" + valid + "</div>";

		var winloss = itemData["winloss"];
		var winlossDiv = "<div class=kyGameBetInfoBetRootDiv_gameItem>" + winloss + "</div>";
		betRootDiv = betRootDiv.replace("%content%", totalDiv + validDiv + winlossDiv);

		entryDiv = entryDiv.replace("%content%", titleRootDiv + betRootDiv);

		// bind 游戏结果信息
		var betLiveObj = itemData["betLives"];
		var betdivs = "";
		var leftTxt = "";
		var rightTxt = "";

		var zuoNum = betLiveObj["roomid"]; zuoNum = fontDes.replace("[val]", zuoNum);
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>房间号:</font>");
		rightTxt = infoRightDiv.replace("%content%", zuoNum);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var payNum = betLiveObj["seatindex"]; payNum = fontDes.replace("[val]", payNum);
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>玩家座位号:</font>");
		rightTxt = infoRightDiv.replace("%content%", payNum);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var paycount = betLiveObj["playercount"]; paycount = fontDes.replace("[val]", paycount);
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>玩家数量:</font>");
		rightTxt = infoRightDiv.replace("%content%", paycount);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var yxBet = betLiveObj["validbetvalue"]; yxBet = fontDes.replace("[val]", yxBet);
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>牛牛有效投注:</font>");
		rightTxt = infoRightDiv.replace("%content%", yxBet);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var allBet = betLiveObj["betvalue"]; allBet = fontDes.replace("[val]", allBet);
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>牛牛投注额:</font>");
		rightTxt = infoRightDiv.replace("%content%", allBet);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var profit = betLiveObj["realvalue"]; profit = fontDes.replace("[val]", profit);
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>牛牛实际营收:</font>");
		rightTxt = infoRightDiv.replace("%content%", profit);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var revenue = betLiveObj["tip"]; revenue = fontDes.replace("[val]", revenue);
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>牛牛服务费:</font>");
		rightTxt = infoRightDiv.replace("%content%", revenue);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		// jackPot
		var buyJackpot = betLiveObj["buyjackpot"];
		if (buyJackpot > 0) {
			buyJackpot = fontDes.replace("[val]", buyJackpot);
			leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>JACKPOT购买费:</font>");
			rightTxt = infoRightDiv.replace("%content%", buyJackpot);
			betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

			var jackpotStatus = betLiveObj["jackpotstatus"];
			var statusJackPot = "";
			if (jackpotStatus == 0) {
				statusJackPot = fontDes.replace("[val]", "未中");
			} else {
				statusJackPot = fontDes.replace("[val]", "已中");
			}
			leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>JACKPOT是否中奖:</font>");
			rightTxt = infoRightDiv.replace("%content%", statusJackPot);
			betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

			if (jackpotStatus != 0) {
				var jackpottype = betLiveObj["jackpottype"]; jackpottype = fontDes.replace("[val]", jackpottype);
				leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>JACKPOT中奖类型:</font>");
				rightTxt = infoRightDiv.replace("%content%", jackpottype);
				betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

				var jackpotValue = betLiveObj["jackpotvalue"]; jackpotValue = fontDes.replace("[val]", jackpotValue);
				leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>JACKPOT中奖金额:</font>");
				rightTxt = infoRightDiv.replace("%content%", jackpotValue);
				betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

				var jackpotRealValue = betLiveObj["jackpotrealvalue"]; jackpotRealValue = fontDes.replace("[val]", jackpotRealValue);
				leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>JACKPOT实际中奖金额:</font>");
				rightTxt = infoRightDiv.replace("%content%", jackpotRealValue);
				betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

				var jackpotValueTip = betLiveObj["jackpotvaluetip"]; jackpotValueTip = fontDes.replace("[val]", jackpotValueTip);
				leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>JACKPOT抽水:</font>");
				rightTxt = infoRightDiv.replace("%content%", jackpotValueTip);
				betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);
			}
		}
		var gamestarttime = betLiveObj["begintime"];
		gamestarttime = getTimeZoneE8(timeZone, new Date(gamestarttime)).format("yyyy-MM-dd hh:mm");
		gamestarttime = fontDes.replace("[val]", gamestarttime);
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>游戏开始时间:</font>");
		rightTxt = infoRightDiv.replace("%content%", gamestarttime);
		betdivs += infoItemDiv.replace("%content%", leftTxt + rightTxt);

		var gameendtime = betLiveObj["endtime"];
		gameendtime = getTimeZoneE8(timeZone, new Date(gameendtime)).format("yyyy-MM-dd hh:mm");
		gameendtime = fontDes.replace("[val]", gameendtime);
		leftTxt = infoLeftDiv.replace("%content%", "<font color=#8C8C8C>游戏结束时间:</font>");
		rightTxt = infoRightDiv.replace("%content%", gameendtime);
		betdivs += infoItemStopDiv.replace("%content%", leftTxt + rightTxt);

		gameInfoDiv = gameInfoDiv.replace("%content%", betdivs);

		objHead.html(entryDiv + gameInfoDiv);

		setHeadStyle();
	}
	function setHeadStyle() {
		// 根布局
		$(".kyGameBetInfoEntryDiv").css({
			"align-items": "center",
			"text-align": "center",
			"width": "auto",
			"height": "auto",
			"background": "#4c4c4c",
			"border-radius": "5px",
			"padding": "5px",
			"margin-left": "5px",
			"margin-right": "5px",
			"margin-top": "10px",
			"margin-bottom": "10px",
			"box-sizing": "border-box"
		});

		// 标题布局
		$(".kyGameBetInfoTitleRootDiv").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto"
		});
		$(".kyGameBetInfoTitleRootDiv_name").css({
			"text-align": "left",
			"width": "33.3%",
			"font-size": "10px"
		});
		$(".kyGameBetInfoTitleRootDiv_period").css({
			"text-align": "center",
			"width": "33.3%",
			"font-size": "10px"
		});
		$(".kyGameBetInfoTitleRootDiv_date").css({
			"text-align": "right",
			"width": "33.3%",
			"font-size": "10px"
		});

		// 结果布局
		$(".kyGameBetInfoBetRootDiv").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto",
			"margin-top": "5px",
			"box-sizing": "border-box"
		});
		$(".kyGameBetInfoBetRootDiv_gameItem").css({
			"text-align": "center",
			"align-items": "center",
			"display": "flex",
			"justify-content": "center",
			"font-size": "12px",
			"background": "#2E2E2E",
			"padding-top": "2px",
			"padding-bottom": "2px",
			"width": "33%",
			"height": "auto"
		});

		// 游戏信息
		$(".kyGameBetInfoGameInfoDiv").css({
			"align-items": "center",
			"text-align": "center",
			"width": "100%",
			"height": "auto",
			"padding-left": "15px",
			"padding-right": "15px",
			"box-sizing": "border-box"
		});
		$(".kyGameBetInfoGameInfoItemDiv").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"margin-bottom": "10px",
			"width": "100%",
			"height": "auto"
		});
		$(".kyGameBetInfoGameInfoItemStopDiv").css({
			"display": "flex",
			"justify-content": "space-between",
			"align-items": "center",
			"width": "100%",
			"height": "auto"
		});
		$(".kyGameBetInfoGameInfoLeftDiv").css({
			"text-align": "left",
			"width": "50%",
			"font-size": "12px"
		});
		$(".kyGameBetInfoGameInfoRightDiv").css({
			"text-align": "right",
			"width": "50%",
			"font-size": "12px"
		});
	}
	function bindListView() {
		var objList = $("#" + layoutId + "_list");
		var betLivesObj = itemData["betLives"];
		var cardList = betLivesObj["cardList"]; if (cardList == null) { return; }
		var rootDiv = "<div class=kyGameCardListRootDiv>%content%</div>";
		var txtDiv = "<div class=kyGameCardListItemDiv>%content%</div>";
		var txtStopDiv = "<div class=kyGameCardListItemStopDiv>%content%</div>";
		var cLen = cardList.length;
		var ms = "";
		for (var i = 0; i < cLen; i++) {
			var value = cardList[i];
			if (i != cLen - 1) {
				ms += txtDiv.replace("%content%", "<font color=#B4B4B4>" + value + "</font>");
			} else {
				ms += txtStopDiv.replace("%content%", "<font color=#B4B4B4>" + value + "</font>");
			}
		}
		rootDiv = rootDiv.replace("%content%", ms);
		objList.html(rootDiv);

		setListStyle();
	}
	function setListStyle() {
		$(".kyGameCardListRootDiv").css({
			"align-items": "center",
			"text-align": "center",
			"width": "100%",
			"height": "auto",
			"padding-left": "15px",
			"padding-right": "15px",
			"padding-top": "10px",
			"padding-bottom": "10px",
			"margin-top": "10px",
			"background": "#222222",
			"box-sizing": "border-box"
		});
		$(".kyGameCardListItemDiv").css({
			"text-align": "left",
			"width": "100%",
			"font-size": "12px",
			"margin-bottom": "8px",
			"box-sizing": "border-box"
		});
		$(".kyGameCardListItemStopDiv").css({
			"text-align": "left",
			"width": "100%",
			"font-size": "12px",
			"box-sizing": "border-box"
		});
	}
	function parsingCard(item) {
		if (item == null) { return null; }
		var cardDes = item["details"];
		var cLen = cardDes["length"];
		if (cardDes == null || cLen == 0) { return null; }
		var list = new Array();
		for (var i = 0; i < cLen; i++) {
			var cardItem = cardDes[i];
			var cardList = JSON.parse(cardItem["card"]);
			var cardLen = cardList["length"];
			var val = "";
			for (var p = 0; p < cardLen; p++) {
				val += getPoker(cardList[p]);
			}
			list.push(cardItem["seat"] + "号座位玩家手牌:" + val);
		}
		list.push("我是" + item["seatindex"] + "号座位");
		return list;
	}
	function getPoker(pk) {
		var number = parseInt(pk % 13); number++;
		var color = parseInt(pk / 13);
		switch (color) {
			case 0:
				color = "♦";
				break;
			case 1:
				color = "♣";
				break
			case 2:
				color = "♥";
				break;
			case 3:
				color = "♠";
				break;
		}
		switch (number) {
			case 1:
				number = "A";
				break;
			case 11:
				number = "J";
				break;
			case 12:
				number = "Q";
				break;
			case 13:
				number = "K";
				break;
		}
		return color + number;
	}
}
function betCircle(divId, mRadius, mColor, mNumber, mNumberColor) {
	var h = s * mRadius;
	if (mNumberColor == null) {
		mNumberColor = "#ffffff";
	}
	$("#" + divId).css({
		"width": h,
		"height": h,
		"background-color": mColor,
		"-webkit-border-radius": s * mRadius,
		"text-align": "center",
		"color": mNumberColor,
		"font-size": s * 20,
		"display": "table-cell",
		"vertical-align": "middle"
	});
	$("#" + divId).html(mNumber);
}
