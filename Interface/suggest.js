/**
 * Created by admin on 2016-09-28.
 */

'use strict';

let thunkify = require('thunkify'),
    crypto = require('crypto'),
    suggestData = require('../data/suggestData');

/**
 * 管理端会员列表获取
 */
router.get('/suggest/list/:pageindex', function *() {
    try {
        var suggestlist = yield thunkify(suggestData.find)(this.params.pageindex);
        this.body = msg.msgResult(msg.code.success, suggestlist);
    } catch (e) {
        console.error('%d - /suggest/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * webapp端 新增意见
 */
router.post('/openapi/suggest/add', koaBody, function *() {
    try {
        if (!(yield thunkify(suggestData.openapi_add)(this.request.body))) {
            this.body = msg.msgResult(msg.code.success, '');
        } else {
            this.body = msg.msgResult(msg.code.fail, '');
        }
    } catch (e) {
        console.error('%d - /openapi/suggest/add function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})