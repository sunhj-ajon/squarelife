/**
 * Created by admin on 2016-10-18.
 */

'use strict';

let thunkify = require('thunkify'),
    adData = require('../data/adData');

/**
 * 获取滚动图片列表
 */
router.get('/ad/list', function *() {
    try {
        var adlist = yield thunkify(adData.find)();
        this.body = msg.msgResult(msg.code.success, adlist);
    } catch (e) {
        console.error('%d - /ad/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 编辑滚动图片
 */
router.post('/ad/edit', koaBody, function *() {
    try {
        if (!(yield thunkify(adData.add)(this.request.body.ad))) {
            this.body = msg.msgResult(msg.code.success, {'data': true});
        }
        else {
            this.body = msg.msgResult(msg.code.success, {'data': false});
        }
    } catch (e) {
        console.error('%d - /ad/edit/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 获取滚动图片列表 for openapi
 */
router.get('/openapi/ad/list', function *() {
    try {
        var adlist = yield thunkify(adData.find)();
        this.body = msg.msgResult(msg.code.success, adlist);
    } catch (e) {
        console.error('%d - /openapi/ad/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})
