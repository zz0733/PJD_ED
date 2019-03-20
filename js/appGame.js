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
        var contentH = screenH - topH - 0.5 - chMenuH - 2 - menuH;
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
        saveLocalStorage("lastGameId", "nn-JPNN");
        $("#menuGameImg").attr("src", "pic/themeMain/LAST_NN.png");
        isEnterTable = true;
        var h = screenH - 0.5;
        // 框架
        $("#indexDiv").css({ "height": h });
        $("#index_content").css({ "height": h });
        // 游戏
        $("#index_content_nn").css({ "height": h });
        $("#nn_content").css({ "height": h });
        $(iframeId).css({ "height": h });
        // 全屏
        $(".index_top_lineX").css({ "display": "none" });
        $("#top").css({ "display": "none" });
        $("#index_top").css({ "display": "none" });
        $("#menusDiv").css({ "display": "none" });
    }
    function exitTable() {
        if (isEnterTable) {
            isExitTable = true;
            isEnterTable = false;
        }
        // 退出全屏
        $(".index_top_lineX").css({ "display": "block" });
        $("#top").css({ "display": "flex" });
        $("#index_top").css({ "display": "flex" });
        $("#menusDiv").css({ "display": "block" });
        // 框架
        var frameH = screenH - topH - 0.5 - menuH;
        $("#indexDiv").css({ "height": frameH });
        var gameH = screenH - topH - 0.5 - chMenuH - 2 - menuH;
        $("#index_content").css({ "height": gameH });
        // 游戏
        $("#index_content_nn").css({ "height": gameH });
        $("#nn_content").css({ "height": gameH });
        $(iframeId).css({ "height": gameH });
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
function KY_ED() {
    var mPage = new Activity("kyDiv", "电子棋牌");
    var mLoader = new Spinner({ "color": "white" });
    var isBack = false;
    var appLogObj = new APPLogging();
    var timeoutMidObj = null;
    var timeoutBackObj = null;
    var kyKindId = 0;
    var eventTheme = "KyGameBackTheme";
    var eventIndex = "KyGameIndex";
    this.init = function () {
        mPage.init(back);
        mPage.hiddenBtn();
        $("#kyDiv_content_iframe").css({
            "width": screenW * 5 / 3,
            "height": (screenH - topH) * 5 / 3,
            "display": "block"
        });
        $("#kyDiv_content_load").css({
            "background": pageBgColor,
            "width": screenW,
            "height": screenH - topH,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        $("#kyDiv_content_fed").css({
            "background": pageBgColor,
            "width": screenW,
            "height": screenH - topH,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        var iframe = o("kyDiv_content_iframe");
        if (iframe.attachEvent) {
            iframe.attachEvent("onload", function () {
                console.log("ky onLoad callback");
            });
        } else {
            iframe.onload = function () {
                console.log("ky onLoad callback");
            };
        }
    }
    this.show = function (gameIndex) {
        appLogObj.clearAPIs();
        appLogObj.markOpStartTime();
        appLogObj.setOpType("openKY");
        if (gameIndex != null) {
            kyKindId = gameIndex;
        } else {
            kyKindId = 0;
        }
        isBack = false;
        reSet();
        mPage.show();
        currentGameCode = "ky";
        showLoad();
        onLoginKy(true);
    }
    function back() {
        focusHiddenBox();
        currentGameCode = "";
        $("#kyDiv_content_iframe").attr("src", "");
        mEventBusObj.unsubscribe(eventIndex);
        if (timeoutMidObj != null) {
            clearTimeout(timeoutMidObj);
            timeoutMidObj = null;
        }
        if (timeoutBackObj != null) {
            clearTimeout(timeoutBackObj);
            timeoutBackObj = null;
        }
        isBack = true;
        reSet();
        console.log("ky click back call");
    }
    function openGame() {
        if (isBack) return;
        saveLocalStorage("lastGameId", "ky-" + kyKindId);
        $("#menuGameImg").attr("src", "pic/themeMain/LAST_KY.png");
        var kyResult = mGameAPI.getAPILoginResult("ky");
        $("#kyDiv_content_iframe").attr("src", kyResult.d.url);
        appLogObj.addAccessAPI("gameApi/enter");
        mGameAPI.enterGame("ky", 1, openKyFailed);
        setTimeout(function () {
            showGame();
            appLogObj.markOpEndTime();
            appLogObj.setOpResult("success");
            appLogObj.uploadLog();
        }, 800);
    }
    function onLoginKy(like) {
        if (like) {
            appLogObj.addAccessAPI("gameApi/login");
            mGameAPI.loginToAPI("ky", 1, function () {
                openGame();
            }, openKyFailed, kyKindId);
        } else {
            setTimeout(function () {
                appLogObj.addAccessAPI("gameApi/login");
                mGameAPI.loginToAPI("ky", 1, function () {
                    openGame();
                }, openKyFailed, kyKindId);
            }, gameApiRetryTime);
            console.log("reset login ky");
        }
    }
    var isShowLoad = false;
    var isShowGame = false;
    var isShowFed = false;
    function showFed(tsMsg) {
        if (isShowFed) return;
        mLoader.spin();
        $("#kyDiv_content_fed").css({
            "display": "flex"
        });
        $("#kyDiv_content_load").css({
            "display": "none"
        });
        $("#kyDiv_content_fed_root_ts").html(tsMsg);
        isShowFed = true;
        isShowLoad = false;
        isShowGame = false;
        if (timeoutMidObj != null) {
            clearTimeout(timeoutMidObj);
            timeoutMidObj = null;
        }
        if (timeoutBackObj != null) {
            clearTimeout(timeoutBackObj);
            timeoutBackObj = null;
        }
    }
    function showLoad() {
        if (isShowLoad) return;
        mLoader.spin();
        $("#kyDiv_content_fed").css({
            "display": "none"
        });
        $("#kyDiv_content_load").css({
            "display": "flex"
        });
        $("#kyDiv_content_load_root_view").html("");
        $("#kyDiv_content_load_root_ts").html("正在加载中,请稍后!");
        mLoader.spin(o("kyDiv_content_load_root_view"));
        isShowLoad = true;
        isShowFed = false;
        isShowGame = false;
        if (timeoutMidObj != null) {
            clearTimeout(timeoutMidObj);
            timeoutMidObj = null;
        }
        if (timeoutBackObj != null) {
            clearTimeout(timeoutBackObj);
            timeoutBackObj = null;
        }
        timeoutMidObj = setTimeout(function () {
            if (!isShowLoad) return;
            $("#kyDiv_content_load_root_ts").html("加载时间较长,请耐心等待...");
        }, timeoutMidTime);
        timeoutBackObj = setTimeout(function () {
            if (!isShowLoad) return;
            showFed("游戏无法打开,请稍后重试!");
            appLogObj.markOpEndTime();
            appLogObj.setOpResult("failure");
            appLogObj.uploadLog();
            setTimeout(function () {
                if (isBack) return;
                isBack = true;
                reSet();
                backClickFun();
            }, 2500);
        }, timeoutBackTime);
    }
    function showGame() {
        if (isShowGame) return;
        mEventBusObj.subscription(eventTheme, eventIndex, function (obj) {
            if (isBack) return;
            backClickFun();
        });
        $("#kyDiv_content_iframe").css({
            "display": "block"
        });
        mLoader.spin();
        $("#kyDiv_content_fed").css({
            "display": "none"
        });
        $("#kyDiv_content_load").css({
            "display": "none"
        });
        isShowGame = true;
        isShowLoad = false;
        isShowFed = false;
        if (timeoutMidObj != null) {
            clearTimeout(timeoutMidObj);
            timeoutMidObj = null;
        }
        if (timeoutBackObj != null) {
            clearTimeout(timeoutBackObj);
            timeoutBackObj = null;
        }
    }
    function reSet() {
        isShowLoad = false;
        isShowGame = false;
        isShowFed = false;
    }
    function openKyFailed(error) {
        if (isBack) return;
        if (error == 900) { // 维护中
            showFed("<div style='font-size:14px'><font>游戏正在维护中...<br></font>" + "· " + gameApiErrorMessage + "</div>");
            appLogObj.markOpEndTime();
            appLogObj.setOpResult("maintain");
            appLogObj.uploadLog();
        } else {
            if (isLogin()) {
                onLoginKy(false);
            }
        }
    }
}
function openKY(gameIndex) {
    if (isLogin()) {
        myPJDApp.openKy(gameIndex);
    } else {
        myPJDApp.showLogin();
        if (mGameAPI.isTryPlay()) {
            mToast.show("该游戏不支持试玩,请登录!", 1, "middle");
        }
    }
}
function GM_ED() {
    var mPage = new Activity("gmDiv", "电子棋牌");
    var mLoader = new Spinner({ "color": "white" });
    var isBack = false;
    var appLogObj = new APPLogging();
    var timeoutMidObj = null;
    var timeoutBackObj = null;
    var gmKindId = 0;
    var eventTheme = "GmGameBackTheme";
    var eventIndex = "GmGameIndex";
    this.init = function () {
        mPage.init(back);
        mPage.hiddenBtn();
        $("#gmDiv_content_iframe").css({
            "width": screenW * 5 / 3,
            "height": (screenH - topH) * 5 / 3,
            "display": "block"
        });
        $("#gmDiv_content_load").css({
            "background": pageBgColor,
            "width": screenW,
            "height": screenH - topH,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        $("#gmDiv_content_fed").css({
            "background": pageBgColor,
            "width": screenW,
            "height": screenH - topH,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        var iframe = o("gmDiv_content_iframe");
        if (iframe.attachEvent) {
            iframe.attachEvent("onload", function () {
                console.log("gm onLoad callback");
            });
        } else {
            iframe.onload = function () {
                console.log("gm onLoad callback");
            };
        }
    }
    this.show = function (gameIndex) {
        appLogObj.clearAPIs();
        appLogObj.markOpStartTime();
        appLogObj.setOpType("openGM");
        if (gameIndex != null) {
            gmKindId = gameIndex;
        } else {
            gmKindId = 0;
        }
        isBack = false;
        reSet();
        mPage.show();
        currentGameCode = "gm";
        showLoad();
        if (isLogin()) {
            onLoginGm(true);
        } else if (mGameAPI.isTryPlay()) {
            onTryLoginGm(true);
        }
    }
    function back() {
        focusHiddenBox();
        currentGameCode = "";
        $("#gmDiv_content_iframe").attr("src", null);
        mEventBusObj.unsubscribe(eventIndex);
        if (timeoutMidObj != null) {
            clearTimeout(timeoutMidObj);
            timeoutMidObj = null;
        }
        if (timeoutBackObj != null) {
            clearTimeout(timeoutBackObj);
            timeoutBackObj = null;
        }
        isBack = true;
        reSet();
        console.log("gm click back call");
    }
    function openGame() {
        if (isBack) return;
        saveLocalStorage("lastGameId", "gm-" + gmKindId);
        $("#menuGameImg").attr("src", "pic/themeMain/LAST_GM.png");
        var gmResult = mGameAPI.getAPILoginResult("gm");
        $("#gmDiv_content_iframe").attr("src", gmResult["data"]["fullUrl"]);
        if (isLogin()) {
            appLogObj.addAccessAPI("gameApi/enter");
            mGameAPI.enterGame("gm", 1, openGmFailed);
        }
        setTimeout(function () {
            showGame();
            appLogObj.markOpEndTime();
            appLogObj.setOpResult("success");
            appLogObj.uploadLog();
        }, 800);
    }
    function onLoginGm(like) {
        if (like) {
            appLogObj.addAccessAPI("gameApi/login");
            mGameAPI.loginToAPI("gm", 1, function () {
                openGame();
            }, openGmFailed, gmKindId);
        } else {
            setTimeout(function () {
                appLogObj.addAccessAPI("gameApi/login");
                mGameAPI.loginToAPI("gm", 1, function () {
                    openGame();
                }, openGmFailed, gmKindId);
            }, gameApiRetryTime);
            console.log("reset login gm");
        }
    }
    function onTryLoginGm(like) {
        if (like) {
            appLogObj.addAccessAPI("gameTestApi/login");
            mGameAPI.tryPlayLoginToApi("gm", "", function () {
                openGame();
            }, openGmFailed, gmKindId);
        } else {
            setTimeout(function () {
                appLogObj.addAccessAPI("gameTestApi/login");
                mGameAPI.tryPlayLoginToApi("gm", "", function () {
                    openGame();
                }, openGmFailed, gmKindId);
            }, gameApiRetryTime);
            console.log("reset login gm");
        }
    }
    var isShowLoad = false;
    var isShowGame = false;
    var isShowFed = false;
    function showFed(tsMsg) {
        if (isShowFed) return;
        mLoader.spin();
        $("#gmDiv_content_fed").css({
            "display": "flex"
        });
        $("#gmDiv_content_load").css({
            "display": "none"
        });
        $("#gmDiv_content_fed_root_ts").html(tsMsg);
        isShowFed = true;
        isShowLoad = false;
        isShowGame = false;
        if (timeoutMidObj != null) {
            clearTimeout(timeoutMidObj);
            timeoutMidObj = null;
        }
        if (timeoutBackObj != null) {
            clearTimeout(timeoutBackObj);
            timeoutBackObj = null;
        }
    }
    function showLoad() {
        if (isShowLoad) return;
        mLoader.spin();
        $("#gmDiv_content_fed").css({
            "display": "none"
        });
        $("#gmDiv_content_load").css({
            "display": "flex"
        });
        $("#gmDiv_content_load_root_view").html("");
        $("#gmDiv_content_load_root_ts").html("正在加载中,请稍后!");
        mLoader.spin(o("gmDiv_content_load_root_view"));
        isShowLoad = true;
        isShowFed = false;
        isShowGame = false;
        if (timeoutMidObj != null) {
            clearTimeout(timeoutMidObj);
            timeoutMidObj = null;
        }
        if (timeoutBackObj != null) {
            clearTimeout(timeoutBackObj);
            timeoutBackObj = null;
        }
        timeoutMidObj = setTimeout(function () {
            if (!isShowLoad) return;
            $("#gmDiv_content_load_root_ts").html("加载时间较长,请耐心等待...");
        }, timeoutMidTime);
        timeoutBackObj = setTimeout(function () {
            if (!isShowLoad) return;
            showFed("游戏无法打开,请稍后重试!");
            appLogObj.markOpEndTime();
            appLogObj.setOpResult("failure");
            appLogObj.uploadLog();
            setTimeout(function () {
                if (isBack) return;
                isBack = true;
                reSet();
                backClickFun();
            }, 2500);
        }, timeoutBackTime);
    }
    function showGame() {
        if (isShowGame) return;
        mEventBusObj.subscription(eventTheme, eventIndex, function (obj) {
            if (isBack) return;
            backClickFun();
        });
        $("#gmDiv_content_iframe").css({
            "display": "block"
        });
        mLoader.spin();
        $("#gmDiv_content_fed").css({
            "display": "none"
        });
        $("#gmDiv_content_load").css({
            "display": "none"
        });
        isShowGame = true;
        isShowLoad = false;
        isShowFed = false;
        if (timeoutMidObj != null) {
            clearTimeout(timeoutMidObj);
            timeoutMidObj = null;
        }
        if (timeoutBackObj != null) {
            clearTimeout(timeoutBackObj);
            timeoutBackObj = null;
        }
    }
    function reSet() {
        isShowLoad = false;
        isShowGame = false;
        isShowFed = false;
    }
    function openGmFailed(error) {
        if (isBack) return;
        if (error == 900) { // 维护中
            showFed("<div style='font-size:14px'><font>游戏正在维护中...<br></font>" + "· " + gameApiErrorMessage + "</div>");
            appLogObj.markOpEndTime();
            appLogObj.setOpResult("maintain");
            appLogObj.uploadLog();
        } else {
            if (isLogin()) {
                onLoginGm(false);
            } else if (mGameAPI.isTryPlay()) {
                onTryLoginGm(false);
            }
        }
    }
}
function openGM(gameIndex) {
    if (isLogin()) {
        myPJDApp.openGm(gameIndex);
    } else {
        if (mGameAPI.isTryPlay()) {
            myPJDApp.openGm(gameIndex);
        } else {
            var tagObj = new Object();
            tagObj["gameType"] = "gm";
            tagObj["openGame"] = gameIndex;
            myPJDApp.showLogin(tagObj);
        }
    }
}
function GameAPI() {
    var mLoginResultList = null;
    var mAPIStatusList = null;
    var isTryPlay = false;
    this.init = function () {
        mLoginResultList = new Object();
        mLoginResultList["nn"] = null;
        mAPIStatusList = new Object();
        mAPIStatusList["nn"] = 0;
    }
    this.loginToAPI = function (gameType, isTest, callback, errorCallBack, kindId) {
        requestLogin(gameType, isTest, callback, errorCallBack, kindId);
    }
    this.tryPlayLoginToApi = function (gameType, vcode, callback, errorCallBack, kindId) {
        requestTryPlay(gameType, vcode, callback, errorCallBack, kindId);
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
    function requestLogin(gameType, isTest, callback, errorCallBack, kindId) {
        var rdata = "requestType=json&code=" + gameType + "&isTest=" + isTest;
        if (kindId != null) {
            if (gameType == "gm") {
                rdata += "&gameId=" + kindId + "&isFullScreen=1";
            } else {
                rdata += "&kindID=" + kindId;
            }
        }
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
    function requestTryPlay(gameType, vcode, callback, errorCallBack, kindId) {
        var requestData = "";
        if (vcode != null) {
            requestData = "requestType=json&code=" + gameType + "&imgCode=" + vcode;
        } else {
            requestData = "requestType=json&code=" + gameType;
        }
        if (kindId != null) {
            if (gameType == "gm") {
                requestData += "&gameId=" + kindId + "&isFullScreen=1";
            } else {
                requestData += "&kindID=" + kindId;
            }
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
function EnterGame() {
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
function GameTryReg() {
    var rootId = "GameTryReg";
    var mPage = new Activity(rootId, "免费试玩");
    var layoutId = rootId + "_content";
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
        $("#" + layoutId).css({
            "height": screenH - topH,
            "background": "#383838"
        });
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
        setTimeout(function () { $("#" + layoutId + "_input").focus(); }, 500);
    }
    function setContentStyle() {
        var sW = screenW;
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
            console.log("input value: " + inpuevalue);
        }, mainColorDeep, mainColor, null);
        var sigupObj = $("#" + layoutId + "_sigup_submit");
        setBtnOnTouchEvent(sigupObj, function (mObj) {
            myPJDApp.showRegister();
        }, "#222222", "#2D2D2D", null);
    }
    function codeSubmitBack(code) {
        mLoader.show("tryPlay");
        regTryGames(["gm"], code, function (isOpen) {
            mLoader.unShow("tryPlay");
            if (isBack) return;
            if (isOpen) {
                backClickFun();
                if (gameType == "gm") {
                    openGM(openGame);
                }
            } else {
                updateCodeImg();
                mToast.show("验证码错误或已失效,请重新获取!", 1, "middle");
            }
        }, function (error) {
            mLoader.unShow("tryPlay");
            if (isBack) return;
            updateCodeImg();
            mToast.show("验证码错误或已失效,请重新获取!", 1, "middle");
        });
    }
    function updateCodeImg() {
        $("#" + layoutId + "_codeImg").attr("src", SERVER_ADD + "servlet/RandomImgCodeServlet?r=" + randomString());
    }
    function regTryGames(games, vcode, callBack, errorCallBack) {
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
                regTryGames(backGames, null, callBack, errorCallBack);
            } else if (callBack != null) {
                callBack(true);
            }
        }, errorCallBack);
    }
    function checkTryGameType(gametype) {
        if (gametype == "gm") {
            return true;
        } else {
            return false;
        }
    }
}
function GamesFrameHtml(id, handel) {
    var lineY_Mid = "<div style=\"height:6px\"></div>";
    var lineY_Min = "<div style=\"height:1px\"></div>";
    var iframe = "<iframe id=\"" + id + "_iframe\" style=\"position:absolute;top:0px;left:0px;z-index:7\"></iframe>";
    var load = "<div id=\"" + id + "_load\" style=\"position:absolute;top:0px;left:0px;z-index:8;width:100%;height:100%;display:flex;justify-content:center;align-items:center\">[content]</div>";
    var load_rot = "<div id=\"" + id + "_load_root\" style=\"text-align:center;align-items:center;width:100%;height:auto;font-size:16px;transform:translateY(-20px)\">[content]</div>";
    var load_view = "<div id=\"" + id + "_load_root_view\" style=\"width:auto;height:48px\"></div>";
    var load_ts = "<div id=\"" + id + "_load_root_ts\" style=\"font-size:16px;color:#cacaca\">游戏正在加载中!</div>";
    load_rot = load_rot.replace("[content]", load_view + lineY_Mid + load_ts);
    load = load.replace("[content]", load_rot);
    var fed = "<div id=\"" + id + "_fed\" style=\"position:absolute;top:0px;left:0px;z-index:9;width:100%;height:100%;display:flex;justify-content:center;align-items:center\">[content]</div>";
    var fed_rot = "<div id=\"" + id + "_fed_root\" style=\"text-align:center;align-items:center;width:100%;height:auto;font-size:16px;transform: translateY(-20px)\">[content]</div>";
    var fed_img = "<img style=\"width:80px;height:80px\" src=\"pic/themeMain/sorry.png\"/>";
    var fed_topTxt = "<div id=\"" + id + "_fed_root_top_txt\" style=\"font-size:18px;color:" + mainColor + "\">很抱歉</div>";
    var fed_ts = "<div id=\"" + id + "_fed_root_ts\" style=\"font-size:16px;color:#cacaca\">游戏无法打开,请稍后重试!</div>";
    fed_rot = fed_rot.replace("[content]", fed_img + lineY_Mid + fed_topTxt + lineY_Min + fed_ts);
    fed = fed.replace("[content]", fed_rot);
    $("#" + id).html(iframe + load + fed);
    if (handel != null) handel();
}
function bindFedView(id, msg, type) {
    var obj = $("#" + id);
    var bg = "<div id=\"" + id + "_failedBg\">[content]</div>";
    var rootDiv = "<div id=\"" + id + "_failedDiv\">[content]</div>";
    var img = "<div style=\"height:80px\"><img class=\"openGameFailureImg\" src=\"" + themPath + "sorry.png\"/></div>";
    var tsMsg = "<div style=\"font-size:18px\"><font color=" + mainColor + ">很抱歉</font></div>";
    var cnMsg = "<div style=\"font-size:16px\"><font color=#CACACA>" + msg + "</font></div>";
    var btn = "<div id=" + id + "_resetBtn>重试</div>";
    var devMx = "<div style=\"height:6px\"></div>";
    var devMn = "<div style=\"height:1px\"></div>";
    bg = bg.replace("[content]", rootDiv.replace("[content]", img + devMx + tsMsg + devMn + cnMsg + devMx + devMx + btn));
    obj.html(bg);
    $("#" + id + "_failedBg").css({
        "width": "100%",
        "height": "100%",
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "box-sizing": "border-box"
    });
    $("#" + id + "_failedDiv").css({
        "display": "flex",
        "justify-content": "flex-start",
        "align-items": "center",
        "flex-direction": "column",
        "width": "100%",
        "height": "auto",
        "font-size": "16px",
        "box-sizing": "border-box"
    });
    $("#" + id + "_resetBtn").css({
        "width": "25%",
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "border-radius": "8px",
        "background": mainColor,
        "font-size": "14px",
        "color": "white",
        "padding": "5px",
        "box-sizing": "border-box"
    });
    setBtnOnTouchEvent($("#" + id + "_resetBtn"), function () {
        var isNewLoad = false;
        if (type != null) {
            if (type == "qsContent") {
                backClickFun();
                myPJDApp.showAskObj(isNewLoad);
            } else if (type == "aboutContent") {
                backClickFun();
                myPJDApp.showAboutObj(isNewLoad);
            } else if (type == "agreementContent") {
                backClickFun();
                myPJDApp.showAgreement("agreement", isNewLoad);
            } else if (type == "declareContent") {
                backClickFun();
                myPJDApp.showAgreement("declare", isNewLoad);
            } else if (type == "bettingContent") {
                backClickFun();
                myPJDApp.showResponsibilityObj(isNewLoad);
            } else if (type == "pyramidContent_1_1") {
                backClickFun();
                myPJDApp.showPyramid("pyramidContent_1_1", isNewLoad);
            } else if (type == "pyramidContent_2_2") {
                backClickFun();
                myPJDApp.showPyramid("pyramidContent_2_2", isNewLoad);
            } else if (type == "league_three_menu_1_content") {
                backClickFun();
                var isType = "5_1";
                myPJDApp.showAgent(isNewLoad, isType);
            } else if (type == "league_three_menu_2_content") {
                backClickFun();
                var isType = "5_2";
                myPJDApp.showAgent(isNewLoad, isType);
            } else if (type == "leagueSuggest") {
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
    }, "#f1c570", mainColor);
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
