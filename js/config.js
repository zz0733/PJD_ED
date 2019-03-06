// 工程配置及初始化控制
var APP_VERSION = "1.8.8"; // 版本号
var IS_TEST_SERVER = false; // 是否是测试服务器(更改服务地址时必须更改该值)
var appRootDomain = null;
var SERVER_ADD;
if (IS_TEST_SERVER) {
    SERVER_ADD = "https://w8.bctt.co:8000/";
} else {
    SERVER_ADD = "https://www.pjd11.com/";
}
var ORDER_TIMEOUT = 15000;
var appDownloadUrl = null;
var ipaInstallUrl = null;
var lmgGetDataUrl = null;
var isLockTouchOpen = false; // 是否开启手势验证
// ------------------------------------------
function getCurrentServerURL(isNotApp) {
    var host = location.hostname;
    var port = location.port;
    var protocol = location.protocol;
    var serverConfig = "";
    if (host.indexOf("127.0.0.1") >= 0) {// in app
        serverConfig = SERVER_ADD;
    } else {// in html5
        if ((port == "") || (port == null)) {
            serverConfig = protocol + "//" + host + "/";
        } else {
            serverConfig = protocol + "//" + host + ":" + port + "/";
        }
    }
    var url = location.href;
    var domain = GetQueryString("domain", url);
    console.log("location url:" + url + ",domain:" + domain);
    if (!IS_TEST_SERVER && domain != null && domain.trim() != "") {
        appRootDomain = domain;
        serverConfig = "https://" + domain + "/";
    }
    var isLock = GetQueryString("isLockTouchOpen", url);
    if (isLock != null && isLock == 1) {
        isLockTouchOpen = true;
    } else {
        isLockTouchOpen = false;
    }
    lmgGetDataUrl = serverConfig + "gameApi/getLmgGameServerData";
    SERVER_ADD = serverConfig;
    if (isNotApp == null) {
        JPNNDomainLoad();
        checkOperatorIndex();
    }
}
function checkLogin(dev, checkLock) {
    if (checkLock == 1 && !isTouchLockOK) {
        checkLockTouch(true);
    }
    console.log("checkLogin dev:" + dev);
}
function checkLockTouch(isForce, backFun) {
    if (isForce == null) { isForce = false; }
    if (!isLockTouchOpen && !isForce) { // 未开启手势验证
        setTimeout(function () {
            if (backFun != null) { backFun(); }
            mUserObj.getLoginInfo(false); // 自动登录
        }, 0);
        return;
    }
    isForceAutoLogIn = isForce; // 是否强制自动登录,无视是否启动TouchLock验证
    isClearLockTouch = false;
    var password = getLocalStorage("touchLockPassword");
    if (password != null && password["length"] > 0) {
        document.activeElement.blur();
        var obj = new Object();
        obj["backCallFun"] = function (pass) {
            setTimeout(function () {
                if (backFun != null) { backFun(); }
                mUserObj.getLoginInfo(true); // 自动登录
            }, 0);
        }
        obj["SwitchAccountFun"] = function () {
            setTimeout(function () {
                if (backFun != null) { backFun(); }
                if (!isLogin()) {
                    myPJDApp.showLogin();
                } else {
                    logOutPost(true);
                }
            }, 0);
            isClearLockTouch = true;
        }
        obj["isHiddenLine"] = getResettingSign();
        obj["isNotBack"] = true;
        obj["titleMs"] = "锁屏";
        release();
        mIndexPopWindowObj.show(1, obj, "none");
    } else { // 未设置手势密码
        setTimeout(function () {
            if (backFun != null) { backFun(); }
            mUserObj.getLoginInfo(false); // 自动登录
        }, 0);
    }
    function release() {
        var objList = new Array();
        var objLogIn = new Object();
        objLogIn["theme"] = "eventLoginBackTheme";
        objList.push(objLogIn);
        var objSig = new Object();
        objSig["theme"] = "eventRegisterBackTheme";
        objList.push(objSig);
        mEventBusObj.releaseList(objList);
    }
}
function clearTouchLockPass() {
    saveLocalStorage("touchLockPassword", "");
    saveLocalStorage("touchLockSaveDate", "");
}
function clearLogIn() {
    saveLocalStorage("logInName", "");
    saveLocalStorage("logInPassword", "");
    saveLocalStorage("logInSaveDate", "");
}
var isForceAutoLogIn = false;
function autoLogin(isLoading) {
    if (!isLockTouchOpen && !isForceAutoLogIn) { return; }
    isForceAutoLogIn = false;
    var name = getLocalStorage("logInName");
    var pass = getLocalStorage("logInPassword");
    if (name != null && pass != null && name["length"] > 0 && pass["length"] > 0) {
        myPJDApp.goLogInAuto(name, pass, isLoading);
    }
}
var isClearLockTouch = false;
function saveLogIn(name, pass) {
    saveLocalStorage("logInName", name);
    saveLocalStorage("logInPassword", pass);
    saveLocalStorage("logInSaveDate", new Date().getTime());
    if (isClearLockTouch) {
        clearTouchLockPass();
        isClearLockTouch = false;
    }
}
function isSetTouchLock() {
    var password = getLocalStorage("touchLockPassword");
    if (password != null && password.length > 0) {
        return true;
    }
    return false;
}
function externalLink(link) {
    myPJDApp.externalLink(link);
}
function enterNNTable() {
    MJPNNObj.enterTable();
}
function exitNNTable() {
    MJPNNObj.exitTable();
}
function notifyNN(code, data) {
    if (code == 9999) { notifyNiuNiuResLoadOK = false; }
    if (code == 1000 && notifyNiuNiuResLoadOK) { return; }
    if (code == 1000) { notifyNiuNiuResLoadOK = true; }
    MJPNNObj.notify(code, data);
}
var notifyNiuNiuResLoadOK = false;
function openRecorde(back) {
    if (openRecordIndex != null) { mEventBusObj.unsubscribe(openRecordIndex); }
    setTimeout(function () {
        window.location.assign("zy://app?command=openRecorde");
        openRecordIndex = mEventBusObj.subscriptionForce("openRecordeTheme", function (obj) {
            var ms = obj["msg"];
            if (back != null) { back(ms); }
            mEventBusObj.unsubscribe(openRecordIndex);
            openRecordIndex = null;
        });
        console.log("openRecorde");
    }, 300);
}
function stopRecorde(back) {
    if (stopRecordIndex != null) { mEventBusObj.unsubscribe(stopRecordIndex); }
    setTimeout(function () {
        window.location.assign("zy://app?command=stopRecorde");
        stopRecordIndex = mEventBusObj.subscriptionForce("stopRecordeTheme", function (obj) {
            var ms = obj["msg"];
            if (back != null) { back(ms); }
            mEventBusObj.unsubscribe(stopRecordIndex);
            stopRecordIndex = null;
        });
        console.log("stopRecorde");
    }, 300);
}
function playeRecorde(back) {
    if (playRecordIndex != null) { mEventBusObj.unsubscribe(playRecordIndex); }
    setTimeout(function () {
        window.location.assign("zy://app?command=playeMedia");
        playRecordIndex = mEventBusObj.subscriptionForce("playRecordeTheme", function (obj) {
            var ms = obj["msg"];
            if (back != null) { back(ms); }
            mEventBusObj.unsubscribe(playRecordIndex);
            playRecordIndex = null;
        });
        console.log("playRecorde");
    }, 300);
}
function backRecordeMedia(code, data) {
    console.log("backRecordeMedia code:" + code + " data:" + data);
    var obj = new Object();
    switch (code) {
        case 5000:
            obj["theme"] = "openRecordeTheme";
            obj["msg"] = data;
            mEventBusObj.release(obj);
            break;
        case 5001:
            obj["theme"] = "stopRecordeTheme";
            obj["msg"] = data;
            mEventBusObj.release(obj);
            break;
        case 5002:
            obj["theme"] = "playRecordeTheme";
            obj["msg"] = data;
            mEventBusObj.release(obj);
            break;
        default: break;
    }
}
var openRecordIndex = null;
var stopRecordIndex = null;
var playRecordIndex = null;
function JPNNDomainLoad() {
    if (IS_TEST_SERVER) {
        NiceJpnnDomain = "nn1.bctt.co";
        return;
    }
    var JpnnDomainList = ["nn2.qilibank.net", "nn3.qilibank.net", "nn4.qilibank.net"];
    var isPingOk = false;
    var len = JpnnDomainList["length"];
    for (var i = 0; i < len; i++) {
        ping(JpnnDomainList[i]);
    }
    function ping(dm) {
        requestAjaxGet("https://" + dm + "/get_jackpot_reward_rule", function (jsonObj) {
            if (isPingOk) { return; }
            isPingOk = true;
            NiceJpnnDomain = dm;
            MJPNNObj.setService(NiceJpnnDomain);
            console.log("JpnnNiceDomain:" + dm);
        });
    }
}
var NiceJpnnDomain = "nn2.qilibank.net";
function checkOperatorIndex() {
    if (isInApp()) { return; }
    setTimeout(function () {
        var url = location.href;
        var code = GetQueryString("code", url);
        if (code == null || code.trim() == "") {
            var obj = new Object();
            obj["name"] = "pages/h5ToApp.html";
            obj["addCompete"] = true;
            mIndexPopWindowObj.show(6, obj, "none");
        }
    }, 500);
    requestAjaxGet("/operator/getOperator", function (jsonObj) {
        var host = location.hostname;
        var port = location.port;
        var protocol = location.protocol;
        var href = location.href;
        var link = "";
        if ((port == "") || (port == null)) {
            link = protocol + "//" + host + "/";
        } else {
            link = protocol + "//" + host + ":" + port + "/";
        }
        link = link + jsonObj["result"]["code"] + "/";
        if (href.indexOf(link) < 0) { location.href = "/error.html"; }
    }, function (error) {
        location.href = "/error.html";
    });
}
