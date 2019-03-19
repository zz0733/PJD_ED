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
        bindKy();
        $(".content_poker_content_item_class").css({
            "width": itemW,
            "height": "auto",
            "padding": "5px",
            "display": "flex",
            "justify-content": "flex-start",
            "flex-direction": "column",
            "align-items": "center",
            "color": mainFontColorMore,
            "background": kyGameItemBgColor,
            "font-size": fontSize,
            "border-radius": "3px",
            "margin-bottom": "5px",
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
    function bindKy() {
        var rot = " <div class=\"content_poker_content_item_class\" id=\"content_poker_content_item_[id]_id\">[content]</div>";
        var img = "<img class=\"content_poker_content_item_img_class\" src=\"pic/themeMain/KY_GAME_[img].png\" style=\"width:60px\"/>[name]";
        var items = rot.replace("[id]", 1).replace("[content]", img.replace("[img]", "8").replace("[name]", "抢庄牛牛"));
        items += rot.replace("[id]", 2).replace("[content]", img.replace("[img]", "14").replace("[name]", "炸金花"));
        items += rot.replace("[id]", 6).replace("[content]", img.replace("[img]", "6").replace("[name]", "二十一点"));
        items += rot.replace("[id]", 5).replace("[content]", img.replace("[img]", "5").replace("[name]", "二八杠"));
        items += rot.replace("[id]", 4).replace("[content]", img.replace("[img]", "10").replace("[name]", "三公"));
        items += rot.replace("[id]", 3).replace("[content]", img.replace("[img]", "3").replace("[name]", "德州扑克"));
        items += rot.replace("[id]", 11).replace("[content]", img.replace("[img]", "9").replace("[name]", "抢庄牌九"));
        items += rot.replace("[id]", 13).replace("[content]", img.replace("[img]", "1").replace("[name]", "百家乐"));
        items += rot.replace("[id]", 10).replace("[content]", img.replace("[img]", "11").replace("[name]", "森林舞会"));
        items += rot.replace("[id]", 12).replace("[content]", img.replace("[img]", "15").replace("[name]", "押庄龙虎"));
        items += rot.replace("[id]", 7).replace("[content]", img.replace("[img]", "13").replace("[name]", "通比牛牛"));
        items += rot.replace("[id]", 9).replace("[content]", img.replace("[img]", "2").replace("[name]", "百人牛牛"));
        items += rot.replace("[id]", 14).replace("[content]", img.replace("[img]", "12").replace("[name]", "十三水"));
        items += rot.replace("[id]", 8).replace("[content]", img.replace("[img]", "4").replace("[name]", "斗地主"));
        items += rot.replace("[id]", 15).replace("[content]", img.replace("[img]", "7").replace("[name]", "极速炸金花"));
        items += rot.replace("[id]", "add").replace("[content]", img.replace("[img]", "ADD").replace("[name]", "敬请期待"));
        $("#index_content_ky").html(items);
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
        bindGm();
        $(".content_gm_content_item_class").css({
            "width": itemW,
            "height": "auto",
            "padding": "5px",
            "display": "flex",
            "justify-content": "flex-start",
            "flex-direction": "column",
            "align-items": "center",
            "color": mainFontColorMore,
            "background": kyGameItemBgColor,
            "font-size": fontSize,
            "border-radius": "3px",
            "margin-bottom": "5px",
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
    function bindGm() {
        var rot = " <div class=\"content_gm_content_item_class\" id=\"content_gm_content_item_[id]_id\">[content]</div>";
        var img = "<img class=\"content_gm_content_item_img_class\" src=\"pic/themeMain/GM_GAME_[img].png\" style=\"width:60px\"/>[name]";
        var items = rot.replace("[id]", 1).replace("[content]", img.replace("[img]", "5").replace("[name]", "百人牛牛"));
        items += rot.replace("[id]", 2).replace("[content]", img.replace("[img]", "16").replace("[name]", "看牌抢庄牛牛"));
        items += rot.replace("[id]", 3).replace("[content]", img.replace("[img]", "2").replace("[name]", "百家乐"));
        items += rot.replace("[id]", 4).replace("[content]", img.replace("[img]", "20").replace("[name]", "通比牛牛"));
        items += rot.replace("[id]", 5).replace("[content]", img.replace("[img]", "4").replace("[name]", "百人龙虎"));
        items += rot.replace("[id]", 6).replace("[content]", img.replace("[img]", "19").replace("[name]", "随机庄家牛牛"));
        items += rot.replace("[id]", 7).replace("[content]", img.replace("[img]", "6").replace("[name]", "百人炸金花"));
        items += rot.replace("[id]", 8).replace("[content]", img.replace("[img]", "22").replace("[name]", "炸金花"));
        items += rot.replace("[id]", 9).replace("[content]", img.replace("[img]", "3").replace("[name]", "百人德州"));
        items += rot.replace("[id]", 10).replace("[content]", img.replace("[img]", "15").replace("[name]", "极速炸金花"));
        items += rot.replace("[id]", 11).replace("[content]", img.replace("[img]", "7").replace("[name]", "德州扑克"));
        items += rot.replace("[id]", 12).replace("[content]", img.replace("[img]", "17").replace("[name]", "三公"));
        items += rot.replace("[id]", 13).replace("[content]", img.replace("[img]", "11").replace("[name]", "二人斗地主"));
        items += rot.replace("[id]", 14).replace("[content]", img.replace("[img]", "18").replace("[name]", "十三水"));
        items += rot.replace("[id]", 15).replace("[content]", img.replace("[img]", "9").replace("[name]", "斗地主"));
        items += rot.replace("[id]", 16).replace("[content]", img.replace("[img]", "21").replace("[name]", "推倒胡"));
        items += rot.replace("[id]", 17).replace("[content]", img.replace("[img]", "12").replace("[name]", "二人麻将"));
        items += rot.replace("[id]", 18).replace("[content]", img.replace("[img]", "8").replace("[name]", "点炮胡"));
        items += rot.replace("[id]", 19).replace("[content]", img.replace("[img]", "10").replace("[name]", "二八杠"));
        items += rot.replace("[id]", 20).replace("[content]", img.replace("[img]", "14").replace("[name]", "港试五张"));
        items += rot.replace("[id]", 21).replace("[content]", img.replace("[img]", "13").replace("[name]", "21点"));
        $("#index_content_gm").html(items);
    }
}
