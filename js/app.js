var screenW;
var screenH;
var topH = 45;
var chMenuH = 62;
var menuH = 45;
var startEvent;
var moveEvent;
var endEvent;
var cancelEvent;
var isSound = true;
var isLoaderShow = false;
var isADClosed = false;
var startX = 0;
var startY = 0;
var isAndroidFlag = false;
var userId = "";
var userInfo = null;
var userMoney = 0.00;
var userMoneyInterest = 0.00;
var userMoneyBag = null;
var moneyCanSee = false;
var bankInfo = null;
var agentRankingList = null;
var gameListObj = null;
var currentZIndex = 100;
var currentGameCode = "";
var langObj;
var MJPNNObj;
var AppMakeObj;
var timeZone = 8;
var bannerH = 100;
function PJDApp() {
    var w;
    var h;
    var currentMenuSelect = 0;
    var mRegisterObj;
    var mLoginObj;
    var mAgreementObj;
    var mInfoNameObj;
    var mServiceObj;
    var mBankInfoObj;
    var mNoticeObj;
    var mMailDetailObj;
    var mFeedbackObj;
    var mInterestObj;
    var mInterestbaoObj;
    var mluckyLpObj;
    var mLuckyDrawObj;
    var mUpdateNickNameObj;
    var minterestDetailObj;
    var mincomeDetailsObj;
    var mBuyInterestObj;
    var mPasswordInputObj;
    var mMoneyrecordObj;
    var mDiscountObj;
    var mFavourableObj;
    var mAgentObj;
    var mAccountSafeObj;
    var mAskObj;
    var mAboutObj;
    var mPyramidObj;
    var mResponsibilityObj;
    var mIncomeObj;
    var mIncomeOnlineObj;
    var mIncomeOfflineObj;
    var mDrawFeeObj;
    var mDepositFeeObj;
    var mAvatarObj;
    var mLeagueAgreementObj;
    var mLeagueContentObj;
    var mAgentQrCodeObj;
    var mMoneyWindowObj;
    var menuObjIndex;
    var menuObjComing;
    var menuObjMy;
    var menuObjMap;
    var currentMenuObj = null;
    var mCompleteInfoObj;
    var mainTopBar = null;
    var operatorId = null;
    this.init = function () {
        AppMakeObj = new AppMake();
        mMoneyWindowObj = new moneyWindowObj();
        mCompleteInfoObj = new completeInfoObj();
        mLoginObj = new loginObj(); mLoginObj.init();
        mRegisterObj = new registerObj(); mRegisterObj.init();
        mAgreementObj = new agreementObj(); mAgreementObj.init();
        mInfoNameObj = new infoNameObj(); mInfoNameObj.init();
        mServiceObj = new PJDService(); mServiceObj.init();
        mBankInfoObj = new bankInfoObj(); mBankInfoObj.init();
        mNoticeObj = new NoticeObj(); mNoticeObj.init();
        mMailDetailObj = new mailDetailObj(); mMailDetailObj.init();
        mFeedbackObj = new feedbackObj(); mFeedbackObj.init();
        mInterestObj = new interestObj(); mInterestObj.init();
        mInterestbaoObj = new interestbaoObj(); mInterestbaoObj.init();
        mluckyLpObj = new luckyLpObj(); mluckyLpObj.init();
        mLuckyDrawObj = new luckyDrawObj(); mLuckyDrawObj.init();
        mUpdateNickNameObj = new UpdateNickNameObj(); mUpdateNickNameObj.init();
        minterestDetailObj = new interestDetailObj(); minterestDetailObj.init();
        mincomeDetailsObj = new incomeDetailsObj(); mincomeDetailsObj.init();
        mBuyInterestObj = new buyInterestObj(); mBuyInterestObj.init();
        mPasswordInputObj = new passwordInputObj(); mPasswordInputObj.init();
        mMoneyrecordObj = new moneyrecordObj(); mMoneyrecordObj.init();
        mBetrecordObj = new betrecordObj(); mBetrecordObj.init();
        mBetrecordLmgObj = new betrecordLmgObj(); mBetrecordLmgObj.init();
        mBetLmgRemakeObj = new betLmgRemakeObj(); mBetLmgRemakeObj.init();
        mBetrecordGmObj = new betrecordGmObj(); mBetrecordGmObj.init();
        mBetGmRemakeObj = new betGmRemakeObj(); mBetGmRemakeObj.init();
        mBetrecordKyObj = new betrecordKyObj(); mBetrecordKyObj.init();
        mBetKyRemakeObj = new betKyRemakeObj(); mBetKyRemakeObj.init();
        mBetrecordIgObj = new betrecordIgObj(); mBetrecordIgObj.init();
        mBetrecordCmdObj = new betrecordCmdObj(); mBetrecordCmdObj.init();
        mBetCmdRemakeObj = new betCmdRemakeObj(); mBetCmdRemakeObj.init();
        mBetrecordJPNNObj = new betrecordJPNNObj(); mBetrecordJPNNObj.init();
        mBetJPNNRemakeObj = new betJPNNRemakeObj(); mBetJPNNRemakeObj.init();
        mTryGameSigup = new tryGameSigupObj(); mTryGameSigup.init();
        mDiscountObj = new discountObj(); mDiscountObj.init();
        mFavourableObj = new favourableObj(); mFavourableObj.init();
        mAgentObj = new agentObj(); mAgentObj.init();
        mAccountSafeObj = new accountSafeObj(); mAccountSafeObj.init();
        mAskObj = new askObj(); mAskObj.init();
        mAboutObj = new aboutObj(); mAboutObj.init();
        mPyramidObj = new pyramidObj(); mPyramidObj.init();
        mResponsibilityObj = new responsibilityObj(); mResponsibilityObj.init();
        mIncomeOnlineObj = new incomeOnlineObj(); mIncomeOnlineObj.init();
        mIncomeOfflineObj = new incomeOfflineObj(); mIncomeOfflineObj.init();
        mDrawFeeObj = new drawFeeObj(); mDrawFeeObj.init();
        mDepositFeeObj = new depositFeeObj(); mDepositFeeObj.init();
        mLeagueAgreementObj = new leagueAgreementObj(); mLeagueAgreementObj.init();
        mLeagueContentObj = new leagueContentObj(); mLeagueContentObj.init();
        mAgentQrCodeObj = new agentQrCodeObj(); mAgentQrCodeObj.init();
        mAvatarObj = new avatarObj(); mAvatarObj.init();
        getAppVersion();
        checkIsAndroid();
        requestAjax("i18n/getMapKeyLangs", "", function (jsonObj) {
            if (jsonObj != null && jsonObj != "") lang = jsonObj;
        });
    }
    this.setAppStyle = setAppStyle;
    this.h5DownloadCheck = h5DownloadCheck;
    this.showAgreement = function (type) {
        mAgreementObj.show();
        mAgreementObj.setType(type);
    }
    this.showMoneyWindow = function () {
        if (!mMoneyWindowObj.isInit()) {
            mMoneyWindowObj.init();
        } else {
            mMoneyWindowObj.show();
        }
    }
    this.unShowMoneyWindow = function () {
        mMoneyWindowObj.unShow();
    }
    this.showAgentQRCode = function (imgUrl, tel, isMark) {
        mAgentQrCodeObj.show(imgUrl, tel, isMark);
    }
    this.showRegister = function () {
        mRegisterObj.show();
    }
    this.showLogin = function (tagObj) {
        mLoginObj.show(tagObj);
    }
    this.goLogInAuto = function (name, pass, isLoading) {
        mLoginObj.logInAuto(name, pass, isLoading);
    }
    this.showUserInfo = function () {
        $("#topRegisterLoginDiv").css({
            "display": "none"
        });
        $("#topIsLoginDiv").css({
            "display": "flex"
        });
        updateNickName();
        if (userInfo.avatar != null) $("#myDiv_userInfo_content_header").attr("src", "header/" + userInfo.avatar);
    }
    this.showLoginBtns = function () {
        $("#topRegisterLoginDiv").css({
            "display": "flex"
        });
        $("#topIsLoginDiv").css({
            "display": "none"
        });
    }
    this.showFavourable = function (offerObj) {
        if (!isNaN(offerObj)) {
            var dataObj = new Object();
            dataObj["id"] = offerObj;
            requestAjax("article/getArticle", dataObj, function (jsonObj) {
                var obj = jsonObj["result"];
                var cn = obj["content"];
                mFavourableObj.show(cn);
            });
        } else {
            mFavourableObj.show(offerObj);
        }
    }
    this.showPyramid = function () {
        mPyramidObj.show();
    }
    this.logout = function () {
        userId = "";
        userInfo = null;
        bankInfo = null;
        userMoney = 0.00;
        userMoneyInterest = 0.00;
        userMoneyBag = null;
        gameListObj = null;

        $("#topRegisterLoginDiv").css({
            "display": "flex"
        });
        $("#topIsLoginDiv").css({
            "display": "none"
        });
        setSelectMenu(1);
        logOutPost();

        mGameAPI.logOutGame("lottery");
        mGameAPI.init();
    }
    this.showComplete = function (sizeMode, theme) {
        mCompleteInfoObj.setSizeMode(sizeMode);
        mCompleteInfoObj.setReleaseTheme(theme);
        mCompleteInfoObj.show();
    }
    this.unShowComplete = function () {
        mCompleteInfoObj.unShow();
    }
    this.showService = function () {
        mServiceObj.show();
    }
    this.showBankInfo = function (realName, theme, hBtn) {
        mBankInfoObj.setReleaseTheme(theme);
        mBankInfoObj.show(realName, hBtn);
    }
    this.coming = function () {
        setSelectMenu(2);
    }
    this.showIncomeOffline = function (item) {
        mIncomeOfflineObj.show(item);
    }
    this.draw = function () {
        setSelectMenu(3);
    }
    this.showInCome = function (channleIndex) {
        mIncomeObj.show(channleIndex);
    }
    this.showInComeOrder = function (orderInfo) {
        mIncomeOnlineObj.show(orderInfo);
    }
    this.externalLink = function (link) {
        mIncomeOnlineObj.externalLink(link);
    }
    this.showDraw = function () {
        mDrawFeeObj.show();
    }
    this.showDeposit = function () {
        mDepositFeeObj.show();
    }
    this.showAccountAndSafe = function (type) {
        mAccountSafeObj.show("m_m_m_m_" + type);
    }
    this.showHome = function () {
        setSelectMenu(1);
    }
    this.getObj = function (whichObj) {
        if (whichObj == "bankInfoObj") return mBankInfoObj;
    }
    this.showNotice = function () {
        mNoticeObj.show();
    }
    this.showMailDetail = function (DateList) {
        mMailDetailObj.show(DateList);
    }
    this.showInterest = function () {
        mInterestObj.show();
    }
    this.showInterestbao = function () {
        mInterestbaoObj.show();
    }
    this.showLuckyLpObj = function () {
        mluckyLpObj.show();
    }
    this.showLuckyDrawObj = function () {
        mLuckyDrawObj.show();
    }
    this.showUpdateNickName = function () {
        mUpdateNickNameObj.show();
    }
    this.showInterestDetailObj = function (listType) {
        minterestDetailObj.show(listType);
    }
    this.showIncomeDetailsObj = function () {
        mincomeDetailsObj.show();
    }
    this.showBuyInterest = function () {
        mBuyInterestObj.show();
    }
    this.showPasswordInput = function () {
        mPasswordInputObj.show();
    }
    this.showAgent = function () {
        mAgentObj.show();
    }
    this.showLeagueAgreement = function (type) {
        mLeagueAgreementObj.show(type);
    }
    this.showLeagueContent = function (type) {
        mLeagueContentObj.show(type);
    }
    this.updateMeLogInStatus = function (status) {
        menuObjMy.updateLoginStatus(status);
    }
    this.showInfoName = function (theme) {
        mInfoNameObj.setReleaseTheme(theme);
        mInfoNameObj.show();
    }
    this.showTopBtn = function () {
        if (isLogin()) {
            $("#topIsLoginDiv").css({ "display": "flex" });
        }
    }
    this.hiddenTopBtn = function () {
        $("#topIsLoginDiv").css({ "display": "none" });
    }
    this.hiddenMeLeagueMenu = function () {
        menuObjMy.hiddenLeagueMenu();
    };
    this.setJPNNAnimation = function (isOpen) {
        if (isOpen) {
            MJPNNObj.openAnimation();
        } else {
            MJPNNObj.stopAnimation(true);
        }
        console.log("setJPNNAnimation :" + isOpen);
    }
    function updateNickName() {
        var nickName = "";
        if (userInfo.nickname == null) {
            nickName = userId;
            if (nickName.length > 4) {
                nickName = nickName.substr(0, 4) + "...";
            }
        } else {
            nickName = userInfo.nickname;
            if (nickName.length > 4) {
                nickName = nickName.substr(0, 4) + "...";
            }
        }
        var nick = "<div id=\"nnValue\">" + nickName + "</div>";
        var line = "<div style=\"width:5px\"></div>";
        var btn = "<div id=\"nickImgBtn\"><img width=\"16px\" src=\"pic/themeMain/edit.png\"/></div>";
        $("#m_nickname").html(nick + line + btn);
        $("#m_userId").html("ID: " + userId);
        $("#m_userGrade").html(userInfo["dt"]["grade_id"]["name"]);
        $("#nickImgBtn").css({
            "width": "20px",
            "border-radius": "5px",
            "background-color": "",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "2px",
            "box-sizing": "border-box"
        });
        setBtnOnTouchEvent($("#nickImgBtn"), function () {
            myPJDApp.showUpdateNickName();
        }, "black", "", null);
    }
    function setSelectMenu(selectIndex) {
        if (currentMenuSelect == selectIndex) return;
        if (isLogin() || selectIndex == 1 || selectIndex == 4) {
            $("#menus_" + currentMenuSelect + "_1").css({ "display": "" });
            $("#menus_" + currentMenuSelect + "_2").css({ "display": "none" });
            $("#menu_" + currentMenuSelect).css({ "color": toolbarFontColor });
            $("#menus_" + selectIndex + "_2").css({ "display": "" });
            $("#menus_" + selectIndex + "_1").css({ "display": "none" });
            $("#menu_" + selectIndex).css({ "color": toolbarFontColorTouch });
            currentMenuSelect = selectIndex;
            var toObj = null;
            if (selectIndex == 1) {
                toObj = menuObjIndex;
            } else if (selectIndex == 2) {
                toObj = menuObjComing;
            } else if (selectIndex == 3) {
                toObj = menuObjMap;
            } else if (selectIndex == 4) {
                toObj = menuObjMy;
            }
            if (currentMenuObj != null) {
                currentMenuObj.unShow();
                currentMenuObj.getObj().css({ opacity: 0 });
            }
            toObj.show();
            currentMenuObj = toObj;
            currentMenuObj.getObj().transition({ opacity: 1.0 });
        } else { mLoginObj.show(); }
        focusHiddenBox();
    }
    function setIndexMode() {
        $("#indexDiv").scrollTop(0);
        $("#indexDiv").css({
            "height": h - topH - menuH - 0.5,
            "overflow-x": "hidden",
            "overflow-y": "hidden"
        });
    }
    function menuIndexContent() {
        setStyle();
        this.show = function () {
            $("#topTitle").css({ "display": "none" });
            $("#topLogo").css({ "display": "block" });
            $("#indexDiv").css({ x: -screenW });
            $("#content_niuniu").css({ "display": "flex" });
            MJPNNObj.openGame();
            myPJDApp.setJPNNAnimation(true);
            checkPageBackFromHome();
        }
        this.unShow = function () {
            myPJDApp.setJPNNAnimation(false);
            MJPNNObj.exitGame();
            $("#indexDiv").css({ x: 0 });
            $("#content_niuniu").css({ "display": "none" });
        }
        this.getObj = function () {
            return $("#indexDiv");
        }
        function setStyle() {
            $("#indexDiv").css({
                "left": screenW,
                "height": h - topH - menuH - 0.5
            });
            $("#content_niuniu").css({
                "height": h - topH - menuH - 0.5,
                "background": roadContentBgColor
            });
        }
    }
    function menuComingContent() {
        var recObj = new DepositBindViewObj("comingDiv"); recObj.init();
        setStyle();
        this.show = function () {
            if (userInfo["complete"] == 1) {
                myPJDApp.hiddenTopBtn();
                myPJDApp.showComplete();
            } else {
                myPJDApp.showTopBtn();
            }
            $("#comingDiv").css({ x: -screenW });
            setTopTitle("存款");
            recObj.show();
        }
        this.unShow = function () {
            $("#comingDiv").css({ x: 0 });
            myPJDApp.showTopBtn();
            mCompleteInfoObj.unShow();
        }
        this.getObj = function () {
            return $("#comingDiv");
        }
        function setStyle() {
            $("#comingDiv").css({
                "width": screenW,
                "height": h - topH - menuH,
                "left": screenW,
                "overflow-x": "hidden",
                "overflow-y": "auto",
                "background": pageBgColor
            });
        }
    }
    function menuFastContent() {
        var startDate = getTimeZoneE8(8, new Date()).format("yyyy-MM-dd");
        var endDate = startDate;
        var valTime;
        var requestTime = new Date();
        var select;
        var isInit = false;
        setMapStyle();
        this.show = function () {
            $("#mapDiv").css({ x: -screenW });
            setTopTitle("投注记录");
            if (!isInit) {
                bindBar();
                select.setSelectValue(0);
                isInit = true;
            }
        }
        this.unShow = function () {
            $("#mapDiv").css({ x: 0 });
        }
        function bindBar() {
            var cId = "mapDiv_content_timeSelect";
            var rId = "mainDiv";
            var times = { "list": [{ "text": "今天", "value": "0" }, { "text": "昨天", "value": "1" }, { "text": "最近7天", "value": "7" }] };
            select = new tSelect(cId, rId, screenW, 45, times, function (index) {
                var dateE8 = getTimeZoneE8(timeZone, new Date());
                valTime = times["list"][index]["value"];
                dateE8.setDate(dateE8.getDate() - valTime);
                startDate = dateE8.format("yyyy-MM-dd");
                if (valTime == 0 || valTime == 1) {
                    endDate = startDate;
                } else {
                    endDate = getTimeZoneE8(timeZone, new Date()).format("yyyy-MM-dd");
                }
                $("#mapDiv_content_list").html("");
                var now = new Date();
                if ((now - requestTime) > 5000) { bindList(500); } else { bindList(5000); }
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
            var mData = "requestType=json&start=" + startDate + "&end=" + endDate;
            var mTable = new tTable("mapDiv_content_list", columns, 20);
            mTable.init();
            mTable.setOutTime(outTime);
            mTable.itemClickFunction(function (itemData, objId) {
                var code = itemData["gameCode"];
                if (itemData["total"] == 0 || itemData["valid"] == 0) { return; }
                var val = valTime;
                if (val == 1) { val = "yesterday"; }
                if (code == "lmg") {
                    mBetrecordLmgObj.show(itemData, val);
                } else if (code == "ky") {
                    mBetrecordKyObj.show(itemData, val);
                } else if (code == "gm") {
                    mBetrecordGmObj.show(itemData, val);
                } else if (code == "lottery") {
                    mBetrecordIgObj.show(itemData, val);
                } else if (code == "cmd") {
                    mBetrecordCmdObj.show(itemData, val);
                } else if (code == "nn") {
                    mBetrecordJPNNObj.show(itemData, val);
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
                $("#mapDiv_content_bottom").css({
                    "display": "flex"
                });
                $("#mapDiv_content_validSum").html("有效投注额：" + doubleValue(v));
                var winOrLoss = "";
                if (winamount < 0) {
                    winOrLoss = "<font color=" + mainColor + ">" + doubleValue(w) + "</font>";
                } else {
                    winOrLoss = "<font color=" + winFontColor + ">" + doubleValue(w) + "</font>";
                }
                $("#mapDiv_content_winorloss").html("输赢：" + winOrLoss);
            });
            mTable.setParseFunction(function (datas) {
                winamount = winamount + datas.result.stats.winamount;
                validamount = validamount + datas.result.stats.validamount;
                return parseGamesData(datas);
            });
            mTable.setIsLoadMore(false);
            mTable.loadData(SERVER_ADD + "gameRecordStat/userRecordStatsGroupByGameNo", mData);
            function parseGamesData(gamesData) {
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
            }
        }
        this.getObj = function () {
            return $("#mapDiv");
        }
        function setMapStyle() {
            $("#mapDiv").css({
                "height": h - topH - menuH,
                "left": screenW,
                "background-color": mapContentBgColor
            });
            $("#mapDiv_content").css({
                "height": h - topH - menuH
            });
            $("#mapDiv_content_list").css({
                "height": h - topH - menuH - 45 - 10 - 40
            });
        }
    }
    function menuMineContent() {
        setMoneyStatus();
        setStyle();
        this.show = function () {
            $("#myDiv").css({
                x: -screenW
            });
            setTopTitle("我的");
            if (isLogin()) {
                refreshMoney();
            } else {
                $("#my_money_main").html("--");
                $("#my_money_Interest").html("--");
                $("#m_logout_btn").html("立即登录");
                $("#m_not_login_title").css({
                    "display": "block"
                });
            }
        }
        this.unShow = function () {
            $("#myDiv").css({
                x: 0
            });
        }
        this.getObj = function () {
            return $("#myDiv");
        }
        this.updateLoginStatus = function (status) {
            switch (status) {
                case 0:
                    $("#my_money_main").html("--");
                    $("#my_money_Interest").html("--");
                    $("#m_logout_btn").html("立即登录");
                    $("#m_not_login_title").css({
                        "display": "block"
                    });
                    break;
                case 1:
                    $("#m_logout_btn").html("退出登录");
                    $("#m_not_login_title").css({
                        "display": "none"
                    });
                    setMoneyStatus();
                    break;
                default:
                    break;
            }
        }
        this.hiddenLeagueMenu = hiddenLeagueMenu;
        function resetRefreshDeg() {
            $("#m_refresh_btn").css({
                rotate: "0deg"
            });
        }
        function setMoneyStatus() {
            var moneyMain = $("#my_money_main");
            var moneyInterest = $("#my_money_Interest");
            var moneyEyeImg = $("#moneyEye");

            if (moneyCanSee) {
                moneyEyeImg.attr("src", themPath + "m_eye_close.png");
                refreshMoney();
            } else {
                moneyEyeImg.attr("src", themPath + "m_eye_open.png");
                moneyMain.html("**********");
                moneyInterest.html("**********");
            }
        }
        function setStyle() {
            $("#myDiv").css({
                "height": h - topH - menuH,
                "left": screenW
            });
            $("#myDiv_userInfo_content").css({
                "background-color": meItemTopBgColor,
            });
            $("#m_nickname").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "color": mainColor,
                "font-size": "16px",
                "line-height": "150%",
            });
            $("#m_userId").css({
                "color": mainFontColorDeep,
                "font-size": "12px",
                "line-height": "150%"
            });
            $("#m_userGrade").css({
                "color": mainFontColorDeep,
                "font-size": "12px",
                "line-height": "150%"
            });
            $("#m_logout_btn").css({
                "color": mainColor,
                "border": "1px solid " + mainColor,
                "font-size": "12px"
            });
            $(".m_money_item").css({
                "width": "90px",
                "font-size": "12px",
                "color": mainFontColorMore,
                "line-height": "100%"
            });
            $(".m_money_item_refresh").css({
                "width": "19%",
            });
            $(".m_money_item_top").css({
                "font-size": "12px",
                "color": mainFontColorDeep,
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center",
                "padding-bottom": "3px"
            });
            $("#m_money_details").css({
                "color": mainColor,
                "line-height": "100%",
                "font-size": "12px",
                "height": "100%",
                "padding": "5px",
                "box-sizing": "border-box"
            });
            $(".m_menu_item").css({
                "width": "25%",
                "height": "100%",
                "display": "flex",
                "flex-direction": "column",
                "justify-content": "center",
                "align-items": "center",
                "color": mainFontColorMore,
                "font-size": "12px",
                "line-height": "200%"
            });
            $(".m_menu2_item").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "color": mainFontColorMore,
                "font-size": "14px",
                "width": "33%",
                "height": "100%"
            });
            $(".m_menu3_item").css({
                "width": "20%",
                "height": "100%",
                "display": "flex",
                "flex-direction": "column",
                "justify-content": "center",
                "align-items": "center",
                "color": mainFontColorMore,
                "font-size": "12px",
                "line-height": "200%"
            });
            $(".m_info_item").css({
                "display": "flex",
                "justify-content": "space-between",
                "align-items": "center",
                "height": "60px",
                "background-color": meItemContentBgColor
            });
            $("#m_info_item_content_league").css({
                "display": "none"
            });
            $(".m_info_item_content").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "color": mainFontColorDeep,
                "font-size": "14px",
                "height": "100%"
            });
            $(".myDivItemContent").css({
                "background-color": meItemContentBgColor
            });
            $(".myDivSplitBlock").css({
                "background-color": meSplitBlock
            });
            $(".myDivSplitline").css({
                "background-color": meSplitLine
            });
            setBtnOnTouchEventNoColor($("#myDiv_userInfo_content_header"), function () {
                if (isLogin()) {
                    mAvatarObj.show();
                } else {
                    myPJDApp.showLogin();
                }
            }, null);
            setBtnOnTouchEvent($("#m_logout_btn"), function () {
                if (isLogin()) {
                    mMsgBox.show("提示", "确定退出登录吗？", function () {
                        clearLogIn();
                        userId = "";
                        userInfo = null;
                        myPJDApp.logout();
                        onlinePayObj.setReGet();
                        setTimeout(function () { mLoader.show("logout"); }, 200);
                    }, null);
                } else {
                    myPJDApp.showLogin();
                }
            }, mainColorMore, "", null);
            setBtnOnTouchEvent($("#m_refresh_btn"), function () {
                if (isLogin()) {
                    $("#m_refresh_btn").transition({
                        rotate: "360deg"
                    }, "slow", resetRefreshDeg);
                    var mUserObj = new userObj();
                    mUserObj.getMoneyBag();
                } else {
                    myPJDApp.showLogin();
                }
            }, meItemContentTouchColor, "", null);
            setBtnOnTouchEvent($("#m_eye_open_btn"), function () {
                if (isLogin()) {
                    if (moneyCanSee) {
                        moneyCanSee = false;
                    } else {
                        moneyCanSee = true;
                    }
                    setMoneyStatus();
                } else {
                    myPJDApp.showLogin();
                }
            }, meItemContentTouchColor, "", null);
            $(".m_menu_item").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    if (isLogin()) {
                        if (mObj.id == "m_menu_item_btn_coming") {
                            myPJDApp.showDeposit();
                        } else if (mObj.id == "m_menu_item_btn_draw") {
                            mDrawFeeObj.show();
                        } else if (mObj.id == "m_menu_item_btn_fundsrecord") {
                            mMoneyrecordObj.show();
                        } else if (mObj.id == "m_menu_item_btn_betrecord") {
                            mBetrecordObj.show();
                        }
                    } else {
                        myPJDApp.showLogin();
                    }
                }, meItemContentTouchColor, meItemContentBgColor, null);
            });
            $(".m_menu2_item").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    if (mObj.id == "m_menu2_item_btn_discount") {
                        mDiscountObj.show();
                        return;
                    }
                    if (isLogin()) {
                        if (mObj.id == "m_menu2_item_btn_moneyrecord") {
                            mMoneyrecordObj.show();
                        } else if (mObj.id == "m_menu2_item_btn_betrecord") {
                            mBetrecordObj.show();
                        }
                    } else {
                        myPJDApp.showLogin();
                    }
                }, meItemContentTouchColor, meItemContentBgColor, null);
            });
            $(".m_menu3_item").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    if (isLogin()) {
                        mAccountSafeObj.show(mObj.id);
                    } else {
                        myPJDApp.showLogin();
                    }
                }, meItemContentTouchColor, meItemContentBgColor, null);
            });
            $(".m_info_item").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    if (mObj.id == "m_info_item_content_agreement") {
                        mAgreementObj.show();
                    } else if (mObj.id == "m_info_item_content_ask") {
                        mAskObj.show();
                    } else if (mObj.id == "m_info_item_content_about") {
                        mAboutObj.show();
                    } else if (mObj.id == "m_info_item_content_pyramid") {
                        mPyramidObj.show();
                    } else if (mObj.id == "m_info_item_content_league") {
                        mAgentObj.show();
                    } else if (mObj.id == "m_info_item_content_responsibility") {
                        mResponsibilityObj.show();
                    } else if (mObj.id == "m_info_item_content_update") {
                        if (isInApp()) {
                            window.location.assign("zy://app?command=update");
                        } else {
                            console.log("not is app unable to request update");
                        }
                    }
                }, meItemContentTouchColor, meItemContentBgColor, null);
            });
        }
        function hiddenLeagueMenu() {
            if (userInfo["is_agent"] != 0) {
                $("#m_info_item_content_pyramid").css({ "display": "none" });
                $("#m_info_item_content_league").css({ "display": "flex" });
                $(".myDivSplitline").css({ "display": "flex" });
                return true;
            }
            return false;
        }
    }
    function setTopTitle(ms) {
        $("#topTitle").html(ms);
        $("#topTitle").css({
            "color": toolbarFontColor,
            "font-size": "18px",
            "display": "block"
        });
        $("#topLogo").css({
            "display": "none"
        });
    }
    function showMain() {
        $("#mainDiv").animate({
            "opacity": 1.0
        }, "slow");
    }
    function setAppStyle() {
        w = $(window).width(); screenW = w;
        h = $(window).height(); screenH = h;
        var menusY = h - menuH;
        $("#bodyDiv").css({
            "width": w,
            "height": h
        });
        $("#menusDiv").css({
            "background": "-webkit-linear-gradient(top, " + toolbarBottomColor + " 0%," + toolbarBottomColorDK + " 100%)",
            "width": w,
            "top": menusY
        });
        $("#registerBtn").css({
            "border": "1px solid " + subColor,
            "color": subColor
        });
        $("#loginBtn").css({
            "border": "1px solid " + subColor,
            "color": subColor
        });
        $("#m_menu_top_finance_block").css({
            "background-color": subColor
        });
        $("#m_menu_top_finance_text").css({
            "color": subColor
        });
        $("#m_menu3_top_safety_block").css({
            "background-color": subColor
        });
        $("#m_menu3_top_safety_text").css({
            "color": subColor
        });
        $("#topIsLoginDiv_money").css({
            "width": "40px",
            "height": "40px",
            "border-radius": "50%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        $("#topIsLoginDiv_mail").css({
            "width": "40px",
            "height": "40px",
            "border-radius": "50%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        $(".topServiceClass").css({
            "width": "40px",
            "height": "40px",
            "border-radius": "50%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        $(".menuClass").css({
            "width": w / 4,
            "color": toolbarFontColor,
            "font-size": "10px",
            "line-height": "150%",
            "text-align": "center",
            "height": "55px"
        });
        $(".PJDCommBtn").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "border-radius": "20px",
            "background-color": mainColor,
            "color": " #FFFFFF",
            "height": "40px",
            "width": "auto",
            "margin-left": "15px",
            "margin-right": "15px",
            "font-size": "14px"
        });
        if (isInIOS()) {
            $("#bodyDiv").css({ "position": "static" });
            $("#mainDiv").css({ "position": "fixed" });
            $("#top").css({ "position": "static" });
            $("#menusDiv").css({ "position": "fixed" });
            $("#toast").css({ "position": "fixed" });
            $("#loadingDiv").css({ "position": "fixed" });
        }
        $(".menuClass").each(function () {
            setBtnOnTouchEventNoColor($("#" + this.id), function (mObj) {
                var index = mObj.id.split("_")[1];
                if (index == 3) {
                    if (isLogin()) {
                        myPJDApp.showLuckyDrawObj();
                    } else {
                        mLoginObj.show();
                    }
                } else {
                    setSelectMenu(index);
                }
            }, null);
        });
        $(".topServiceClass").each(function () {
            setBtnOnTouchEvent($(this), function (mObj) {
                myPJDApp.unShowMoneyWindow();
                openService();
            }, mainColorDeep, "", null);
        });
        $("#App_Version").html(APP_VERSION);
        setBtnOnTouchEvent($("#topIsLoginDiv_money"), function () {
            myPJDApp.showMoneyWindow();
        }, mainColorDeep, "", null);
        setBtnOnTouchEvent($("#topIsLoginDiv_mail"), function () {
            myPJDApp.showNotice();
        }, mainColorDeep, "", null);
        setBtnOnTouchEvent($("#registerBtn"), function () {
            mRegisterObj.show();
        }, subColorDK, "", null);
        setBtnOnTouchEvent($("#loginBtn"), function () {
            mLoginObj.show();
        }, subColorDK, "", null);
        mainTopBar = new topObj("top", "");
        mainTopBar.init();
        menuObjIndex = new menuIndexContent();
        menuObjComing = new menuComingContent();
        menuObjMap = new menuFastContent();
        menuObjMy = new menuMineContent();
        MJPNNObj = new JPNN_ED(); MJPNNObj.loadUI();
        setIndexMode(); setSelectMenu(1); showMain();
    }
    function h5DownloadCheck() {
        if (!isInApp()) {
            $("#accountSafeDiv_content_signPwd_btn").css({ "display": "none", "width": "0px" });
            $("#accountSafeDiv_content_signPwd_line").css({ "display": "none", "width": "0px" });
            $("#m_menu3_item_btn_signPwd").css({ "display": "none" });
            $("#alBtnStyle").css({ "width": "25%" });
            checkIsAndroid();
            setDonwLoadLink($("#h5AppDownloadA"));
            setDonwLoadLink($("#registerSuccessDownloadA"));
            setDonwLoadLink($("#roadAppDwonloadLink"));
            if (operatorId != null) {
                checkOperatorId(operatorId);
            } else {
                requestAjax("operator/isAgentDomain", "", function (jsonObj) {
                    operatorId = jsonObj.result;
                    checkOperatorId(operatorId);
                }, null);
            }
        }
        function setDonwLoadLink(obj) {
            if (isAndroidFlag) {
                obj.attr("href", "install/install.html");
            } else {
                obj.attr("href", "install/install.html");
            }
        }
        function checkOperatorId(operatorId) {
            if (operatorId == 0) {
                $("#h5AppDownload").css({ "display": "block" });
                $("#roadAppDwonloadDiv").css({ "display": "flex" });
                $("#registerSuccessDownload").css({ "display": "flex" });
            }
        }
    }
}
function PJDService() {
    var serivePage;
    var isShow = false;
    var zindex = 0;
    var spinner;
    this.init = function () {
        serivePage = $("#serviceDiv");
        serivePage.css({ "display": "none" });
        initMEIQIA();
        initServiceDiv();
    }
    this.show = function () {
        addBackFunArr(function () {
            spinner.spin();
            pageExit();
            isShow = false;
            unShowMEIQIA();
            focusHiddenBox();
        });
        serivePage.css({ "display": "block" });
        isShow = true;
        serivePage.transition({ x: -screenW }, "fast");
        $("#serviceDiv_content").css({ "display": "flex" });
        blurAnyone();
        currentZIndex = currentZIndex + 1;
        serivePage.css({ "z-index": currentZIndex });
        showMEIQIAPanel();
        myPJDApp.unShowComplete();
        myPJDApp.setJPNNAnimation(false);
    }
    function pageExit() {
        serivePage.transition({ x: 0 }, "fast");
        myPJDApp.setJPNNAnimation(true);
    }
    function initMEIQIA() {
        (function (m, ei, q, i, a, j, s) {
            m[i] = m[i] || function () {
                (m[i].a = m[i].a || []).push(arguments)
            };
            j = ei.createElement(q),
                s = ei.getElementsByTagName(q)[0];
            j.async = true;
            j.charset = 'UTF-8';
            j.src = 'https://static.meiqia.com/dist/meiqia.js?_=t';
            s.parentNode.insertBefore(j, s);
        })(window, document, 'script', '_MEIQIA');
        _MEIQIA('entId', 108588);
        _MEIQIA('manualInit');
    }
    function initServiceDiv() {
        var opts = { color: '#000000' };
        spinner = new Spinner(opts);
        serivePage.css({
            "width": screenW,
            "height": screenH,
            "position": "absolute",
            "left": screenW
        });
        $("#serviceDiv_top").css({
            "background": "-webkit-linear-gradient(top, " + toolbarTopColor + " 0%," + toolbarTopColorDK + " 100%)",
            "width": screenW,
            "height": topH + 8,
            "display": "flex",
            "justify-content": "flex-start",
            "align-items": "center",
        });
        var back = "<div id=\"serviceDiv_top_back\"><img src=\"" + themPath + "back.png\" height=15px /></div>";
        var text = "<div id=\"serviceDiv_top_title\">客服</div>";
        var controls = "<div id=\"serviceDiv_top_controls\"></div>";
        var line = "<div style=\"width:3px\"></div>";
        $("#serviceDiv_top").html(line + back + line + text + controls);
        $("#serviceDiv_top_back").css({
            "width": (topH - 8),
            "height": (topH - 8),
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "border-radius": "50%"
        });
        $("#serviceDiv_top_title").css({
            "width": "120px",
            "color": toolbarFontColor,
            "font-size": "18px"
        });
        $("#serviceDiv_top_controls").css({
            "width": "200px",
            "display": "flex",
            "justify-content": "flex-end",
            "align-items": "center"
        });
        setBtnOnTouchEvent($("#serviceDiv_top_back"), function () {
            backClickFun();
        }, mainColorDeep, "", null);
        $("#serviceDiv_content").css({
            "width": screenW,
            "height": screenH - topH - 8,
            "background": "#FFFFFF",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
    }
    function showMEIQIAPanel() {
        spinner.spin(document.getElementById('serviceDiv_content_loading'));
        $("#serviceDiv_content").css({ "display": "flex" });
        if (isShow) {
            _MEIQIA('withoutBtn');
            _MEIQIA('allSet', showMEIQIAPanelFun);
            _MEIQIA('init');
        }
        function showMEIQIAPanelFun() {
            spinner.spin();
            if (isShow) {
                $("#MEIQIA-PANEL-HOLDER").css({ "opacity": "0.0" });
                _MEIQIA('showPanel');
                setTimeout(showMEIQIAPanelFunNext, 100);
            }
        }
        function showMEIQIAPanelFunNext() {
            $("#serviceDiv_content").css({ "display": "none" });
            zindex = serivePage.css("z-index");
            console.log("showMEIQIAPanelFunNext zindex:" + zindex);
            $("#MEIQIA-PANEL-HOLDER").css({ "z-index": zindex - 1, "opacity": "1.0" });
            serivePage.css({ "z-index": zindex, "height": topH });
        }
    }
    function unShowMEIQIA() {
        var opts = { color: '#000000' };
        spinner = new Spinner(opts);
        spinner.spin();
        _MEIQIA('hidePanel');
        $("#serviceDiv_content").css({ "display": "block" });
        $("#MEIQIA-PANEL-HOLDER").css({ "opacity": "0.0" });
    }
}
function getAppVersion() {
    requestAjax("dt/getList?table=dt_app_version", "requestType=json", function (jsonObj) {
        if (jsonObj["code"] != 0) return;
        var list = jsonObj["result"];
        var len = list.length;
        for (var i = 0; i < len; i++) {
            var item = list[i];
            var type = item.type;
            if (type == "ios") {
                ipaInstallUrl = item.file_url;
            }
            if (type == "apk") {
                appDownloadUrl = item.file_url;
            }
        }
        myPJDApp.h5DownloadCheck();
    });
}
function topObj(topId, title) {
    this.init = function () {
        $("#" + topId).css({
            "background": "-webkit-linear-gradient(top, " + toolbarTopColor + " 0%," + toolbarTopColorDK + " 100%)",
            "width": screenW,
            "height": topH,
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
    }
    this.addControls = function (backFun) {
        var devMs = "<div style=\"width:3px\"></div>";
        var devMaxMs = "<div style=\"width:10px\"></div>";
        var leftMs = "<div style=\"width:50%;display:flex;justify-content:flex-start;align-items: center\">[content]</div>";
        var rightMs = "<div id=\"" + topId + "_controls\" style=\"width:50%;display:flex;justify-content:flex-end;align-items: center\">[content]</div>";
        var backMs = "<div id=" + topId + "_back style=\"width:40px;height:40px;display:flex;justify-content:center;align-items: center \">[content]</div>";
        var backImg = "<img src=" + themPath + "back.png height=15px />";
        backMs = backMs.replace("[content]", backImg);
        var titleMs = "<div id=" + topId + "_title style=\"color:" + toolbarFontColor + ";font-size:15px;width:auto\">" + title + "</div>";
        leftMs = leftMs.replace("[content]", devMs + backMs + devMs + titleMs);

        var mailDiv = '<div id=' + topId + '_notice class=topNoticeBtn style="width: 40px;height: 40px;">[content]</div>';
        var relDiv = '<div style="position: relative;width: 40px;height: 40px;">[content]</div>';
        var mailImg = '<div style="position: absolute;width: 40px;height: 40px;top: 0px;display: flex;justify-content: center;align-items: center;">[content]</div>';
        mailImg = mailImg.replace("[content]", '<img id="topIsLogin_mail_img" src="pic/themeMain/servicetop_message2.png" height="24px" />');

        var readDiv = '<div style="position: absolute;width: 18px;height: 18px;left: 25px;;display: flex;justify-content: center;align-items: center;">[content]</div>';
        var readNum = "<div class='appNoticeReadSize' id='" + topId + "_IsRead' style='border-radius:50%;width:14px;height:14px;background:red;color:white;font-size: 12px;display: none;justify-content: center;align-items: center;'></div>";
        readDiv = readDiv.replace("[content]", readNum);
        relDiv = relDiv.replace("[content]", mailImg + readDiv);
        mailDiv = mailDiv.replace("[content]", relDiv);

        var serviceMs = "<div id=" + topId + "_service class=topServiceBtn><img src=" + themPath + "service.png height=20px /></div>";
        var moneyMs = "<div id=" + topId + "_money_btn class=topMoneyBtn><img src=" + themPath + "m_money.png height=22px /></div>";
        rightMs = rightMs.replace("[content]", devMaxMs + mailDiv + devMaxMs + serviceMs + devMaxMs + moneyMs + devMaxMs);
        $("#" + topId).html(leftMs + rightMs);
        $("#" + topId + "_back").css({ "border-radius": "50%" });
        setBtnOnTouchEvent($("#" + topId + "_back"), function () {
            backFun();
        }, mainColorDeep, "", null);
        $("#" + topId + "_service").css({
            "width": "40px",
            "height": "40px",
            "border-radius": "50%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        setBtnOnTouchEvent($("#" + topId + "_service"), function () {
            openService();
        }, mainColorDeep, "", null);
        $("#" + topId + "_money_btn").css({
            "width": "40px",
            "height": "40px",
            "border-radius": "50%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        setBtnOnTouchEvent($("#" + topId + "_money_btn"), function () {
            myPJDApp.showMoneyWindow();
        }, mainColorDeep, "", null);
        $("#" + topId + "_notice").css({
            "width": "40px",
            "height": "40px",
            "border-radius": "50%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        if (NUMBER_MESSAGE_READ > 0) {
            var temp = NUMBER_MESSAGE_READ;
            if (NUMBER_MESSAGE_READ > 9) { temp = "9+"; }
            $("#" + topId + "_IsRead").html(temp);
            $("#" + topId + "_IsRead").css({ "display": "flex" });
        }
        setBtnOnTouchEvent($("#" + topId + "_notice"), function () {
            myPJDApp.showNotice();
        }, mainColorDeep, "", null);
    }
    this.show = function () {
        $("#" + topId).css({ "display": "flex" });
    }
    this.hidden = function () {
        $("#" + topId).css({ "display": "none" });
    }
    this.showBtn = function () {
        $("#" + topId + "_controls").css({ "display": "flex" });
    }
    this.hiddenBtn = function () {
        $("#" + topId + "_controls").css({ "display": "none" });
    }
    this.showServiceBtn = function () {
        $("#" + topId + "_service").css({ "display": "flex" });
    }
    this.hiddenServiceBtn = function () {
        $("#" + topId + "_service").css({ "display": "none" });
    }
    this.showNoticeBtn = function () {
        $("#" + topId + "_notice").css({ "display": "flex" });
    }
    this.hiddenNoticeBtn = function () {
        $("#" + topId + "_notice").css({ "display": "none" });
    }
    this.showFunds = function () {
        $("#" + topId + "_money_btn").css({ "display": "flex" });
    }
    this.hiddenFunds = function () {
        $("#" + topId + "_money_btn").css({ "display": "none" });
    }
    this.setTitle = function (ms) {
        $("#" + topId + "_title").html(ms);
    }
    this.checkMoneyShow = function () {
        if (isLogin()) {
            var ce = userInfo["complete"];
            if (ce == 2 || ce == 3) {
                $("#" + topId + "_money_btn").css({ "display": "flex" });
            } else {
                $("#" + topId + "_money_btn").css({ "display": "none" });
            }
        } else {
            $("#" + topId + "_money_btn").css({ "display": "none" });
            $("#" + topId + "_notice").css({ "display": "none" });
        }
    }
}
function pageObj(preFix, title) {
    var page = $("#" + preFix);
    var w = $(window).width();
    var h = $(window).height();
    var mTop;
    var backFun = null;
    this.init = function (back) {
        if (back != null) {
            backFun = back;
        }
        page.css({
            "width": w,
            "height": h,
            "position": "absolute",
            "left": w,
            "display": "none"
        });
        mTop = new topObj(preFix + "_top", title);
        mTop.init();
        mTop.addControls(function () {
            backClickFun();
            focusHiddenBox();
        });
        $("#" + preFix + "_content").css({
            "width": w,
            "height": h - topH,
            "background": pageBgColor
        });
    }
    this.show = function (pageExitFun) {
        addBackFunArr(function () {
            pageExit();
            if (backFun != null) {
                backFun();
            }
            if (pageExitFun != null) {
                pageExitFun();
            }
        });
        focusHiddenBox();
        currentZIndex = currentZIndex + 1;
        page.css({ "display": "block", "z-index": currentZIndex });
        page.transition({ x: -w }, "fast");
        $("#moneyShowDiv").css({ "z-index": currentZIndex + 1 });
        mTop.checkMoneyShow();
    }
    this.showTop = function () {
        mTop.show();
    }
    this.hiddenTop = function () {
        mTop.hidden();
    }
    this.showBtn = function () {
        mTop.showBtn();
    }
    this.hiddenBtn = function () {
        mTop.hiddenBtn();
    }
    this.showServiceBtn = function () {
        mTop.showServiceBtn();
    }
    this.hiddenServiceBtn = function () {
        mTop.hiddenServiceBtn();
    }
    this.showNoticeBtn = function () {
        mTop.showNoticeBtn();
    }
    this.hiddenNoticeBtn = function () {
        mTop.hiddenNoticeBtn();
    }
    this.showFunds = function () {
        mTop.showFunds();
    }
    this.hiddenFunds = function () {
        mTop.hiddenFunds();
    }
    this.setTitle = function (ms) {
        mTop.setTitle(ms);
    }
    function pageExit() {
        page.transition({
            x: 0
        }, "fast");
    }
}
function agentRankingObj() {
    this.getAgentRankingData = function (okFun) {
        getAgentRankingData(okFun);
    }
    function getAgentRankingData(okFun) {
        var dataObj = new Object();
        dataObj["requestType"] = "json";
        requestAjax("gameRecordStat/agentRankings", dataObj, function (jsonObj) {
            if (jsonObj["code"] == 0) {
                agentRankingList = jsonObj["result"];
                if (okFun != null) { okFun(); }
            }
        }, null);
    }
}
function appLogout(time) {
    focusHiddenBox();
    userId = "";
    userInfo = null;
    bankInfo = null;
    userMoney = 0.00;
    userMoneyInterest = 0.00;
    userMoneyBag = null;
    if (time == null) {
        setTimeout(reloadPage, 3000);
    } else if (time > 0) {
        setTimeout(reloadPage, time);
    } else {
        reloadPage();
    }
    function reloadPage() {
        if (appRootDomain != null) {
            console.log("appLogoutByAppRootDomain:" + appRootDomain);
            location.href = "app.html?domain=" + appRootDomain;
        } else {
            console.log("appLogoutByAppRootDomain:null");
            location.href = "app.html";
        }
    }
}
function luckyLpObj() {
    var mPage = new pageObj("luckyLpDiv", "幸运抽奖");
    var isInit = false;
    this.init = function () {
        mPage.init();
        $("#luckyLpDiv_content").css({
            "overflow-x": "hidden",
            "overflow-y": "auto"
        });
    }
    this.show = function () {
        myPJDApp.setJPNNAnimation(false);
        mPage.show(function () {
            myPJDApp.setJPNNAnimation(true);
        });
        if (!isInit) {
            var page = new tPage("luckyLp", "pages/luckyLp.html", "luckyLpDiv_content", function () {
                isInit = true;
            }, null);
            page.open();
        } else {
            bindFun();
        }
    }
}
function luckyDrawObj() {
    var mPage = new pageObj("luckyDrawDiv", "幸运抽奖");
    var isInit = false;
    this.init = function () {
        mPage.init();
        $("#luckyDrawDiv_content").css({
            "overflow-x": "hidden",
            "overflow-y": "auto"
        });
    }
    this.show = function () {
        myPJDApp.setJPNNAnimation(false);
        mPage.show(function () {
            myPJDApp.setJPNNAnimation(true);
        });
        if (!isInit) {
            var page = new tPage("luckyDraw", "pages/luckyDraw.html", "luckyDrawDiv_content", function () {
                isInit = true;
            }, null);
            page.open();
        } else {
            contentRuleMake();
            contentScheduleMake();
        }
    }
}
function UpdateNickNameObj() {
    var mPage = new pageObj("nickNameDiv", "修改昵称");
    var isInit = false;
    this.init = function () {
        mPage.init();
        $("#nickNameDiv_content").css({
            "background-color": pageBgColor,
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "height": screenH - topH
        });
    }
    this.show = function () {
        myPJDApp.setJPNNAnimation(false);
        mPage.show(function () {
            document.activeElement.blur();
            myPJDApp.setJPNNAnimation(true);
        });
        if (!isInit) {
            var page = new tPage("editNickName", "pages/editNickName.html", "nickNameDiv_content", function () {
                isInit = true;
            }, null);
            page.open();
        }
    }
}
function NoticeObj() {
    var mPage = new pageObj("mailDiv", "公告");
    var isInit = false;
    this.init = function () {
        mPage.init();
        $("#mailDiv_content").css({
            "background-color": pageBgColor,
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "height": screenH - topH
        });
    }
    this.show = function () {
        myPJDApp.setJPNNAnimation(false);
        mPage.show(function () {
            myPJDApp.setJPNNAnimation(true);
        });
        mPage.hiddenNoticeBtn();
        if (!isInit) {
            var page = new tPage("notice", "pages/notice.html", "mailDiv_content", function () {
                isInit = true;
            }, null);
            page.open();
        } else {
            noticeSelect("affiche_menu_sys");
        }
    }
}
function mailDetailObj() {
    var mPage = new pageObj("mailDetailDiv", "公告详情");
    var isInit = false;
    this.init = function () {
        mPage.init();
        $("#mailDetailDiv_content").css({
            "background-color": pageBgColor,
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "height": screenH - topH
        });
    }
    this.show = function (DateList) {
        mPage.show();
        mPage.hiddenNoticeBtn();
        if (!isInit) {
            var page = new tPage("mailDetail", "pages/mailDetail.html", "mailDetailDiv_content", function () {
                isInit = true;
                mDetailFunObj.show(DateList);
            }, null);
            page.open();
        } else {
            mDetailFunObj.show(DateList);
        }
    }
}
function interestObj() {
    var mPage = new pageObj("interestDiv", "利息账户");
    var isInit = false;
    this.init = function () {
        mPage.init();
        $("#interestDiv_content").css({
            "background-color": pageBgColor,
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "height": screenH - topH
        });
    }
    this.show = function () {
        myPJDApp.setJPNNAnimation(false);
        mPage.show(function () {
            myPJDApp.setJPNNAnimation(true);
        });
        if (!isInit) {
            var page = new tPage("interest", "pages/interest.html", "interestDiv_content", function () {
                isInit = true;
            }, null);
            page.open();
        }
    }
}
function interestbaoObj() {
    var mPage = new pageObj("interestbaoDiv", "利息宝");
    var isInit = false;
    this.init = function () {
        mPage.init();
        $("#interestbaoDiv_content").css({
            "background-color": pageBgColor,
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "height": screenH - topH
        });
    }
    this.show = function () {
        mPage.show();
        if (!isInit) {
            var page = new tPage("interestbao", "pages/interestbao.html", "interestbaoDiv_content", function () {
                isInit = true;
            }, null);
            page.open();
        }
    }
}
function interestDetailObj() {
    var mPage = new pageObj("interestDetailDiv", "利息记录详情");
    var isInit = false;
    this.init = function () {
        mPage.init();
        $("#interestDetailDiv_content").css({
            "background-color": "black",
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "height": screenH - topH
        });
    }
    this.show = function (itemType) {
        mPage.show();
        if (!isInit) {
            var page = new tPage("interestDetail", "pages/interestDetail.html", "interestDetailDiv_content", function () {
                isInit = true;
                mAfunObj.show(itemType);
            }, null);
            page.open();
        }
    }
}
function incomeDetailsObj() {
    var mPage = new pageObj("incomeDetailsDiv", "收益详情");
    var isInit = false;
    this.init = function () {
        mPage.init();
        $("#incomeDetailsDiv_content").css({
            "background-color": "black",
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "height": screenH - topH
        });
    }
    this.show = function () {
        mPage.show();
        if (!isInit) {
            var page = new tPage("incomeDetails", "pages/incomeDetails.html", "incomeDetailsDiv_content", function () {
                isInit = true;
            }, null);
            page.open();
        }
    }
}
function buyInterestObj() {
    var mPage = new pageObj("buyInterestDiv", "购买利息产品");

    this.init = function () {
        mPage.init();
        $("#buyInterestDiv_content").css({
            "background-color": pageBgColor,
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "height": screenH - topH
        });
    }
    this.show = function () {
        mPage.show();
        var page = new tPage("buyInterest", "pages/buyInterest.html", "buyInterestDiv_content", function () { }, null);
        page.open();
    }
}
function passwordInputObj() {
    var mPage = new pageObj("passwordInputDiv", "输入资金密码");

    this.init = function () {
        mPage.init();
        $("#passwordInputDiv_content").css({
            "background-color": pageBgColor,
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "height": screenH - topH
        });
    }
    this.show = function () {
        mPage.show();
        var page = new tPage("passwordInput", "pages/passwordInput.html", "passwordInputDiv_content", function () { }, null);
        page.open();
    }
}
function discountObj() {
    var mPage = new pageObj("discountDiv", "优惠管理");
    var datas = new Array();
    this.init = function () {
        mPage.init();
    }
    this.show = function () {
        mPage.show();
        contentMake();
    }
    var openStatus = false;
    function contentMake() {
        var yhDiv = "discountDiv_content";
        var ms = "暂无优惠活动!";
        if (openStatus) { return; }
        requestAjax("article/getArticleForList", "typeId=[1010]", function (jsonObj) {
            var codeValue = jsonObj.code;
            if (codeValue == 0) {
                var obj = jsonObj.result;
                var str = '<div id="discountDiv_content_list"><div style="width:10px"></div><div>全部类型</div>';
                str += '<div><img id="discount_arrow_down_img_id" src="pic/themeMain/arrow_down.png" width="10px" style="padding-right: 10px" /></div></div>';
                str += '<div style="height: 1px" class="content_discount_line"></div>';
                if (obj != null && obj != "") {
                    var tData = new Array();
                    for (var i = 0; i < obj.length; i++) {
                        var objItem = obj[i];
                        var item = new Object();
                        item["title"] = objItem.title;
                        item["text"] = objItem.summary;
                        item["img"] = '<img src="' + SERVER_ADD + objItem.thumb + '" height="60px" />';
                        str += '<div class="content_discount_item" id="discount_' + i + '"><div class="content_discount_item_left">';
                        str += '<div class="content_discount_item_img_' + i + '"></div>';
                        str += '<div class="content_discount_item_content"><div class="content_discount_item_content_title_' + i + '"></div>';
                        str += '<div class="content_discount_item_content_text_' + i + '"></div><div class="content_discount_item_content_time">';
                        str += '<div><img src="pic/themeMain/youhui_time.png" height="10px" /></div>';
                        str += '<div class="disscountEndTime"></div></div></div></div><div class="content_discount_item_arrow">';
                        str += '<img class="arrowImgClass" src="pic/themeMain/arrow.png" height="10px" /></div></div>';
                        str += '<div style="height: 1px" class="content_discount_line"></div>';
                        tData.push(item);
                        datas.push(objItem.content);
                    }
                    $("#discountDiv_content_listDIv").html(str);
                    setContentStyle(tData);
                    openStatus = true;
                } else {
                    bindFedView(yhDiv, ms);
                }
            } else {
                ms = "页面加载失败，请重试！";
                bindFedView(yhDiv, ms);
            }
        }, function (error) {
            ms = "页面加载失败，请重试！";
            bindFedView(yhDiv, ms);
        });

        function setContentStyle(item) {
            $("#discountDiv_content_list").css({
                "width": "100%",
                "background-color": lighterBackColor,
                "font-size": "14px",
                "color": mainFontColorMore,
                "line-height": "40px",
                "height": "40px",
                "display": "flex",
                "justify-content": "space-between",
                "align-items": "center"
            });
            $(".content_discount_item").css({
                "width": "100%",
                "background-color": lighterBackColor,
                "height": "80px",
                "display": "flex",
                "justify-content": "space-between",
                "align-items": "center"
            });
            $(".content_discount_item_left").css({
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center",
                "width": "75%"
            });
            $(".content_discount_item_content").css({
                "height": "80px",
                "padding-top": "15px"
            });
            $(".content_discount_item_content_time").css({
                "font-size": "10px",
                "color": "#589abb",
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center"
            });
            $(".content_discount_item_arrow").css({
                "padding-right": "10px"
            });
            $(".content_discount_line").css({
                "width": "100%",
                "background-color": mainBackColor
            });
            $("#discountDiv_content_listDIv").css({ "display": "block" });
            for (var i = 0; i < item.length; i++) {
                var objItem = item[i];
                $(".content_discount_item_img_" + i).css({
                    "padding": "10px"
                });
                $(".content_discount_item_content_title_" + i).css({
                    "font-size": "14px",
                    "color": mainColor
                });
                $(".content_discount_item_content_text_" + i).css({
                    "font-size": "10px",
                    "color": mainFontColorMore
                });
                $(".content_discount_item_img_" + i).html(objItem["img"]);
                $(".content_discount_item_content_title_" + i).html(objItem["title"]);
                $(".content_discount_item_content_text_" + i).html(objItem["text"]);
            }
            for (var j = 0; j < datas.length; j++) {
                var qEndTime = JSON.parse(datas[j]);
                var len = qEndTime.length;
                for (var i = 0; i < len; i++) {
                    var objList = qEndTime[i];
                    if (objList["type"] == "count" && objList["end"] != null && objList["end"] != "") {
                        $(".disscountEndTime").html("&nbsp;&nbsp;截止：" + objList["end"].substr(0, 10));
                    }
                }
            }
            $(".content_discount_item").each(function () {
                setBtnOnTouchEvent($(this), function (mObj) {
                    var index = (mObj.id.split("_"))[1];
                    if (index < 0 || index >= datas.length) {
                        return;
                    }
                    myPJDApp.showFavourable(datas[index]);
                }, mainBackColor, lighterBackColor);
            });
        }
    }
}
function favourableObj() {
    var mPage = new pageObj("favourableDiv", "优惠详情");

    this.init = function () {
        mPage.init();
    }
    this.show = function (datas) {
        mPage.show(function () {
            try {
                mFavourableFunObj.exit();
            } catch (e) {
            }
        });

        loadModel(datas);
    }

    function loadModel(datas) {
        var page = new tPage("favourable", "pages/favourable.html", "favourableDiv_content", function () {
            mFavourableFunObj.show(datas);
        }, null);
        page.open();
    }
}
function agentObj() {
    var mPage = new pageObj("agentDiv", "联盟合作");
    var isOpenLeagueCom = false;
    var isOpenLeagueWc = false;
    var isOpenLeaguePm = false;
    this.init = function () {
        mPage.init(function () {
            myPJDApp.unShowComplete();
        });
    }
    this.show = function (isNewLoad, isSelect) {
        mPage.show();
        if (isNewLoad != null) {
            isOpenLeagueCom = isNewLoad;
            isOpenLeagueWc = isNewLoad;
            isOpenLeaguePm = isNewLoad;
        }
        if (isLogin() && userInfo["is_agent"] == 1) {
            switch (userInfo["agent_type"]) {
                case 1: loadCommission(isSelect); break;
                case 2: loadWashCode(isSelect); break;
                case 3: loadPyramid(isSelect); break;
                default: backClickFun(isSelect); break;
            }
        } else {
            backClickFun();
        }
    }
    this.loadAgentType = function (type) {
        if (type == "one") {
            loadCommission();
        } else if (type == "two") {
            loadWashCode();
        } else if (type == "three") {
            loadPyramid();
        }
    }
    function loadCommission(isSelect) {
        mPage.setTitle("联盟合作");
        if (isOpenLeagueCom && !isOpenLeagueWc && !isOpenLeaguePm) {
            mLeagueFunObj.reGet();
            return;
        }
        var page = new tPage("league", "pages/leagueCommission.html", "agentDiv_content", function () {
            mleagueLoadingFunObj.show(isSelect);
            isOpenLeagueCom = true;
            isOpenLeagueWc = false;
            isOpenLeaguePm = false;
        }, null);
        page.open();
    }
    function loadWashCode(isSelect) {
        mPage.setTitle("联盟合作");
        if (isOpenLeagueWc && !isOpenLeagueCom && !isOpenLeaguePm) { return; }
        var page = new tPage("league", "pages/leagueWashCode.html", "agentDiv_content", function () {
            isOpenLeagueWc = true;
            isOpenLeagueCom = false;
            isOpenLeaguePm = false;
        }, null);
        page.open();
    }
    function loadPyramid(isSelect) {
        mPage.setTitle("金字塔代理");
        if (isOpenLeaguePm && !isOpenLeagueCom && !isOpenLeagueWc) {
            mleaguePyLoadingFunObj.returnGet();
            return;
        }
        var page = new tPage("league", "pages/leaguePyramid.html", "agentDiv_content", function () {
            mleaguePyLoadingFunObj.show(isSelect);
            isOpenLeaguePm = true;
            isOpenLeagueCom = false;
            isOpenLeagueWc = false;
        }, null);
        page.open();
    }
}
function askObj() {
    var mPage = new pageObj("askDiv", "常见问题");
    var isLoad = false;
    this.init = function () {
        mPage.init();
        $("#askDiv_content").css({
            "width": "100%",
            "height": screenH - top,
            "color": mainFontColorMore,
            "font-size": "12px",
            "line-height": "180%"
        });
    }
    this.show = function () {
        mPage.show();
        if (!isLoad) {
            loadFile();
        }
        $("#askDiv_content").scrollTop(0);
    }
    function loadFile() {
        requestAjaxGet("files/qs.html", function (jsonObj) {
            isLoad = true;
            $("#askDiv_content").html(jsonObj);
        }, null);
    }
}
function aboutObj() {
    var mPage = new pageObj("aboutDiv", "关于我们");
    var isLoad = false;
    this.init = function () {
        mPage.init();
        $("#aboutDiv_content").css({
            "width": "100%",
            "height": screenH - top,
            "color": mainFontColorMore,
            "font-size": "12px",
            "line-height": "180%"
        });
    }
    this.show = function () {
        mPage.show();
        if (!isLoad) {
            loadFile();
        }
    }
    function loadFile() {
        requestAjaxGet("files/about.html", function (jsonObj) {
            isLoad = true;
            $("#aboutDiv_content").html(jsonObj);
        }, null);
    }
}
function pyramidObj() {
    var mPage = new pageObj("pyramidDiv", "金字塔介绍");
    var isLoad = false;
    this.init = function () {
        mPage.init();
        $("#pyramidDiv_content").css({
            "width": "100%",
            "height": screenH - top,
            "color": mainFontColorMore,
            "font-size": "12px",
            "line-height": "180%"
        });
    }
    this.show = function () {
        mPage.show();
        if (!isLoad) {
            loadFile();
        }
    }
    function loadFile() {
        requestAjaxGet("files/pyramid.html", function (jsonObj) {
            isLoad = true;
            $("#pyramidDiv_content").html(jsonObj);
        }, null);
    }
}
function responsibilityObj() {
    var mPage = new pageObj("responsibilityDiv", "博彩责任");
    var isLoad = false;
    this.init = function () {
        mPage.init();
        $("#responsibilityDiv_content").css({
            "width": "100%",
            "height": screenH - top,
            "color": mainFontColorMore,
            "font-size": "12px",
            "line-height": "180%"
        });
    }
    this.show = function () {
        mPage.show();
        if (!isLoad) {
            loadFile();
        }
    }
    function loadFile() {
        requestAjaxGet("files/responsibility.html", function (jsonObj) {
            isLoad = true;
            $("#responsibilityDiv_content").html(jsonObj);
        }, null);
    }
}
function openService() {
    myPJDApp.showService();
}
function bankCard(prefix, bankObjInfo, parentDiv) {
    var cardNO = bankObjInfo["cardNO"];
    var cardNOMs = "";
    var inputType = "button";
    var len = cardNO.length;
    var m = parseInt(len / 4);
    for (var i = 0; i < m; i++) {
        cardNOMs = cardNOMs + cardNO[i * 4];
        cardNOMs = cardNOMs + cardNO[i * 4 + 1];
        cardNOMs = cardNOMs + cardNO[i * 4 + 2];
        cardNOMs = cardNOMs + cardNO[i * 4 + 3] + " ";
    }
    if (len % 4 != 0) {
        cardNOMs = cardNOMs + cardNO.substring(m * 4);
    }
    cardNO = cardNOMs;
    var cardId = "\"" + bankObjInfo["cardNO"] + "\"";
    var copyAccount = "\"" + bankObjInfo["account"] + "\"";
    var copybankChild = "\"" + bankObjInfo["bankChild"] + "\"";
    if (bankObjInfo["btnHidden"]) {
        inputType = "hidden";
    }
    var copyBtn = "<input id=" + prefix + "_copyBtn class='copyStyle' onClick='copyInApp([copyVal])' type='" + inputType + "' value='复制' />";
    var str = "<div class=" + prefix + "_main>";
    str = str + "<div class=" + prefix + "_top><div><img style=\"padding-left:10px\" src=pic/BANK_" + bankObjInfo["code"] + ".png height=25 /></div><div class=" + prefix + "_cardtext>储蓄卡</div></div>";
    str = str + "<div class=" + prefix + "_body>";
    str = str + "<div class=" + prefix + "_body_cardNo>" + cardNO + copyBtn.replace("[copyVal]", cardId) + "</div>";
    str = str + "<div class=\"" + prefix + "_body_cardBank\"><div class=" + prefix + "_body_title>开户名:" + bankObjInfo["account"] + "</div>" + copyBtn.replace("[copyVal]", copyAccount) + "</div>";
    str = str + "<div class=\"" + prefix + "_body_cardBank\"><div class=" + prefix + "_body_title>开户行:" + bankObjInfo["bankChild"] + "</div>" + copyBtn.replace("[copyVal]", copybankChild) + "</div>";
    str = str + "</div>";
    str = str + "</div>";
    parentDiv.html(str);
    $("." + prefix + "_cardtext").css({
        "line-height": "45px",
        "color": "#000000",
        "text-align": "center",
        "width": "80px",
        "font-size": "12px"
    });
    $("." + prefix + "_top").css({
        "width": "100%",
        "height": "45px",
        "display": "flex",
        "border-top-left-radius": "16px",
        "border-top-right-radius": "16px",
        "border": "1px solid #cccccc",
        "background-color": "#cccccc",
        "justify-content": "space-between",
        "align-items": "center"
    });
    $("." + prefix + "_body").css({
        "width": "100%",
        "height": "auto",
        "border-bottom-left-radius": "16px",
        "border-bottom-right-radius": "16px",
        "border": "1px solid #cccccc",
        "background-color": "#252525"
    });
    $("." + prefix + "_main").css({
        "width": "100%",
        "height": "auto",
        "border-radius": "16px",
        "background-color": "#cccccc"
    });
    $("." + prefix + "_body_cardNo").css({
        "font-size": "20px",
        "color": "#cccccc",
        "display": "flex",
        "justify-content": "space-between",
        "align-items": "center",
        "line-height": "40px",
        "padding-left": "10px",
        "padding-right": "10px",
        "overflow": "hidden"
    });
    $("." + prefix + "_body_cardBank").css({
        "font-size": "20px",
        "color": "#cccccc",
        "display": "flex",
        "justify-content": "space-between",
        "align-items": "center",
        "line-height": "40px",
        "padding-left": "10px",
        "padding-right": "10px",
        "overflow": "hidden"
    });
    $("." + prefix + "_body_title").css({
        "height": "40px",
        "font-size": "12px",
        "color": "#999999",
        "line-height": "30px"
    });
    $(".copyStyle").css({
        "border": "0px",
        "background": "#72b3e9",
        "border-radius": "25px",
        "color": "white",
        "width": "50px",
        "float": "right",
    });
    parentDiv.css({
        "width": "100%",
        "padding-left": "10px",
        "padding-right": "10px",
        "box-sizing": "border-box"
    });
}
function sureCloseApp() {
    window.location.assign("zy://app?command=close&type=0");
}
function getContent(key, contentId, okFun, errorFun) {
    requestAjaxGet("pages/" + key + ".html", function (jsonObj) {
        $("#" + contentId).html(jsonObj);
        if (okFun != null) {
            okFun();
        }
    }, function (error) {
        if (errorFun != null) {
            errorFun();
        }
    });
}
function doubleValue(val) {
    if (val == null || isNaN(val)) { return parseFloat(0); }
    return parseFloat(parseFloat(val).toFixed(2));
}
function singnPwdOpen() {
    setBtnOnTouchEvent($("#accountSN_touchLock"), function () {
        if (isSetTouchLock()) {
            var obj = new Object();
            obj["showBack"] = true;
            obj["titleMs"] = "修改手势";
            obj["backCallFun"] = function (pass) {
                if (pass != null) {
                    mIndexPopWindowObj.show(4, null, "none");
                }
            }
            mIndexPopWindowObj.show(1, obj, "none");
        } else {
            var obj = new Object();
            obj["showBack"] = true;
            obj["backCallFun"] = function (pass) {
                if (pass != null) {
                    $("#accountSN_DelTouchLock").css({ "display": "flex" });
                    $("#accountSN_touchLock").html("修改手势密码");
                }
            }
            mIndexPopWindowObj.show(4, obj, "none");
        }
    }, mainColorDeep, mainColor, null);
    setBtnOnTouchEvent($("#accountSN_DelTouchLock"), function () {
        var obj = new Object();
        obj["showBack"] = true;
        obj["titleMs"] = "删除手势";
        obj["backCallFun"] = function (pass) {
            if (pass != null) {
                clearTouchLockPass();
                $("#accountSN_DelTouchLock").css({ "display": "none" });
                $("#accountSN_touchLock").html("设置手势密码");
            }
        }
        mIndexPopWindowObj.show(1, obj, "none");
    }, mainColorDeep, mainColor, null);
}
function getResettingSign() {
    var isHiden = getLocalStorage("touckLock_IsHiddenLine");
    if (isHiden == 1) { isHiden = true } else { isHiden = false; }
    return isHiden;
}
function loadAlert(){
    mIndexPopWindowObj.close(true);
    if (userInfo["agent_type"] == 3) {
        myPJDApp.showAgent();
    } else {
        myPJDApp.showPyramid();
    }
}
function loadIsAgent() {
    var isAgent = false;
    if (isLogin()) {
        if (userInfo["is_agent"] != 0) {
            isAgent = true;
        }
    }
    return isAgent;
}
function nnAgentAlert() {
    var obj = new Object();
    obj["name"] = "pages/nnAgentAlert.html";
    obj["addCompete"] = true;
    mIndexPopWindowObj.show(6, obj, "none");
}
var toolbarTopColor = "#0f0f0f";
var toolbarTopColorDK = "#212121";
var toolbarIndexColor = "#cccccc";
var toolbarIndexColorTouch = "#cca352";
var toolbarBottomColor = "#0f0f0f";
var toolbarBottomColorDK = "#212121";
var toolbarFontColor = "#999999";
var toolbarFontColorTouch = "#cca352";
var mainColor = "#cca352";
var mainColorDeep = "#9a7d44";
var mainColorMore = "#212121";
var subColor = "#cca352";
var subColorDK = "#212121";
var mainBackColor = "#2A2A2A";
var lighterBackColor = "#383838";
// 分割块颜色
var splitLineColor = "#999999";
// 字体颜色
var mainFontColor = "#FFFFFF";
var mainFontColorMore = "#CCCCCC";
var mainFontColorDeep = "#999999";
// 输赢字体颜色
var winFontColor = "#5D8FB8";
var lossFontColor = "#FF5E1B";
// 细分颜色
var roadContentBgColor = "#272727";
var mapContentBgColor = "#272727";
var mapContentItemBgColor = "#272727";
var mapContentItemGameColor = "#191919";
var mapContentItemGameColorTouch = "#111111";
var mapContentItemGameColorSD = "#2A2A2A";
var mapContentItemGameFontColor = "#FFFFFF";
var mapSplitLineColor = "#111111";
var meItemTopBgColor = "#272727";
var meItemContentBgColor = "#191919";
var meItemContentTouchColor = "#212121";
var meSplitBlock = "#272727";
var meSplitLine = "#272727";
var noticeTextColor = "#999999";
var noticeBgColor = "#2f2f2f";
var topBarTouchColor = "#232323";
var pageBgColor = "#272727";
var pageBgColorDK = "#272727";
var tryPlayBottomToneColor = "#5396C7";
var inputLineColor = "#161616";
var inputFontColor = "#FFFFFF";
var inputSubFontColor = "#cca352";
var inputTouchColor = "#15171b";
var inputBgColor = "#2E333B";
var kyGameItemBgColor = "#1B1B1B";
// 主题路径
var themPath = "pic/themeMain/";
var themJsonObj = null;
