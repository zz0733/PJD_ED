// bank
var bank = [{ "code": "GONGSHANG", "id": 1, "text": "工商银行" }, { "code": "JIANSHE", "id": 2, "text": "建设银行" }, { "code": "ZHAOSHANG", "id": 3, "text": "招商银行" }, { "code": "NONGYE", "id": 4, "text": "农业银行" }, { "code": "ZHONGGUO", "id": 5, "text": "中国银行" }, { "code": "JIAOTONG", "id": 6, "text": "交通银行" }, { "code": "ZHONGXIN", "id": 7, "text": "中信银行" }, { "code": "YOUZHENG", "id": 8, "text": "中国邮政银行" }, { "code": "XINGYE", "id": 9, "text": "兴业银行" }, { "code": "XIAMENGUOJI", "id": 10, "text": "厦门国际银行" }, { "code": "SHANGHAI", "id": 11, "text": "上海银行" }, { "code": "RENMIN", "id": 12, "text": "中国人民银行" }, { "code": "PUFA", "id": 13, "text": "浦发银行" }, { "code": "PINGAN", "id": 14, "text": "平安银行" }, { "code": "NONGYEFAZHAN", "id": 15, "text": "中国农业发展银行" }, { "code": "MINSHENG", "id": 16, "text": "民生银行" }, { "code": "JINCHUKOU", "id": 17, "text": "中国进出口银行" }, { "code": "HUAXIA", "id": 18, "text": "华夏银行" }, { "code": "GUOJIAKAIFA", "id": 19, "text": "国家开发银行" }, { "code": "GUANGFA", "id": 20, "text": "广发银行" }, { "code": "GUANGDA", "id": 21, "text": "光大银行" }, { "code": "BEIJING", "id": 22, "text": "北京银行" }];
// depositType
var depositType = [{ "name": "网银转账", "id": 1 }, { "name": "银行柜台存钱", "id": 2 }, { "name": "ATM柜员机现金存款", "id": 3 }, { "name": "ATM柜员机转账", "id": 4 }, { "name": "微信支付", "id": 5 }, { "name": "支付宝支付", "id": 6 }];
// lang
var lang = {
    "code": 0, "tipMessage": "tip.success", "result": {
        "tip.error.deposit.nopays": { "zh": "存在有没完成的存款订单." },
        "tip.error.agent.null": { "zh": "代理不能为空." },
        "tip.error.pay.deposittype": { "zh": "存款方式错误." },
        "tip.error.bank.cardno": { "zh": "银行卡号有误." },
        "tip.error.deposit.sum": { "zh": "超出每天存款限额." },
        "tip.error.avatar.null": { "zh": "头像不能为空." },
        "tip.error.product.pdays": { "zh": "产品天数有误." },
        "tip.error.game.changepassword": { "zh": "修改游戏密码失败." },
        "tip.error.deposit.min": { "zh": "不能小于存款最小额." },
        "tip.error.grade": { "zh": "用户等级有误" },
        "tip.error.cograde.lessthenupper": { "zh": "设置不能小于上一级." },
        "tip.error.game.maintenance": { "zh": "游戏正在维护，请稍后再试." },
        "tip.error.paypassword.rule": { "zh": "提款密码必须为4位数字." },
        "tip.error.pay.channel": { "zh": "支付渠道异常." },
        "tip.error.content.null": { "zh": "内容不能为空." },
        "tip.error.pay.deposittime.null": { "zh": "存款时间不能为空." },
        "tip.error.channel.pay": { "zh": "支付通道异常，请稍后再试." },
        "tip.error.grade.id": { "zh": "用户等级ID不能为空." },
        "tip.error.withdraw.stop": { "zh": "提款暂停，请联系客服." },
        "tip.error.channel": { "zh": "支付通道有误." },
        "tip.error.email": { "zh": "邮箱有误." },
        "tip.error.product.use": { "zh": "产品已经使用." },
        "tip.error.date.stat.notfinish": { "zh": "时间段数据没结算完成." },
        "tip.error.setstatus": { "zh": "设置状态有误." },
        "tip.error.deposit.max": { "zh": "超出每次存款限额." },
        "tip.error.deposit.off": { "zh": " 存款暂停." },
        "tip.error.operator.null": { "zh": "运营商不能为空." },
        "tip.error.game.deposit": { "zh": "游戏存款失败." },
        "tip.error.role.notexist": { "zh": "角色不存在." },
        "tip.error.agent.notexist": { "zh": "代理商不存在." },
        "tip.error.digiccy.account.null": { "zh": "数字货币账号不能为空." },
        "tip.error.nopower": { "zh": "权限不足." },
        "tip.error.wait": { "zh": "操作过于频繁." },
        "tip.error.game.no": { "zh": "游戏编号不能为空." },
        "tip.error.domain.isuse": { "zh": "域名已经使用，不能重复录入" },
        "tip.error.ip": { "zh": "IP有误." },
        "tip.error.operator": { "zh": "运营商不存在." },
        "tip.error.register.fail": { "zh": "注册失败." },
        "tip.error.deposit.count": { "zh": "超出每天存款次数." },
        "tip.error.save": { "zh": "保存失败." },
        "tip.error.order.null": { "zh": "订单不存在." },
        "tip.error.agent.nopay": { "zh": "只有成功存款的会员才有资格申请成为联盟合作者" },
        "tip.error.deposit.bet.rate": { "zh": "存款与投注额比率错误." },
        "tip.error.grade.normal": { "zh": "只能选择专用等级" },
        "tip.error.name.notexist": { "zh": "用户不存在." },
        "tip.error.domain": { "zh": "域名不存在，请先注册域名再录入." },
        "tip.error.email.null": { "zh": "邮箱不能为空." },
        "tip.error.user.id.null": { "zh": "用户编号不能为空." },
        "tip.error.birthday.null": { "zh": "出生日期不能为空." },
        "tip.error.bank.id.null": { "zh": "银行编号不能为空." },
        "tip.error.kickout": { "zh": "该账号在其他设备登录，你被踢出." },
        "tip.error.mobile.null": { "zh": "手机不能为空." },
        "tip.error.product.minamount": { "zh": "不能小于最小购买限额." },
        "tip.error.oldpassword.null": { "zh": "旧密码不能为空." },
        "tip.error.authcode.notcheck": { "zh": "未做身份验证." },
        "tip.error.account.notenough": { "zh": "账户余额不足." },
        "WAIT": {}, "tip.error.pay.payfee": { "zh": "支付手续费有误." },
        "tip.error.status": { "zh": "状态错误." },
        "tip.error.id.null": { "zh": "编号不能为空." },
        "tip.error.channel.id.null": { "zh": "支付通道不能为空." },
        "tip.error.pay.deposittype.null": { "zh": "存款方式不能为空." },
        "tip.error.game.login": { "zh": "登录游戏失败." },
        "tip.error.password.null": { "zh": "密码不能为空." },
        "tip.error.paypwd.resetting": { "zh": "重复设置." },
        "tip.success": { "zh": "操作成功." },
        "tip.error.imgcode": { "zh": "验证码错误." },
        "tip.error.product.notexist": { "zh": "产品不存在." },
        "tip.error.pay.withdrawtype.null": { "zh": "出款类型不能为空." },
        "tip.error.name.null": { "zh": "名称不能为空." },
        "tip.error.paypwd.null": { "zh": "提款密码不能为空." },
        "tip.error.role.isuse": { "zh": "角色已经使用." },
        "tip.error.operator.bank": { "zh": "运营商银行卡有误." },
        "tip.error.digiccy.id.null": { "zh": "数字货币ID不能为空." },
        "tip.error.user.status": { "zh": "账号状态异常，请联系客服." },
        "tip.error.order.do.status": { "zh": "订单状态有误." },
        "tip.error.withdraw.has": { "zh": "有正在处理的提现订单，请稍后." },
        "tip.error.grade.default.null": { "zh": "默认用户等级不能为空." },
        "tip.error.code.isuse": { "zh": "编码已经使用." },
        "tip.error.grade.special": { "zh": "专用等级不能设置." },
        "tip.error.unit.null": { "zh": "位置不能为空 ." },
        "tip.error.frequent": { "zh": "操作过于频繁，请稍后再试." },
        "tip.error.type.null": { "zh": "类型不能为空." },
        "tip.error.bank.account.null": { "zh": "银行账户不能为空." },
        "tip.error.bank.card.null": { "zh": "银行卡不能为空." },
        "tip.error.product.maxamount": { "zh": "超出最大购买限额." },
        "tip.error.task.exist": { "zh": "任务已经存在，不用重复提交." },
        "tip.error.grade.use": { "zh": "用户等级已经使用." },
        "tip.error.pid.null": { "zh": "上级ID不能为空." },
        "tip.error.game.istest.null": { "zh": "是否测试环境不能这空." },
        "tip.error.password.rule": { "zh": "密码必须包含大小字母和数字,8~18位." },
        "tip.error.date.range": { "zh": "日期时间范围有误." },
        "tip.error.notlogin": { "zh": "请登录." },
        "tip.error.user.notexist": { "zh": "该账号不存在." },
        "tip.error.bank.cardno.double": { "zh": "银行卡已经存在，不能重复绑定." },
        "tip.error.withdraw.betsum.not.enough": { "zh": "洗码量不足，不能提款." },
        "tip.error": { "zh": "操作异常，请稍后重试." },
        "tip.error.agent.haschild": { "zh": "有下级，处理失败." },
        "tip.error.ip.null": { "zh": "IP不能为空." },
        "tip.error.order.status": { "zh": "订单状态异常." },
        "tip.error.userexist": { "zh": "该账号已经存在." },
        "tip.error.date.range.7": { "zh": "日期范围：7天内." },
        "tip.error.payfee": { "zh": "手续费错误." },
        "tip.error.blocked.trade": { "zh": "账户处于冻结状态，不能操作." },
        "tip.error.game.queryorder": { "zh": "游戏订单查询失败." },
        "tip.error.operator.bank.null": { "zh": "运营商银行卡不能为空." },
        "tip.error.game.balance": { "zh": "获取游戏余额失败." },
        "tip.error.roletype.null": { "zh": "角色类型不能为空." },
        "tip.error.title.null": { "zh": "标题不能这空." },
        "tip.error.date.null": { "zh": "日期时间不能为空." },
        "tip.error.withdraw.minlimit": { "zh": "不能小于提款最小额度." },
        "tip.error.ip.rang": { "zh": "IP范围过大，最多255个." },
        "tip.error.game.getRecords": { "zh": "注单拉取错误." },
        "tip.error.code.rule": { "zh": "编码由字母、数字组成,3~10位." },
        "tip.error.uname.null": { "zh": "姓名不能为空." },
        "tip.error.password.lock": { "zh": "密码输入错误次数过多，账号已被锁定1小时." },
        "tip.error.game.createuser": { "zh": "创建游戏账号失败." },
        "tip.error.game.code.null": { "zh": "游戏代码不能为空." }, "tip.error.ip.limit": { "zh": "IP受限." },
        "tip.error.operator.digiccy": { "zh": "数字货币账号有误." },
        "tip.error.params": { "zh": "参数有误." },
        "tip.error.pay.amount": { "zh": "金额有误." },
        "tip.error.dataname.null": { "zh": "名称不能为空." },
        "tip.error.password": { "zh": "密码有误." },
        "tip.error.rate": { "zh": "比率设置有误，不能大于最大设置值或者小于0" },
        "tip.error.game.withdraw": { "zh": "游戏提款失败." },
        "tip.error.digiccy.account.double": { "zh": "数字货币账号已经存在，不能重复绑定." },
        "tip.error.name.isuse": { "zh": "名称已经使用." },
        "tip.error.file.upload": { "zh": "文件上传失败." },
        "tip.error.file.maxlength": { "zh": "文件过大." },
        "tip.error.qq.null": { "zh": "QQ不能为空." },
        "tip.error.agent.grade.null": { "zh": "代理等级不能为空." },
        "tip.error.agent.grade.notexist": { "zh": "代理等级不能存在." },
        "tip.error.withdraw.maxtimes": { "zh": "超出每天提款次数." },
        "tip.error.name.rule": { "zh": "账号由字母、数字组成,6~18位." },
        "tip.error.nameorpassword.null": { "zh": "输入账号或密码不能为空." },
        "tip.error.paypwd": { "zh": "提款密码错误." },
        "tip.error.profit.level": { "zh": "净利层次不能小于3层." },
        "tip.error.authcode": { "zh": "身份验证码错误." },
        "tip.error.game.rate": { "zh": "比率不能为空" },
        "tip.error.system": { "zh": "系统繁忙." },
        "tip.error.game.code": { "zh": "游戏代码错误." },
        "tip.error.withdraw.maxlimit": { "zh": "超出每次提款最大限额." }
    }
};
var NUMBER_MESSAGE_READ = 0;
// 界面框架扩展内容
var _PageFrameExpansion = {
    agreementDiv:
        '<div style="height:40px;background-color:#2A2A2A;width:100%;display:flex;justify-content:space-between;align-items:center">\
        <div id="agreementDiv_one" style="height:40px;width:50%;justify-content:center;align-items:center;display:flex">规则与条款</div>\
        <div id="agreementDiv_two" style="height:40px;width:50%;justify-content:center;align-items:center;display:flex">隐私权政策</div>\
        </div>\
        <div style="width:100%;height:2px;background-color:#000000;display:flex;justify-content:center;align-items:center">\
        <div style="width: 50%; height: 100%" id="agreementDiv_select_one"></div>\
        <div style="width: 50%; height: 100%" id="agreementDiv_select_two"></div>\
        </div>\
        <div style="height:10px"></div>\
        <div id="agreementDiv_content_content" style="overflow-x:hidden;overflow-y:hidden;width:100%">\
        <div style="display:flex;justify-content:center;align-items:center;width:100%;box-sizing:border-box">\
            <div id="agreementDiv_content_content_one" style="width:100%;display:block"></div>\
            <div id="agreementDiv_content_content_two" style="width:100%;display:none"></div>\
        </div>\
        </div>\
        <div style="height: 10px"></div>',
    commGamesDiv:
        '<div id="commGamesDiv_top_list" style="width: 100%;height: 45px;display: flex;justify-content: space-between;align-items: center;box-sizing: border-box">\
            <div id="commGamesDiv_top_0" style="width: 50%;text-align: center;font-size: 12px;color: #8C8C8C"></div>\
            <div id="commGamesDiv_top_1" style="width: 50%;text-align: center;font-size: 12px;color: #8C8C8C"></div>\
        </div>\
        <div style="width: 100%;height:10px;background: #1B1B1B;"></div>\
        <div id="commGamesDiv_content_list" style="width: 100%;overflow-x: hidden;overflow-y: auto;"></div>\
        <div id="commGamesDiv_content_bottom" style="width: 100%;height: 45px;background: #1B1B1B;display: flex;justify-content: space-between;align-items: center;box-sizing: border-box">\
            <div id="commGamesDiv_bottom_0" style="width: 21%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
            <div id="commGamesDiv_bottom_1" style="width: 37%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
            <div id="commGamesDiv_bottom_2" style="width: 37%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
            <div id="commGamesDiv_bottom_3" style="width: 37%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
        </div>',
    agentCommsDiv:
        '<div id="agentCommsDiv_content_list" style="width: 100%;overflow-x: hidden;overflow-y: auto;"></div>\
        <div id="agentCommsDiv_content_bottom" style="width: 100%;height: 45px;background: #1B1B1B;display: flex;justify-content: space-between;align-items: center;box-sizing: border-box">\
            <div id="agentCommsDiv_bottom_0" style="width: 16%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
            <div id="agentCommsDiv_bottom_1" style="width: 25%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
            <div id="agentCommsDiv_bottom_2" style="width: 28%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
            <div id="agentCommsDiv_bottom_3" style="width: 31%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
        </div>',
    costDiv:
        '<div id="costDiv_content_list" style="width: 100%;overflow-x: hidden;overflow-y: auto;"></div>\
        <div id="costDiv_content_bottom" style="width: 100%;height: 45px;background: #1B1B1B;display: flex;justify-content: space-between;align-items: center;box-sizing: border-box">\
            <div id="costDiv_bottom_0" style="width: 30%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
            <div id="costDiv_bottom_2" style="width: 40%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
            <div id="costDiv_bottom_1" style="width: 30%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
        </div>',
    gamesDiv:
        '<div id="gamesDiv_content_list" style="width: 100%;overflow-x: hidden;overflow-y: auto;"></div>\
        <div id="gamesDiv_content_bottom" style="width: 100%;height: 45px;background: #1B1B1B;display: flex;justify-content: space-between;align-items: center;box-sizing: border-box">\
            <div id="gamesDiv_bottom_0" style="width: 33%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
            <div id="gamesDiv_bottom_1" style="width: 33%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
            <div id="gamesDiv_bottom_2" style="width: 33%;text-align: center;font-size: 15px;color: #8C8C8C"></div>\
        </div>',
    leagueDetailsDiv:
        '<div id="leagueDetailsDiv_content_list" style="width: 100%;overflow-x: hidden;overflow-y: auto"></div>\
        <div id="leagueDetailsDiv_content_bottom" style="width: 100%;height: 45px;background: #1B1B1B;display: flex;justify-content: space-between;align-items: center;box-sizing: border-box">\
            <div id="leagueDetailsDiv_bottom_0" style="width: 13%;text-align: center;font-size: 14px;color: #8C8C8C"></div>\
            <div id="leagueDetailsDiv_bottom_1" style="width: 23%;text-align: center;font-size: 14px;color: #E96734"></div>\
            <div id="leagueDetailsDiv_bottom_2" style="width: 32%;text-align: center;font-size: 14px;color: #E96734"></div>\
            <div id="leagueDetailsDiv_bottom_3" style="width: 32%;text-align: center;font-weight: bold;font-size: 14px;color: #E96734"></div>\
            <div id="leagueDetailsDiv_bottom_4" style="width: 27%;text-align: center;font-size: 14px;color: #E96734"></div>\
        </div>',
    betrecordCmdDiv:
        '<div id="betrecordCmdDiv_content_select" style="width:100%;height:55px;display:flex;justify-content:center;align-items:center"><div id="betrecordCmdDiv_select_date"></div></div>\
        <div style="height:10px;width:100%"></div>\
        <div id="betrecordCmdDiv_content_list" style="width:100%;overflow-x:hidden;overflow-y:auto"></div>\
        <div id="betrecordCmdDiv_content_bottom" style="height:40px;width:100%;background-color:#cccccc;display:none;font-size:12px">\
            <div style="width: 50%;display:flex;justify-content:center;align-items:center" id="betrecordCmdDiv_validSum"></div>\
            <div style="width: 50%;display:flex;justify-content:center;align-items:center" id="betrecordCmdDiv_winorloss"></div>\
        </div>',
    betrecordIgDiv:
        '<div id="betrecordIgDiv_content_select" style="width:100%;height:55px;display:flex;justify-content:center;align-items:center"><div id="betrecordIgDiv_select_date"></div></div>\
        <div style="height:10px;width:100%"></div>\
        <div id="betrecordIgDiv_content_list" style="width:100%;overflow-x:hidden;overflow-y:auto"></div>\
        <div id="betrecordIgDiv_content_bottom" style="height:40px;width:100%;background-color:#cccccc;display:none;font-size:12px">\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordIgDiv_validSum"></div>\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordIgDiv_winorloss"></div>\
        </div>',
    betrecordJPNNDiv:
        '<div id="betrecordJPNNDiv_content_select" style="width:100%;height:55px;display:flex;justify-content:center;align-items:center"><div id="betrecordJPNNDiv_select_date"></div></div>\
        <div style="height:10px;width:100%"></div>\
        <div id="betrecordJPNNDiv_content_list" style="width:100%;overflow-x:hidden;overflow-y:auto"></div>\
        <div id="betrecordJPNNDiv_content_bottom" style="height:40px;width:100%;background-color:#cccccc;display:none;font-size:12px">\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordJPNNDiv_validSum"></div>\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordJPNNDiv_winorloss"></div>\
        </div>',
    betrecordGmDiv:
        '<div id="betrecordGmDiv_content_select" style="width:100%;height:55px;display:flex;justify-content:center;align-items:center"><div id="betrecordGmDiv_select_date"></div></div>\
        <div style="height:10px;width:100%"></div>\
        <div id="betrecordGmDiv_content_list" style="width:100%;overflow-x:hidden;overflow-y:auto"></div>\
        <div id="betrecordGmDiv_content_bottom" style="height:40px;width:100%;background-color:#cccccc;display:none;font-size:12px">\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordGmDiv_validSum"></div>\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordGmDiv_winorloss"></div>\
        </div>',
    betrecordKyDiv:
        '<div id="betrecordKyDiv_content_select" style="width:100%;height:55px;display:flex;justify-content:center;align-items:center"><div id="betrecordKyDiv_select_date"></div></div>\
        <div style="height:10px;width:100%"></div>\
        <div id="betrecordKyDiv_content_list" style="width:100%;overflow-x:hidden;overflow-y:auto"></div>\
        <div id="betrecordKyDiv_content_bottom" style="height:40px;width:100%;background-color:#cccccc;display:none;font-size:12px">\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordKyDiv_validSum"></div>\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordKyDiv_winorloss"></div>\
        </div>',
    betrecordInfoDiv:
        '<div id="betrecordInfoDiv_content_select" style="width:100%;height:55px;display:flex;justify-content:center;align-items:center"><div id="betrecordInfoDiv_select_date"></div></div>\
        <div style="height:10px;width:100%"></div>\
        <div id="betrecordInfoDiv_content_list" style="width:100%;overflow-x:hidden;overflow-y:auto"></div>\
        <div id="betrecordInfoDiv_content_bottom" style="height:40px;width:100%;background-color:#cccccc;display:none;font-size:12px">\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordInfoDiv_validSum"></div>\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordInfoDiv_winorloss"></div>\
        </div>',
    betrecordElectDiv:
        '<div id="betrecordElectDiv_content_select" style="width:100%;height:55px;display:flex;justify-content:center;align-items:center"><div id="betrecordElectDiv_select_date"></div></div>\
        <div style="height:10px;width:100%"></div>\
        <div id="betrecordElectDiv_content_list" style="width:100%;overflow-x:hidden;overflow-y:auto"></div>\
        <div id="betrecordElectDiv_content_bottom" style="height:40px;width:100%;background-color:#cccccc;display:none;font-size:12px">\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordElectDiv_validSum"></div>\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordElectDiv_winorloss"></div>\
        </div>',
    betrecordDiv:
        '<div id="betrecordDiv_content_select" style="width:100%;height:55px;display:flex;justify-content:center;align-items:center"><div id="betrecordDiv_timeSelect"></div></div>\
        <div style="height:10px;width:100%"></div>\
        <div id="betrecordDiv_content_list" style="width:100%;overflow-x:hidden;overflow-y:auto"></div>\
        <div id="betrecordDiv_stats_bottom" style="height:40px;width:100%;background-color:#cccccc;display:none;font-size:12px">\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordDiv_validSum"></div>\
            <div style="width:50%;display:flex;justify-content:center;align-items:center" id="betrecordDiv_winorloss"></div>\
        </div>',
    avatarDiv:
        '<div id="avatarDiv_content_all_headers" style="width:100%;display:flex;justify-content:flex-start;align-items:center;flex-wrap:wrap;overflow-x:hidden;overflow-y:auto"></div>\
        <div style="height:20px"></div>\
        <div id="avatarDiv_content_sure_btn">确定修改</div>\
        <div style="height:20px"></div>',
    incomeOnlineDiv:
        '<div id="incomeOnlineDiv_content_Loading" style="width: 100%;height: 100%"></div>\
        <div id="incomeOnlineDiv_content_Fed" style="width: 100%;height: auto"></div>\
        <div id="incomeOnlineDiv_content_QrCode" style="width: 100%;display: flex;justify-content: flex-start;flex-direction: column;align-items: center">\
            <div style="height: 30px"></div>\
            <div id="incomeOnlineDiv_content_QrCode_order" style="font-size: 14px;width: 80%;height: 30px;line-height: 20px;color: #cccccc"></div>\
            <div id="incomeOnlineDiv_content_QrCode_time" style="font-size: 14px;width: 80%;height: 30px;line-height: 20px;color: #cccccc"></div>\
            <div id="incomeOnlineDiv_content_QrCode_notic" style="font-size: 14px;width: 80%;height: 30px;line-height: 20px;color: #cccccc;"></div>\
            <div id="incomeOnlineDiv_content_QrCode_amount" style="width: 80%;height: 40px;line-height: 40px;font-size: 30px;color: #ff5e1b"></div>\
            <div id="incomeOnlineDiv_content_QrCode_img" style="width: 100%;display: flex;justify-content: center;align-items: center"></div>\
            <div style="height: 10px"></div>\
            <div id="incomeOnlineDiv_content_QrCode_note" style="font-size: 16px;width: 80%;height: 30px;line-height: 20px;color: #cccccc;"></div>\
        </div>\
        <iframe id="incomeOnlineDiv_content_Frame" sandbox="allow-forms allow-scripts allow-same-origin" frameborder="0" src="pay.html"\
        style="border:0px;width: 100%;height: auto"></iframe>',
    incomeOfflineDiv:
        '<div id="incomeOfflineDiv_content_load" style="width:100%;height:100px;display:flex;justify-content:center;align-items:center;box-sizing:border-box"></div>\
        <div id="incomeOfflineDiv_content_list" style="width:100%;overflow-x:hidden;overflow-y:auto"></div>',
    incomeOfflineSuccessDiv:
        '<div style="width: 90%;height: 300px;display: flex;flex-direction: column;justify-content: space-between;align-items: center">\
            <div style="height: 20px"></div>\
            <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">\
                <img src="pic/themeMain/success.png" height="80px"/>\
                <div id="incomeOfflineSuccessDiv_content_successText">存款信息提交成功</div>\
            </div>\
            <div id="incomeOfflineSuccessDiv_content_notic" style="text-align: center">存款单号为\
                <span id="incomeOfflineSuccessDiv_content_orderNO"></span><br>正等待系统处理<br>请注意查看主钱包余额变化\
            </div>\
        </div>\
        <div style="width: 90%">\
            <div id="incomeOfflineSuccessDiv_content_sure" class="PJDCommBtn">完成</div>\
            <div style="height: 20px"></div>\
        </div>',
    completeInfo:
        '<div id="completeInfo_bg" style="width:100%;height:100%;position:absolute;background:#000000;opacity:0.6"></div>\
        <div id="completeInfo_content" style="position:absolute;width:100%;height:100%;display:flex;justify-content:center;align-items:center">\
        </div>',
    fundsWindowDiv:
        '<div id="fundsWindowDiv_arrow" style="position:absolute;width:0px;height:0px;display:none;border-width:0 10px 10px;border-style:solid;border-color:transparent transparent #383838"></div>\
        <div id="fundsWindowDiv_panel" style="position:absolute;top:10px;width:60%;height:182px;border-radius:8px;background:#383838"></div>',
}
