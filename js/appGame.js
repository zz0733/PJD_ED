var timeoutMidTime = 30000;
var timeoutBackTime = 120000;
var gameApiErrorMessage = "";
function JPNN_ED() {
    var TAG = "JPNNGAME: ";
    var token = null; var isSetToken = false;
    var isBack = true;
    var resetLoginTimeOut;
    var mLoader = new Spinner({ "color": "white" });
    var timeoutMidObj;
    var timeoutBackObj;
    var iframeId = "#nn_content_frame";
    var tableCode = null; // 预进桌
    var isResLoadOK = false;
    var isEnterTable = false;
    var isExitTable = false;
    var is1003codeHandle = false;
    var reLoadFrameTimeOutObj = null;
    var reLoadTime = 40000;
    this.loadUI = function () {
        var src = $(iframeId).attr("src");
        if (src != "JPNN/index.html") {
            $(iframeId).attr("src", "JPNN/index.html");
            reLoadTimeout();
        }
        var contentH = screenH - topH - menuH - 0.5;
        $("#nn_content").css({
            "width": screenW,
            "height": contentH
        });
        $(iframeId).css({
            "width": screenW,
            "height": contentH
        });
        $("#nn_content_fed").css({
            "background": pageBgColor,
            "width": screenW,
            "height": contentH,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        $("#nn_content_load").css({
            "width": screenW,
            "height": contentH,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        $("#nn_content_fed_root_top_txt").css({
            "color": mainColor
        });
        AppAddEvent(document, "visibilitychange", appHiddenChange, true);
    }
    this.openGame = function () {
        isBack = false;
        reSet();
        openAnimation();
        if (token != null) {
            showGame();
            var vv = getParentVv("setToken");
            if (vv != null && isSetToken) {
                vv.resume(); if (isLogin()) { mGameAPI.enterGame("nn", 1, onLoginFed); }
            } else if (vv != null) {
                vv.setToken(token, onTokenBack);
            }
        } else {
            var result = mGameAPI.getAPILoginResult("nn");
            if (result == null) { tokenNot(); return; }
            var data = result["data"];
            if (data == null) { tokenNot(); return; }
            token = data["token"];
            if (token == null) { tokenNot(); return; }
            showGame();
            var vv = getParentVv("setToken");
            if (vv != null) {
                vv.setToken(token, onTokenBack);
            } else {
                isSetToken = false;
            }
        }
        function tokenNot() {
            if (isLogin()) {
                showLoad();
                onLoginJPNN();
            }
        }
    }
    this.exitGame = function () {
        mEnterGameObj.unShow();
        isBack = true;
        reSet();
        var vv = getParentVv("exitRoom");
        if (vv != null) {
            vv.exitRoom();
        }
        tableCode = null;
    }
    this.notify = notify;
    this.enterTable = enterTable;
    this.exitTable = exitTable;
    this.resetOpenGame = resetOpenGame;
    this.openAnimation = openAnimation;
    this.stopAnimation = stopAnimation;
    this.reLoadFrame = reLoadFrame;
    this.setService = setService;
    function notify(code, data) {
        switch (code) {
            case 1000:
                setService(NiceJpnnDomain);
                clearReLoadTimeout();
                isResLoadOK = true;
                stopAnimation();
                var vv = getParentVv("setToken");
                if (vv == null || isBack || token == null || isSetToken) { return; }
                vv.setToken(token, onTokenBack);
                break;
            case 1001:
                token = null;
                mGameAPI.setAPILoginResult("nn", null);
                resetOpenGame();
                break;
            case 1002:
                tableCode = data;
                if (isLogin()) {
                    token = null;
                    mGameAPI.setAPILoginResult("nn", null);
                    resetOpenGame();
                } else {
                    myPJDApp.showLogin();
                }
                break;
            case 1003:
                if (!is1003codeHandle) {
                    tableCode = data;
                    is1003codeHandle = true;
                    var vv = getParentVv("enterRoom");
                    if (vv == null || tableCode == null) {
                        is1003codeHandle = false;
                        return;
                    }
                    setTimeout(function () {
                        if (isBack) {
                            is1003codeHandle = false;
                            return;
                        }
                        vv.enterRoom(tableCode);
                        tableCode = null; // 消费掉预桌号
                    }, 800);
                } else {
                    is1003codeHandle = false;
                    showIncome();
                }
                break;
            case 9999:
                token = null;
                mGameAPI.setAPILoginResult("nn", null);
                resetOpenGame();
                $(iframeId).attr("src", "JPNN/index.html");
                reLoadTimeout();
                break;
            default: break;
        }
        console.log(TAG + "notify code:" + code);
    }
    function enterTable() {
        if (isBack) { return; }
        isEnterTable = true;
        var h = screenH - 0.5;
        // 框架
        $("#indexDiv").css({ "height": h });
        // 游戏
        $("#content_niuniu").css({ "height": h });
        $("#nn_content").css({ "height": h });
        $(iframeId).css({ "height": h });
        // 全屏
        $("#top").css({ "display": "none" });
        $("#menusDiv").css({ "display": "none" });
    }
    function exitTable() {
        if (isEnterTable) {
            isExitTable = true;
            isEnterTable = false;
        }
        var h = screenH - topH - menuH - 0.5;
        var wH = screenH - topH - menuH - 0.5;
        // 退出全屏
        $("#top").css({ "display": "flex" });
        $("#menusDiv").css({ "display": "block" });
        // 框架
        $("#indexDiv").css({ "height": wH });
        // 游戏
        $("#content_niuniu").css({ "height": h });
        $("#nn_content").css({ "height": h });
        $(iframeId).css({ "height": h });
    }
    function resetOpenGame() {
        if (isBack) { return; }
        MJPNNObj.openGame();
    }
    function onLoginJPNN() {
        mGameAPI.loginToAPI("nn", 1, onLoginOK, onLoginFed);
    }
    function onLoginOK() {
        var result = mGameAPI.getAPILoginResult("nn");
        if (result == null || result == "") { showFed("游戏无法打开,请稍后重试!"); return; }
        var data = result["data"];
        if (data == null || data == "") { showFed("游戏无法打开,请稍后重试!"); return; }
        token = data["token"];
        if (token == null || token == "") { showFed("游戏无法打开,请稍后重试!"); return; }
        showGame();
        var vv = getParentVv("setToken");
        if (vv != null) {
            vv.setToken(token, onTokenBack);
        } else {
            isSetToken = false;
        }
    }
    function onLoginFed(error) {
        if (isBack) {
            clearResetLogin();
            return;
        }
        if (error == 900) {
            clearResetLogin();
            showFed("游戏正在维护中," + errorMesage);
        } else {
            clearResetLogin();
            resetLoginTimeOut = setTimeout(function () {
                onLoginJPNN();
            }, 3000);
        }
        function clearResetLogin() {
            if (resetLoginTimeOut != null) {
                clearTimeout(resetLoginTimeOut);
                resetLoginTimeOut = null;
            }
        }
    }
    function onTokenBack(data) {
        if (isEnterTable) { return; }
        if (data == null || !data["success"]) {
            if (data != null && data["msg"] != null && data["msg"] != "") {
                showFed(data["msg"]);
            } else {
                showFed("游戏登录失败,请稍后重试!");
            }
            isSetToken = false;
            return;
        }
        isSetToken = true;
        var vv = getParentVv("resume");
        if (vv == null) {
            showFed("游戏内部错误,请稍后重试!");
            return;
        }
        vv.resume();
        if (tableCode != null && !isNaN(tableCode)) {
            vv.enterRoom(tableCode);
            tableCode = null; // 消费掉预桌号
        }
        if (isLogin() && !isExitTable) { mGameAPI.forceEnterGame("nn", onLoginFed); }
        isExitTable = false;
        console.log("onTokenBack isSuccess:" + data["success"]);
    }
    function getParentVv(funName) {
        if (!isResLoadOK) { return null; }
        if (funName == null) { funName = "setToken" }
        try {
            var vv = $(window.parent.document).contents().find(iframeId)[0].contentWindow.cc.vv;
            if (vv[funName] != null) {
                console.log("getParentVv func succ:" + funName);
                return vv;
            }
            console.log("getParentVv func fed:" + funName);
            return null;
        } catch (e) {
            console.log("getParentVv func error:" + funName);
            return null;
        }
    }
    var isShowLoad = false;
    var isShowGame = false;
    var isShowFed = false;
    function showFed(tsMsg) {
        if (isShowFed) { return; }
        mLoader.spin();
        $("#nn_content_fed").css({ "display": "flex" });
        $("#nn_content_load").css({ "display": "none" });
        $("#nn_content_fed_root_ts").html(tsMsg);
        isShowFed = true;
        isShowLoad = false;
        isShowGame = false;
        clearLoadingTimeout();
    }
    function showLoad() {
        if (isShowLoad) { return; }
        mLoader.spin();
        $("#nn_content_fed").css({ "display": "none" });
        $("#nn_content_load").css({ "display": "flex" });
        $("#nn_content_load_root_view").html("");
        $("#nn_content_load_root_ts").html("正在加载中,请稍后!");
        mLoader.spin(o("nn_content_load_root_view"));
        isShowLoad = true;
        isShowFed = false;
        isShowGame = false;
        clearLoadingTimeout();
        timeoutMidObj = setTimeout(function () {
            if (!isShowLoad) { return; }
            $("#nn_content_load_root_ts").html("加载时间较长,请耐心等待...");
        }, timeoutMidTime);
        timeoutBackObj = setTimeout(function () {
            if (!isShowLoad) { return; }
            showFed("游戏无法打开,请稍后重试!");
        }, timeoutBackTime);
    }
    function showGame() {
        if (isShowGame) { return; }
        mLoader.spin();
        $("#nn_content_fed").css({ "display": "none" });
        $("#nn_content_load").css({ "display": "none" });
        isShowGame = true;
        isShowLoad = false;
        isShowFed = false;
        clearLoadingTimeout();
    }
    function reSet() {
        clearLoadingTimeout();
        isShowLoad = false;
        isShowGame = false;
        isShowFed = false;
        $("#nn_content_fed").css({ "display": "none" });
        $("#nn_content_load").css({ "display": "none" });
    }
    function clearLoadingTimeout() {
        if (timeoutMidObj != null) {
            clearTimeout(timeoutMidObj);
            timeoutMidObj = null;
        }
        if (timeoutBackObj != null) {
            clearTimeout(timeoutBackObj);
            timeoutBackObj = null;
        }
    }
    function openAnimation() {
        if (isBack) { return; }
        var vv = getParentVv("resume");
        if (vv != null) { vv.resume(); }
    }
    function stopAnimation(isForce) {
        if (isForce == null) { isForce = false; }
        if (!isBack && !isForce) { return; }
        var vv = getParentVv("exitRoom");
        if (vv != null) { vv.exitRoom(); }
    }
    function appHiddenChange() {
        var isHidden = document.hidden;
        if (isHidden) {
            stopAnimation();
            console.log("document visibilitychange hidden");
        } else {
            setTimeout(function () { stopAnimation(); }, 0);
            console.log("document visibilitychange not hidden");
        }
    }
    function reLoadFrame() {
        if (reLoadFrameTimeOutObj == null) { return; }
        $(iframeId).attr("src", "JPNN/index.html");
        reLoadTimeout();
    }
    function reLoadTimeout() {
        clearReLoadTimeout();
        reLoadFrameTimeOutObj = setTimeout(reLoadFrame, reLoadTime);
        console.log(TAG + "reLoadTimeout");
    }
    function clearReLoadTimeout() {
        if (reLoadFrameTimeOutObj != null) {
            clearTimeout(reLoadFrameTimeOutObj);
            reLoadFrameTimeOutObj = null;
            console.log(TAG + "clearReLoadTimeout success");
        }
        console.log(TAG + "clearReLoadTimeout");
    }
    function showIncome() {
        if (isBack || !isLogin()) { return; }
        var obj = new Object();
        obj["backIs"] = true;
        obj["title"] = "余额不足";
        obj["viewFun"] = function (id) {
            var root = "<div id=\"" + id + "_disconnectRoot\">[content]</div>";
            var loadIcon = "<div id=\"" + id + "_disconnectLoadIcon\">[content]</div>";
            var img = "<img id=\"" + id + "_disconnectImg\" src=\"" + themPath + "insufficient_balance.png\" style=\"width:85px\"/>";
            loadIcon = loadIcon.replace("[content]", img);
            var txt = "<div id=\"" + id + "_disconnectTxt\">您当前的余额不足!</div>";
            var txtSub = "<div id=\"" + id + "_disconnectTxtSub\">请充值</div>";
            var btnCome = "<div id=\"" + id + "_disconnectBtnCome\">立即存款</div>";
            var btnBack = "<div id=\"" + id + "_disconnectBtnBack\">取消</div>";
            return root.replace("[content]", loadIcon + txt + txtSub + btnCome + btnBack);
        };
        obj["styleFun"] = function (id) {
            $("#" + id + "_disconnectRoot").css({
                "align-items": "center",
                "text-align": "center",
                "width": "100%",
                "height": "auto",
                "padding": "15px",
                "box-sizing": "border-box"
            });
            $("#" + id + "_disconnectLoadIcon").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": "100%",
                "height": "auto",
                "box-sizing": "border-box"
            });
            $("#" + id + "_disconnectTxt").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": "100%",
                "height": "auto",
                "font-size": "14px",
                "color": "#A8A8A8",
                "margin-top": "10px",
                "box-sizing": "border-box"
            });
            $("#" + id + "_disconnectTxtSub").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": "100%",
                "height": "auto",
                "font-size": "16px",
                "color": mainColor,
                "margin-top": "2px",
                "box-sizing": "border-box"
            });
            $("#" + id + "_disconnectBtnCome").css({
                "border-radius": "20px",
                "color": mainFontColor,
                "font-size": "14px",
                "background-color": mainColor,
                "width": "100%",
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "padding": "10px",
                "margin-top": "15px",
                "box-sizing": "border-box"
            });
            $("#" + id + "_disconnectBtnBack").css({
                "border-radius": "20px",
                "border": "1px solid " + mainColor,
                "color": mainColor,
                "font-size": "14px",
                "background-color": "",
                "width": "100%",
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "padding": "10px",
                "margin-top": "15px",
                "box-sizing": "border-box"
            });
            setBtnOnTouchEvent($("#" + id + "_disconnectBtnCome"), function () {
                if (isLogin()) {
                    mMsgBox.hide();
                    myPJDApp.showDeposit();
                } else {
                    mMsgBox.hide();
                    myPJDApp.showLogin();
                }
            }, mainColorDeep, mainColor, null);
            setBtnOnTouchEvent($("#" + id + "_disconnectBtnBack"), function () {
                mMsgBox.hide();
            }, mainColorDeep, "", null);
        };
        mMsgBox.showImp(obj);
    }
    function setService(dom) {
        if (IS_TEST_SERVER) { return; }
        setTimeout(function () {
            var vv = getParentVv("setServer");
            if (vv != null) {
                vv.setServer(dom);
                console.log("setService dom:" + dom);
            }
        }, 200);
        console.log("setService close");
    }
}
function bindFedView(id, msg, btnC) {
    var obj = $("#" + id);
    // 背景布局
    var bg = "<div id=\"" + id + "_failedBg\">%content%</div>";
    // 根部布局
    var rootDiv = "<div id=\"" + id + "_failedDiv\">%content%</div>";
    // 哭脸图片
    var img = "<div style=\"height:80px\"><img class=\"openGameFailureImg\" src=\"" + themPath + "sorry.png\"/></div>";
    // 提示标题
    var tsMsg = "<div style=\"font-size:18px\"><font color=" + mainColor + ">很抱歉</font></div>";
    // 提示内容
    var cnMsg = "<div style=\"font-size:16px\"><font color=#CACACA>" + msg + "</font></div>";
    // 重试按钮
    var btnCon = "<div style=display:flex;justify-content:center;align-items:center><div id=btn_" + id + " style=\"font-size:16px\"><font color=white>重试</font></div><div>";
    // 大分割线
    var devMx = "<div style=\"height:6px\"></div>";
    // 小分割线
    var devMn = "<div style=\"height:1px\"></div>";
    bg = bg.replace("%content%", rootDiv.replace("%content%", img + devMx + tsMsg + devMn + cnMsg + devMx + devMx + btnCon));
    obj.html(bg);
    $("#btn_" + id).css({
        "border-radius": "20px",
        "width": "20%",
        "height": "22px",
        "font-size": "14px",
        "background-color": "#cca352"
    })
    setBtnOnTouchEvent($("#btn_" + id), function () {
        var isNewLoad = false;
        if (btnC != null) {
            if (btnC == "qsContent") {
                backClickFun();
                myPJDApp.showAskObj(isNewLoad);
            } else if (btnC == "aboutContent") {
                backClickFun();
                myPJDApp.showAboutObj(isNewLoad);
            } else if (btnC == "agreementContent") {
                backClickFun();
                myPJDApp.showAgreement("agreement", isNewLoad);
            } else if (btnC == "declareContent") {
                backClickFun();
                myPJDApp.showAgreement("declare", isNewLoad);
            } else if (btnC == "bettingContent") {
                backClickFun();
                myPJDApp.showResponsibilityObj(isNewLoad);
            } else if (btnC == "pyramidContent_1_1") {
                backClickFun();
                myPJDApp.showPyramid("pyramidContent_1_1", isNewLoad);
            } else if (btnC == "pyramidContent_2_2") {
                backClickFun();
                myPJDApp.showPyramid("pyramidContent_2_2", isNewLoad);
            } else if (btnC == "league_three_menu_1_content") {
                backClickFun();
                var isType = "5_1";
                myPJDApp.showAgent(isNewLoad, isType);
            } else if (btnC == "league_three_menu_2_content") {
                backClickFun();
                var isType = "5_2";
                myPJDApp.showAgent(isNewLoad, isType);
            } else if (btnC == "leagueSuggest") {
                backClickFun();
                myPJDApp.showAgent(isNewLoad, 4);
            }
        } else {
            if (id == "discountDiv_content") {
                backClickFun();
                myPJDApp.showDiscountObj(isNewLoad);
            } else if (id == "rule_content") {
                backClickFun();
                myPJDApp.showLuckyDrawObj();
            } else {
                $("#btn_" + id).css({ "display": "none" })
            }
        }
    }, "#f1c570", "#cca352");
    $("#" + id + "_failedBg").css({
        "width": "100%",
        "height": "100%",
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "box-sizing": "border-box"
    });
    $("#" + id + "_failedDiv").css({
        "align-items": "center",
        "text-align": "center",
        "width": "100%",
        "height": "auto",
        "font-size": "16px",
        "box-sizing": "border-box"
    });
}
function gameAPI() {
    var mLoginResultList = null;
    var mAPIStatusList = null;
    var isTryPlay = false;
    this.init = function () {
        mLoginResultList = new Object();
        mLoginResultList["nn"] = null;
        mAPIStatusList = new Object();
        mAPIStatusList["nn"] = 0;
    }
    this.loginToAPI = function (gameType, isTest, callback, errorCallBack) {
        requestLogin(gameType, isTest, callback, errorCallBack);
    }
    this.tryPlayLoginToApi = function (gameType, vcode, callback, errorCallBack) {
        requestTryPlay(gameType, vcode, callback, errorCallBack);
    }
    this.getAPILoginResult = function (gameType) {
        return mLoginResultList[gameType];
    }
    this.setAPILoginResult = function (gameType, val) {
        mLoginResultList[gameType] = val;
    }
    this.enterGame = function (gameType, isTest, callback) {
        enterGame(gameType, isTest, callback);
    }
    this.forceEnterGame = function (gameType, callback) {
        forceEnterGame(gameType, callback);
    }
    this.getAPIStatus = function (gameType) {
        return mAPIStatusList[gameType];
    }
    this.setAPIStatus = setGameAPIStatus;
    this.isTryPlay = function () {
        return isTryPlay;
    }
    this.setIsTryPlay = function (b) {
        isTryPlay = b;
    }
    function requestLogin(gameType, isTest, callback, errorCallBack) {
        var rdata = "requestType=json&code=" + gameType + "&isTest=" + isTest;
        requestAjax("gameApi/login", rdata, function (jsonObj) {
            var code = jsonObj["code"];
            if (code == 0) {
                isTryPlay = false;
                mLoginResultList[gameType] = jsonObj["result"];
                if (callback != null) callback();
            } else if (code == 100 || code == 101) {
                mToast.show("您的登录已经失效，请重新登录！", 1, "middle");
                appLogout(0);
            } else {
                if (code == 900) { gameApiErrorMessage = jsonObj["errorMesage"]; }
                errorBack(code);
            }
        }, function (error) {
            errorBack(error);
        });
        function errorBack(error) {
            setGameAPIStatus(gameType, 2);
            if (errorCallBack != null) {
                if (error != null) {
                    errorCallBack(error);
                } else {
                    errorCallBack();
                }
            }
        }
    }
    function requestTryPlay(gameType, vcode, callback, errorCallBack) {
        var requestData = "";
        if (vcode != null) {
            requestData = "requestType=json&code=" + gameType + "&imgCode=" + vcode;
        } else {
            requestData = "requestType=json&code=" + gameType;
        }
        requestAjax("gameTestApi/login", requestData, function (jsonObj) {
            var code = jsonObj["code"];
            if (code == 0) {
                isTryPlay = true;
                mLoginResultList[gameType] = jsonObj["result"];
                if (callback != null) callback();
            } else if (code == 100 || code == 101) {
                mToast.show("您的试玩登录已经失效，请重新登录！", 1, "middle");
                appLogout(0);
            } else {
                if (code == 900) { gameApiErrorMessage = jsonObj["errorMesage"]; }
                errorBack(code);
            }
        }, function (error) {
            errorBack(error);
        });
        function errorBack(error) {
            setGameAPIStatus(gameType, 2);
            if (errorCallBack != null) {
                if (error != null) {
                    errorCallBack(error);
                } else {
                    errorCallBack();
                }
            }
        }
    }
    function setGameAPIStatus(gameType, status) {
        mAPIStatusList[gameType] = status;
    }
    function enterGame(gameType, isTest, callBack) {
        mEnterGameObj.show(gameType, callBack);
    }
    function forceEnterGame(gameType, callBack) {
        mEnterGameObj.forceEnter(gameType, callBack);
    }
}
function enterGameObj() {
    var obj;
    var currentGame = "";
    var isOK = "WAIT";
    var isTest = 1;
    var timeOutObj = null;
    var timeOut = 3000;
    var callBack = null;
    this.init = function () {
        obj = $("#enterGameNotic");
        obj.css({ "display": "none" });
    }
    this.show = function (enterGameType, callback) {
        if (currentGame != enterGameType) {
            clearEnterTimeout();
            currentGame = enterGameType;
            obj.css({
                "display": "flex",
                "left": (screenW - 200) / 2,
                "top": (screenH - 50) / 2,
                "z-index": (currentZIndex + 1)
            });
            callBack = callback;
            enterGame();
        }
    }
    this.unShow = unShow;
    this.forceEnter = function (enterGameType, callback) {
        clearEnterTimeout();
        currentGame = enterGameType;
        obj.css({
            "display": "flex",
            "left": (screenW - 200) / 2,
            "top": (screenH - 50) / 2,
            "z-index": (currentZIndex + 1)
        });
        callBack = callback;
        enterGame();
    }
    this.reEnterGame = function () {
        if (currentGame == "") { return; }
        clearEnterTimeout();
        enterGame();
    }
    function clearEnterTimeout() {
        if (timeOutObj != null) {
            clearTimeout(timeOutObj);
            timeOutObj = null;
        }
    }
    function unShow() {
        obj.css({ "display": "none" });
    }
    function enterGame() {
        var dataObj = new Object();
        dataObj["code"] = currentGame;
        dataObj["isTest"] = isTest;
        dataObj["requestType"] = "json";
        requestAjax("gameApi/enter", dataObj, function (jsonObj) {
            console.log("enterGame code:" + dataObj["code"] + ",currentGame:" + currentGame);
            if (dataObj["code"] != currentGame) { return; }
            var code = jsonObj["code"];
            if (code == 0) {
                isOK = jsonObj["result"];
                switch (isOK) {
                    case "OK":
                        clearEnterTimeout();
                        unShow();
                        break;
                    case "MAINTENANCE":
                        if (callBack != null) {
                            callBack(900);
                            callBack = null;
                        }
                        clearEnterTimeout();
                        unShow();
                        break;
                    default:
                        reSetEnterGame();
                        break;
                }
            } else if (code == 100 || code == 101) {
                mToast.show("您的登录已经失效!", 1, "middle");
                appLogout(0);
            } else {
                reSetEnterGame();
            }
        }, function (error) {
            console.log("enterGame code:" + dataObj["code"] + ",currentGame:" + currentGame);
            if (dataObj["code"] != currentGame) { return; }
            reSetEnterGame();
        });
    }
    function reSetEnterGame() {
        clearEnterTimeout();
        timeOutObj = setTimeout(enterGame, timeOut);
    }
}
function tryGameSigupObj() {
    var mPage = new Activity("tryGameSigup", "免费试玩");
    var layoutId = "tryGameSigup_content";
    var layoutObj = $("#" + layoutId);
    var gameType;
    var openGame;
    var isBack = false;
    var isBind = false;
    var bottomToneColor = tryPlayBottomToneColor;
    this.init = function () {
        mPage.init(function () {
            isBack = true;
        });
        $("#tryGameSigup_content").css({ "background-color": "#383838" });
        $("#tryGameSigup_content").css({ "height": screenH - topH });
    }
    this.show = function (tagObj) {
        if (tagObj == null) { return; }
        isBack = false;
        gameType = tagObj["gameType"];
        openGame = tagObj["openGame"];
        if (!checkTryGameType(gameType)) { return; }
        mPage.show();
        if (!isBind) {
            setContentView();
            isBind = true;
        }
    }
    function setContentView() {
        var title1Ms = "如需体验金钱游戏的乐趣,您必须成为真正的会员.";
        var title2Ms = "请输入验证码以申请免费体验账号:";
        var title3Ms = "新玩家288元首存奖金";
        var title4Ms = "了解更多>>";
        var inputMs = "请输入验证码";
        // 顶部布局
        var topRootDiv = "<div class=" + layoutId + "_top_root_div>%content%</div>";
        var bottomRootDiv = "<div class=" + layoutId + "_bottom_root_div>%content%</div>";
        var topTitleDiv = "<div class=" + layoutId + "_top_title_div>%content%</div>";
        var toptitle1 = "<div class=" + layoutId + "_top_title1><font color=#B0B0B0>" + title1Ms + "</font></div>";
        var toptitle2 = "<div class=" + layoutId + "_top_title2><font color=#B0B0B0>" + title2Ms + "</font></div>";
        topTitleDiv = topTitleDiv.replace("%content%", toptitle1 + toptitle2);
        var topVCodeDiv = "<div class=" + layoutId + "_top_code>%content%</div>";
        var imgDiv = "<div class=" + layoutId + "_top_img><img class=validImage src=\"" + themPath + "valid.png\" /></div>";
        var yzMDiv = "<div class=" + layoutId + "_top_yzm><font color=" + mainColor + ">验证码</font></div>";
        var fgDiv = "<div class=" + layoutId + "_fengedev></div>";
        var inputDiv = "<div class=" + layoutId + "_top_input><input type=\"email\" id=" +
            layoutId + "_input placeholder=\"" + inputMs + "\" /></div>";
        var codeDiv = "<div class=" + layoutId + "_codeImgDiv><img class=vcodeImage id=" + layoutId + "_codeImg /></div>";
        topVCodeDiv = topVCodeDiv.replace("%content%", imgDiv + yzMDiv + fgDiv + inputDiv + codeDiv);
        var xiahuaxianDiv = "<div class=" + layoutId + "_top_xiahuaxian></div>";
        var submitDiv = "<div class=" + layoutId + "_top_submit id=" + layoutId +
            "_code_submit><font color=white>提交</font></div>";
        topRootDiv = topRootDiv.replace("%content%", topTitleDiv + topVCodeDiv + xiahuaxianDiv + submitDiv);
        // 底部布局
        var bottomTitleDiv = "<div class=" + layoutId + "_bottom_title_div>%content%</div>";
        var bomtitle1 = "";//"<div class=" + layoutId + "_bottom_title1><font color=" + bottomToneColor + ">" + title3Ms + "</font></div>";
        var aLink = "";//"<a  style=\"text-decoration: underline;color:" + bottomToneColor + "\" href=\"javascript:myPJDApp.showFavourable(43)\">" + title4Ms + "</a>";
        var bomtitle2 = "<div class=" + layoutId + "_bottom_title2>" + aLink + "</div>";
        bottomTitleDiv = bottomTitleDiv.replace("%content%", bomtitle1 + bomtitle2);
        var wSigupDiv = "<div class=" + layoutId + "_bottom_wsigup>%content%</div>";
        var nSigupDiv = "<div class=" + layoutId + "_bottom_nsigup id=" + layoutId +
            "_sigup_submit><font color=" + bottomToneColor + ">立即注册</font></div>";
        wSigupDiv = wSigupDiv.replace("%content%", nSigupDiv);
        bottomRootDiv = bottomRootDiv.replace("%content%", bottomTitleDiv + wSigupDiv);
        layoutObj.html(topRootDiv + bottomRootDiv);
        setContentStyle();
        setTimeout(function () { $("#tryGameSigup_content_input").focus(); }, 500);
    }
    function setContentStyle() {
        var sW = $(window).width();
        // 顶部布局
        $("." + layoutId + "_top_root_div").css({
            "align-items": "center",
            "text-align": "center",
            "width": "100%",
            "height": "55%",
            "padding-top": "50px",
            "padding-bottom": "50px",
            "padding-left": "15px",
            "padding-right": "15px",
            "background": "#383838",
            "box-sizing": "border-box"
        });
        $("." + layoutId + "_top_title_div").css({
            "align-items": "center",
            "text-align": "center",
            "width": "100%",
            "height": "auto"
        });
        $("." + layoutId + "_top_title1").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "auto",
            "height": "auto",
            "font-size": "14px"
        });
        $("." + layoutId + "_top_title2").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "auto",
            "height": "auto",
            "margin-top": "3px",
            "font-size": "14px"
        });
        // 验证码布局
        var codeW = sW - 30;
        $("." + layoutId + "_top_code").css({
            "display": "flex",
            "justify-content": "start-flex",
            "align-items": "center",
            "text-align": "center",
            "width": "100%",
            "height": "30px",
            "margin-top": "50px"
        });
        $("." + layoutId + "_top_img").css({
            "text-align": "left",
            "width": "19px",
            "height": "auto"
        });
        $("." + layoutId + "_top_yzm").css({
            "text-align": "left",
            "width": "42px",
            "height": "auto",
            "font-size": "14px",
            "margin-left": "10px",
            "box-sizing": "border-box"
        });
        $("." + layoutId + "_fengedev").css({
            "text-align": "cneter",
            "width": "1px",
            "height": "18px",
            "margin-left": "20px",
            "background": "#848484"
        });
        $("." + layoutId + "_top_input").css({
            "text-align": "left",
            "width": codeW - 19 - 10 - 42 - 20 - 1 - 10 - 20 - 80,
            "height": "auto",
            "margin-left": "10px",
            "box-sizing": "border-box"
        });
        $("#" + layoutId + "_input").css({
            "width": "100%",
            "height": "28px",
            "color": "#B0B0B0",
            "outline": "medium",
            "border": "none",
            "background": "transparent"
        });
        $("." + layoutId + "_codeImgDiv").css({
            "text-align": "right",
            "width": "80px",
            "margin-left": "20px",
            "height": "28px"
        });
        $("." + layoutId + "_top_xiahuaxian").css({
            "text-align": "center",
            "width": "100%",
            "height": "1px",
            "margin-top": "5px",
            "background": "#848484"
        });
        $("." + layoutId + "_top_submit").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "100%",
            "height": "40px",
            "background": mainColor,
            "border-radius": "25px",
            "margin-top": "55px",
            "box-sizing": "border-box"
        });
        // 底部布局
        $("." + layoutId + "_bottom_root_div").css({
            "align-items": "center",
            "text-align": "center",
            "width": "100%",
            "height": "45%",
            "padding-top": "65px",
            "padding-bottom": "65px",
            "padding-left": "15px",
            "padding-right": "15px",
            "background": "#2D2D2D",
            "box-sizing": "border-box"
        });
        $("." + layoutId + "_bottom_title_div").css({
            "align-items": "center",
            "text-align": "center",
            "width": "100%",
            "height": "auto"
        });
        $("." + layoutId + "_bottom_title1").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "auto",
            "height": "auto",
            "font-size": "20px"
        });
        $("." + layoutId + "_bottom_title2").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "auto",
            "height": "auto",
            "margin-top": "2px",
            "font-size": "12px",
            "color": bottomToneColor
        });
        $("." + layoutId + "_bottom_wsigup").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "100%",
            "height": "40px",
            "background": bottomToneColor,
            "border-radius": "25px",
            "margin-top": "25px",
            "padding": "1px",
            "box-sizing": "border-box"
        });
        $("." + layoutId + "_bottom_nsigup").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "width": "100%",
            "height": "100%",
            "background": "#2D2D2D",
            "border-radius": "25px",
            "box-sizing": "border-box"
        });
        updateCodeImg();
        var vcodeImgObj = $("#" + layoutId + "_codeImg");
        setBtnOnTouchEventNoColor(vcodeImgObj, function () {
            updateCodeImg();
        }, null);
        var codeObj = $("#" + layoutId + "_code_submit");
        setBtnOnTouchEvent(codeObj, function (mObj) {
            var inpuevalue = $("#" + layoutId + "_input").val();
            if (inpuevalue == null || inpuevalue.length == 0) {
                mToast.show("您未输入任何信息!", "1", "middle");
                return;
            }
            codeSubmitBack(inpuevalue);
        }, mainColorDeep, mainColor, null);
        var sigupObj = $("#" + layoutId + "_sigup_submit");
        setBtnOnTouchEvent(sigupObj, function (mObj) {
            myPJDApp.showRegister();
        }, "#222222", "#2D2D2D", null);
    }
    function codeSubmitBack(code) {
        mLoader.show("tryPlay");
        sigupTryGame(["lmg", "lottery"], code, function (isOpen) {
            mLoader.unShow("tryPlay");
            if (isBack) { return; }
            if (isOpen) {
                backClickFun();
                if (gameType == "lottery") {
                    openLottery(openGame);
                } else if (gameType == "lmg") {
                    openLmg(openGame);
                } else if (gameType == "gm") {
                    openGM(openGame);
                }
            } else {
                updateCodeImg();
                mToast.show("验证码错误或已失效,请重新获取!", 1, "middle");
            }
        }, function (error) {
            mLoader.unShow("tryPlay");
            if (isBack) { return; }
            updateCodeImg();
            mToast.show("验证码错误或已失效,请重新获取!", 1, "middle");
        });
    }
    function updateCodeImg() {
        $("#" + layoutId + "_codeImg").attr("src", SERVER_ADD + "servlet/RandomImgCodeServlet?r=" + randomString());
    }
    function sigupTryGame(games, vcode, callBack, errorCallBack) {
        var backGames = games;
        var len = backGames.length;
        if (len == 0) {
            if (callBack != null) {
                callBack(false);
            }
            return;
        }
        var gametypeObj = backGames[0];
        mGameAPI.tryPlayLoginToApi(gametypeObj, vcode, function () {
            backGames.splice(0, 1);
            if (backGames != null && backGames.length > 0) { // 递归backGames
                sigupTryGame(backGames, null, callBack, errorCallBack);
            } else if (callBack != null) {
                callBack(true);
            }
        }, errorCallBack);
    }
    function checkTryGameType(gametype) {
        if (gametype == "gm" || gametype == "lmg" || gametype == "lottery") {
            return true;
        } else {
            return false;
        }
    }
}
function parseGameList() {
    var gameListObjSort = new Array();
    var len = gameListObj.length;
    for (var i = 0; i < len; i++) {
        var topClassId = gameListObj[i].id;
        var topClassName = gameListObj[i].name;
        var subClassList = gameListObj[i].games;
        var subLen = subClassList.length;
        for (var j = 0; j < subLen; j++) {
            if (subClassList[j].games != null) {
                var subsubClassList = subClassList[j].games;
                var subClassId = subClassList[j].id;
                var subsubLen = subsubClassList.length;
                for (var n = 0; n < subsubLen; n++) {
                    var item = new Object();
                    item["topClass"] = topClassId;
                    item["gameId"] = subsubClassList[n].id;
                    item["name"] = subsubClassList[n].name;
                    item["sname"] = subsubClassList[n].sname;
                    item["topClassName"] = topClassName;
                    item["subClassId"] = subClassId;
                    item["no"] = subsubClassList[n].no;
                    gameListObjSort.push(item);
                }
            } else {
                var item = new Object();
                item["topClass"] = topClassId;
                item["gameId"] = subClassList[j].id;
                item["name"] = subClassList[j].name;
                item["sname"] = subClassList[j].sname;
                item["topClassName"] = topClassName;
                item["no"] = subClassList[j].no;
                gameListObjSort.push(item);
            }
        }
    }
    gameListObj["sort"] = gameListObjSort;
}
