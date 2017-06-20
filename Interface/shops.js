/**
 * Created by admin on 2016-10-18.
 */

'use strict';

let thunkify = require('thunkify'),
    shopsData = require('../data/shopsData');


/**
 * 管理端店铺列表获取
 */
router.get('/shops/list/:pageindex', function *() {
    try {
        var shoplist = yield thunkify(shopsData.find)(this.params.pageindex);
        this.body = msg.msgResult(msg.code.success, shoplist);
    } catch (e) {
        console.error('%d - /shops/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 获取某一个店铺的数据
 */
router.get('/shops/one/:id', function *() {
    try {
        var shoplist = yield thunkify(shopsData.one)(this.params.id);
        this.body = msg.msgResult(msg.code.success, shoplist[0]);
    } catch (e) {
        console.error('%d - /shops/one/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 删除某一个店铺
 */
router.get('/shops/del/:id', function *() {
    try {
        if (!(yield thunkify(shopsData.del)(this.params.id))) {
            this.body = msg.msgResult(msg.code.success, {'data': true});
        }
        else {
            this.body = msg.msgResult(msg.code.fail, {'data': false});
        }
    } catch (e) {
        console.error('%d - /shops/one/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 编辑某一个店铺
 */
router.post('/shops/edit', koaBody, function *() {
    try {
        if (!(yield thunkify(shopsData.add)(this.request.body))) {
            this.body = msg.msgResult(msg.code.success, {'data': true});
        }
        else {
            this.body = msg.msgResult(msg.code.fail, {'data': false});
        }
    } catch (e) {
        console.error('%d - /shops/edit/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 获取店铺列表 for openapi
 */
router.get('/openapi/shops/list/:pageindex', function *() {
    try {
        var shoplist = yield thunkify(shopsData.openapi_find)(this.params.pageindex);
        this.body = msg.msgResult(msg.code.success, shoplist);
    } catch (e) {
        console.error('%d - /openapi/shops/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 获取推荐店铺列表 for openapi
 */
router.get('/openapi/shops/isrecommend/list', function *() {
    try {
        var shoplist = yield thunkify(shopsData.openapi_findbyrecommend)();
        this.body = msg.msgResult(msg.code.success, shoplist);
    } catch (e) {
        console.error('%d - /openapi/shops/isrecommend/list function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})