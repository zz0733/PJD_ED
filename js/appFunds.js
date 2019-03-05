function payObj() {
    var resultList = new Array();
    var isGetPayChannel = false;
    this.isGetPayChannel = function () {
        return isGetPayChannel;
    }
    this.getPayChannel = function (channelCallBack) {
        var mData = "requestType=json&rand=" + randomString();
        banksLoad(function (isBanks) {
            requestAjax("payChannel/getOperatorChannelsByType", mData, function (jsonObj) {
                if (jsonObj["code"] == 0) {
                    parsing(jsonObj["result"], isBanks);
                    isGetPayChannel = true;
                    if (channelCallBack != null) {
                        channelCallBack(resultList);
                    }
                } else if (jsonObj["code"] == 100) {
                    mToast.show("登录信息失效,请重新登录!", 2, "middle");
                    appLogout(0);
                } else {
                    mToast.show("支付信息获取失败,请重试!", 2, "middle");
                }
            }, function (error) {
                mToast.show("支付信息获取失败,请重试!", 2, "middle");
                console.log("get pay channel error: " + error);
            });
        })
        requestAjax("operatorSetting/getGlobalSetting", "settingId=31", function (jsonObj) {
            reqTime = jsonObj["result"];
        }, null);
    }
    this.getPayChannelData = function () {
        return resultList;
    }
    this.setReGet = function () {
        isGetPayChannel = false;
    }
    this.addChannelItem = addChannelItem;
    this.isChannelChanage = isChannelChanage;
    // 解析
    function parsing(data, isBanks) {
        resultList = new Array();
        var len = data.length;
        for (var i = 0; i < len; i++) {
            var rootItem = data[i];
            var resultItem = new Object();
            resultItem.id = rootItem.id;
            resultItem.logo = rootItem.logo;
            resultItem.name = rootItem.name;
            resultItem.sort = rootItem.sort;
            resultItem.list = rootItem.items;
            if (isBanks) {
                if (resultItem.id == 1) {
                    if(userInfo["dt"]["grade_id"]["weixin_show"] == 1){
                        var obj = new Object();
                        obj["name"] = "微信转银行卡";
                        obj["channel_type"] = "_offline_channel_wxto_";
                        obj["fixed_values"] = [200, 500, 1000, 2000, 5000, 8000, 10000, 20000, 30000, 40000, 45000, 50000];
                        obj["max_amount"] = 50000;
                        obj["min_amount"] = 200;
                        obj["user_input"] = 0;
                        resultItem.list.push(obj);
                    }
                } else if (resultItem.id == 2) {
                    if(userInfo["dt"]["grade_id"]["alipay_show"] == 1){
                        var obj = new Object();
                        obj["name"] = "支付宝转银行卡";
                        obj["channel_type"] = "_offline_channel_zfbto_";
                        obj["fixed_values"] = [200, 500, 1000, 2000, 5000, 8000, 10000, 20000, 30000, 40000, 45000, 50000];
                        obj["max_amount"] = 50000;
                        obj["min_amount"] = 200;
                        obj["user_input"] = 0;
                        resultItem.list.push(obj);
                    }
                }
            }
            resultList.push(resultItem);
        }
        if (isBanks) {
            addOCType();
        } else {
            delOCType();
        }
    }
    function addChannelItem(channelItem, payItem) {
        var resultLen = resultList.length;
        if (resultLen == 0) {
            var resultItem = new Object();
            resultItem.id = payItem.id;
            resultItem.logo = payItem.logo;
            resultItem.name = payItem.name;
            resultItem.sort = payItem.sort;
            var arr = new Array();
            arr.push(channelItem);
            resultItem.list = arr;
            resultList.push(resultItem);
            return;
        }
        for (var n = 0; n < resultLen; n++) {
            var resultItem = resultList[n];
            if (resultItem != null && resultItem.id == payItem.id) {
                resultItem.list.push(channelItem);
                break;
            } else if (n == resultLen - 1) {
                resultItem = new Object();
                resultItem.id = payItem.id;
                resultItem.logo = payItem.logo;
                resultItem.name = payItem.name;
                resultItem.sort = payItem.sort;
                var arr = new Array();
                arr.push(channelItem);
                resultItem.list = arr;
                resultList.push(resultItem);
                break;
            }
        }
    }
    function addOCType() {
        var len = resultList.length;
        for (var i = 0; i < len; i++) {
            var item = resultList[i];
            if (item.id == "off_rec_channel") {
                return;
            }
        }
        var resultItem = new Object();
        resultItem.id = "off_rec_channel";
        resultItem.logo = themPath + "yinhanghuikuan.png";
        resultItem.name = "线下银行汇款";
        resultItem.sort = 9999;
        var obj = new Object();
        obj["name"] = "线下银行汇款";
        obj["channel_type"] = "_offline_channel_xxto_";
        obj["fixed_values"] = [200, 500, 1000, 2000, 5000, 8000, 10000, 20000, 30000, 40000, 45000, 50000];
        obj["max_amount"] = 50000;
        obj["min_amount"] = 200;
        obj["user_input"] = 0;
        resultItem.list = [obj];
        resultList.push(resultItem);
    }
    function delOCType() {
        var len = resultList.length;
        for (var i = 0; i < len; i++) {
            var item = resultList[i];
            if (item.id == "off_rec_channel") {
                resultList.splice(i, 1);
                break;
            }
        }
    }
    var reqTime = 0;
    function isChannelChanage(callBack) {
        if (callBack == null) { return; }
        requestAjax("operatorSetting/getGlobalSetting", "settingId=31", function (jsonObj) {
            if (jsonObj.result != reqTime) {
                reqTime = jsonObj.result;
                callBack(true);
            } else {
                callBack(false);
            }
        }, function (error) {
            callBack(false);
        });
    }
    function banksLoad(back) {
        requestAjax("operatorBank/getOperatorBanks", "requestType=json", function (bankObj) {
            if (bankObj["code"] == 0) {
                var bankList = bankObj["result"];
                var b;
                if (bankList != null && bankList.length > 0) {
                    b = true;
                } else {
                    b = false;
                }
                if (back != null) {
                    back(b);
                }
            } else {
                if (back != null) {
                    back(false);
                }
            }
        }, function (error) {
            if (back != null) {
                back(false);
            }
        });
    }
}
var onlinePayObj = new payObj();
function moneyrecordObj() {
    var mPage = new pageObj("moneyrecordDiv", "资金记录");
    var isInit = false;
    this.init = function () {
        mPage.init();
    }
    this.show = function () {
        mPage.show();
        if (!isInit) {
            new tPage("moneyRecord", "pages/moneyRecord.html", "moneyrecordDiv_content", function () {
                isInit = true;
            }).open();
        }
    }
}
function moneyrecordDetailsObj() {
    var mPage = new pageObj("moneyrecordDetailsDiv", "资金详情");
    var isInit = false;
    this.init = function () {
        mPage.init();
    }
    this.show = function () {
        mPage.show();
        if (isInit) {
            moneyRecordDetailsFun();
        } else {
            new tPage("moneyRecordDetails", "pages/moneyRecordDetails.html", "moneyrecordDetailsDiv_content", function () {
                isInit = true;
            }).open();
        }
    }
}
function drawFeeObj() {
    var mPage = new pageObj("drawFeeDiv", "提款");
    var isInit = false;
    this.init = function () {
        mPage.init();
    }
    this.show = function () {
        myPJDApp.setJPNNAnimation(false);
        mPage.show(function () {
            mPage.showBtn();
            myPJDApp.unShowComplete();
            myPJDApp.setJPNNAnimation(true);
            mDrawFeeFunObj.unShow();
        });
        if (isInit) {
            mDrawFeeFunObj.show();
        } else {
            new tPage("drawFee", "pages/drawFee.html", "drawFeeDiv_content", function () {
                isInit = true;
            }).open();
        }
        if (userInfo["complete"] != 3) {
            mPage.hiddenBtn();
            myPJDApp.showComplete("noMenu");
        } else {
            mPage.showBtn();
        }
        mPage.hiddenFunds();
    }
}
function depositFeeObj() {
    var mPage = new pageObj("depositFeeDiv", "存款");
    var depositRecObj = new DepositBindViewObj("depositFeeDiv_content");
    this.init = function () {
        mPage.init();
        depositRecObj.init();
    }
    this.show = function () {
        myPJDApp.setJPNNAnimation(false);
        mPage.show(function () {
            mPage.showBtn();
            myPJDApp.unShowComplete();
            myPJDApp.setJPNNAnimation(true);
        });
        depositRecObj.show();
        if (userInfo["complete"] == 1) {
            mPage.hiddenBtn();
            myPJDApp.showComplete("noMenu");
        } else {
            mPage.showBtn();
        }
        mPage.hiddenFunds();
    }
}
function moneyWindowObj() {
    var obj = $("#moneyShowDiv");
    var isInit = false;
    var isShowFlag = false;
    this.init = function () {
        obj.css({
            "width": screenW,
            "height": screenH - topH,
            "top": topH,
            "display": "flex"
        });
        $("#aTriangle").css({
            "display": "block",
            "top": 0,
            "left": screenW - 50
        });
        obj.click(function () {
            myPJDApp.unShowMoneyWindow();
        });
        $("#moneyShowDiv_panel").css({
            "width": screenW * 0.6,
            "left": screenW * 0.4,
            "background-color": pageBgColor
        });
        setBtnOnTouchEventNoColor($("#moneyShow_mainMoneyBag"), function () {
            $("#moneyShow_refreshBtn").transition({
                rotate: "360deg"
            }, "slow", function () {
                $("#moneyShow_refreshBtn").css({ rotate: "0deg" });
            });
            mUserObj.getMoneyBag();
        }, null);
        setBtnOnTouchEvent($("#moneyShow_interest"), function () {
            myPJDApp.unShowMoneyWindow();
            myPJDApp.showInterest();
        }, mainBackColor, pageBgColor, null);
        setBtnOnTouchEvent($("#moneyShow_income"), function () {
            myPJDApp.unShowMoneyWindow();
            myPJDApp.showDeposit();
        }, mainBackColor, pageBgColor, null);
        setBtnOnTouchEvent($("#moneyShow_widthdraw"), function () {
            myPJDApp.unShowMoneyWindow();
            myPJDApp.showDraw();
        }, mainBackColor, pageBgColor, null);
        myPJDApp.setJPNNAnimation(false);
        isInit = true;
        isShowFlag = true;
    }
    this.show = function () {
        if (isShowFlag == true) {
            myPJDApp.setJPNNAnimation(true);
            obj.css({ "display": "none" });
            isShowFlag = false;
        } else {
            myPJDApp.setJPNNAnimation(false);
            obj.css({ "display": "flex" });
            isShowFlag = true;
        }
    }
    this.unShow = function () {
        myPJDApp.setJPNNAnimation(true);
        obj.css({ "display": "none" });
        isShowFlag = false;
    }
    this.isInit = function () {
        return isInit;
    }
}
function refreshMoney(elementID) {
    if (elementID != null) {
        $("#" + elementID).html(userMoney.toFixed(2));
    }
    if (moneyCanSee) {
        $("#my_money_main").html(userMoney.toFixed(2));
        $("#my_money_all").html((userMoney + userMoneyInterest).toFixed(2));
        $("#my_money_Interest").html(userMoneyInterest.toFixed(2));
        $("#topIsLoginDiv_userInfo").html(userInfo.name + "<br> ¥ " + userMoney.toFixed(2));
    }
    $("#moneyShow_main_money").html(userMoney.toFixed(2));
    $("#moneyShow_interest_money").html(userMoneyInterest.toFixed(2));
}
function feedbackObj() {
    var mPage = new pageObj("feedbackDiv", "返水");
    var startData;
    var endData;
    var selectvalue;
    var requestTime = new Date();
    var select;
    var mFeedbackInfoObj = new feedbackInfoObj();

    this.init = function () {
        mPage.init();
        mFeedbackInfoObj.init();
        $("#feedbackDiv_content").css({ "background-color": mainBackColor });
        $("#feedbackDiv_content_list").css({ "height": screenH - topH - 65 });
    }

    this.show = function () {
        mPage.show(function () {
            $("#feedbackDiv_content_list").html("");
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
            "list": [
                { "text": "今天", "value": "0" },
                { "text": "昨天", "value": "yesterday" },
                { "text": "最近7天", "value": "7" }
            ]
        };

        select = new tSelect("feedbackDiv_timeSelect", "feedbackDiv",
            screenW, 50, times, function (index) {
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
                $("#feedbackDiv_content_list").html("");
                var now = new Date();
                if ((now - requestTime) > 5000) {
                    bindList(500);
                } else {
                    bindList(5000);
                }
            });
    }

    function bindList(outTime) {
        var columns = [
            { "title": "", "code": "", "width": "5%", "align": "left" },
            { "title": "类型/时间", "code": "note", "width": "40%", "align": "left" },
            { "title": "金额", "code": "money", "width": "30%", "align": "right" },
            { "title": "状态", "code": "status", "width": "20%", "align": "center" },
            { "title": "", "code": "arrow", "width": "5%", "align": "center" }
        ];
        var mData = "requestType=json&start=" + startData + "&end=" + endData;
        var mTable = new tTable("feedbackDiv_content_list", columns, 30);
        mTable.init();
        mTable.setOutTime(outTime);
        mTable.setItemHeight(50);
        mTable.setIsLoadMore(true);
        mTable.setParseFunction(function (theDatas) {
            return parseGamesData(theDatas);
        });
        mTable.itemClickFunction(function (itemData, objId) {
            mFeedbackInfoObj.show(itemData);
        });
        mTable.loadData(SERVER_ADD + "payOrder/getBackwaters", mData);

        function parseGamesData(gamesData) {
            var returnObj = new Object();
            var datas = new Array();
            var objList = gamesData.result.list;
            var len = objList.length;
            for (var i = 0; i < len; i++) {
                var item = new Object();
                var payType;
                if (objList[i].dt["game_no"] != null) {
                    payType = objList[i].dt.pay_type_id.name + "(" + objList[i].dt["game_no"]["name"] + ")";
                } else {
                    payType = objList[i].dt.pay_type_id.name;
                }
                var str = "<div style=\"font-size:12px;color:#cccccc\">" + payType + "</div>";
                var timeStr = getTimeZoneE8(8, objList[i].order_time).format("yyyy-MM-dd hh:mm:ss");
                str = str + "<div style=\"font-size:10px;color:" + mainFontColorDeep + "\">" + timeStr + "</div>";
                item["note"] = str;
                var money = doubleValue(objList[i].amount);
                if (money >= 0) {
                    money = "<font color=" + winFontColor + ">+" + money + "</font>";
                } else {
                    money = "<font color=" + lossFontColor + ">-" + money + "</font>";
                }
                item["money"] = "<div style=\"font-size:14px\">" + money + "</div>";
                var status = objList[i].status;
                if (status == 1) {
                    status = "<font color=#CCCCCC>成功</font>";
                } else if (status == 9) {
                    status = "<font color=red>拒绝</font>";
                } else if (status == 0) {
                    status = "<font color=#CCCCCC>审核中</font>";
                }
                item["status"] = status;
                item["arrow"] = "<img src=" + themPath + "arrow.png height=8px />";
                item["details"] = objList[i];
                datas.push(item);
            }
            returnObj["result"] = new Object();
            returnObj["result"]["list"] = datas;
            return returnObj;
        }
    }
}
function feedbackInfoObj() {
    var mPage = new pageObj("feedbackInfoDiv", "返水详情");
    var itemData = null;

    this.init = function () {
        mPage.init();
    }

    this.show = function (item) {
        mPage.show();
        itemData = item;
        bindContentView();
    }

    function bindContentView() {
        // 顶部标题布局
        var topTitleDiv = "<div class=\"feedbackInfo_top_title\">%content%</div>";
        var topleft = "<div class=\"feedbackInfo_top_title_left\"><div style=\"width: 25px\"></div>%content%</div>";
        var topright = "<div class=\"feedbackInfo_top_title_right\">%content%<div style=\"width: 25px\"></div></div>";
        var leftTxt = "<div style=\"font-size: 14px;color: #cccccc\">%content%</div>";
        var rightTxt = "<div style=\"font-size: 14px;color: #999999\">%content%</div>";

        // 内容布局
        var contentInfoDiv = "<div style=\"width:100%;height: auto;padding-top:15px;padding-bottom:15px;box-sizing: border-box\">%content%</div>";
        var contentItemDiv = "<div class=\"feedbackInfo_content_item_div\">%content%</div>";
        var contentItemLeftDiv = "<div class=\"feedbackInfo_content_item_left\"><div style=\"width:25px;\"></div>%content%</div>";
        var contentItemRightDiv = "<div class=\"feedbackInfo_content_item_right\">%content%<div style=\"width:25px;\"></div></div>";
        var cLeftTxt = "<div style=\"font-size: 12px;color: #cccccc\">%content%</div>";
        var cRightTxt = "<div style=\"font-size: 12px;color: #cccccc\">%content%</div>";
        var cMaxRightTxt = "<div style=\"font-size: 20px;color: #cccccc\">%content%</div>";
        var devDiv = "<div style=\"width:100%;height: 20px;background-color: #2a2a2a;\"></div>";

        var infoObj = itemData.details;

        topleft = topleft.replace("%content%", leftTxt.replace("%content%", "返水记录"));

        var status = infoObj.status;
        if (status == 1) {
            status = "<font color=#cccccc>成功</font>";
        } else if (status == 9) {
            status = "<font color=red>拒绝</font>";
        } else if (status == 0) {
            status = "<font color=#cccccc>审核中</font>";
        }
        topright = topright.replace("%content%", rightTxt.replace("%content%", status));
        topTitleDiv = topTitleDiv.replace("%content%", topleft + topright);

        var cdivs = "";

        var amount = "<font color=" + winFontColor + ">+" + doubleValue(infoObj.amount) + "</font>";
        cdivs += contentItemDiv.replace("%content%", contentItemLeftDiv.replace("%content%",
            cLeftTxt.replace("%content%", "金额")) + contentItemRightDiv.replace("%content%",
                cMaxRightTxt.replace("%content%", amount)));

        var dateMs = "<font color=#cccccc>" +
            getTimeZoneE8(8, infoObj.order_time).format("yyyy-MM-dd hh:mm:ss") + "</font>";
        cdivs += contentItemDiv.replace("%content%", contentItemLeftDiv.replace("%content%",
            cLeftTxt.replace("%content%", "时间")) + contentItemRightDiv.replace("%content%",
                cRightTxt.replace("%content%", dateMs)));

        if (infoObj["game_rep_time"] != null) {
            var strTime = "<font color=#cccccc>" +
                getTimeZoneE8(8, infoObj.game_rep_time).format("yyyy-MM-dd") + "</font>";
            cdivs += contentItemDiv.replace("%content%", contentItemLeftDiv.replace("%content%",
                cLeftTxt.replace("%content%", "下注时间")) + contentItemRightDiv.replace("%content%",
                    cRightTxt.replace("%content%", strTime)));
        }

        var mtype;
        if (infoObj.dt["game_no"] != null) {
            mtype = infoObj.dt.pay_type_id.name + "(" + infoObj.dt["game_no"]["name"] + ")";
        } else {
            mtype = infoObj.dt.pay_type_id.name;
        }
        cdivs += contentItemDiv.replace("%content%", contentItemLeftDiv.replace("%content%",
            cLeftTxt.replace("%content%", "方式")) + contentItemRightDiv.replace("%content%",
                cRightTxt.replace("%content%", mtype)));

        var remark = infoObj.remark;
        if (remark == null) {
            remark = "无";
        } else {
            cdivs += contentItemDiv.replace("%content%", contentItemLeftDiv.replace("%content%",
                cLeftTxt.replace("%content%", "备注")) + contentItemRightDiv.replace("%content%",
                    cRightTxt.replace("%content%", remark)));
        }

        var theId = infoObj.id;
        cdivs += contentItemDiv.replace("%content%", contentItemLeftDiv.replace("%content%",
            cLeftTxt.replace("%content%", "单号")) + contentItemRightDiv.replace("%content%",
                cRightTxt.replace("%content%", theId)));

        contentInfoDiv = contentInfoDiv.replace("%content%", cdivs);

        $("#feedbackInfoDiv_content").html(topTitleDiv + devDiv + contentInfoDiv + devDiv);

        setContentStyle();
    }

    function setContentStyle() {
        $(".feedbackInfo_top_title").css({
            "width": "100%",
            "height": "50px",
            "display": "flex"
        });

        $(".feedbackInfo_top_title_left").css({
            "width": "60%",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center"
        });

        $(".feedbackInfo_top_title_right").css({
            "width": "40%",
            "display": "flex",
            "justify-content": "flex-end",
            "align-items": "center"
        });

        $(".feedbackInfo_content_item_div").css({
            "width": "100%",
            "display": "flex",
            "height": "40px",
            "justify-content": "space-between",
            "align-items": "center",
            "font-size": "12px"
        });

        $(".feedbackInfo_content_item_left").css({
            "width": "30%",
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center"
        });

        $(".feedbackInfo_content_item_right").css({
            "width": "70%",
            "display": "flex",
            "justify-content": "flex-end",
            "align-items": "center"
        });
    }
}
// 线上存款渠道
function DepositBindViewObj(rootViewId) {
    var rootId;
    var rootObj;
    var channelList;
    var selectChannel = null; // 选中的渠道,头部展示的渠道
    var fixedClickId = null;
    var channelClickId = null;
    var isBind = false;
    var isHideOCTypoe = false;
    var spinner = new Spinner({ "color": "white" });
    this.init = function () {
        rootId = rootViewId;
        rootObj = $("#" + rootId);
        rootObj.css({
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "background": "#383838",
        });
    }
    this.show = function () {
        if (!isBind) {
            if (onlinePayObj.isGetPayChannel()) {
                channelList = onlinePayObj.getPayChannelData();
                if (channelList != null && channelList["length"] > 0) {
                    bindFrameView();
                    isBind = true;
                } else {
                    var ms = "没有支付通道!";
                    bindFedView(rootId, ms);
                }
            } else {
                showLoad();
                onlinePayObj.getPayChannel(function (channels) {
                    closeLoad();
                    if (channels != null && channels["length"] > 0) {
                        channelList = channels;
                        bindFrameView();
                        isBind = true;
                    } else {
                        var ms = "没有支付通道!";
                        bindFedView(rootId, ms);
                    }
                });
            }
        } else {
            onlinePayObj.isChannelChanage(function (isChanage) {
                if (isChanage) {
                    rootObj.html("");
                    showLoad();
                    onlinePayObj.getPayChannel(function (channels) {
                        closeLoad();
                        if (channels != null && channels["length"] > 0) {
                            channelList = channels;
                            bindFrameView();
                            isBind = true;
                        } else {
                            var ms = "没有支付通道!";
                            bindFedView(rootId, ms);
                        }
                    });
                }
            });
        }
    }
    this.setHideOCType = setHideOCType;
    // 框架view
    function bindFrameView() {
        // bind基本界面框架
        var headDiv = "<div id=\"" + rootId + "_rgPaychannel_head_div\"></div>";
        var spDiv = "<div id=\"" + rootId + "_rgPaychannel_sp_div\">%content%</div>";
        var colorBk = "<div style=\"width: 5px;height: 15px;background-color: " + mainColor + "\"></div>";
        var tsTx = "<div style=\"width:10px\"></div><font color=" + mainColor + ">切换存款方式</font>";
        spDiv = spDiv.replace("%content%", colorBk + tsTx);
        var midDiv = "<div id=\"" + rootId + "_rgPaychannel_mid_div\"></div>";
        var dsDiv = "<div id=\"" + rootId + "_rgPaychannel_ds_div\">%content%</div>";
        var dsTe = "<div id=\"" + rootId + "_rgPaychannel_ds_te\"><font color=#B5B5B5>温馨提示</font></div>";
        var dsCn = "<div id=\"" + rootId + "_rgPaychannel_ds_cn\"></div>";
        var dsBtn = "<div id=\"" + rootId + "_rgPaychannel_ds_btn\">查看教程</div>";
        dsDiv = dsDiv.replace("%content%", dsTe + dsCn + dsBtn);
        rootObj.html(headDiv + spDiv + midDiv + dsDiv);
        setStyle();

        // bind充值内容
        bindHeadView();
        bindMidView();
        bindDsView();

        // 框架样式
        function setStyle() {
            $("#" + rootId + "_rgPaychannel_head_div").css({
                "align-items": "center",
                "text-align": "center",
                "width": "100%",
                "height": "auto",
                "padding-top": "15px",
                "padding-bottom": "15px",
                "padding-left": "12px",
                "padding-right": "12px",
                "box-sizing": "border-box"
            });
            $("#" + rootId + "_rgPaychannel_sp_div").css({
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center",
                "text-align": "center",
                "width": "100%",
                "height": "32px",
                "background": "#2D2D2D",
                "padding-top": "5px",
                "padding-bottom": "5px",
                "padding-left": "12px",
                "padding-right": "12px",
                "font-size": "14px",
                "box-sizing": "border-box"
            });
            $("#" + rootId + "_rgPaychannel_mid_div").css({
                "align-items": "center",
                "text-align": "center",
                "width": "100%",
                "height": "auto",
                "padding-top": "15px",
                "padding-bottom": "15px",
                "padding-left": "12px",
                "padding-right": "12px",
                "box-sizing": "border-box"
            });
            $("#" + rootId + "_rgPaychannel_ds_div").css({
                "align-items": "left",
                "text-align": "left",
                "width": "100%",
                "height": "auto",
                "padding-top": "0px",
                "padding-bottom": "15px",
                "padding-left": "18px",
                "padding-right": "18px",
                "box-sizing": "border-box"
            });
            $("#" + rootId + "_rgPaychannel_ds_te").css({
                "text-align": "left",
                "width": "auto",
                "height": "auto",
                "font-size": "15px"
            });
            $("#" + rootId + "_rgPaychannel_ds_cn").css({
                "text-align": "left",
                "width": "auto",
                "height": "auto",
                "font-size": "12px",
                "color": "#8D8D8D"
            });
            $("#" + rootId + "_rgPaychannel_ds_btn").css({
                "border-radius": "4px",
                "color": mainFontColor,
                "font-size": "12px",
                "background-color": mainColor,
                "width": "80px",
                "height": "25px",
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "margin-top": "5px",
                "padding": "10px",
                "box-sizing": "border-box"
            });
            setBtnOnTouchEvent($("#" + rootId + "_rgPaychannel_ds_btn"), function (mObj) {
                if (selectChannel != null) {
                    switch (selectChannel["channel_type"]) {
                        case 8:
                            myPJDApp.showAgentQRCode(themPath + "pay_channel_type_8_tutorial.jpg", "云闪付教程");
                            break;
                        case 9:
                            myPJDApp.showAgentQRCode(themPath + "pay_channel_type_9_tutorial.jpg", "快速充值");
                            break;
                        default: break;
                    }
                }
            }, mainColorDeep, mainColor, null);
        }
    }
    // 筹码view
    function bindHeadView(channelItem) {
        if (channelItem == null) {
            channelItem = getChannelByIndex(0, 0);
        } else {
            bindDsView(channelItem);
        }
        if (channelItem == null) { return; }
        selectChannel = channelItem;
        selectChannel.amount = null;
        fixedClickId = null;

        // 渠道名view
        var teL = "<font color=" + mainColor + ">您已选择</font>";
        var teM = "<font color=#C2C2C2>" + channelItem.name + "</font>";
        var teR = "<font color=" + mainColor + ">方式存款,请选择存款金额</font>";
        var topTe = "<div id=\"" + rootId + "_rgPaychannel_head_topTe\"><p style='overflow:hidden;text-overflow:ellipsis;white-space:nowrap'>" + teL + teM + teR + "</p></div>";

        // 输入view
        var input = "";
        var isinput = channelItem.user_input;
        var maxM = channelItem.max_amount;
        var minM = channelItem.min_amount;
        if (isinput == 0) { // 可自定义金额
            var inMs = "请输入" + minM + "-" + maxM;
            input = "<input id=\"" + rootId + "_rgPaychannel_head_topInput\" type=\"tel\"  placeholder=\"" + inMs + "\" />";
        }

        // 筹码view
        var cmDivs = "";
        var cmLineDiv = "<div class=\"" + rootId + "_rgPaychannel_head_topFixed_class\">%content%</div>";
        var cmItem = "<div id=\"" + rootId + "_%idtag%\" class=\"" + rootId + "_rgPaychannel_head_topFixedItem_class\">%content%</div>";
        var cmSp = "<div style=\"width:8px\"></div>";
        var fixedList = channelItem.fixed_values;
        if (fixedList != null && fixedList.length > 0) {
            var fLen = fixedList.length;
            var fLine;
            var fYu = fLen % 6;
            if (fYu == 0) {
                fLine = fLen / 6;
            } else {
                fLine = (fLen + (6 - fYu)) / 6;
            }
            for (var i = 1; i <= fLine; i++) {
                var startIndex = (i * 6) - 6;
                var cms = "";
                for (var p = 0; p < 6; p++) {
                    var index = p + startIndex;
                    if (index < fLen) {
                        var cm = "<font color=" + mainColor + ">" + fixedList[index] + "</font>";
                        var id = "topFixedItem_id_" + index + "_" + fixedList[index];
                        cms += cmItem.replace("%content%", cm).replace("%idtag%", id);
                        if (p < 5) {
                            cms += cmSp;
                        }
                    } else {
                        break;
                    }
                }
                cmDivs += cmLineDiv.replace("%content%", cms);
            }
        }
        $("#" + rootId + "_rgPaychannel_head_div").html(topTe + input + cmDivs);

        setStyle();
        function setStyle() {
            $("#" + rootId + "_rgPaychannel_head_topTe").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "text-align": "center",
                "width": "auto",
                "height": "auto",
                "font-size": "14px",
                "overflow": "hidden"
            });
            var inputObj = $("#" + rootId + "_rgPaychannel_head_topInput");
            if (inputObj != null) {
                inputObj.css({
                    "align-items": "center",
                    "text-align": "center",
                    "width": "100%",
                    "height": "40px",
                    "background-color": "white",
                    "outline": "none",
                    "border": "0px",
                    "border-radius": "5px",
                    "font-size": "16px",
                    "color": mainColor,
                    "margin-top": "10px",
                    "box-sizing": "border-box"
                });
            }
            $("." + rootId + "_rgPaychannel_head_topFixed_class").css({
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center",
                "text-align": "center",
                "width": "100%",
                "height": "auto",
                "margin-top": "15px",
                "box-sizing": "border-box"
            });
            var cmW = (screenW - 24 - (5 * 8)) / 6;
            $("." + rootId + "_rgPaychannel_head_topFixedItem_class").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "text-align": "center",
                "border": "1px solid " + mainColor,
                "width": cmW,
                "height": "22px",
                "background-color": "",
                "border-radius": "30px",
                "font-size": "14px",
                "padding": "5px",
                "box-sizing": "border-box"
            });
            // 点击事件处理
            $("." + rootId + "_rgPaychannel_head_topFixedItem_class").click(function () {
                var id = this.id;
                if (fixedClickId == id) {
                    return;
                }
                if (fixedClickId != null) {
                    $("#" + fixedClickId).css({
                        "background-color": ""
                    });
                }
                $("#" + id).css({
                    "background-color": mainColorDeep
                });
                var iLs = id.split("_");
                var iLn = iLs.length;
                var cmv = iLs[iLn - 1];
                if (inputObj != null) {
                    inputObj.val(cmv);
                }
                selectChannel.amount = cmv;
                fixedClickId = id;
                console.log("click fixed id: " + id);
            });
            // input实时监听
            if (inputObj != null) {
                inputObj.on("change", function () {
                    var vae = inputObj.val();
                    var vLen = vae.length;
                    if (isNaN(vae)) { // 非数字
                        inputObj.val(vae.substr(0, vLen - 1));
                        mToast.show("请输入纯数字!", "1", "middle");
                    } else { // 数字
                        selectChannel.amount = vae;
                        if (fixedClickId != null) {
                            $("#" + fixedClickId).css({
                                "background-color": ""
                            });
                            fixedClickId = null;
                        }
                    }
                    console.log("input rec change: " + vae);
                });
                inputObj.focus(function () {
                    var obj = new Object();
                    obj["inputObj"] = inputObj;
                    obj["maxLen"] = 16;
                    obj["FloatLimit"] = 2;
                    obj["isFunds"] = true;
                    mIndexPopWindowObj.show(2, obj);
                    document.activeElement.blur();
                });
            }
        }
    }
    // 渠道view
    function bindMidView() {
        var cLineDiv = "<div class=\"" + rootId + "_rgPaychannel_mid_line\">%content%</div>";
        var cItemDiv = "<div id=\"" + rootId + "_%idtag%\" class=\"" + rootId + "_rgPaychannel_mid_item\">%content%</div>";
        var cTbImg = "<img class=\"logoMinImage\" src=\"%srctag%\" />";
        var cArrowImg = "<img style=\"width:6px;height:8px;\" src=\"" + themPath + "arrow.png\"/>";
        var cName = "<div class=\"" + rootId + "_rgPaychannel_mid_item_name\">%content%</div>";
        // 下一步按钮
        var cBtn = "<div style=\"height:20px\"></div><div id=\"" + rootId + "_rgPaychannel_mid_btn\">下一步</div>";

        var cLen = channelList.length;
        var cLine;
        var cYu = cLen % 2;
        if (cYu == 0) {
            cLine = cLen / 2;
        } else {
            cLine = (cLen + (2 - cYu)) / 2;
        }
        var cLineDs = "";
        for (var i = 1; i <= cLine; i++) {
            var startIndex = i * 2 - 2;
            var citemDs = "";
            for (var p = 0; p < 2; p++) {
                var index = startIndex + p;
                if (index < channelList.length) {
                    var itemObj = channelList[index];
                    var list = itemObj.list;
                    var img = cTbImg.replace("%srctag%", itemObj.logo);
                    var name = cName.replace("%content%", itemObj.name);
                    var id = "rgPaychannel_mid_item_id_" + index;
                    if (list != null && list.length > 1) {
                        citemDs += cItemDiv
                            .replace("%content%", img + name + cArrowImg)
                            .replace("%idtag%", id);
                    } else {
                        citemDs += cItemDiv
                            .replace("%content%", img + name)
                            .replace("%idtag%", id);
                    }
                } else {
                    break;
                }
            }
            cLineDs += cLineDiv.replace("%content%", citemDs);
        }
        $("#" + rootId + "_rgPaychannel_mid_div").html(cLineDs + cBtn);

        setStyle();
        function setStyle() {
            $("." + rootId + "_rgPaychannel_mid_line").css({
                "display": "flex",
                "justify-content": "space-between",
                "align-items": "center",
                "width": "100%",
                "height": "auto",
                "margin-bottom": "8px",
                "box-sizing": "border-box"
            });
            var iW = (screenW - 24 - 10) / 2;
            $("." + rootId + "_rgPaychannel_mid_item").css({
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center",
                "width": iW,
                "height": "42px",
                "padding-top": "5px",
                "padding-bottom": "5px",
                "padding-left": "10px",
                "padding-right": "5px",
                "border-radius": "6px",
                "background": "#2D2D2D",
                "box-sizing": "border-box",
                "font-size": "15px",
                "color": "#C4C4C4"
            });
            var nW = iW - 15 - 24 - 6 - 8;
            $("." + rootId + "_rgPaychannel_mid_item_name").css({
                "text-align": "left",
                "margin-left": "8px",
                "width": nW,
                "height": "auto",
                "box-sizing": "border-box"
            });
            $("#" + rootId + "_rgPaychannel_mid_btn").css({
                "border-radius": "20px",
                "color": mainFontColor,
                "font-size": "14px",
                "background-color": mainColor,
                "width": "100%",
                "height": "40px",
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "padding": "10px",
                "box-sizing": "border-box"
            });
            $("." + rootId + "_rgPaychannel_mid_item").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    var id = mObj.id;
                    var idList = id.split("_");
                    var iLen = idList.length;
                    var index = idList[iLen - 1];
                    var ctypeItem = channelList[index];
                    var list = ctypeItem.list;
                    if (list == null) return;
                    if (list["length"] == 1) {
                        bindHeadView(list[0]);
                        setTypeSedStyle(id);
                        typeIndex = index;
                        channelIndex = 0;
                    } else if (list["length"] > 1) {
                        showCTypeList(list, id);
                    }
                }, "#161616", "#2D2D2D", null);
            });
            setBtnOnTouchEvent($("#" + rootId + "_rgPaychannel_mid_btn"), function (mObj) {
                if (!checkPay(selectChannel)) return;
                var type = selectChannel["channel_type"];
                switch (type) {
                    case "_offline_channel_wxto_":
                        myPJDApp.showIncomeOffline(selectChannel);
                        return;
                    case "_offline_channel_zfbto_":
                        myPJDApp.showIncomeOffline(selectChannel);
                        return;
                    case "_offline_channel_xxto_":
                        myPJDApp.showIncomeOffline(selectChannel);
                        return;
                    default:
                        break;
                }
                var cId = selectChannel["id"];
                var amount = selectChannel["amount"];
                if (isInApp()) {
                    var obj = new Object();
                    obj["channelId"] = cId;
                    obj["amount"] = amount;
                    myPJDApp.showInComeOrder(obj);
                } else {
                    var cIx = cId + "_" + amount;
                    window.open("payOnline.html?user=name&channleIndex=" + cIx + "&type=0");
                }
                console.log("selected pay cId: " + cId + " amount: " + amount);
            }, mainColorDeep, mainColor, null);
            setTypeSedStyle(rootId + "_rgPaychannel_mid_item_id_" + 0);
            setHideOCType(isHideOCTypoe);
        }
    }
    // 描述view
    function bindDsView(channelItem) {
        if (channelItem == null) {
            channelItem = getChannelByIndex(0, 0);
        }
        if (channelItem == null) {
            $("#" + rootId + "_rgPaychannel_ds_div").css({ "display": "none" });
            return;
        }
        var ds = channelItem["remark"];
        console.log(channelItem);
        if (ds != null && ds.trim().length > 0) {
            $("#" + rootId + "_rgPaychannel_ds_div").css({ "display": "block" });
            $("#" + rootId + "_rgPaychannel_ds_cn").html(ds);
            if (channelItem["channel_type"] == 8 || channelItem["channel_type"] == 9) {
                $("#" + rootId + "_rgPaychannel_ds_btn").css({ "display": "flex" });
            } else {
                $("#" + rootId + "_rgPaychannel_ds_btn").css({ "display": "none" });
            }
        } else {
            $("#" + rootId + "_rgPaychannel_ds_div").css({ "display": "none" });
        }
    }
    // 选中渠道样式
    function setTypeSedStyle(id) {
        if (channelClickId == id) {
            return;
        }
        if (channelClickId != null) {
            $("#" + channelClickId).css({
                "border": "",
                "color": "#C4C4C4"
            });
        }
        $("#" + id).css({
            "border": "1px solid " + mainColor,
            "color": mainColor
        });
        channelClickId = id;
    }
    function setHideOCType(isHide) {
        if (channelList == null) {
            isHideOCTypoe = isHide;
        }
        isHideOCTypoe = isHide;
        var len = channelList.length;
        for (var i = 0; i < len; i++) {
            var item = channelList[i];
            if (item.id == "off_rec_channel") {
                var obj = $("#" + rootId + "_rgPaychannel_mid_item_id_" + i);
                if (obj == null) {
                    return;
                }
                if (isHide) {
                    obj.css({
                        "display": "none"
                    });
                } else {
                    obj.css({
                        "display": "flex"
                    });
                }
                return;
            }
        }
    }
    // 渠道选中项
    var typeIndex = 0; // 上层
    var channelIndex = 0; // 下层
    function showCTypeList(list, id) {
        var ixList = id.split("_");
        var ixLen = ixList.length;
        var ix = ixList[ixLen - 1];
        var sedIndex = -1;
        if (typeIndex == ix) { sedIndex = channelIndex; }
        mMsgBox.showList("选择具体方式", list, "name", sedIndex, function (index) {
            bindHeadView(list[index]);
            setTypeSedStyle(id);
            typeIndex = ix;
            channelIndex = index;
        });
    }
    function showLoad() {
        spinner.spin(document.getElementById(rootId));
    }
    function closeLoad() {
        spinner.spin();
        rootObj.html("");
    }
    function getChannelByIndex(rootIndex, cIndex) {
        if (rootIndex < 0 || rootIndex >= channelList.length) {
            return null;
        }
        var childList = channelList[cIndex]["list"];
        if (cIndex < 0 || cIndex >= childList.length) {
            return null;
        }
        return childList[cIndex];
    }
    function checkPay(sedChannel) {
        if (sedChannel == null) {
            mToast.show("请选择存款渠道!", "1", "middle");
            return false;
        }
        var isValid = false;
        var amount = sedChannel.amount;
        var min = selectChannel.min_amount;
        var max = selectChannel.max_amount;
        if (amount == "" || amount == null) {
            mToast.show("请输入存款金额!", "1", "middle");
            isValid = false;
        } else if (!isNaN(amount)) {
            amount = Number(amount);
            if ((amount >= min) && (amount <= max)) {
                isValid = true;
            } else {
                mToast.show("存款金额要在" + min + "-" + max + "之间哦!", "1", "middle");
                isValid = false;
            }
        } else {
            mToast.show("请输入正确的金额!", "1", "middle");
            isValid = false;
        }
        return isValid;
    }
}
// 线上存款
function incomeOnlineObj() {
    var mPage = new pageObj("incomeOnlineDiv", "在线存款");
    var mLoader = new Spinner({ "color": "white" });
    var payOrderInfo = null;
    var isBack = false;
    this.init = function () {
        mPage.init(function () { isBack = true; });
        $("#incomeOnlineDiv_content_Frame").css({
            "width": "100%",
            "height": screenH - topH
        });
        $("#incomeOnlineDiv_content_Fed").css({
            "width": "100%",
            "height": screenH - topH
        });
        $("#incomeOnlineDiv_content_Loading").css({
            "width": "100%",
            "height": screenH - topH,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "background": pageBgColor
        });
        $("#incomeOnlineDiv_content_QrCode_img").css({
            "width": screenW - 65,
            "border-radius": "10px",
            "padding": "15px",
            "background-color": "white",
            "border": "1px solid " + mainColor,
            "box-sizing": "border-box"
        });
    }
    this.show = function (orderInfo) {
        if (orderInfo == null) { return; }
        mPage.show(function () {
            $("#incomeOnlineDiv_content_Frame").attr("src", "pay.html");
            $("#incomeOnlineDiv_content_QrCode_amount").html("");
            $("#incomeOnlineDiv_content_QrCode_time").html("");
            $("#incomeOnlineDiv_content_QrCode_notic").html("");
            $("#incomeOnlineDiv_content_QrCode_img").html("");
            $("#incomeOnlineDiv_content_QrCode_note").html("");
            $("#incomeOnlineDiv_content_QrCode_order").html("");
            $("#incomeOnlineDiv_content_Fed").html("");
        });
        mPage.hiddenFunds();
        isBack = false;
        payOrderInfo = orderInfo;
        addPayOrder();
    }
    this.externalLink = externalLink;
    function showLoading() {
        $("#incomeOnlineDiv_content_Loading").css({ "display": "flex" });
        mLoader.spin(o("incomeOnlineDiv_content_Loading"));
    }
    function closeLoading() {
        mLoader.spin();
        $("#incomeOnlineDiv_content_Loading").css({ "display": "none" });
    }
    function addPayOrder() {
        var mDataObj = new Object();
        mDataObj["amount"] = payOrderInfo["amount"];
        mDataObj["channelId"] = payOrderInfo["channelId"];
        mDataObj["requestType"] = "json";
        mDataObj["rand"] = randomString();
        showLoading();
        requestAjax("payOrder/addPayOrder", mDataObj, function (jsonObj) {
            if (isBack) { return; }
            if (jsonObj["code"] == 0) { // OK
                var info = jsonObj["result"];
                var type = info["payInfo"]["type"];
                if (type == 2) {
                    bindQrCode(info);
                    console.log("addPayOrder bindQrCode");
                } else if (type == 3 || type == 6) {
                    var content = info["payInfo"]["content"];
                    var cList = content.split(".");
                    var gs = cList[cList.length - 1].toLowerCase();
                    console.log("payInfo content gs:" + gs);
                    if (gs == "png" || gs == "jpg") {
                        var img = "<img src=\"" + content + "\" style=\"width:100%\"/>";
                        bindContent(img);
                        console.log("addPayOrder bindContent");
                    } else {
                        bindFrame(content);
                        console.log("addPayOrder bindFrame");
                    }
                } else if (type == 4 || type == 5) {
                    bindContent(info["payInfo"]["content"]);
                    console.log("addPayOrder bindContent");
                }
                setTimeout(function () { closeLoading(); }, 1000);
            } else if (jsonObj["code"] == 100) { // 登录失效
                closeLoading();
                bindFed("登录信息已失效,请重新登录!");
                appLogout(100);
            } else { // 其他错误
                closeLoading();
                bindFed("订单提交失败," + mLangObj.getZHByCode(jsonObj["tipMessage"]));
                setTimeout(function () {
                    if (isBack) { return }
                    backClickFun();
                }, 2000);
            }
        }, function (error) { // 请求错误
            if (isBack) { return; }
            closeLoading();
            bindFed("订单提交失败,请重试!");
            setTimeout(function () {
                if (isBack) { return }
                backClickFun();
            }, 2000);
        });
    }
    function bindQrCode(info) {
        $("#incomeOnlineDiv_content_QrCode").css({ "display": "flex" });
        $("#incomeOnlineDiv_content_Frame").css({ "display": "none" });
        $("#incomeOnlineDiv_content_Fed").css({ "display": "none" });
        // 结构
        $("#incomeOnlineDiv_content_QrCode_order").html("订单号：" + info["id"]);
        $("#incomeOnlineDiv_content_QrCode_amount").html("<font style=\"font-size:14px\">¥</font><b>" + info["amount"] + "</b>");
        $("#incomeOnlineDiv_content_QrCode_time").html(getTimeZoneE8(8, info["order_time"]).format("yyyy-MM-dd hh:mm:ss"));
        $("#incomeOnlineDiv_content_QrCode_notic").html(info["dt"]["channel_id"]["name"]);
        $("#incomeOnlineDiv_content_QrCode_img").html("");
        new QRCode("incomeOnlineDiv_content_QrCode_img", {
            text: info["payInfo"]["content"],
            width: screenW - 100,
            height: screenW - 100,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        $("#incomeOnlineDiv_content_QrCode_note").html("截屏保存二维码至相册!");
    }
    function bindFrame(src) {
        $("#incomeOnlineDiv_content_Frame").css({ "display": "block" });
        $("#incomeOnlineDiv_content_QrCode").css({ "display": "none" });
        $("#incomeOnlineDiv_content_Fed").css({ "display": "none" });
        // 链接
        $("#incomeOnlineDiv_content_Frame").attr("src", src);
    }
    function bindContent(ms) {
        $("#incomeOnlineDiv_content_Frame").css({ "display": "block" });
        $("#incomeOnlineDiv_content_QrCode").css({ "display": "none" });
        $("#incomeOnlineDiv_content_Fed").css({ "display": "none" });
        // 内容
        $("#incomeOnlineDiv_content_Frame").contents().find("body").append(ms);
    }
    function bindFed(ms) {
        $("#incomeOnlineDiv_content_Fed").css({ "display": "block" });
        $("#incomeOnlineDiv_content_QrCode").css({ "display": "none" });
        $("#incomeOnlineDiv_content_Frame").css({ "display": "none" });
        bindFedView("incomeOnlineDiv_content_Fed", ms);
    }
    function externalLink(link) {
        if (isBack || link == null || link.trim() == "") {
            return;
        }
        if (link.indexOf("127.0.0.1") == -1) {
            bindFrame(link);
        }
    }
}
// 线下存款
function incomeOfflineObj() {
    var rootId = "incomeOfflineDiv";
    var mPage = new pageObj(rootId, "线下存款");
    var mIncomeOfflineSuccessObj = new incomeOfflineSuccessObj();
    var contentObj = $("#" + rootId + "_content");
    var bankObj;
    var item;
    var isBack = true;
    var succId;
    this.init = function () {
        mPage.init(function () {
            succId = null;
            isBack = true;
        });
        contentObj.css({
            "position": "relative",
            "overflow-x": "hidden",
            "overflow-y": "auto",
        });
        bindView();
        mIncomeOfflineSuccessObj.init();
    }
    this.show = function (im) {
        mPage.show(); isBack = false;
        mPage.hiddenFunds();
        mPage.setTitle(im["name"]);
        $("#" + rootId + "_root_sub").css({ "display": "flex" });
        item = im;
        setOpenTypeFromView();
        var am = item["amount"].toString();
        var rm1 = Math.floor(Math.random() * 9) + 1;
        var rm2 = Math.floor(Math.random() * 9) + 1;
        if (am.indexOf(".") != -1) {
            var index = am.indexOf(".");
            am = am.substr(0, index);
            am = Number(am + "." + rm1.toString() + rm2.toString());
        } else {
            am = Number(am + "." + rm1.toString() + rm2.toString());
        }
        if (am > item["max_amount"]) {
            am = am - 1;
        }
        item["amount"] = am;
        loadBankList();
    }
    function bindView() {
        var root_main = "<div id=\"" + rootId + "_root_main\" style=\"position:absolute;top:0px;left:0px;z-index:8\">[content]<div>";
        var root_sub = "<div id=\"" + rootId + "_root_sub\" style=\"position:absolute;top:0px;left:0px;z-index:9\">[content]</div>";

        var sp_min = "<div style=\"height:10px\"></div>";
        var sp_mmin = "<div style=\"height:5px\"></div>";
        var sp_mid = "<div style=\"height:15px\"></div>";
        var sp_max = "<div style=\"height:20px\"></div>";
        var sp_mmax = "<div style=\"height:40px\"></div>";
        var xsp_min = "<div style=\"width:5px\"></div>";
        var sp_back = "<div style=\"width:100%;height:20px;background:#161616\"></div>";

        var sub_win = "<div id=\"" + rootId + "_root_sub_win\">[content]</div>";
        var sub_txt = "<div id=\"" + rootId + "_root_sub_txt\">为了能更快速地处理您的存款,<br>请务必照此精确到分的金额进行转账!</div>";
        var sub_btn = "<div id=\"" + rootId + "_root_sub_btn\">知道了</div>";
        var sub_line = "<div class=\"" + rootId + "_root_sub_line\">[content]</div>";
        var sub_arrow = "<div id=\"" + rootId + "_root_sub_arrow\"></div>";
        sub_win = sub_win.replace("[content]", sub_txt + sp_max + sub_btn);
        root_sub = root_sub.replace("[content]", sub_line.replace("[content]", sub_arrow) + sub_win);

        var top = "<div id=\"" + rootId + "_main_top\">已经为您生成一个待完成的支付宝转银行卡订单,信息如下 :</div>";

        var mid = "<div id=\"" + rootId + "_main_mid\">[content]</div>";
        var mid_line = "<div class=\"" + rootId + "_mid_line\">[content]</div>";
        var mid_line_left = "<div class=\"" + rootId + "_mid_left\">[content]</div>";
        var mid_line_1_left = mid_line_left.replace("[content]", "存款订单号 :");
        var mid_line_2_left = mid_line_left.replace("[content]", "存款金额 :");
        var mid_line_3_left = mid_line_left.replace("[content]", "存款人姓名 :");
        var mid_line_1_right = "<div id=\"" + rootId + "_mid_1_right\">TNF9999999999999</div>";
        var mid_line_2_right = "<div id=\"" + rootId + "_mid_2_right\">200.12元</div>";
        var mid_line_3_right = "<div id=\"" + rootId + "_mid_3_right\">王小明</div>";
        var mid_bot_ts = "<div id=\"" + rootId + "_mid_bot_ts\">*若您的支付宝账户姓名与在本APP填写的真实姓名不一致,请联系在线客服!</div>";
        var mid_line_1 = mid_line.replace("[content]", mid_line_1_left + mid_line_1_right);
        var mid_line_2 = mid_line.replace("[content]", mid_line_2_left + mid_line_2_right);
        var mid_line_3 = mid_line.replace("[content]", mid_line_3_left + mid_line_3_right);
        mid = mid.replace("[content]", mid_line_1 + sp_min + mid_line_2 + sp_min + mid_line_3 + sp_max + mid_bot_ts);

        var bot = "<div id=\"" + rootId + "_main_bot\">[content]</div>";
        var bot_title = "<div id=\"" + rootId + "_bot_title\">接下来请打开您的支付宝APP,向以下银行卡账号进行转账 :</div>";
        var bot_sub_title = "<div id=\"" + rootId + "_bot_sub_title\">如何使用支付宝向银行卡转账?</div>";
        var bot_bank = "<div id=\"" + rootId + "_bot_bank\">[content]</div>";
        var bot_bank_line = "<div class=\"" + rootId + "_bot_bank_line\">[content]</div>";
        var bot_bank_line_left = "<div class=\"" + rootId + "_bot_bank_left\">[content]</div>";
        var bot_bank_line_1_left = bot_bank_line_left.replace("[content]", "银行名称 :");
        var bot_bank_line_2_left = bot_bank_line_left.replace("[content]", "开户姓名 :");
        var bot_bank_line_3_left = bot_bank_line_left.replace("[content]", "账号 :");
        var bot_bank_line_4_left = bot_bank_line_left.replace("[content]", "转账金额 :");
        var bot_bank_line_right = "<div class=\"" + rootId + "_bot_bank_right\">[content]</div>";
        var bot_bank_line_right_txt = "<div id=\"[id]\" class=\"" + rootId + "_bot_bank_right_txt\">[content]</div>";
        var bot_bank_line_right_copy = "<div id=\"[id]\" class=\"" + rootId + "_bot_bank_right_copy\">复制</div>";
        // 银行名称
        var temp = bot_bank_line_right_txt.replace("[id]", rootId + "_bot_bank_right_txt_bankname").replace("[content]", "银行名称")
            + xsp_min + bot_bank_line_right_copy.replace("[id]", rootId + "_bot_bank_right_copy_bankname");
        var bot_bank_line_1_right = bot_bank_line_right.replace("[content]", temp);
        // 开户姓名
        temp = bot_bank_line_right_txt.replace("[id]", rootId + "_bot_bank_right_txt_name").replace("[content]", "开户姓名")
            + xsp_min + bot_bank_line_right_copy.replace("[id]", rootId + "_bot_bank_right_copy_name");
        var bot_bank_line_2_right = bot_bank_line_right.replace("[content]", temp);
        // 账号
        temp = bot_bank_line_right_txt.replace("[id]", rootId + "_bot_bank_right_txt_user").replace("[content]", "账号")
            + xsp_min + bot_bank_line_right_copy.replace("[id]", rootId + "_bot_bank_right_copy_user");
        var bot_bank_line_3_right = bot_bank_line_right.replace("[content]", temp);
        // 转账金额
        temp = bot_bank_line_right_txt.replace("[id]", rootId + "_bot_bank_right_txt_money").replace("[content]", "转账金额")
            + xsp_min + bot_bank_line_right_copy.replace("[id]", rootId + "_bot_bank_right_copy_money");
        var bot_bank_line_4_right = bot_bank_line_right.replace("[content]", temp);
        var bot_bank_line_1 = bot_bank_line.replace("[content]", bot_bank_line_1_left + bot_bank_line_1_right);
        var bot_bank_line_2 = bot_bank_line.replace("[content]", bot_bank_line_2_left + bot_bank_line_2_right);
        var bot_bank_line_3 = bot_bank_line.replace("[content]", bot_bank_line_3_left + bot_bank_line_3_right);
        var bot_bank_line_4 = bot_bank_line.replace("[content]", bot_bank_line_4_left + bot_bank_line_4_right);
        bot_bank = bot_bank.replace("[content]", bot_bank_line_1 + sp_mid + bot_bank_line_2 + sp_mid + bot_bank_line_3 + sp_mid + bot_bank_line_4);
        var bot_bot_ts = "<div id=\"" + rootId + "_bot_bot_ts\">*请勿保存我们的收款银行账号信息,我们会不定时使用不同的收款银行账号!</div>";
        var bot_btn = "<div id=\"" + rootId + "_bot_btn\">已通过支付宝完成转账,提交审核!</div>";
        bot = bot.replace("[content]", bot_title + sp_mmin + bot_sub_title + sp_mid + bot_bank + sp_mid + bot_bot_ts + sp_mmax + bot_btn);
        root_main = root_main.replace("[content]", top + sp_back + mid + sp_back + bot);
        contentObj.html(root_main + root_sub);
        setStyle();
    }
    function loadBankList() {
        mLoader.show("loadBank");
        requestAjax("operatorBank/getOperatorBanks", { "requestType": "json" }, function (jsonObj) {
            var code = jsonObj["code"];
            if (code == 0) {
                bankObj = jsonObj["result"][0];
                bindBank();
                submitDeposit();
            } else if (code == 100) {
                mLoader.unShow("loadBank");
                backClickFun();
                mToast.show("登录失效,请重新登录!", 1, "middle");
                appLogout(0);
            } else {
                mLoader.unShow("loadBank");
                backClickFun();
                mToast.show("获取银行卡列表失败,请重试!<br>" + mLangObj.getZHByCode(jsonObj["tipMessage"]), 2, "middle");
            }
        }, function (error) {
            mLoader.unShow("loadBank");
            backClickFun();
            mToast.show("获取银行卡列表失败,请重试!", 1, "middle");
        });
    }
    function bindBank() {
        $("#" + rootId + "_bot_bank_right_txt_bankname").html(bankObj["open_bank"]);
        $("#" + rootId + "_bot_bank_right_txt_name").html(bankObj["account"]);
        $("#" + rootId + "_bot_bank_right_txt_user").html(bankObj["cardno"]);
        $("#" + rootId + "_bot_bank_right_txt_money").html(item["amount"]);
        $("#" + rootId + "_mid_2_right").html(item["amount"] + "元");
        $("#" + rootId + "_mid_3_right").html(userInfo["u_name"]);
    }
    function submitDeposit() {
        var dataObj = new Object();
        dataObj["amount"] = item["amount"];
        dataObj["operatorBankId"] = bankObj["id"];
        dataObj["depositTypeId"] = depositType[0]["id"];
        dataObj["username"] = userInfo["u_name"];
        dataObj["depositTime"] = getTimeZoneE8(timeZone, new Date()).format("yyyy-MM-dd hh:mm:ss");
        dataObj["rand"] = randomString();
        dataObj["requestType"] = "json";
        requestAjax("payOrder/addDepositOrder", dataObj, function (jsonObj) {
            mLoader.unShow("loadBank");
            var code = jsonObj["code"];
            if (code == 0) {
                mUserObj.getMoneyBag();
                var result = jsonObj["result"];
                succId = result["id"];
                $("#" + rootId + "_mid_1_right").html(succId);
            } else if (code == 100) {
                backClickFun();
                mToast.show("登录失效,请重新登录!", 1, "middle");
                appLogout(0);
            } else {
                backClickFun();
                mToast.show("提交存款信息失败!<br>" + mLangObj.getZHByCode(jsonObj["tipMessage"]), 2, "middle");
            }
        }, function (error) {
            mLoader.unShow("loadBank");
            backClickFun();
            mToast.show("提交存款信息失败!", 1, "middle");
        });
    }
    function setOpenTypeFromView() {
        var type = item["channel_type"];
        switch (type) {
            case "_offline_channel_wxto_":
                $("#" + rootId + "_main_top").html("已经为您生成一个待完成的微信转银行卡订单,信息如下 :");
                $("#" + rootId + "_mid_bot_ts").html("*若您的微信账户姓名与在本APP填写的真实姓名不一致,请联系在线客服!");
                $("#" + rootId + "_bot_title").html("接下来请打开您的微信APP,向以下银行卡账号进行转账 :");
                $("#" + rootId + "_bot_sub_title").html("如何使用微信向银行卡转账?");
                $("#" + rootId + "_bot_btn").html("已通过微信完成转账,提交审核!");
                break;
            case "_offline_channel_zfbto_":
                $("#" + rootId + "_main_top").html("已经为您生成一个待完成的支付宝转银行卡订单,信息如下 :");
                $("#" + rootId + "_mid_bot_ts").html("*若您的支付宝账户姓名与在本APP填写的真实姓名不一致,请联系在线客服!");
                $("#" + rootId + "_bot_title").html("接下来请打开您的支付宝APP,向以下银行卡账号进行转账 :");
                $("#" + rootId + "_bot_sub_title").html("如何使用支付宝向银行卡转账?");
                $("#" + rootId + "_bot_btn").html("已通过支付宝完成转账,提交审核!");
                break;
            case "_offline_channel_xxto_":
                $("#" + rootId + "_main_top").html("已经为您生成一个待完成的网银转银行卡订单,信息如下 :");
                $("#" + rootId + "_mid_bot_ts").html("*若您的网银账户姓名与在本APP填写的真实姓名不一致,请联系在线客服!");
                $("#" + rootId + "_bot_title").html("接下来请打开您的网银APP,向以下银行卡账号进行转账 :");
                $("#" + rootId + "_bot_sub_title").html("");
                $("#" + rootId + "_bot_btn").html("已通过网银完成转账,提交审核!");
                break;
            default:
                break;
        }
    }
    function setStyle() {
        $("#" + rootId + "_root_main").css({
            "width": "100%",
            "height": "auto",
            "overflow": "hidden",
            "display": "flex",
            "justify-content": "flex-start",
            "flex-direction": "column",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_root_sub").css({
            "width": "100%",
            "height": screenH - topH,
            "overflow": "hidden",
            "display": "flex",
            "justify-content": "flex-start",
            "flex-direction": "column",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_main_top").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "100%",
            "height": "60px",
            "padding": "10px",
            "color": "#BBBBBB",
            "font-size": "12px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_main_mid").css({
            "display": "flex",
            "justify-content": "flex-start",
            "flex-direction": "column",
            "align-items": "center",
            "width": "100%",
            "padding": "20px 15px 20px 15px",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_mid_line").css({
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "width": "100%",
            "height": "auto",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_mid_left").css({
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "color": "#919191",
            "font-size": "14px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_mid_1_right").css({
            "display": "flex",
            "justify-content": "flex-end",
            "align-items": "center",
            "color": "#BBBBBB",
            "font-size": "14px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_mid_2_right").css({
            "border-radius": "6px",
            "border": "1px solid " + "#EB5750",
            "color": "#EB5750",
            "font-size": "16px",
            "background-color": "",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "2px 10px 2px 10px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_mid_3_right").css({
            "display": "flex",
            "justify-content": "flex-end",
            "align-items": "center",
            "color": "#BBBBBB",
            "font-size": "14px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_mid_bot_ts").css({
            "width": "100%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "color": "#EB5750",
            "font-size": "10px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_main_bot").css({
            "display": "flex",
            "justify-content": "flex-start",
            "flex-direction": "column",
            "align-items": "center",
            "width": "100%",
            "height": "auto",
            "padding": "20px 15px 20px 15px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_bot_title").css({
            "width": "100%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "color": "#BBBBBB",
            "font-size": "12px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_bot_sub_title").css({
            "width": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "text-decoration": "underline",
            "color": "#65789B",
            "font-size": "10px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_bot_bank").css({
            "width": "100%",
            "border-radius": "14px",
            "border": "1px solid " + "#464646",
            "background-color": "#222222",
            "display": "flex",
            "justify-content": "flex-start",
            "flex-direction": "column",
            "align-items": "center",
            "padding": "20px 15px 20px 15px",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_bot_bank_line").css({
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "width": "100%",
            "height": "auto",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_bot_bank_left").css({
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
            "color": "#919191",
            "font-size": "14px",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_bot_bank_right").css({
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_bot_bank_right_txt").css({
            "display": "flex",
            "justify-content": "flex-end",
            "align-items": "center",
            "color": "#BBBBBB",
            "font-size": "14px",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_bot_bank_right_copy").css({
            "border-radius": "6px",
            "color": "white",
            "font-size": "12px",
            "background-color": "#6F87B4",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "2px 5px 2px 5px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_bot_bot_ts").css({
            "width": "100%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "color": "#EB5750",
            "font-size": "10px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_bot_btn").css({
            "width": "100%",
            "height": "45px",
            "border-radius": "25px",
            "color": "white",
            "font-size": "16px",
            "background-color": mainColor,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "2px 5px 2px 5px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_root_sub_win").css({
            "width": "93%",
            "border-radius": "6px",
            "background-color": "#EB5750",
            "display": "flex",
            "justify-content": "flex-start",
            "flex-direction": "column",
            "align-items": "center",
            "padding": "20px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_root_sub_txt").css({
            "width": "auto",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "color": "white",
            "font-size": "16px",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_root_sub_btn").css({
            "width": "100px",
            "border-radius": "6px",
            "border": "1px solid white",
            "color": "white",
            "font-size": "16px",
            "background-color": "",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "2px 5px 2px 5px",
            "box-sizing": "border-box"
        });
        $("." + rootId + "_root_sub_line").css({
            "width": "80%",
            "height": "auto",
            "margin-top": "160px",
            "display": "flex",
            "justify-content": "flex-end",
            "align-items": "center",
            "box-sizing": "border-box"
        });
        $("#" + rootId + "_root_sub_arrow").css({
            "width": 0,
            "height": 0,
            "border-left": "7.5px solid transparent",
            "border-right": "7.5px solid transparent",
            "border-bottom": "15px solid #EB5750"
        });
        // 复制按钮
        $("." + rootId + "_bot_bank_right_copy").each(function () {
            setBtnOnTouchEvent($(this), function (obj) {
                var id = obj.id;
                var iList = id.split("_");
                var iLen = iList.length;
                iList[iLen - 2] = "txt";
                id = iList.join("_");
                var val = $("#" + id).html();
                copyInApp(val);
            }, "#37415C", "#6F87B4", null);
        });
        // 提交按钮
        setBtnOnTouchEvent($("#" + rootId + "_bot_btn"), function (obj) {
            if (succId == null) return;
            var id = succId;
            mMsgBox.show("线下银行汇款", userInfo["u_name"] + "您是否向" + bankObj["account"] + "汇款" + item["amount"] + "元?", function () {
                requestAjax("payOrder/confirmDepositOrder", "orderId=" + id, function (jsonObj) {
                    var obj = jsonObj["code"];
                    if(obj == 0){
                        backClickFun();
                        mIncomeOfflineSuccessObj.show(id);
                    } else {
                        mToast.show("存款失败,请重试!");
                    }
                }, function (error) {
                    mToast.show("存款失败,请重试!");
                });
            });
        }, mainColorDeep, mainColor, null);
        // 金额提示确认按钮
        setBtnOnTouchEvent($("#" + rootId + "_root_sub_btn"), function (obj) {
            $("#" + rootId + "_root_sub").css({ "display": "none" });
        }, "#752C28", "", null);
        // 支付教程
        setBtnOnTouchEvent($("#" + rootId + "_bot_sub_title"), function (obj) {
            var id = obj.id
            var type = item["channel_type"]
            if (type != null) {
                switch (type) {
                    case "_offline_channel_wxto_":
                        myPJDApp.showAgentQRCode(themPath + "pay_channel_type_wx_tutorial.png", "微信转银行卡教程");
                        break;
                    case "_offline_channel_zfbto_":
                        myPJDApp.showAgentQRCode(themPath + "pay_channel_type_zfb_tutorial.png", "支付宝转银行卡");
                        break;
                }
            }
        }, "#323C4D", "", null);
    }
}
function incomeOfflineSuccessObj() {
    var mPage = new pageObj("incomeOfflineSuccessDiv", "存款成功");
    this.init = function () {
        mPage.init();
        mPage.hiddenTop();
        $("#incomeOfflineSuccessDiv_content").css({
            "height": screenH
        });
        $("#incomeOfflineSuccessDiv_content_successText").css({
            "color": mainColor,
            "font-size": "20px",
            "line-height": "200%"
        });
        $("#incomeOfflineSuccessDiv_content_notic").css({
            "color": mainFontColorMore,
            "font-size": "16px"
        });
        setBtnOnTouchEvent($("#incomeOfflineSuccessDiv_content_sure"), function () {
            backClickFun();
        }, mainColorDeep, mainColor, null);
    }
    this.show = function (orderNO) {
        mPage.show();
        mPage.hiddenFunds();
        $("#incomeOfflineSuccessDiv_content_orderNO").html(orderNO);
    }
}
