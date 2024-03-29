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
var AppMakeObj;
var MJPNNObj;
var MKyObj;
var MGmObj;
var MGameTryReg;
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
        PageFrameGenerating();
        AppMakeObj = new AppMake();
        mCompleteInfoObj = new CompleteInfo();
        mMoneyWindowObj = new FundsWindow(); mMoneyWindowObj.init();
        mLoginObj = new LoginObj(); mLoginObj.init();
        mRegisterObj = new RegisterObj(); mRegisterObj.init();
        mAgreementObj = new Agreement(); mAgreementObj.init();
        mInfoNameObj = new InfoName(); mInfoNameObj.init();
        mServiceObj = new PJDService(); mServiceObj.init();
        mBankInfoObj = new BankInfo(); mBankInfoObj.init();
        mNoticeObj = new NoticeObj(); mNoticeObj.init();
        mMailDetailObj = new MailDetail(); mMailDetailObj.init();
        mFeedbackObj = new Feedback(); mFeedbackObj.init();
        mInterestObj = new InterestObj(); mInterestObj.init();
        mInterestbaoObj = new InterestBaoObj(); mInterestbaoObj.init();
        mluckyLpObj = new LuckyLpObj(); mluckyLpObj.init();
        mLuckyDrawObj = new LuckyDrawObj(); mLuckyDrawObj.init();
        mUpdateNickNameObj = new UpdateNickNameObj(); mUpdateNickNameObj.init();
        minterestDetailObj = new InterestDetailObj(); minterestDetailObj.init();
        mincomeDetailsObj = new IncomeDetailsObj(); mincomeDetailsObj.init();
        mBuyInterestObj = new BuyInterestObj(); mBuyInterestObj.init();
        mPasswordInputObj = new PasswordInputObj(); mPasswordInputObj.init();
        mMoneyrecordObj = new FundsRecord(); mMoneyrecordObj.init();
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
        MGameTryReg = new GameTryReg(); MGameTryReg.init();
        mDiscountObj = new DiscountObj(); mDiscountObj.init();
        mFavourableObj = new FavourableObj(); mFavourableObj.init();
        mAgentObj = new AgentObj(); mAgentObj.init();
        mAccountSafeObj = new AccountSafe(); mAccountSafeObj.init();
        mAskObj = new AskObj(); mAskObj.init();
        mAboutObj = new AboutObj(); mAboutObj.init();
        mPyramidObj = new PyramidObj(); mPyramidObj.init();
        mResponsibilityObj = new ResponsibilityObj(); mResponsibilityObj.init();
        mIncomeOnlineObj = new IncomeOnline(); mIncomeOnlineObj.init();
        mIncomeOfflineObj = new IncomeOffline(); mIncomeOfflineObj.init();
        mDrawFeeObj = new DrawFee(); mDrawFeeObj.init();
        mDepositFeeObj = new DepositFee(); mDepositFeeObj.init();
        mLeagueAgreementObj = new LeagueAgreement(); mLeagueAgreementObj.init();
        mLeagueContentObj = new LeagueContent(); mLeagueContentObj.init();
        mAgentQrCodeObj = new AgentQrCode(); mAgentQrCodeObj.init();
        mAvatarObj = new UseAvatar(); mAvatarObj.init();
        MKyObj = new KY_ED(); MKyObj.init();
        MGmObj = new GM_ED(); MGmObj.init();
        getAppVersion();
        checkIsAndroid();
        requestAjax("i18n/getMapKeyLangs", "", function (jsonObj) {
            if (jsonObj != null && jsonObj != "") lang = jsonObj;
        });
    }
    this.setAppStyle = setAppStyle;
    this.h5DownloadCheck = h5DownloadCheck;
    this.openKy = function (gameIndex) {
        MKyObj.show(gameIndex);
    }
    this.openGm = function (gameIndex) {
        MGmObj.show(gameIndex);
    }
    this.showAgreement = function (type) {
        mAgreementObj.show();
        mAgreementObj.setType(type);
    }
    this.showMoneyWindow = function () {
        mMoneyWindowObj.show();
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
        var chJpnn = menuObjIndex.getCH("nn");
        if (chJpnn != null) chJpnn.setJPNNAnimation(isOpen);
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
        if (!isLogin()) {
            if (selectIndex == 2 || selectIndex == 3) {
                mLoginObj.show();
                return;
            }
        }
        focusHiddenBox();
        $("#menus_" + currentMenuSelect + "_1").css({ "display": "" });
        $("#menus_" + currentMenuSelect + "_2").css({ "display": "none" });
        $("#menu_" + currentMenuSelect).css({ "color": toolbarFontColor });
        $("#menus_" + selectIndex + "_2").css({ "display": "" });
        $("#menus_" + selectIndex + "_1").css({ "display": "none" });
        $("#menu_" + selectIndex).css({ "color": toolbarFontColorTouch });
        if (currentMenuObj != null) {
            currentMenuObj.unShow();
            currentMenuObj.getObj().css({ opacity: 0 });
        }
        if (selectIndex == 1) {
            currentMenuObj = menuObjIndex;
        } else if (selectIndex == 3) {
            currentMenuObj = menuObjComing;
        } else if (selectIndex == 4) {
            currentMenuObj = menuObjMy;
        }
        currentMenuSelect = selectIndex;
        currentMenuObj.show();
        currentMenuObj.getObj().transition({ opacity: 1.0 });
    }
    function menuIndexContent() {
        var chJpnn = new CHJPNN();
        var chKy = new CHKY();
        var chGm = new CHGM();
        var currentCH = "";
        var currentCHObj = null;
        setStyle();
        this.show = function () {
            $("#topTitle").css({ "display": "none" });
            $("#topLogo").css({ "display": "block" });
            $("#indexDiv").css({ x: -screenW });
            if (currentCHObj != null) {
                currentCHObj.load();
            } else { selectCH("nn"); }
            checkPageBackFromHome();
        }
        this.unShow = function () {
            if (currentCHObj != null) currentCHObj.exit();
            $("#indexDiv").css({ x: 0 });
        }
        this.getObj = function () {
            return $("#indexDiv");
        }
        this.getCH = function (type) {
            switch (type) {
                case "nn": return chJpnn;
                case "ky": return chKy;
                case "gm": return chGm;
                default: return null;
            }
        }
        this.selectCH = selectCH;
        function selectCH(selectIndex) {
            if (currentCH == selectIndex) return;
            focusHiddenBox();
            var select = "url(" + themPath + "submenu_real_selectbg.png)";
            if (currentCHObj != null) currentCHObj.exit();
            $(".index_top_btn_class").css({ "background": "" });
            if (selectIndex == "nn") {
                currentCHObj = chJpnn;
                $("#index_top_btn_id_nn").css({ "background": select });
            } else if (selectIndex == "ky") {
                currentCHObj = chKy;
                $("#index_top_btn_id_ky").css({ "background": select });
            } else if (selectIndex == "gm") {
                currentCHObj = chGm;
                $("#index_top_btn_id_gm").css({ "background": select });
            }
            currentCH = selectIndex;
            currentCHObj.load();
        }
        function setStyle() {
            $("#index_top").css({
                "width": "100%",
                "height": chMenuH,
                "box-sizing": "border-box"
            });
            $(".index_top_btn_class").css({
                "width": screenW / 3,
                "height": chMenuH,
                "display": "flex",
                "flex-direction": "column",
                "justify-content": "center",
                "align-items": "center",
                "box-sizing": "border-box"
            });
            $(".index_top_btn_txt").css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "font-size": "12px",
                "color": mainFontColorMore,
                "margin-top": "3px",
                "box-sizing": "border-box"
            });
            $(".index_content_games").css({ "display": "none" });
            $("#indexDiv").css({ "left": screenW, "height": h - topH - menuH - 0.5 });
            $("#indexDiv").scrollTop(0);
            $("#index_content").css({ "height": h - topH - 0.5 - chMenuH - 2 - menuH });
            $(".index_top_btn_class").each(function () {
                setBtnOnTouchEventNoColor($(this), function (mObj) {
                    var idList = mObj.id.split("_");
                    var iLen = idList.length;
                    selectCH(idList[iLen - 1]);
                }, null);
            });
        }
    }
    function menuComingContent() {
        var recObj = new DepositBindView("comingDiv"); recObj.init();
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
        setMapStyle();
        this.show = function () {
            $("#mapDiv").css({ x: -screenW });
        }
        this.unShow = function () {
            $("#mapDiv").css({ x: 0 });
        }
        this.getObj = function () {
            return $("#mapDiv");
        }
        function setMapStyle() {
            $("#mapDiv").css({
                "height": h - topH - menuH,
                "left": screenW,
                "background": mapContentBgColor
            });
            $("#mapDiv_content").css({
                "height": h - topH - menuH
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
                RefreshFunds();
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
                RefreshFunds();
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
                    var mUserObj = new UserObj();
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
            "width": w / 5,
            "color": toolbarFontColor,
            "font-size": "10px",
            "line-height": "150%",
            "text-align": "center",
            "height": "55px"
        });
        $("#menuGame").css({
            "width": w / 5,
            "color": toolbarFontColor,
            "font-size": "10px",
            "line-height": "150%",
            "text-align": "center",
            "height": "90px"
        });
        $("#menuGameImg").css({
            "width": "35px",
            "height": "35px",
            "padding": "6px",
            "border-radius": "50%",
            "background": "#181818"
        });
        if (isInIOS()) {
            $("#bodyDiv").css({ "position": "static" });
            $("#mainDiv").css({ "position": "fixed" });
            $("#top").css({ "position": "static" });
            $("#menusDiv").css({ "position": "fixed" });
            $("#toast").css({ "position": "fixed" });
            $("#loadingDiv").css({ "position": "fixed" });
        }
        $("#App_Version").html(APP_VERSION);
        $(".topServiceClass").each(function () {
            setBtnOnTouchEvent($(this), function (mObj) {
                myPJDApp.unShowMoneyWindow();
                openService();
            }, mainColorDeep, "", null);
        });
        $(".menuClass").each(function () {
            setBtnOnTouchEventNoColor($("#" + this.id), function (mObj) {
                var index = mObj.id.split("_")[1];
                if (index == 2) {
                    if (isLogin()) {
                        myPJDApp.showLuckyDrawObj();
                    } else { mLoginObj.show(); }
                } else { setSelectMenu(index); }
            }, null);
        });
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
        setBtnOnTouchEventNoColor($("#menuGame"), function () {
            var lastGame = getLocalStorage("lastGameId").split("-");
            if (lastGame[0] == "nn") {
                setSelectMenu(1);
                menuObjIndex.selectCH("nn");
            } else if (lastGame[0] == "ky") {
                if (isLogin()) {
                    myPJDApp.openKy(lastGame[1]);
                } else {
                    myPJDApp.showLogin();
                }
            } else if (lastGame[0] == "gm") {
                if (isLogin()) {
                    myPJDApp.openGm(lastGame[1]);
                } else {
                    myPJDApp.showLogin();
                }
            } else {
                setSelectMenu(1);
                menuObjIndex.selectCH("nn");
            }
        });
        mainTopBar = new TopToolbar("top", "");
        mainTopBar.init();
        MJPNNObj = new JPNN_ED(); MJPNNObj.loadUI();
        menuObjIndex = new menuIndexContent();
        menuObjComing = new menuComingContent();
        menuObjMap = new menuFastContent();
        menuObjMy = new menuMineContent();
        LoadLastPlay();
        setSelectMenu(1);
        $("#mainDiv").animate({ "opacity": 1.0 }, "slow");
    }
    function PageFrameGenerating() { // 界面框架生成
        addPageToHtml("feedbackInfoDiv");
        addPageToHtml("moneyrecordDiv");
        addPageToHtml("moneyrecordDetailsDiv");
        addPageToHtml("interestbaoDiv");
        addPageToHtml("pastRecordDiv");
        addPageToHtml("interestDetailDiv");
        addPageToHtml("incomeDetailsDiv");
        addPageToHtml("buyInterestDiv");
        addPageToHtml("passwordInputDiv");
        addPageToHtml("GameTryReg");
        addPageToHtml("favourableDiv");
        addPageToHtml("agentDiv");
        addPageToHtml("nickNameDiv");
        addPageToHtml("luckyDrawDiv");
        addPageToHtml("luckyLpDiv");
        addPageToHtml("mailDiv");
        addPageToHtml("mailDetailDiv");
        addPageToHtml("leagueAgreementDiv");
        addPageToHtml("leagueContentDiv");
        addPageToHtml("interestDiv");
        addPageToHtml("depositFeeDiv");
        addPageToHtml("drawFeeDiv");
        addPageToHtml("accountSafeDiv");
        addPageToHtml("registerDiv", function () {
            $("#registerDiv_content").css({
                "padding": "10px",
                "box-sizing": "border-box"
            });
            return "";
        });
        addPageToHtml("loginDiv", function () {
            $("#loginDiv_content").css({
                "padding": "10px",
                "box-sizing": "border-box"
            });
            return "";
        });
        addPageToHtml("infoNameDiv", function () {
            $("#infoNameDiv_content").css({
                "width": "100%",
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center",
                "flex-direction": "column"
            });
            return "";
        });
        addPageToHtml("bankInfoDiv", function () {
            $("#bankInfoDiv_content").css({
                "width": "100%",
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center",
                "flex-direction": "column"
            });
            return "";
        });
        addPageToHtml("registerSuccess", function () {
            $("#registerSuccess").html("");
            $("#registerSuccess").css({
                "position": "absolute",
                "top": "0px",
                "left": "0px",
                "width": screenW,
                "height": screenH,
                "flex-direction": "column",
                "display": "none",
                "justify-content": "space-between",
                "align-items": "center",
                "background": lighterBackColor,
            });
            requestAjaxGet("pages/_reg_success.html", function (jsonObj) {
                $("#registerSuccess").html(jsonObj);
                $(".registerSuccess_top_text").css({
                    "color": mainColor,
                    "font-size": "16px",
                    "line-height": "200%"
                });
                $("#registerSuccess_bottom").css({
                    "height": screenH * 0.4
                });
                $("#registerSuccess_bottom_coming").css({
                    "background": mainColor,
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
            }, null);
            return "";
        });
        addPageToHtml("fundsWindowDiv", function () {
            $("#fundsWindowDiv").css({ "background": "rgba(0,0,0,0.6)" });
            $("#fundsWindowDiv").html(_PageFrameExpansion.fundsWindowDiv);
        });
        // 需要扩展的界面框架
        addPageToHtml("completeInfo", function () {
            $("#completeInfo").css({ "position": "fixed" });
            $("#completeInfo").html(_PageFrameExpansion.completeInfo);
            return "";
        });
        addPageToHtml("askDiv", function () {
            $("#askDiv_content").css({
                "overflow": "hidden",
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center",
                "flex-wrap": "wrap",
                "flex-direction": "column"
            });
            return "";
        });
        addPageToHtml("responsibilityDiv", function () {
            $("#responsibilityDiv_content").css({
                "overflow": "hidden",
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center",
                "flex-wrap": "wrap",
                "flex-direction": "column"
            });
            return "";
        });
        addPageToHtml("aboutDiv", function () {
            $("#aboutDiv_content").css({
                "overflow": "hidden",
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center",
                "flex-wrap": "wrap",
                "flex-direction": "column"
            });
            return "";
        });
        addPageToHtml("pyramidDiv", function () {
            $("#pyramidDiv_content").css({
                "overflow": "hidden",
                "display": "flex",
                "justify-content": "flex-start",
                "align-items": "center",
                "flex-wrap": "wrap",
                "flex-direction": "column"
            });
            return "";
        });
        addPageToHtml("agentQrCodeDiv", function () {
            var id = "agentQrCodeDiv_content";
            $("#" + id).css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "overflow-x": "hidden",
                "overflow-y": "auto"
            });
            return "<div id=\"" + id + "_img\" style=\"width:100%;height:auto;display:block\"></div>";
        });
        addPageToHtml("feedbackDiv", function () {
            var rid = "feedbackDiv";
            var cid = rid + "_content";
            var select = "<div id=\"" + cid + "_select\" style=\"width:100%;height:55px;display:flex;justify-content:center;align-items:center\">[cone]</div>";
            select = select.replace("[cone]", "<div id=\"" + rid + "_timeSelect\"></div>");
            var line = "<div style=\"height:10px\"></div>";
            var list = "<div id=\"" + cid + "_list\" style=\"width:100%;overflow-x:hidden;overflow-y:auto\"></div>";
            return select + line + list;
        });
        addPageToHtml("serviceDiv", function () {
            var id = "serviceDiv_content";
            return "<div id=\"" + id + "_loading\" style=\"width:100px;height:100px\"></div>";
        });
        addPageToHtml("discountDiv", function () {
            var id = "discountDiv_content";
            var con = "<div id=\"" + id + "_listDIv\" style=\"width:100%;display:none;flex-direction:column;justify-content:flex-start;align-items:center\"></div>";
            return con;
        });
        addPageToHtml("betLmgRemakeDiv", function () {
            var rid = "betLmgRemakeDiv";
            $("#" + rid).append("<div id=\"" + rid + "_backdom\"><div id=\"" + rid + "_button\"></div></div>");
            return "";
        });
        addPageToHtml("betGmRemakeDiv", function () {
            var rid = "betGmRemakeDiv";
            $("#" + rid).append("<div id=\"" + rid + "_backdom\"><div id=\"" + rid + "_button\"></div></div>");
            return "";
        });
        addPageToHtml("betKyRemakeDiv", function () {
            var rid = "betKyRemakeDiv";
            $("#" + rid).append("<div id=\"" + rid + "_backdom\"><div id=\"" + rid + "_button\"></div></div>");
            return "";
        });
        addPageToHtml("betJPNNRemakeDiv", function () {
            var rid = "betJPNNRemakeDiv";
            $("#" + rid).append("<div id=\"" + rid + "_backdom\"><div id=\"" + rid + "_button\"></div></div>");
            return "";
        });
        addPageToHtml("betCmdRemakeDiv", function () {
            var rid = "betCmdRemakeDiv";
            $("#" + rid).append("<div id=\"" + rid + "_backdom\"><div id=\"" + rid + "_button\"></div></div>");
            return "";
        });
        addPageToHtml("betElectRemakeDiv", function () {
            var rid = "betElectRemakeDiv";
            $("#" + rid).append("<div id=\"" + rid + "_backdom\"><div id=\"" + rid + "_button\"></div></div>");
            return "";
        });
        addPageToHtml("avatarDiv", function () {
            return _PageFrameExpansion.avatarDiv;
        });
        addPageToHtml("betrecordDiv", function () {
            return _PageFrameExpansion.betrecordDiv;
        });
        addPageToHtml("betrecordInfoDiv", function () {
            return _PageFrameExpansion.betrecordInfoDiv;
        });
        addPageToHtml("betrecordKyDiv", function () {
            return _PageFrameExpansion.betrecordKyDiv;
        });
        addPageToHtml("betrecordGmDiv", function () {
            return _PageFrameExpansion.betrecordGmDiv;
        });
        addPageToHtml("betrecordJPNNDiv", function () {
            return _PageFrameExpansion.betrecordJPNNDiv;
        });
        addPageToHtml("betrecordIgDiv", function () {
            return _PageFrameExpansion.betrecordIgDiv;
        });
        addPageToHtml("betrecordCmdDiv", function () {
            return _PageFrameExpansion.betrecordCmdDiv;
        });
        addPageToHtml("betrecordElectDiv", function () {
            return _PageFrameExpansion.betrecordElectDiv;
        });
        addPageToHtml("leagueDetailsDiv", function () {
            return _PageFrameExpansion.leagueDetailsDiv;
        });
        addPageToHtml("gamesDiv", function () {
            return _PageFrameExpansion.gamesDiv;
        });
        addPageToHtml("costDiv", function () {
            return _PageFrameExpansion.costDiv;
        });
        addPageToHtml("agentCommsDiv", function () {
            return _PageFrameExpansion.agentCommsDiv;
        });
        addPageToHtml("commGamesDiv", function () {
            return _PageFrameExpansion.commGamesDiv;
        });
        addPageToHtml("agreementDiv", function () {
            return _PageFrameExpansion.agreementDiv;
        });
        addPageToHtml("incomeOnlineDiv", function () {
            return _PageFrameExpansion.incomeOnlineDiv;
        });
        addPageToHtml("incomeOfflineDiv", function () {
            return _PageFrameExpansion.incomeOfflineDiv;
        });
        addPageToHtml("incomeOfflineSuccessDiv", function () {
            $("#incomeOfflineSuccessDiv_content").css({
                "display": "flex",
                "flex-direction": "column",
                "justify-content": "space-between",
                "align-items": "center"
            });
            return _PageFrameExpansion.incomeOfflineSuccessDiv;
        });
        // 游戏框架
        addPageToHtml("kyDiv", function () {
            var id = "kyDiv";
            $("#" + id + "_content").css({
                "position": "relative",
                "overflow": "hidden",
                "background": "#2A2A2A"
            });
            GamesFrameHtml(id + "_content", function () {
                $("#" + id + "_content_iframe").attr("frameborder", "0");
                $("#" + id + "_content_iframe").css({
                    "transform": "scale(0.6)",
                    "transform-origin": "0 0"
                });
            });
        });
        addPageToHtml("gmDiv", function () {
            var id = "gmDiv";
            $("#" + id + "_content").css({
                "position": "relative",
                "overflow": "hidden",
                "background": "#2A2A2A"
            });
            GamesFrameHtml(id + "_content", function () {
                $("#" + id + "_content_iframe").attr("frameborder", "1");
                $("#" + id + "_content_iframe").css({
                    "border-color": "#2A2A2A",
                    "overflow-x": "hidden",
                    "overflow-y": "hidden",
                    "transform": "scale(0.596,0.596)",
                    "transform-origin": "0 0"
                });
            });
        });
    }
    function LoadLastPlay() {
        var getLastGame = getLocalStorage("lastGameId");
        if (getLastGame == null) {
            saveLocalStorage("lastGameId", "nn-JPNN");
        }
        getLastGame = getLocalStorage("lastGameId").split("-");
        if (getLastGame[0] == "nn") {
            $("#menuGameImg").attr("src", "pic/themeMain/LAST_NN.png");
        } else if (getLastGame[0] == "ky") {
            $("#menuGameImg").attr("src", "pic/themeMain/LAST_KY.png");
        } else if (getLastGame[0] == "gm") {
            $("#menuGameImg").attr("src", "pic/themeMain/LAST_GM.png");
        } else {
            saveLocalStorage("lastGameId", "nn-JPNN");
            $("#menuGameImg").attr("src", "pic/themeMain/LAST_NN.png");
        }
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
function AgentRankingObj() {
    this.getAgentRankingData = getAgentRankingData;
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
function LuckyLpObj() {
    var mPage = new Activity("luckyLpDiv", "幸运抽奖");
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
function LuckyDrawObj() {
    var mPage = new Activity("luckyDrawDiv", "幸运抽奖");
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
    var mPage = new Activity("nickNameDiv", "修改昵称");
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
    var mPage = new Activity("mailDiv", "公告");
    var isInit = false;
    this.init = function () {
        mPage.init();
        mPage.onResume(function () {
            console.log("Notice Activity onResume");
        });
        mPage.onPause(function () {
            console.log("Notice Activity onPause");
        });
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
function MailDetail() {
    var mPage = new Activity("mailDetailDiv", "公告详情");
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
function InterestObj() {
    var mPage = new Activity("interestDiv", "利息账户");
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
function InterestBaoObj() {
    var mPage = new Activity("interestbaoDiv", "利息宝");
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
function InterestDetailObj() {
    var mPage = new Activity("interestDetailDiv", "利息记录详情");
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
function IncomeDetailsObj() {
    var mPage = new Activity("incomeDetailsDiv", "收益详情");
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
function BuyInterestObj() {
    var mPage = new Activity("buyInterestDiv", "购买利息产品");

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
function PasswordInputObj() {
    var mPage = new Activity("passwordInputDiv", "输入资金密码");

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
function DiscountObj() {
    var mPage = new Activity("discountDiv", "优惠管理");
    var datas = new Array();
    this.init = function () {
        mPage.init();
        $("#discountDiv_content").css({
            "background-color": pageBgColor,
            "overflow-x": "hidden",
            "overflow-y": "auto",
            "height": screenH - topH
        });
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
                var str = '<div style="height:10px;background:' + pageBgColor + ';"></div>';
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
function FavourableObj() {
    var mPage = new Activity("favourableDiv", "优惠详情");

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
function AgentObj() {
    var mPage = new Activity("agentDiv", "联盟合作");
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
            mleagueLoadingFunObj.returnGet();
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
function AskObj() {
    var mPage = new Activity("askDiv", "常见问题");
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
function AboutObj() {
    var mPage = new Activity("aboutDiv", "关于我们");
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
function PyramidObj() {
    var mPage = new Activity("pyramidDiv", "金字塔介绍");
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
function ResponsibilityObj() {
    var mPage = new Activity("responsibilityDiv", "博彩责任");
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
// 方法
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
function getAppVersion() {
    requestAjax("dt/getList?table=dt_app_version", "requestType=json", function (jsonObj) {
        if (jsonObj["code"] != 0) return;
        var list = jsonObj["result"];
        var len = list["length"];
        for (var i = 0; i < len; i++) {
            var item = list[i];
            var type = item["type"];
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
function getResettingSign() {
    var isHiden = getLocalStorage("touckLock_IsHiddenLine");
    if (isHiden == 1) { isHiden = true } else { isHiden = false; }
    return isHiden;
}
function loadAlert() {
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
function doubleValue(val) {
    if (val == null || isNaN(val)) { return parseFloat(0); }
    return parseFloat(parseFloat(val).toFixed(2));
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
