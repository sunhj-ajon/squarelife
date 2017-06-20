/**
 * Created by admin on 2016-10-18.
 */

'use strict';

let thunkify = require('thunkify'),
    withdrawcashData = require('../data/withdrawcashData');
let uuid = require('node-uuid');

/**
 * 获取提现申请记录
 */
router.get('/withdrawcash/list', function *() {
    try {
        var withdrawcashlist = yield thunkify(withdrawcashData.find)();
        this.body = msg.msgResult(msg.code.success, withdrawcashlist);
    } catch (e) {
        console.error('%d - /apply/withdrawals/list function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})
