function registerObj() {
    var mPage = new Activity("registerDiv", "注册");
    var isBack = false;
    var username = "";
    var validStr = "";
    var userSN = "";
    var recommendCode = "";
    var isRecommend = false;
    var eventTheme = "eventRegisterBackTheme";
    var eventIndex = "eventRegisterIndex";
    var isDomainCode = false;
    this.init = function () {
        mPage.init(function () {
            isBack = true;
            mEventBusObj.unsubscribe(eventIndex);
        });
        mPage.hiddenBtn();
        setStyle();
        setBtnOnTouchEvent($("#registerSuccess_bottom_coming"), function () {
            backClickFun();
            myPJDApp.coming();
        }, mainColorDeep, mainColor, null);
        setBtnOnTouchEvent($("#registerSuccess_bottom_complete"), function () {
            backClickFun();
        }, mainBackColor, "", null);
        setBtnOnTouchEvent($("#registerDiv_content_agreement_1"), function () {
            myPJDApp.showAgreement("agreement");
        }, mainColorDeep, "", null);
        setBtnOnTouchEvent($("#registerDiv_content_agreement_2"), function () {
            myPJDApp.showAgreement("declare");
        }, mainColorDeep, "", null);
        setBtnOnTouchEvent($("#registerDiv_content_sure_btn"), function () {
            if (checkInput()) {
                submitRegister();
            } else {
                showVaildImg();
            }
        }, mainColorDeep, mainColor, null);
        setBtnOnTouchEventNoColor($("#validImg"), function () {
            showVaildImg();
        }, null);
        $("#registerDiv_username").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#registerDiv_username");
            obj["showIs"] = true;
            obj["numberIs"] = true;
            obj["symbolIs"] = false;
            obj["maxLen"] = 18;
            // mIndexPopWindowObj.show(3, obj);
            // document.activeElement.blur();
        });
        $("#registerDiv_userSN").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#registerDiv_userSN");
            obj["showIs"] = true;
            obj["numberIs"] = true;
            obj["symbolIs"] = false;
            obj["passIs"] = true;
            obj["maxLen"] = 18;
            // mIndexPopWindowObj.show(3, obj);
            // document.activeElement.blur();
        });
        $("#registerDiv_userSN_again").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#registerDiv_userSN_again");
            obj["showIs"] = true;
            obj["numberIs"] = true;
            obj["symbolIs"] = false;
            obj["passIs"] = true;
            obj["maxLen"] = 18;
            // mIndexPopWindowObj.show(3, obj);
            // document.activeElement.blur();
        });
        $("#registerDiv_content_valid_input").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#registerDiv_content_valid_input");
            obj["showIs"] = true;
            obj["numberIs"] = true;
            obj["symbolIs"] = false;
            obj["maxLen"] = 4;
            // mIndexPopWindowObj.show(3, obj);
            // document.activeElement.blur();
        });
    }
    this.show = function () {
        mPage.show(function () {
            exitPage();
        });
        isBack = false;
        showVaildImg();
        mEventBusObj.subscription(eventTheme, eventIndex, function (obj) {
            if (isBack) { return; }
            backClickFun();
        });
        requestAjax("operator/getDomainInfo", "", function (jsonObj) {
            var code = jsonObj["code"];
            if (code != 0) {
                isDomainCode = false;
                $("#registerDiv_recommend").attr("disabled", false);
                return;
            }
            var result = jsonObj["result"];
            var tcode = result["code"];
            if (tcode == null || tcode.trim() == "") {
                isDomainCode = false;
                $("#registerDiv_recommend").attr("disabled", false);
                $("#reg_recommend_item_id").css({ "display": "block" });
                $("#reg_recommend_line_id").css({ "display": "block" });
                return;
            }
            isDomainCode = true;
            isRecommend = true;
            $("#reg_recommend_item_id").css({ "display": "none" });
            $("#reg_recommend_line_id").css({ "display": "none" });
            $("#registerDiv_recommend").val(tcode);
            $("#registerDiv_recommend").attr("disabled", "disabled");
        }, function (error) {
            isDomainCode = false;
            $("#registerDiv_recommend").attr("disabled", false);
        });
        requestAjax("operator/getOperator", "", function (jsonObj) {
            if (isDomainCode) return;
            if (jsonObj["result"]["reg_need_code"] == 1) {
                isRecommend = true;
                var url = location.href;
                var code = GetQueryString("code", url);
                if (code == null || code.trim() == "") {
                    $("#reg_recommend_item_id").css({ "display": "block" });
                    $("#reg_recommend_line_id").css({ "display": "block" });
                } else {
                    $("#registerDiv_recommend").val(code);
                    $("#reg_recommend_item_id").css({ "display": "none" });
                    $("#reg_recommend_line_id").css({ "display": "none" });
                }
            } else {
                var url = location.href;
                var code = GetQueryString("code", url);
                if (code == null || code.trim() == "") {
                    $("#reg_recommend_item_id").css({ "display": "block" });
                    $("#reg_recommend_line_id").css({ "display": "block" });
                } else {
                    $("#registerDiv_recommend").val(code);
                    $("#reg_recommend_item_id").css({ "display": "none" });
                    $("#reg_recommend_line_id").css({ "display": "none" });
                }
            }
        }, function (error) {
            if (isDomainCode) return;
            isRecommend = false;
            $("#reg_recommend_item_id").css({ "display": "none" });
            $("#reg_recommend_line_id").css({ "display": "none" });
        });
    }
    function checkInput() {
        var returnBoolean = false;
        var returnStr = "";
        var line = 0;
        username = $("#registerDiv_username").val();
        userSN = $("#registerDiv_userSN").val();
        var userSNAgain = $("#registerDiv_userSN_again").val();
        recommendCode = $("#registerDiv_recommend").val();
        validStr = $("#registerDiv_content_valid_input").val();
        if (checkISNumberAndLetter(username)) {
            if ((username.length >= 6) && (username.length <= 18)) {
                //用户名格式验证通过
            } else {
                returnStr = "• 账号必须是6-18位的数字和字母的组合";
                line = line + 1;
            }
        }
        if (checkISNumberAndLetter(userSN)) {
            if ((userSN.length >= 8) && (userSN.length <= 16)) {
                //密码格式验证通过
            } else {
                if (line > 0) {
                    returnStr = returnStr + "<br>";
                }
                returnStr = returnStr + "• 密码必须是8-18位的数字和大小写字母的组合";
                line = line + 1;
            }
        }
        if (validStr == "") {
            if (line > 0) {
                returnStr = returnStr + "<br>";
            }
            returnStr = returnStr + "• 验证码不能为空";
            line = line + 1;
        }
        if (userSN != userSNAgain) {
            if (line > 0) {
                returnStr = returnStr + "<br>";
            }
            returnStr = returnStr + "• 两次密码输入不一致";
            line = line + 1;
        }
        if (!o("registerDiv_content_agree").checked) {
            if (line > 0) {
                returnStr = returnStr + "<br>";
            }
            returnStr = returnStr + "• 您需要同意规则条款和隐私权政策";
            line = line + 1;
        }
        if (isRecommend && recommendCode == "") {
            if (line > 0) {
                returnStr = returnStr + "<br>";
            }
            returnStr = returnStr + "• 您需要输入推荐码";
            line = line + 1;
        }
        if (returnStr == "") {
            returnBoolean = true;
        }
        if (!returnBoolean) {
            mToast.show(returnStr, line, null);
        }
        return returnBoolean;
    }
    function showRegisterSuccess() {
        if (mGameAPI.isTryPlay()) {
            appLogout(0);
            return;
        } else {
            mLoader.unShow();
        }
        backClickFun();
        addBackFunArr(function () {
            registerSuccessComplete();
        });
        focusHiddenBox();
        MJPNNObj.resetOpenGame();
        $("#registerSuccess").css({ "display": "flex" });
        $("#registerSuccess_top_notictext_id").html(userId);
        myPJDApp.showUserInfo();
        mUserObj.getMoneyBag();
        myPJDApp.updateMeLogInStatus(1);
        myPJDApp.h5DownloadCheck();
        updateBankInfo();
        ReadNoticeMessage();
        myPJDApp.hiddenMeLeagueMenu();
        requestAjax("article/getArticleForList", "typeId=[1100]", function (jsonObj) {
            var result = jsonObj["result"]; if (result == null || result["length"] == 0) { return; }
            var rootItem = result[0]; if (rootItem == null) { return; }
            var cList = JSON.parse(rootItem["content"]); if (cList == null || cList["length"] == 0) { return; }
            var obj = new Object();
            obj["isNotBack"] = true;
            obj["content"] = cList;
            obj["isList"] = true;
            obj["bindTime"] = 1000;
            obj["addCompete"] = true;
            mIndexPopWindowObj.show(5, obj, "center", 0.8);
        });
        $('#content_road_top_try').css({ "display": "none" });
    }
    function registerSuccessComplete() {
        $("#registerSuccess").css({ "display": "none" });
    }
    function showVaildImg() {
        $("#validImg").attr("src", SERVER_ADD + "servlet/RandomImgCodeServlet?r=" + randomString());
    }
    function exitPage() {
        $(".registerDiv_content_input").val("");
        $(".registerDiv_content_valid").val("");
        o("registerDiv_content_agree").checked = false;
    }
    function submitRegister() {
        mLoader.show();
        getEnKey(function (key) {
            var tempSN = userSN;
            if (key != null) {
                userSN = encryptPass(userSN, key);
            }
            var dataObj = new Object();
            dataObj["name"] = username;
            dataObj["password"] = userSN;
            if (isRecommend) {
                dataObj["code"] = recommendCode;
            }
            else {
                var url = location.href;
                var code = GetQueryString("code", url);
                if (code != null && code != "") {
                    dataObj["code"] = code;
                }
            }
            dataObj["imgCode"] = validStr;
            dataObj["rand"] = randomString();
            requestAjax("user/register", dataObj, function (jsonObj) {
                if (jsonObj["code"] == 0) {
                    saveLogIn(name, tempSN);
                    userId = username;
                    userInfo = jsonObj["result"];
                    showRegisterSuccess();
                } else {
                    showVaildImg();
                    mLoader.unShow();
                    mToast.show("注册失败!<br>" + mLangObj.getZHByCode(jsonObj["tipMessage"]), 2, "middle");
                }
            }, function (error) {
                showVaildImg();
                mLoader.unShow();
                mToast.show("注册失败!<br>" + error, 2, "middle");
            });
        })
    }
    function setStyle() {
        $(".registerDiv_content_userInfo_text").css({
            "color": mainColor,
            "font-size": "16px",
        });
        $(".registerDiv_content_line_select").css({
            "background-color": mainColor,
        });
        $(".registerDiv_content_item").css({
            "width": "100%",
            "height": "30px",
            "font-size": "14px",
            "color": mainColor
        });
        $(".registerDiv_content_text").css({
            "width": "70px"
        });
        $(".registerDiv_content_item_content").css({
            "width": "100%",
            "height": "35px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
        $(".registerDiv_content_line_split").css({
            "width": "1px",
            "height": "60%",
            "background-color": splitLineColor
        });
        $(".registerDiv_content_input").css({
            "border": "none",
            "width": screenW - 140,
            "height": "25px",
            "background-color": pageBgColor,
            "color": mainFontColorDeep,
            "font-size": "14px"
        });
        $(".registerDiv_line").css({
            "width": "100%",
            "height": "1px",
            "background-color": splitLineColor,
            "margin-top": "5px"
        });
        $(".registerDiv_content_valid").css({
            "border": "none",
            "width": screenW - 200,
            "height": "25px",
            "background-color": pageBgColor,
            "color": mainFontColorDeep,
            "font-size": "14px"
        });
        $(".registerDiv_content_agreement").css({
            "color": mainFontColorDeep,
            "font-size": "12px"
        });
        $(".registerDiv_content_sure").css({
            "border-radius": "20px",
            "color": mainFontColor,
            "font-size": "14px",
            "background-color": mainColor,
            "width": "100%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "10px",
            "box-sizing": "border-box"
        });
        $("#registerSuccess").css({
            "width": screenW,
            "height": screenH,
            "background-color": lighterBackColor
        });
        $(".registerSuccess_top_text").css({
            "color": mainColor,
            "font-size": "16px",
            "line-height": "200%"
        });
        $("#registerSuccess_bottom").css({
            "height": screenH * 0.4
        });
        $("#registerSuccess_bottom_coming").css({
            "background-color": mainColor,
            "color": mainFontColor
        });
        $("#registerSuccess_bottom_complete").css({
            "border": "1px solid " + mainColor,
            "color": mainColor
        });
        $("#registerSuccess_top_notictext").css({
            "color": mainFontColorMore,
            "font-size": "14px"
        });
        $("#registerSuccess_top_notictext_id").css({
            "color": mainColor,
            "font-size": "14px"
        });
        $("#reg_recommend_item_id").css({ "display": "none" });
        $("#reg_recommend_line_id").css({ "display": "none" });
    }
}
function loginObj() {
    var mPage = new Activity("loginDiv", "登录");
    var isAutoLogIn = false; // 消费型变量,使用完后需要置为默认值
    var isBack = false;
    var openTagObj;
    var eventTheme = "eventLoginBackTheme";
    var eventIndex = "eventLoginIndex";
    this.init = function () {
        mPage.init(function () {
            isBack = true;
            mEventBusObj.unsubscribe(eventIndex);
        });
        mPage.hiddenBtn();
        $(".loginDiv_content_userInfo_text").css({
            "color": mainColor,
            "font-size": "16px",
        });
        $(".loginDiv_content_line_select").css({
            "background-color": mainColor,
        });
        $(".loginDiv_content_item").css({
            "width": "100%",
            "height": "30px",
            "font-size": "14px",
            "color": mainColor
        });
        $(".loginDiv_content_text").css({
            "width": "60px"
        });
        $(".loginDiv_content_item_content").css({
            "width": "100%",
            "height": "35px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
        $(".loginDiv_content_line_split").css({
            "width": "1px",
            "height": "60%",
            "background-color": splitLineColor
        });
        $(".loginDiv_content_input").css({
            "border": "none",
            "width": screenW - 140,
            "height": "25px",
            "background-color": pageBgColor,
            "color": mainFontColorDeep,
            "font-size": "14px"
        });
        $(".loginDiv_line").css({
            "width": "100%",
            "height": "1px",
            "background-color": splitLineColor,
            "margin-top": "5px"
        });
        $("#loginDiv_content_sure_btn").css({
            "border-radius": "20px",
            "color": mainFontColor,
            "font-size": "14px",
            "background-color": mainColor,
            "width": "100%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "10px",
            "box-sizing": "border-box"
        });
        $("#loginDiv_content_tryPlay_btn").css({
            "border-radius": "20px",
            "border": "1px solid " + "#3399cc",
            "color": "#3399cc",
            "font-size": "14px",
            "font-weight": "normal",
            "background-color": "",
            "width": "100%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "padding": "10px",
            "box-sizing": "border-box"
        });
        $("#loginDiv_content_register_btn").css({
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
            "box-sizing": "border-box"
        });
        setBtnOnTouchEvent($("#loginDiv_content_sure_btn"), function () {
            checkLoginInput();
        }, mainColorDeep, mainColor, null);
        setBtnOnTouchEvent($("#loginDiv_content_register_btn"), function () {
            backClickFun();
            myPJDApp.showRegister();
        }, mainColorDeep, "", null);
        setBtnOnTouchEvent($("#loginDiv_content_tryPlay_btn"), function () {
            backClickFun();
            MGameTryReg.show(openTagObj);
        }, "#194C66", "", null);
        setBtnOnTouchEvent($("#loginDiv_forgetSN"), function () {
            mToast.show("请联系客服！", 1, null);
        }, mainColorDeep, "", null);
        setBtnOnTouchEvent($("#loginDiv_loginproblem"), function () {
            mToast.show("请联系客服！", 1, null);
        }, mainColorDeep, "", null);
    }
    this.show = function (tagObj) {
        mPage.show(function () {
            exitPage();
        });
        isBack = false;
        if (tagObj == null) {
            $("#loginDiv_content_tryPlay_btn").css({ "display": "none" });
            $("#loginDiv_content_tryPlay_len").css({ "display": "none" });
        } else {
            openTagObj = tagObj;
            $("#loginDiv_content_tryPlay_btn").css({ "display": "flex" });
            $("#loginDiv_content_tryPlay_len").css({ "display": "flex" });
        }
        mEventBusObj.subscription(eventTheme, eventIndex, function (obj) {
            if (isBack) { return; }
            backClickFun();
        });
    }
    this.logInAuto = function (name, pass, isLoading) {
        if (name == null || pass == null || name.length == 0 || pass.length == 0) {
            return;
        }
        $("#loginDiv_username").val(name);
        $("#loginDiv_password").val(pass);
        isAutoLogIn = true;
        loginIt(isLoading);
    }
    function exitPage() {
        $(".loginDiv_content_input").val("");
    }
    function checkLoginInput() {
        if (($("#loginDiv_username").val() == "") || ($("#loginDiv_password").val() == "")) {
            mToast.show("用户名和密码不能为空!", 1, null);
            return;
        } else {
            isAutoLogIn = false;
            loginIt();
        }
    }
    function loginIt(isLoading) {
        if (isLoading == null) { isLoading = false; }
        if (!isAutoLogIn || isLoading) {
            mLoader.show("logIn");
        }
        getEnKey(function (key) {
            var name = $("#loginDiv_username").val();
            var pass = $("#loginDiv_password").val();
            var tempPass = pass;
            if (key != null) {
                pass = encryptPass(pass, key);
            }
            var dataObj = new Object();
            dataObj["name"] = name;
            dataObj["password"] = pass;
            dataObj["requestType"] = "json";
            dataObj["rand"] = randomString();
            requestAjax("user/login", dataObj, function (jsonObj) {
                if (jsonObj["code"] == 0) {
                    saveLogIn(name, tempPass);
                    if (mGameAPI.isTryPlay()) {
                        appLogout(0);
                        return;
                    } else {
                        mLoader.unShow("logIn");
                    }
                    userInfo = jsonObj["result"];
                    userId = userInfo["name"];
                    loginSuccess();
                } else {
                    mLoader.unShow("logIn");
                    LogInError(mLangObj.getZHByCode(jsonObj["tipMessage"]));
                }
                isAutoLogIn = false;
            }, function (error) {
                mLoader.unShow("logIn");
                LogInError(error);
                isAutoLogIn = false;
            });
            function LogInError(error) {
                if (!isAutoLogIn || isLoading) {
                    if (error == null) {
                        mToast.show("登录失败,请重试!", 1, "middle");
                    } else {
                        mToast.show("登录失败,请重试! <br>" + error, 2, "middle");
                    }
                }
            }
        });
    }
    function loginSuccess() {
        MJPNNObj.resetOpenGame();
        myPJDApp.showUserInfo();
        myPJDApp.updateMeLogInStatus(1);
        myPJDApp.h5DownloadCheck();
        if (!isAutoLogIn) {
            backClickFun();
        }
        updateBankInfo();
        if (userInfo["complete"] == 3) {
            mUserObj.getBankInfo(null);
        }
        loadIsAgent();
        mUserObj.getMoneyBag();
        ReadNoticeMessage();
        myPJDApp.hiddenMeLeagueMenu();
        requestAjax("article/getArticleForList", "typeId=[1100]", function (jsonObj) {
            var result = jsonObj["result"]; if (result == null || result["length"] == 0) { return; }
            var rootItem = result[0]; if (rootItem == null) { return; }
            var cList = JSON.parse(rootItem["content"]); if (cList == null || cList["length"] == 0) { return; }
            var obj = new Object();
            obj["isNotBack"] = true;
            obj["content"] = cList;
            obj["isList"] = true;
            obj["bindTime"] = 1000;
            obj["addCompete"] = true;
            mIndexPopWindowObj.show(5, obj, "center", 0.8);
        });
        $('#content_road_top_try').css({ "display": "none" });
    }
}
function updateBankInfo() {
    requestAjax("bank/getOperatorBanksForSelect", "requestType=json", function (jsonObj) {
        if (jsonObj["code"] == 0) {
            var bk = jsonObj["result"];
            if (bk == null || bk == "") { return; }
            bank = bk;
        }
    });
}
function userObj() {
    this.getBankInfo = function (callback) {
        requestAjax("userBank/getUserBanks", "requestType=json", function (jsonObj) {
            if (jsonObj["code"] != 0) { return; }
            bankInfo = jsonObj["result"];
            if (callback != null) { callback(); }
        }, null);
    }
    this.getMoneyBag = function () {
        requestAjax("account/getAccounts", "requestType=json", function (jsonObj) {
            var code = jsonObj["code"];
            if (code != 0) { return; }
            userMoneyBag = jsonObj["result"];
            var len = userMoneyBag["length"];
            for (var i = 0; i < len; i++) {
                var item = userMoneyBag[i];
                var typeId = item["type_id"];
                switch (typeId) {
                    case 1:
                        userMoney = item["amount"];
                        var gameAmount = item["gameAmount"];
                        if (gameAmount != null && gameAmount != userMoney) {
                            mEnterGameObj.reEnterGame();
                        }
                        break;
                    case 2:
                        userMoneyInterest = item["amount"];
                        break;
                    default: break;
                }
            }
            refreshMoney();
        }, null);
    }
    this.getLoginInfo = function (isLoading) {
        if (isLoading == null) { isLoading = false; }
        if (isLoading) { mLoader.show("getLoginInfo"); }
        requestAjax("user/userInfo", "requestType=json", function (jsonObj) {
            if (isLoading) { mLoader.unShow("getLoginInfo"); }
            if (jsonObj["code"] != 0) {
                autoLogin(isLoading);
                return;
            }
            userInfo = jsonObj["result"];
            userId = userInfo["name"];
            loadIsAgent();
            MJPNNObj.resetOpenGame();
            myPJDApp.updateMeLogInStatus(1);
            myPJDApp.showUserInfo();
            updateBankInfo();
            if (userInfo["complete"] == 3) {
                mUserObj.getBankInfo(null);
            }
            mUserObj.getMoneyBag();
            myPJDApp.hiddenMeLeagueMenu();
            ReadNoticeMessage();
            requestAjax("article/getArticleForList", "typeId=[1100]", function (jsonObj) {
                var result = jsonObj["result"]; if (result == null || result["length"] == 0) { return; }
                var rootItem = result[0]; if (rootItem == null) { return; }
                var cList = JSON.parse(rootItem["content"]); if (cList == null || cList["length"] == 0) { return; }
                var obj = new Object();
                obj["isNotBack"] = true;
                obj["content"] = cList;
                obj["isList"] = true;
                obj["bindTime"] = 1000;
                obj["addCompete"] = true;
                mIndexPopWindowObj.show(5, obj, "center", 0.8);
            });
            $('#content_road_top_try').css({ "display": "none" });
        }, function (error) {
            if (isLoading) { mLoader.unShow("getLoginInfo"); }
            autoLogin(isLoading);
        });
    }
}
function avatarObj() {
    var currentSelectID = "";
    var isShow = false;
    var mPage = new Activity("avatarDiv", "选择头像");
    this.init = function () {
        mPage.init(function () {
            var avaId = userInfo.avatar;
            if (avaId == null || avaId == "") {
                return;
            }
            $("#avatar_" + currentSelectID).css({
                "border": "none"
            });
            currentSelectID = avaId.substr(0, avaId.length - 4);
            $("#avatar_" + currentSelectID).css({
                "border": "4px solid " + mainColor
            });
        });
        $("#avatarDiv_content_all_headers").css({
            "height": screenH - topH - 80
        });
        setBtnOnTouchEvent($("#avatarDiv_content_sure_btn"), function () {
            if (currentSelectID != "") {
                updateHeader();
            } else {
                mToast.show("请选择头像！", 1, "middle");
            }
        }, mainColorDeep, mainColor, null);
    }
    this.show = function () {
        mPage.show();
        if (!isShow) {
            setHeaders();
            isShow = true;
        }
    }
    function updateHeader() {
        var mData = "requestType=json&avatar=" + currentSelectID + ".jpg";
        requestAjax("user/changAvatar", mData, function (jsonObj) {
            try {
                if (jsonObj.code == 0) {
                    userInfo.avatar = currentSelectID + ".jpg";
                    $("#myDiv_userInfo_content_header").attr("src", "header/" + currentSelectID + ".jpg");
                    backClickFun();
                } else {
                    mToast.show("更新失败，请重试！", 1, "middle");
                }
            } catch (e) {
                mToast.show("更新失败，请重试！" + e.message, 1, "middle");
            }
        }, null);
    }
    function setHeaders() {
        var obj = $("#avatarDiv_content_all_headers");
        obj.height(screenH - topH - 80);
        var div = "<div class=avatarDiv_content_all_headers_item id=%idTag%>%content%</div>";
        var img = "<img class=%classTag% id=%idTag% src=%srcTag% height=60 />";
        var defId = "avatarDiv_content_all_headers_item_img";
        var selectId = "avatarDiv_content_all_headers_item_img_select";
        for (var i = 1; i < 41; i++) {
            var ms;
            if (i < 10) {
                ms = "00" + i;
            } else {
                ms = "0" + i;
            }
            var name = "B_" + ms + ".jpg";
            var classId = defId; if (userInfo.avatar == name) { classId = selectId; currentSelectID = "B_" + ms; }
            var divId = "avatarDiv_content_all_headers_item_B_" + ms;
            var imgId = "avatar_B_" + ms;
            var src = "header/" + name;
            var cImg = img.replace("%classTag%", classId).replace("%idTag%", imgId).replace("%srcTag%", src);
            obj.append(div.replace("%idTag%", divId).replace("%content%", cImg));
        }
        for (var i = 1; i < 8; i++) {
            var ms = "00" + i;
            var name = "G_" + ms + ".jpg";
            var classId = defId; if (userInfo.avatar == name) { classId = selectId; currentSelectID = "G_" + ms }
            var divId = "avatarDiv_content_all_headers_item_G_" + ms;
            var imgId = "avatar_G_" + ms;
            var src = "header/" + name;
            var cImg = img.replace("%classTag%", classId).replace("%idTag%", imgId).replace("%srcTag%", src);
            obj.append(div.replace("%idTag%", divId).replace("%content%", cImg));
        }
        $(".avatarDiv_content_all_headers_item").css({
            "width": screenW / 4,
            "height": screenW / 4,
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
        });
        $(".avatarDiv_content_all_headers_item_img").css({
            "border-radius": "30px"
        });
        $(".avatarDiv_content_all_headers_item_img_select").css({
            "border-radius": "30px",
            "border": "4px solid " + mainColor
        });
        $(".avatarDiv_content_all_headers_item").each(function () {
            setBtnOnTouchEventNoColor($(this), function (mObj) {
                var idList = mObj.id.split("_");
                var ms = idList[5] + "_" + idList[6];
                if (currentSelectID == ms) {
                    return;
                } else if (currentSelectID != null && currentSelectID != "") {
                    $("#avatar_" + currentSelectID).css({
                        "border": "none"
                    });
                }
                $("#avatar_" + ms).css({
                    "border": "4px solid " + mainColor
                });
                currentSelectID = ms;
            }, null);
        });
    }
}
function agreementObj() {
    var mPage = new Activity("agreementDiv", "条款与隐私");
    var isLoadArgeement = false;
    var isLoadDeclare = false;
    this.init = function () {
        mPage.init();
        $("#agreementDiv_one").css({
            "color": mainColor,
            "font-size": "14px",
        });
        $("#agreementDiv_two").css({
            "color": mainFontColorDeep,
            "font-size": "14px",
        });
        $("#agreementDiv_select_one").css({
            "background-color": mainColor,
        });
        $("#agreementDiv_content_content").css({
            "height": screenH - 52 - topH - 10,
            "color": mainFontColor,
            "font-size": "14px",
        });
        setBtnOnTouchEventNoColor($("#agreementDiv_one"), function () {
            showAgreement();
        }, null);
        setBtnOnTouchEventNoColor($("#agreementDiv_two"), function () {
            showDeclare();
        }, null);
    }
    this.show = function (isNewLoad) {
        mPage.show(function () {
            $("#agreementDiv_content_content").scrollTop(0);
        });
        $("#agreementDiv_content_content").scrollTop(0);
        if (isNewLoad != null) {
            isLoadArgeement = isNewLoad;
            isLoadDeclare = isNewLoad;
        }
        if (!isLoadArgeement) {
            loadFileArgeement();
        }
        if (!isLoadDeclare) {
            loadFileDeclare();
        }
    }
    this.setType = function (typeStr) {
        if (typeStr == "agreement") {
            showAgreement();
        } else if (typeStr == "declare") {
            showDeclare();
        } else {
            showAgreement();
        }
    }
    function showAgreement() {
        $("#agreementDiv_one").css({
            "color": mainColor,
            "font-size": "14px",
        });
        $("#agreementDiv_two").css({
            "color": mainFontColorDeep,
            "font-size": "14px",
        });
        $("#agreementDiv_select_one").css({
            "background-color": mainColor,
        });
        $("#agreementDiv_select_two").css({
            "background-color": ""
        });
        $("#agreementDiv_content_content_one").css({
            "display": "block"
        });
        $("#agreementDiv_content_content_two").css({
            "display": "none"
        });
        $("#agreementDiv_content_content").scrollTop(0);
    }
    function showDeclare() {
        $("#agreementDiv_one").css({
            "color": mainFontColorDeep,
            "font-size": "14px",
        });
        $("#agreementDiv_two").css({
            "color": mainColor,
            "font-size": "14px",
        });
        $("#agreementDiv_select_one").css({
            "background-color": "",
        });
        $("#agreementDiv_select_two").css({
            "background-color": mainColor
        });
        $("#agreementDiv_content_content_one").css({
            "display": "none"
        });
        $("#agreementDiv_content_content_two").css({
            "display": "block"
        });
        $("#agreementDiv_content_content").scrollTop(0);
    }
    function loadFileArgeement() {
        $("#agreementDiv_content_content").scrollTop(0);
        requestAjaxGet("files/agreement.html", function (jsonObj) {
            isLoadArgeement = true;
            $("#agreementDiv_content_content_one").html(jsonObj);
            $("#agreementDiv_content_content_one").css({
                "color": mainFontColorMore,
                "font-size": "12px",
                "line-height": "180%"
            });
        }, null);
    }
    function loadFileDeclare() {
        $("#agreementDiv_content_content").scrollTop(0);
        requestAjaxGet("files/declare.html", function (jsonObj) {
            isLoadDeclare = true;
            $("#agreementDiv_content_content_two").html(jsonObj);
            $("#agreementDiv_content_content_two").css({
                "color": mainFontColorMore,
                "font-size": "12px",
                "line-height": "180%"
            });
        }, null);
    }
}
function leagueAgreementObj() {
    var mPage = new Activity("leagueAgreementDiv", "申请合作人");
    var isInit = false;
    this.init = function () {
        mPage.init();
    }
    this.show = function (type) {
        mPage.show(function () {
            $("#leagueAgreementCheck").prop("checked", "");
            myPJDApp.unShowComplete();
        });
        if (!isInit) {
            loadModel(type);
        } else {
            $("#leagueAgreementContent").scrollTop(0);
            mLeagueAgreementFun.setLeagueType(type);
        }
    }
    function loadModel(type) {
        var page = new tPage("leagueAgreement", "pages/leagueAgreement.html", "leagueAgreementDiv_content", function () {
            isInit = true;
            if (type != null) {
                mLeagueAgreementFun.setLeagueType(type);
            }
        }, null);
        page.open();
    }
}
function leagueContentObj() {
    var mPage = new Activity("leagueContentDiv", "联盟合作");
    this.init = function () {
        mPage.init();
    }
    this.show = function (type) {
        mPage.show(function () {
            $("#leagueContentDiv_content").html("");
            myPJDApp.unShowComplete();
        });
        loadModel(type);
    }
    function loadModel(type) {
        var pageName = "";
        if (type == "one") {
            pageName = "league.html";
        } else if (type == "two") {
            pageName = "leagueTwo.html";
        }
        var page = new tPage("leagueContent", "pages/" + pageName, "leagueContentDiv_content", function () {
        }, null);
        page.open();
    }
}
function agentQrCodeObj() {
    var mPage = new Activity("agentQrCodeDiv", "专属二维码");
    this.init = function () {
        mPage.init();
        $("#agentQrCodeDiv_content").css({ "display": "flex" });
        $("#agentQrCodeDiv_content_img").css({ "text-align": "center" });
        $("#agentQrCodeDiv_content").click(function () { backClickFun(); });
    }
    this.show = function (imgUrl, tel, isMark) {
        if (tel == null || tel == "") { tel = "专属二维码"; }
        if (isMark == null) { isMark = false; }
        mPage.show();
        mPage.setTitle(tel);
        if (isMark) {
            $("#agentQrCodeDiv_content").css({ "display": "flex" });
            $("#agentQrCodeDiv_content_img").html("");
            new QRCode("agentQrCodeDiv_content_img", {
                text: userInfo.rurl,
                width: screenW,
                height: screenW,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            $("#agentQrCodeDiv_content").css({ "display": "block" });
            $("#agentQrCodeDiv_content_img").html('<img src=' + imgUrl + ' style="width:100%" />');
        }
    }
}
function completeInfoObj() {
    var zIndexFrom = zIndexMax - 10;
    var releaseTheme = null;
    setStyle();
    this.show = function () {
        $("#completeInfo").css({
            "display": "block",
            "z-index": zIndexFrom
        });
        if (userInfo != null) {
            var completeMs = userInfo["complete"];
            if (completeMs == 1) {
                $("#completeInfo_realName").html("（未填写）");
                $("#completeInfo_realName").css({ "color": mainColor });
                $("#completeInfo_contract").html("（未填写）");
                $("#completeInfo_contract").css({ "color": mainColor });
                $("#completeInfo_drawSN").html("（未填写）");
                $("#completeInfo_drawSN").css({ "color": mainColor });
            } else if (completeMs == 2) {
                $("#completeInfo_realName").html("（已填写）");
                $("#completeInfo_realName").css({ "color": mainFontColorMore });
                $("#completeInfo_contract").html("（已填写）");
                $("#completeInfo_contract").css({ "color": mainFontColorMore });
                $("#completeInfo_drawSN").html("（已填写）");
                $("#completeInfo_drawSN").css({ "color": mainFontColorMore });
            } else if (completeMs == 3) {
                myPJDApp.unShowComplete();
            }
        }
    }
    this.unShow = function () {
        $("#completeInfo").css({
            "display": "none"
        });
    }
    this.setSizeMode = function (sizeMode) {
        if (sizeMode == "noMenu") {
            $("#completeInfo").css({
                "height": screenH - topH,
                "width": "100%",
                "top": topH
            });
        } else {
            $("#completeInfo").css({
                "height": screenH - topH - menuH,
                "width": "100%",
                "top": topH
            });
        }
    }
    this.setReleaseTheme = function (theme) {
        if (theme == null || theme == "") { return; }
        releaseTheme = theme;
    }
    function setStyle() {
        $("#completeInfo").css({
            "height": screenH - topH - menuH,
            "width": "100%",
            "top": topH
        });
        $("#completeInfo_content_content").css({
            "width": "80%",
            "height": "80%",
            "background-color": pageBgColor
        });
        $("#completeInfo_content_content_btn").css({
            "width": "90%",
            "height": "35px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "border-radius": "16px",
            "color": mainFontColor,
            "font-size": "14px",
            "background-color": mainColor
        });
        $(".completeInfo_content_content_text").css({
            "width": "100%",
            "display": "flex",
            "flex-direction": "column",
            "justify-content": "center",
            "align-items": "center"
        });
        $(".completeInfo_content_content_text_title").css({
            "color": mainFontColorMore,
            "font-size": "14px",
            "text-align": "center",
            "width": "80%"
        });
        $(".completeInfo_content_content_text_item").css({
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
        $(".completeInfo_content_content_text_item_text").css({
            "color": mainFontColorMore,
            "font-size": "16px",
            "width": "100px",
            "line-height": "170%"
        });
        $(".completeInfo_content_content_text_item_notic").css({
            "color": mainColor,
            "font-size": "16px",
            "width": "80px",
            "line-height": "170%"
        });
        setBtnOnTouchEvent($("#completeInfo_content_content_btn"), function () {
            if (userInfo["complete"] == 2) {
                myPJDApp.showBankInfo(userInfo["u_name"], releaseTheme, 1);
            } else if (userInfo["complete"] == 3) {
                mToast.show("您的资料已填写完成!", 2, "middle");
                myPJDApp.unShowComplete();
            } else {
                myPJDApp.showInfoName(releaseTheme);
            }
        }, mainColorDeep, mainColor, null);
        setBtnOnTouchEvent($("#completeInfo_content_content_back"), function () {
            myPJDApp.unShowComplete();
        }, mainColorDeep, "", null);
    }
}
function infoNameObj() {
    var mPage = new Activity("infoNameDiv", "完善资料");
    var releaseTheme = null;
    var zIndexFrom = zIndexMax - 5;
    this.init = function () {
        mPage.init();
        mPage.hiddenBtn();
        $(".infoNameDiv_item").css({
            "width": "100%",
            "height": "50px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
        });
        $(".infoNameDiv_item_title").css({
            "width": "120px",
            "height": "100%",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
        $(".infoNameDiv_item_title_text").css({
            "color": mainColor,
            "font-size": "16px"
        });
        $(".infoNameDiv_item_title_split").css({
            "background-color": splitLineColor,
            "width": "1px",
            "height": "50%",
            "margin-right": "10px",
            "box-sizing": "border-box"
        });
        $(".infoNameDiv_line").css({
            "width": "100%",
            "height": "1px",
            "background-color": splitLineColor
        });
        $(".infoNameDiv_item_input_controls").css({
            "border": "none",
            "width": screenW - 120 - 25,
            "color": mainFontColorMore,
            "background-color": pageBgColor,
            "font-size": "14px"
        });
        $(".infoNameDiv_item_ask").css({
            "width": "25px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        $("#infoName_next").css({
            "border-radius": "20px",
            "height": "40px",
            "color": mainFontColor,
            "background-color": mainColor,
            "width": "100%",
            "font-size": "16px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        setBtnOnTouchEvent($("#infoName_next"), function () {
            var dSN = $("#infoNameDiv_drawSN").val();
            var dSNR = $("#infoNameDiv_drawSNRES").val();
            if (dSN != dSNR) {
                mToast.show("提款密码不一致,请重新输入!", 1, null);
                return;
            }
            checkNameInfo();
        }, mainColorDeep, mainColor, null);
        $("#infoNameDiv_email").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#infoNameDiv_email");
            obj["showIs"] = true;
            obj["numberIs"] = true;
            obj["symbolIs"] = true;
            obj["maxLen"] = 18;
            mIndexPopWindowObj.show(3, obj);
            document.activeElement.blur();
        });
        $("#infoNameDiv_drawSN").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#infoNameDiv_drawSN");
            obj["showIs"] = false;
            obj["maxLen"] = 4;
            obj["danIs"] = false;
            mIndexPopWindowObj.show(2, obj);
            document.activeElement.blur();
        });
        $("#infoNameDiv_drawSNRES").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#infoNameDiv_drawSNRES");
            obj["showIs"] = false;
            obj["maxLen"] = 4;
            obj["danIs"] = false;
            mIndexPopWindowObj.show(2, obj);
            document.activeElement.blur();
        });
        $("#infoNameDiv_phone").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#infoNameDiv_phone");
            obj["showIs"] = true;
            obj["maxLen"] = 16;
            obj["danIs"] = false;
            mIndexPopWindowObj.show(2, obj);
            document.activeElement.blur();
        });
        $("#infoNameDiv_QQ").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#infoNameDiv_QQ");
            obj["showIs"] = true;
            obj["maxLen"] = 16;
            obj["danIs"] = false;
            mIndexPopWindowObj.show(2, obj);
            document.activeElement.blur();
        });
    }
    this.show = function () {
        mPage.show(function () { exitPage(); });
        $("#infoNameDiv").css({ "z-index": zIndexFrom });
        $("#infoNameDiv_content").css({ "display": "flex" });
    }
    this.setReleaseTheme = function (theme) {
        if (theme == null || theme == "") { return; }
        releaseTheme = theme;
    }
    function checkNameInfo() {
        var realName = $("#infoNameDiv_realName").val();
        var drawSN = $("#infoNameDiv_drawSN").val();
        var phone = $("#infoNameDiv_phone").val();
        var email = $("#infoNameDiv_email").val();
        var QQ = $("#infoNameDiv_QQ").val();
        if (realName == "" || drawSN == "") {
            mToast.show("真实姓名和提款密码必须输入哦～", 1, null);
        } else {
            if (phone == "" && email == "" && QQ == "") {
                mToast.show("联系方式至少填写一种哦～", 1, null);
            } else {
                var isValidEmail = true;
                if (email != "") {
                    if (!checkEmail(email)) {
                        isValidEmail = false;
                        mToast.show("电子邮箱格式不正确哦～", 1, null);
                    }
                }
                if (isValidEmail) {
                    var nameLen = realName.length;
                    var snLen = drawSN.length;
                    if (snLen != 4) {
                        mToast.show("提款密码必须是4位哦～", 1, null);
                    } else {
                        if ((nameLen >= 2) && (nameLen <= 10)) {
                            if (phone != "") {
                                if (phone.length == 11) {
                                    mMsgBox.show("提示", "<center>真实姓名和联系方式一经提交不可修改<br>请确定填写是否正确！</center>", function () {
                                        submitNameInfo(realName, drawSN, phone, email, QQ);
                                    }, null);
                                } else {
                                    mToast.show("手机号码输入的不对吧～", 1, null);
                                }
                            } else {
                                mMsgBox.show("提示", "<center>真实姓名和联系方式一经提交不可修改<br>请确定填写是否正确！</center>", function () {
                                    submitNameInfo(realName, drawSN, phone, email, QQ);
                                }, null);
                            }
                        } else {
                            mToast.show("姓名输入的不对吧～", 1, null);
                        }
                    }
                }
            }
        }
    }
    function submitNameInfo(u_name, password, mobile, email, qq) {
        mLoader.show();
        var dataObj = new Object();
        dataObj["u_name"] = u_name;
        dataObj["password"] = password;
        dataObj["mobile"] = mobile;
        dataObj["email"] = email;
        dataObj["qq"] = qq;
        dataObj["rand"] = randomString();
        dataObj["requestType"] = "json";
        requestAjax("user/saveMainInfo", dataObj, function (jsonObj) {
            mLoader.unShow();
            if (jsonObj["code"] == 0) {
                userInfo = jsonObj["result"];
                backClickFun();
                backClickFun();
                if (releaseTheme != null) {
                    var eventObj = new Object();
                    eventObj["theme"] = releaseTheme;
                    mEventBusObj.release(eventObj);
                    releaseTheme = null;
                }
                myPJDApp.unShowComplete();
            } else if (jsonObj["code"] == 100) {
                mToast.show("登录失效，请重新登录！", 1, "middle");
                appLogout();
            } else {
                mToast.show("设置资料失败！<br>" + mLangObj.getZHByCode(jsonObj["tipMessage"]), 2, "middle");
            }
        }, function (error) {
            mLoader.unShow();
            mToast.show("设置资料失败！" + error, 1, "middle");
        });
    }
    function exitPage() {
        $(".infoNameDiv_item_input_controls").val("");
    }
}
function bankInfoObj() {
    var mPage = new Activity("bankInfoDiv", "银行卡信息");
    var selectBankIndex = -1;
    var releaseTheme = null;
    var zIndexFrom = zIndexMax - 5;
    this.init = function () {
        mPage.init();
        $(".bankInfoDiv_item").css({
            "width": "100%",
            "height": "50px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center",
        });
        $(".bankInfoDiv_item_title").css({
            "width": "120px",
            "height": "100%",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
        $(".bankInfoDiv_item_title_text").css({
            "color": mainColor,
            "font-size": "16px"
        });
        $(".bankInfoDiv_item_title_split").css({
            "background-color": splitLineColor,
            "width": "1px",
            "height": "50%",
            "margin-right": "10px",
            "box-sizing": "border-box"
        });
        $(".bankInfoDiv_line").css({
            "width": "100%",
            "height": "1px",
            "background-color": splitLineColor
        });
        $(".bankInfoDiv_item_input_controls").css({
            "border": "none",
            "width": screenW - 120 - 25,
            "color": mainFontColorMore,
            "background-color": pageBgColor,
            "font-size": "14px"
        });
        $(".bankInfoDiv_item_ask").css({
            "width": "25px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        $("#bankInfoDiv_OK").css({
            "border-radius": "20px",
            "height": "40px",
            "color": mainFontColor,
            "background-color": mainColor,
            "width": "100%",
            "font-size": "16px",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        $(".bankInfoDiv_selectBank").css({
            rotate: "90deg"
        });
        $("#bankInfoDiv_bankNum").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#bankInfoDiv_bankNum");
            obj["showIs"] = true;
            obj["maxLen"] = 18;
            obj["danIs"] = false;
            // mIndexPopWindowObj.show(2, obj);
            // document.activeElement.blur();
        });
        $("#bankInfoDiv_reBankNum").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#bankInfoDiv_reBankNum");
            obj["showIs"] = true;
            obj["maxLen"] = 18;
            obj["danIs"] = false;
            // mIndexPopWindowObj.show(2, obj);
            // document.activeElement.blur();
        });
        setBtnOnTouchEvent($("#bankInfoDiv_OK"), function () {
            var bankNum = $("#bankInfoDiv_bankNum").val();
            var bankNumAgain = $("#bankInfoDiv_reBankNum").val();
            var bankInfoDiv_bank = $("#bankInfoDiv_bank").val();
            var bankInfoDiv_bankChild = $("#bankInfoDiv_bankChild").val();
            if ((bankNum == "") || (bankNumAgain == "") || (bankInfoDiv_bank == "") || (bankInfoDiv_bankChild == "")) {
                mToast.show("信息填写不完整!", 1, null);
            } else {
                if (bankNum != bankNumAgain) {
                    mToast.show("两次卡号输入不相同!", 1, null);
                } else {
                    submitAddBank(userInfo.u_name, bankNum, bank[selectBankIndex]["id"], bankInfoDiv_bankChild);
                }
            }
        }, mainColorDeep, mainColor, null);
        setBtnOnTouchEventNoColor($("#bankInfoDiv_item_select"), function () {
            showBankList();
        }, null);
    }
    this.show = function (realName, hBtn) {
        if (hBtn != null) {
            mPage.hiddenBtn();
        }
        mPage.hiddenBtn();
        mPage.show(function () {
            exitPage();
        });
        $("#bankInfoDiv").css({
            "z-index": zIndexFrom
        });
        $("#bankInfoDiv_realName").val(realName);
        $("#bankInfoDiv_content").css({
            "display": "flex"
        });
    }
    this.setReleaseTheme = function (theme) {
        if (theme == null || theme == "") { return; }
        releaseTheme = theme;
    }
    function submitAddBank(account, cardno, bank_id, open_bank) {
        mLoader.show();
        var dataObj = new Object();
        dataObj["account"] = account;
        dataObj["cardno"] = cardno;
        dataObj["bank_id"] = bank_id;
        dataObj["open_bank"] = open_bank;
        dataObj["requestType"] = "json";
        dataObj["rand"] = randomString();
        requestAjax("userBank/saveUserBank", dataObj, function (jsonObj) {
            mLoader.unShow();
            if (jsonObj["code"] == 0) {
                bankInfo = jsonObj["result"];
                userInfo["complete"] = 3;
                backClickFun();
                if (releaseTheme != null) {
                    var eventObj = new Object();
                    eventObj["theme"] = releaseTheme;
                    mEventBusObj.release(eventObj);
                    releaseTheme = null;
                }
                myPJDApp.unShowComplete();
                try { mDrawFeeFunObj.reBindBankList(); } catch (e) { }
            } else if (jsonObj["code"] == 100) {
                mToast.show("登录失效,请重新登录!", 1, "middle");
                appLogout();
            } else {
                mToast.show("设置资料失败!<br>" + mLangObj.getZHByCode(jsonObj["tipMessage"]), 2, "middle");
            }
        }, function (error) {
            mLoader.unShow();
            mToast.show("设置资料失败!", 1, "middle");
        });
    }
    function showBankList() {
        mMsgBox.showList("选择银行", bank, "text", selectBankIndex, function (index) {
            var item = bank[index];
            $("#bankInfoDiv_bank").val(item["text"]);
            selectBankIndex = index;
        }, null);
    }
    function exitPage() {
        $(".bankInfoDiv_item_input_controls").val("");
        selectBankIndex = -1;
    }
}
function accountSafeObj() {
    var mPage = new Activity("accountSafeDiv", "账号与安全");
    var eventTheme = "accountSafe_infoComplete_theme";
    var eventIndex;
    this.init = function () {
        mPage.init();
        initAccountInfo();
        initAccountSN();
        initAccountDrawSN();
        isPwd();
        initLockTouch();
        setBtnOnTouchEvent($("#accountSafeDiv_content_bank_add"), function () {
            var eBankIndex = mEventBusObj.subscriptionForce("eventTheme_addBank", function (obj) {
                showBankContent();
                mEventBusObj.unsubscribe(eBankIndex);
            });
            var theBankInfoObj = myPJDApp.getObj("bankInfoObj");
            theBankInfoObj.setReleaseTheme("eventTheme_addBank");
            theBankInfoObj.show(userInfo["u_name"]);
        }, mainColorDeep, mainColor, null);
        setBtnOnTouchEventNoColor($("#accountSafeDiv_content_info_btn"), function () {
            setTypeSelect("info");
        }, null);
        setBtnOnTouchEventNoColor($("#accountSafeDiv_content_bank_btn"), function () {
            setTypeSelect("bank");
        }, null);
        setBtnOnTouchEventNoColor($("#accountSafeDiv_content_loginSN_btn"), function () {
            setTypeSelect("sn");
        }, null);
        setBtnOnTouchEventNoColor($("#accountSafeDiv_content_drawSN_btn"), function () {
            setTypeSelect("drawsn");
        }, null);
        setBtnOnTouchEventNoColor($("#accountSafeDiv_content_signPwd_btn"), function () {
            setTypeSelect("signPwd");
        }, null);
    }
    this.show = function (type) {
        mPage.show(function () {
            mPage.showBtn();
            myPJDApp.unShowComplete();
        });
        $("#accountSafeDiv").css({
            "display": "block"
        });
        $(".accountSafeDiv_content_content").css({
            "width": screenW,
            "height": screenH - topH - 45 - 2,
            "flex-direction": "column",
            "display": "flex",
            "align-items": "center"
        });
        $("#accountSafeDiv_content_top").css({
            "display": "flex"
        });
        var typeList = type.split("_");
        setTypeSelect(typeList[4]);
    }
    function setTypeSelect(type) {
        focusHiddenBox();
        resetSNVal();
        if (type == "info") {
            $("#accountSafeDiv_content_info_btn").css({
                "color": mainColor
            });
            $("#accountSafeDiv_content_bank_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_loginSN_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_drawSN_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_signPwd_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_signPwd_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_info_line").css({
                "background-color": mainColor
            });
            $("#accountSafeDiv_content_bank_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_loginSN_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_drawSN_line").css({
                "background-color": ""
            });
            showInfoContent();
            checkInfoComplete(type);
        } else if (type == "bank") {
            $("#accountSafeDiv_content_info_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_bank_btn").css({
                "color": mainColor
            });
            $("#accountSafeDiv_content_loginSN_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_drawSN_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_signPwd_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_signPwd_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_info_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_bank_line").css({
                "background-color": mainColor
            });
            $("#accountSafeDiv_content_loginSN_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_drawSN_line").css({
                "background-color": ""
            });
            showBankContent();
            checkInfoComplete(type);
        } else if (type == "sn") {
            $("#accountSafeDiv_content_info_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_bank_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_loginSN_btn").css({
                "color": mainColor
            });
            $("#accountSafeDiv_content_drawSN_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_signPwd_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_signPwd_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_info_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_bank_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_loginSN_line").css({
                "background-color": mainColor
            });
            $("#accountSafeDiv_content_drawSN_line").css({
                "background-color": ""
            });
            showLoginSNContent();
            checkInfoComplete(type);
        } else if (type == "drawsn") {
            $("#accountSafeDiv_content_info_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_bank_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_loginSN_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_drawSN_btn").css({
                "color": mainColor
            });
            $("#accountSafeDiv_content_signPwd_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_signPwd_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_info_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_bank_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_loginSN_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_drawSN_line").css({
                "background-color": mainColor
            });
            showDrawSNContent();
            checkInfoComplete(type);
        } else if (type == "signPwd") {
            $("#accountSafeDiv_content_info_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_bank_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_loginSN_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_drawSN_btn").css({
                "color": mainFontColorMore
            });
            $("#accountSafeDiv_content_signPwd_btn").css({
                "color": mainColor
            });
            $("#accountSafeDiv_content_info_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_bank_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_loginSN_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_drawSN_line").css({
                "background-color": ""
            });
            $("#accountSafeDiv_content_signPwd_line").css({
                "background-color": mainColor
            });
            showLockTouchContent();
        }
    }
    function showInfoContent() {
        $("#accountInfo_item_username").val(userInfo.name);
        $("#accountInfo_item_nickName").val(userInfo.nickname);
        $("#accountInfo_item_realName").val(userInfo.u_name);
        if (userInfo.mobile != null) {
            var newInfo = "";
            for (var i = 0; i <= userInfo.mobile.length; i++) {
                if (i > 3 && i < userInfo.mobile.length - 2) {
                    newInfo = newInfo + "*";
                } else {
                    newInfo = newInfo + userInfo.mobile.substring(i - 1, i);
                }
            }
            $("#accountInfo_item_phone").val(newInfo);
        }
        if (userInfo.qq != null) {
            $("#accountInfo_item_QQ").val(userInfo.qq);
        }
        if (userInfo.email != null) {
            var Email = userInfo.email.split("@");
            var newEmail = "";
            if (Email[1] != null) {
                for (var i = 0; i <= Email[0].length; i++) {
                    if (i > 2) {
                        newEmail = newEmail + "*";
                    } else {
                        newEmail = newEmail + userInfo.email.substring(i - 1, i);
                    }
                }
                newEmail = newEmail + "@" + Email[1];
                $("#accountInfo_item_email").val(newEmail);
            } else {
                $("#accountInfo_item_email").val(userInfo.email);
            }
        }
        if (userInfo.weixin != null) {
            $("#accountInfo_item_wechat").val(userInfo.weixin);
        }
        if (userInfo.gender_id != null) {
            $("#accountInfo_sex").val(userInfo.gender_id);
        }
        if (userInfo.birthday != null) {
            var birthday = new Date(userInfo.birthday);
            $("#accountInfo_item_birthday").val(birthday.format("yyyy-MM-dd"));
        }
        $(".accountSafeDiv_content_content").css({
            "display": "none"
        });
        $("#accountSafeDiv_content_info").css({
            "display": "flex"
        });
        $("#accountInfo_item_username").css({
            "color": "gray"
        });
        $("#accountInfo_item_realName").css({
            "color": "gray"
        });
    }
    function initAccountInfo() {
        $(".accountInfo_item").css({
            "width": "100%",
            "height": "50px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
        $(".accountInfo_item_title").css({
            "width": "120px",
            "height": "100%",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
        $(".accountInfo_item_title_text").css({
            "color": mainColor,
            "font-size": "16px"
        });
        $(".accountInfo_item_title_split").css({
            "background-color": splitLineColor,
            "width": "1px",
            "height": "50%",
            "margin-right": "10px",
            "box-sizing": "border-box"
        });
        $(".accountInfo_item_line").css({
            "width": "100%",
            "height": "1px",
            "background-color": splitLineColor
        });
        $(".accountInfo_item_input_controls").css({
            "border": "none",
            "width": screenW - 120,
            "color": mainFontColorMore,
            "background-color": pageBgColor,
            "font-size": "14px"
        });
        $("#accountInfo_sex").css({
            "width": screenW - 120
        });
        $("#accountInfo_item_birthday").css({
            "width": screenW - 120
        });
        setBtnOnTouchEvent($("#accountInfo_edit_sure"), function () {
            focusHiddenBox();
            submitInfoPost();
        }, mainColorDeep, mainColor, null);
        $("#accountInfo_item_email").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#accountInfo_item_email");
            obj["showIs"] = true;
            obj["numberIs"] = true;
            obj["symbolIs"] = true;
            obj["maxLen"] = 24;
            obj["passIs"] = false;
            mIndexPopWindowObj.show(3, obj);
            $("#accountSafeDiv_content_info").scrollTop(4 * 50 + 8);
            document.activeElement.blur();
        });
        $("#accountInfo_item_wechat").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#accountInfo_item_wechat");
            obj["showIs"] = true;
            obj["numberIs"] = true;
            obj["symbolIs"] = false;
            obj["maxLen"] = 24;
            obj["passIs"] = false;
            mIndexPopWindowObj.show(3, obj);
            $("#accountSafeDiv_content_info").scrollTop(4 * 50 + 8);
            document.activeElement.blur();
        });
        $("#accountInfo_item_phone").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#accountInfo_item_phone");
            obj["maxLen"] = 16;
            obj["showIs"] = true;
            obj["danIs"] = false;
            mIndexPopWindowObj.show(2, obj);
            $("#accountSafeDiv_content_info").scrollTop(4 * 50 + 8);
            document.activeElement.blur();
        });
        $("#accountInfo_item_QQ").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#accountInfo_item_QQ");
            obj["maxLen"] = 16;
            obj["showIs"] = true;
            obj["danIs"] = false;
            mIndexPopWindowObj.show(2, obj);
            $("#accountSafeDiv_content_info").scrollTop(4 * 50 + 8);
            document.activeElement.blur();
        });
        function submitInfoPost() {
            var u_name = $("#accountInfo_item_realName").val();
            var n_name = $("#accountInfo_item_nickName").val();
            var sex = $("#accountInfo_sex").val();
            var birthDay = $("#accountInfo_item_birthday").val();
            var mobile = $("#accountInfo_item_phone").val();
            var email = $("#accountInfo_item_email").val();
            var QQ = $("#accountInfo_item_QQ").val();
            var wechat = $("#accountInfo_item_wechat").val();
            birthDay += " 21:00:00";
            var tag = "*";
            if (mobile.indexOf(tag) != -1 && email.indexOf(tag) != -1) {
                mobile = userInfo.mobile;
                email = userInfo.email;
            }
            if (mobile.indexOf(tag) != -1) {
                mobile = userInfo.mobile;
            }
            if (email.indexOf(tag) != -1) {
                email = userInfo.email;
            }
            if ((mobile == "") && (email == "") && (QQ == "") && (wechat == "")) {
                mToast.show("联系方式必须至少填写一种哦～", 1, null);
            } else {
                if (checkEmail(email) || (email == "")) {
                    submitAjaxRequest();
                } else {
                    mToast.show("电子邮箱格式不正确哦～", 1, null);
                }
            }
            function submitAjaxRequest() {
                mLoader.show();
                var mData = "u_name=" + u_name + "&gender_id=" + sex + "&requestType=json&birthday=" + birthDay + "&nickname=" + n_name + "&mobile=" + mobile + "&qq=" + QQ + "&email=" + email + "&weixin=" + wechat + "&rand=" + randomString();
                requestAjax("user/editUser", mData, function (jsonObj) {
                    mLoader.unShow();
                    if (jsonObj["code"] == 0) {
                        userInfo = jsonObj["result"];
                        mToast.show("修改成功!", 1, "middle");
                        var userName = userInfo.nickname;
                        if (userName.length > 4) {
                            userName = userName.substr(0, 4) + "...";
                        }
                        $("#nnValue").html(userName);
                        showInfoContent();
                    } else if (jsonObj["code"] == 100) {
                        mToast.show("登录失效,请重新登录!", 1, "middle");
                        appLogout();
                    } else {
                        mToast.show("资料修改失败!<br>" + mLangObj.getZHByCode(jsonObj["tipMessage"]), 2, "middle");
                    }
                }, function (error) {
                    mLoader.unShow();
                    mToast.show("资料修改失败!<br>" + error, 1, "middle");
                });
            }
        }
    }
    function initAccountSN() {
        $(".accountSN_item").css({
            "width": "100%",
            "height": "50px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
        $(".accountSN_item_title").css({
            "width": "154px",
            "height": "100%",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
        $(".accountSN_item_title_text").css({
            "color": mainColor,
            "font-size": "16px"
        });
        $(".accountSN_item_title_split").css({
            "background-color": splitLineColor,
            "width": "1px",
            "height": "50%",
            "margin-right": "10px",
            "box-sizing": "border-box"
        });
        $(".accountSN_item_line").css({
            "width": "100%",
            "height": "1px",
            "background-color": splitLineColor
        });
        $(".accountSN_item_input_controls").css({
            "border": "none",
            "width": screenW - 154,
            "color": mainFontColorMore,
            "background-color": pageBgColor,
            "font-size": "14px"
        });
        $("#accountSN_item_old").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#accountSN_item_old");
            obj["showIs"] = true;
            obj["numberIs"] = true;
            obj["symbolIs"] = false;
            obj["maxLen"] = 18;
            obj["passIs"] = true;
            // mIndexPopWindowObj.show(3, obj);
            // document.activeElement.blur();
        });
        $("#accountSN_item_new").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#accountSN_item_new");
            obj["showIs"] = true;
            obj["numberIs"] = true;
            obj["symbolIs"] = false;
            obj["maxLen"] = 18;
            obj["passIs"] = true;
            // mIndexPopWindowObj.show(3, obj);
            // document.activeElement.blur();
        });
        $("#accountSN_item_newagain").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#accountSN_item_newagain");
            obj["showIs"] = true;
            obj["numberIs"] = true;
            obj["symbolIs"] = false;
            obj["maxLen"] = 18;
            obj["passIs"] = true;
            // mIndexPopWindowObj.show(3, obj);
            // document.activeElement.blur();
        });
        setBtnOnTouchEvent($("#accountSN_edit_sure"), function () {
            submitSNPost();
        }, mainColorDeep, mainColor, null);
        function submitSNPost() {
            var oldSN = $("#accountSN_item_old").val();
            var newSN = $("#accountSN_item_new").val();
            var againNewSN = $("#accountSN_item_newagain").val();
            if ((newSN.length >= 8) && (newSN.length <= 18)) {
                if (newSN == againNewSN) {
                    submitAjaxRequest();
                    $("#accountSN_item_old").val("");
                    $("#accountSN_item_new").val("");
                    $("#accountSN_item_newagain").val("");
                } else {
                    mToast.show("两次密码的输入不一致", 1, null);
                }
            } else {
                mToast.show("新密码必须是8-18位的数字和大小写字母的组合", 1, null);
            }
            function submitAjaxRequest() {
                mLoader.show();
                var tempPass = newSN;
                var mData = "oldpassword=" + oldSN + "&password=" + newSN + "&requestType=json&rand=" + randomString();
                requestAjax("user/changPassword", mData, function (jsonObj) {
                    mLoader.unShow();
                    if (jsonObj["code"] == 0) {
                        if (userId != null && userId != "") {
                            saveLogIn(userId, tempPass);
                            tempPass = null;
                        }
                        mToast.show("修改登录密码成功!", 1, "middle");
                    } else if (jsonObj["code"] == 100) {
                        mToast.show("登录失效,请重新登录!", 1, "middle");
                        appLogout();
                    } else {
                        mToast.show("修改登录密码失败!<br>" + mLangObj.getZHByCode(jsonObj["tipMessage"]), 2, "middle");
                    }
                }, function (error) {
                    mLoader.unShow();
                    mToast.show("修改登录密码失败!<br>" + error, 2, "middle");
                });
            }
        }
    }
    function initAccountDrawSN() {
        $(".accountDrawSN_item").css({
            "width": "100%",
            "height": "50px",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
        $(".accountDrawSN_item_title").css({
            "width": "154px",
            "height": "100%",
            "display": "flex",
            "justify-content": "space-between",
            "align-items": "center"
        });
        $(".accountDrawSN_item_title_text").css({
            "color": mainColor,
            "font-size": "16px"
        });
        $(".accountDrawSN_item_title_split").css({
            "background-color": splitLineColor,
            "width": "1px",
            "height": "50%",
            "margin-right": "10px",
            "box-sizing": "border-box"
        });
        $(".accountDrawSN_item_line").css({
            "width": "100%",
            "height": "1px",
            "background-color": splitLineColor
        });
        $(".accountDrawSN_item_input_controls").css({
            "border": "none",
            "width": screenW - 154,
            "color": mainFontColorMore,
            "background-color": pageBgColor,
            "font-size": "14px"
        });
        $("#accountDrawSN_item_old").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#accountDrawSN_item_old");
            obj["maxLen"] = 4;
            obj["showIs"] = false;
            obj["danIs"] = false;
            mIndexPopWindowObj.show(2, obj);
            document.activeElement.blur();
        });
        $("#accountDrawSN_item_new").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#accountDrawSN_item_new");
            obj["maxLen"] = 4;
            obj["showIs"] = false;
            obj["danIs"] = false;
            mIndexPopWindowObj.show(2, obj);
            document.activeElement.blur();
        });
        $("#accountDrawSN_item_newagain").focus(function () {
            var obj = new Object();
            obj["inputObj"] = $("#accountDrawSN_item_newagain");
            obj["maxLen"] = 4;
            obj["showIs"] = false;
            obj["danIs"] = false;
            mIndexPopWindowObj.show(2, obj);
            document.activeElement.blur();
        });
        setBtnOnTouchEvent($("#accountDrawSN_edit_sure"), function () {
            submitSNPost();
        }, mainColorDeep, mainColor, null);
        function submitSNPost() {
            var oldSN = $("#accountDrawSN_item_old").val();
            var newSN = $("#accountDrawSN_item_new").val();
            var againNewSN = $("#accountDrawSN_item_newagain").val();
            if (checkISNumberAndLetter(newSN)) {
                if (newSN.length == 4) {
                    if (newSN == againNewSN) {
                        submitAjaxRequest();
                        $("#accountDrawSN_item_old").val("");
                        $("#accountDrawSN_item_new").val("");
                        $("#accountDrawSN_item_newagain").val("");
                    } else {
                        mToast.show("两次密码的输入不一致", 1, null);
                    }
                } else {
                    mToast.show("新密码必须是4位数字", 1, null);
                }
            }
            function submitAjaxRequest() {
                mLoader.show();
                getEnKey(function (key) {
                    if (key != null) {
                        oldSN = encryptPass(oldSN, key);
                        newSN = encryptPass(newSN, key);
                    }
                    var dataObj = new Object();
                    dataObj["oldpassword"] = oldSN;
                    dataObj["password"] = newSN;
                    dataObj["requestType"] = "json";
                    requestAjax("user/changPayPwd", dataObj, function (jsonObj) {
                        mLoader.unShow();
                        if (jsonObj["code"] == 0) {
                            mToast.show("修改提款密码成功!", 1, "middle");
                        } else if (jsonObj["code"] == 100) {
                            mToast.show("登录失效,请重新登录!", 1, "middle");
                            appLogout();
                        } else {
                            mToast.show("修改提款密码失败!<br>" + mLangObj.getZHByCode(jsonObj["tipMessage"]), 2, "middle");
                        }
                    }, function (error) {
                        mLoader.unShow();
                        mToast.show("修改提款密码失败!<br>" + error, 1, "middle");
                    });
                });
            }
        }
    }
    function initLockTouch() {
        $("#showSignPwd").click(function () {
            if (getResettingSign()) {
                saveLocalStorage("touckLock_IsHiddenLine", 0);
            } else {
                saveLocalStorage("touckLock_IsHiddenLine", 1);
            }
            isPwd();
        })
        setBtnOnTouchEvent($("#resettingSignPwd"), function () {
            var obj = new Object();
            obj["showBack"] = true;
            obj["titleMs"] = "修改手势";
            obj["isHiddenLine"] = getResettingSign();
            obj["backCallFun"] = function (pass) {
                if (pass != null) {
                    mIndexPopWindowObj.show(4, null, "none");
                }
            }
            mIndexPopWindowObj.show(1, obj, "none");
        }, "#3a3a3a", "#2a2a2a")
        $("#SignPwdSwitch").click(function () {
            if (isSetTouchLock()) {
                var obj = new Object();
                obj["showBack"] = true;
                obj["titleMs"] = "删除手势";
                obj["isHiddenLine"] = getResettingSign();
                obj["backCallFun"] = function (pass) {
                    if (pass != null) {
                        clearTouchLockPass();
                        isPwd();
                    }
                }
                mIndexPopWindowObj.show(1, obj, "none");
            } else {
                var obj = new Object();
                obj["showBack"] = true;
                obj["isHiddenLine"] = getResettingSign();
                obj["backCallFun"] = function (pass) {
                    if (pass != null) {
                        isPwd();
                    }
                }
                mIndexPopWindowObj.show(4, obj, "none");
            }
        })
    }
    function isPwd() {
        if (isSetTouchLock()) {
            $("#SignPwdSwitch").css({ "background": "#cca352" });
            $("#SignPwdSwitch_open").css({ "display": "block" });
            $("#showSign").css({ "display": "flex" });
            $("#resettingSignPwd").css({ "display": "flex" });
            if (!getResettingSign()) {
                $("#showSignPwd").css({ "background": "#cca352" });
                $("#showSignPwd_open").css({ "display": "block" });
            } else {
                $("#showSignPwd").css({ "background": "white" });
                $("#showSignPwd_open").css({ "display": "none" });
            }
        } else {
            $("#resettingSignPwd").css({ "display": "none" });
            $("#SignPwdSwitch").css({ "background": "white" });
            $("#SignPwdSwitch_open").css({ "display": "none" });
            $("#showSign").css({ "display": "none" });
        }
    }
    function resetSNVal() {
        $(".accountSN_item_input_controls").val("");
        $(".accountDrawSN_item_input_controls").val("");
    }
    function showLoginSNContent() {
        $(".accountSafeDiv_content_content").css({ "display": "none" });
        $("#accountSafeDiv_content_loginSN").css({ "display": "flex" });
    }
    function showBankContent() {
        $(".accountSafeDiv_content_content").css({ "display": "none" });
        $("#accountSafeDiv_content_bank").css({ "display": "flex" });
        $("#accountSafeDiv_content_bank_list").css({ "height": "auto" });
        var obj = $("#accountSafeDiv_content_bank_list");
        obj.html("");
        if (bankInfo != null) {
            var len = bankInfo.length;
            var str = "<div style=\"height:20px\"></div>";
            for (var i = 0; i < len; i++) {
                str = str + "<div class=accountSafeDiv_content_bank_list_item><div id=accountSafeDiv_content_bank_list_" + i + "></div></div>";
                str = str + "<div style=\"height:20px\"></div>";
            }
            obj.html(str);
            for (var i = 0; i < len; i++) {
                var bankItem = new Object();
                bankItem["code"] = bankInfo[i]["dt"]["bank_id"]["code"];
                bankItem["cardNO"] = bankInfo[i]["cardno"];
                bankItem["account"] = bankInfo[i]["account"];
                bankItem["bankChild"] = bankInfo[i]["open_bank"];
                bankItem["btnHidden"] = true;
                bankCard("accountSafeDiv_content_bank_list_" + i, bankItem, $("#accountSafeDiv_content_bank_list_" + i));
            }
            $(".accountSafeDiv_content_bank_list_item").css({
                "width": "100%",
                "height": "auto",
                "display": "flex",
                "align-items": "center",
                "justify-content": "center"
            });
        }
    }
    function showDrawSNContent() {
        $(".accountSafeDiv_content_content").css({ "display": "none" });
        $("#accountSafeDiv_content_drawSN").css({ "display": "flex" });
    }
    function showLockTouchContent() {
        $(".accountSafeDiv_content_content").css({ "display": "none" });
        $("#accountSafeDiv_content_signPwd").css({ "display": "flex" });
        $("#accountSN_touchLock").css({ "display": "flex" });
        if (isSetTouchLock()) {
            $("#accountSN_DelTouchLock").css({ "display": "flex" });
            $("#accountSN_touchLock").html("修改手势密码");
        } else {
            $("#accountSN_DelTouchLock").css({ "display": "none" });
            $("#accountSN_touchLock").html("设置手势密码");
        }
    }
    function checkInfoComplete(type) {
        if (userInfo["complete"] == 1) {
            mPage.hiddenBtn();
            eventIndex = mEventBusObj.subscriptionForce(eventTheme, function (obj) {
                setTypeSelect(type);
                mEventBusObj.unsubscribe(eventIndex);
            });
            myPJDApp.showComplete("noMenu", eventTheme);
        } else {
            mPage.showBtn();
        }
    }
}
function logOutPost(isLoading) {
    if (isLoading == null) { isLoading = false; }
    if (isLoading) {
        mLoader.show("logOut");
    }
    requestAjax("user/logout", "", function (data) {
        appLogout(0);
    }, function (error) {
        appLogout(0);
    });
}
function isLogin() {
    if (userId == null || userId == "") {
        return false;
    } else {
        return true;
    }
}
function encryptPass(ms, key) {
    var key = CryptoJS.enc.Utf8.parse(decryptDefault(key));
    var srcs = CryptoJS.enc.Utf8.parse(ms + ";" + Math.random());
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
    function decryptDefault(key) {
        var decrypt = CryptoJS.AES.decrypt(key, CryptoJS.enc.Utf8.parse("wsx~3319dee^1688"), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }
}
function getEnKey(backFun) {
    requestAjax("user/getAeskey", null, function (jsonObj) {
        var key = jsonObj["result"];
        if (key != null && key.length > 0) {
            if (backFun != null) {
                backFun(key);
            }
        } else {
            if (backFun != null) {
                backFun(null);
            }
        }
    }, function (error) {
        if (backFun != null) {
            backFun(null);
        }
    });
}
function ReadNoticeMessage() {
    requestAjax("userMsg/getUserMsgs", "", function (jsonObj) {
        if (jsonObj["code"] != 0) { return; }
        var count = 0;
        var objList = jsonObj["result"]["list"];
        var len = objList["length"];
        for (var i = 0; i < len; i++) {
            var objItem = objList[i];
            if (objItem["dt"]["isRead"] == 0) { count += 1; }
        }
        NUMBER_MESSAGE_READ = count;
        if (count > 0) {
            var tmpe = count;
            if (count > 9) { tmpe = '9+'; }
            $(".appNoticeReadSize").each(function () { $("#" + this.id).html(tmpe); });
            $(".appNoticeReadSize").css({ "display": "flex" });
        } else {
            $(".appNoticeReadSize").css({ "display": "none" });
            $(".appNoticeReadSize").each(function () { $("#" + this.id).html("0"); });
        }
    });
}
