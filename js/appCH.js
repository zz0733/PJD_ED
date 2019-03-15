function CHJPNN() {
    var mObj = $("#index_content_nn");
    var isInit = false;
    this.init = function () {
        mObj.css({
            "height": screenH - topH - 0.5 - chMenuH - 2 - menuH,
            "background": roadContentBgColor
        });
        isInit = true;
    }
    this.load = function () {
        if (isInit) {
            mObj.css({ "display": "flex" });
        } else {
            this.init();
            mObj.css({ "display": "flex" });
        }
        MJPNNObj.openGame();
        this.setJPNNAnimation(true);
    }
    this.getObj = function () {
        return mObj;
    }
    this.exit = function () {
        mObj.css({ "display": "none" });
        this.setJPNNAnimation(false);
        MJPNNObj.exitGame();
    }
    this.setJPNNAnimation = function (isOpen) {
        if (isOpen) {
            MJPNNObj.openAnimation();
        } else {
            MJPNNObj.stopAnimation(true);
        }
        console.log("setJPNNAnimation:" + isOpen);
    }
}
function CHKY() {
    var mObj = $("#index_content_ky");
    var isInit = false;
    var itemW = (screenW - 16 - 24) / 4;
    this.init = function () {
        var fontSize = "11px";
        if (screenW <= 320) { fontSize = "9px"; }
        mObj.css({
            "height": screenH - topH - 0.5 - chMenuH - 2 - menuH,
            "background": roadContentBgColor
        });
        $(".content_poker_content_item_class").css({
            "width": itemW,
            "height": "auto",
            "padding": "5px",
            "display": "flex",
            "justify-content": "flex-start",
            "flex-direction": "column",
            "align-items": "center",
            "margin-bottom": "10px",
            "color": mainFontColorMore,
            "background": kyGameItemBgColor,
            "font-size": fontSize,
            "border-radius": "3px",
            "box-sizing": "border-box"
        });
        $(".content_poker_content_item_img_class").css({
            "width": itemW - 10,
            "margin-bottom": "5px",
            "box-sizing": "border-box"
        });
        $("#content_poker_content_item_add_id").css({
            "visibility": "hidden"
        });
        $(".content_poker_content_item_class").each(function () {
            setBtnOnTouchEvent($(this), function (mObj) {
                var id = mObj.id;
                var idList = id.split("_");
                var iLen = idList.length;
                var index = Number(idList[iLen - 2]);
                var gameIndex = 0;
                switch (index) {
                    case 1: gameIndex = 830; break;
                    case 2: gameIndex = 220; break;
                    case 3: gameIndex = 620; break;
                    case 4: gameIndex = 860; break;
                    case 5: gameIndex = 720; break;
                    case 6: gameIndex = 600; break;
                    case 7: gameIndex = 870; break;
                    case 8: gameIndex = 610; break;
                    case 9: gameIndex = 930; break;
                    case 10: gameIndex = 920; break;
                    case 11: gameIndex = 730; break;
                    case 12: gameIndex = 900; break;
                    case 13: gameIndex = 910; break;
                    case 14: gameIndex = 630; break;
                    case 15: gameIndex = 230; break;
                }
                console.log("kyGameClickId:" + id);
                if (index != "add") {
                    openKY(gameIndex);
                } else {
                    mToast.show("敬请期待!", 1, "middle");
                }
            }, mainColorDeep, kyGameItemBgColor, null);
        });
        isInit = true;
    }
    this.load = function () {
        if (isInit) {
            mObj.css({ "display": "flex" });
        } else {
            this.init();
            mObj.css({ "display": "flex" });
        }
    }
    this.getObj = function () {
        return mObj;
    }
    this.exit = function () {
        mObj.css({ "display": "none" });
    }
}
function CHGM() {
    var mObj = $("#index_content_gm");
    var isInit = false;
    var itemW = (screenW - 16 - 24) / 4;
    this.init = function () {
        var fontSize = "11px";
        if (screenW <= 320) { fontSize = "9px"; }
        mObj.css({
            "height": screenH - topH - 0.5 - chMenuH - 2 - menuH,
            "background": roadContentBgColor
        });
        $(".content_gm_content_item_class").css({
            "width": itemW,
            "height": "auto",
            "padding": "5px",
            "display": "flex",
            "justify-content": "flex-start",
            "flex-direction": "column",
            "align-items": "center",
            "margin-bottom": "10px",
            "color": mainFontColorMore,
            "background": kyGameItemBgColor,
            "font-size": fontSize,
            "border-radius": "3px",
            "box-sizing": "border-box"
        });
        $(".content_gm_content_item_img_class").css({
            "width": itemW - 10,
            "margin-bottom": "5px",
            "box-sizing": "border-box"
        });
        $("#content_gm_content_item_20_id").css({
            "visibility": "hidden"
        });
        $("#content_gm_content_item_21_id").css({
            "display": "none"
        });
        $("#content_gm_content_item_15_id").css({
            "display": "none"
        });
        $("#content_gm_content_item_16_id").css({
            "display": "none"
        });
        $("#content_gm_content_item_18_id").css({
            "display": "none"
        });
        $("#content_gm_content_item_19_id").css({
            "display": "none"
        });
        $(".content_gm_content_item_class").each(function () {
            setBtnOnTouchEvent($(this), function (mObj) {
                var id = mObj.id;
                var idList = id.split("_");
                var iLen = idList.length;
                var index = Number(idList[iLen - 2]);
                var gameIndex = 0;
                switch (index) {
                    case 1: gameIndex = 3003; break;
                    case 2: gameIndex = 3002; break;
                    case 3: gameIndex = 24001; break;
                    case 4: gameIndex = 3008; break;
                    case 5: gameIndex = 22001; break;
                    case 6: gameIndex = 3001; break;
                    case 7: gameIndex = 23001; break;
                    case 8: gameIndex = 1001; break;
                    case 9: gameIndex = 2006; break;
                    case 10: gameIndex = 1002; break;
                    case 11: gameIndex = 2001; break;
                    case 12: gameIndex = 15003; break;
                    case 13: gameIndex = 9004; break;
                    case 14: gameIndex = 25001; break;
                    case 15: gameIndex = 9001; break;
                    case 16: gameIndex = 10102; break;
                    case 17: gameIndex = 10103; break;
                    case 18: gameIndex = 10104; break;
                    case 19: gameIndex = 26001; break;
                }
                console.log("gmGameClickId:" + id);
                openGM(gameIndex);
            }, mainColorDeep, kyGameItemBgColor, null);
        });
        isInit = true;
    }
    this.load = function () {
        if (isInit) {
            mObj.css({ "display": "flex" });
        } else {
            this.init();
            mObj.css({ "display": "flex" });
        }
    }
    this.getObj = function () {
        return mObj;
    }
    this.exit = function () {
        mObj.css({ "display": "none" });
    }
}
