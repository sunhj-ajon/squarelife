/**
 * Created by admin on 2016-10-18.
 */

'use strict';

let thunkify = require('thunkify'),
    applywithdrawalsData = require('../data/applywithdrawalsData');
let uuid = require('node-uuid');

/**
 * 获取提现申请记录
 */
router.get('/apply/withdrawals/list', function *() {
    try {
        var applywithdrawalslist = yield thunkify(applywithdrawalsData.find)();
        this.body = msg.msgResult(msg.code.success, applywithdrawalslist);
    } catch (e) {
        console.error('%d - /apply/withdrawals/list function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 支付提现
 */
router.post('/apply/withdrawals/pay', koaBody, function *() {
    try {
        if (!(yield thunkify(applywithdrawalsData.pay)(this.request.body))) {
            this.body = msg.msgResult(msg.code.success, 'true');
        } else {
            this.body = msg.msgResult(msg.code.fail, 'false');
        }
    } catch (e) {
        console.error('%d - /apply/withdrawals/pay function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 申请提现  for openapi
 */
router.post('/openapi/apply/withdrawals/add', koaBody, function *() {
    try {
        let content = this.request.body;
        content.innerid = uuid.v4();
        content.createdtime = new Date();
        content.channel = 1;
        content.state = 1;

        //必要参数判断是否为空
        if (!content.ver_code || !content.openid || !content.mobile || parseFloat(content.money) <= 0) {
            return this.body = msg.msgResult(msg.code.params_invalid, {});
        }

        var ver_code = yield  thunkify(rediscomm.get)(content.mobile + '_ver_code');
        //判断验证码是否一致
        if (ver_code != content.ver_code) {
            return this.body = msg.msgResult(msg.code.ver_code_invalid, {});
        }

        let ishavingapply = yield  thunkify(applywithdrawalsData.openapi_find_one)(content);
        if (ishavingapply > 0) {        //有之前申请体现的数据，并且该数据未处理，则不能再次申请提现
            this.body = msg.msgResult(msg.code.apply_withdrawals_fail, false);
        }
        else {
            if (!(yield thunkify(applywithdrawalsData.openapi_add)(content))) {
                this.body = msg.msgResult(msg.code.success, true);
            }
            else {
                this.body = msg.msgResult(msg.code.fail, false);
            }
        }
    } catch (e) {
        console.error('%d - /openapi/apply/withdrawals/add function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})
