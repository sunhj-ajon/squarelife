/**
 * Created by admin on 2016-09-26.
 */


module.exports = msgComm = function () {
    msgComm.prototype.code = {
        fail: {code: -1, msg: '系统异常'},
        success: {code: 0, msg: 'OK'},
        token_invalid: {code: 9100, msg: 'token invalid'},
        login: {code: 201, msg: 'user or pwd is error'},
        params_invalid: {code: 202, msg: '缺少参数,或者参数错误'},
        ver_code_invalid: {code: 203, msg: '验证码无效'},
        grad_demand_end: {code: 204, msg: '该单已被他人抢完'},
        sms_fail: {code: 205, msg: '短信发送失败'},
        pay_no_fail: {code: 206, msg: '不存在该支付码数据，或者该支付码已经被支付，或该单已经过期'},
        prepay_fail: {code: 207, msg: '统一下单出错'},
        apply_withdrawals_fail: {code: 208, msg: '对不起，您之前的提现申请还未处理完，无法再次提现申请，请联系客服'}
    }
    msgComm.prototype.msgResult = function (r, data) {
        return {errcode: r.code, errmsg: r.msg, data: data};
    }
};
