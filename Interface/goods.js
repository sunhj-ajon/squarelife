/**
 * Created by admin on 2016-10-26.
 */

'use strict';

let thunkify = require('thunkify'),
    goodsData = require('../data/goodsData');


/**
 * 管理端根据店铺ID获取商品列表
 * 路由参数：
 *  1、pageindex 页码
 *  2、shopid 店铺ID
 * URL参数：
 *  1、name  商品名称
 */
router.get('/goods/list/:pageindex/:shopid', function *() {
    try {
        var goodslist = yield thunkify(goodsData.find)(this.params.pageindex, this.params.shopid);
        this.body = msg.msgResult(msg.code.success, goodslist);
    } catch (e) {
        console.error('%d - /goods/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 获取某一个商品的数据
 */
router.get('/goods/one/:id', function *() {
    try {
        var goodslist = yield thunkify(goodsData.one)(this.params.id);
        this.body = msg.msgResult(msg.code.success, goodslist[0]);
    } catch (e) {
        console.error('%d - /goods/one/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 删除某一个商品
 */
router.get('/goods/del/:id', function *() {
    try {
        if (!(yield thunkify(goodsData.del)(this.params.id))) {
            this.body = msg.msgResult(msg.code.success, {'data': true});
        }
        else {
            this.body = msg.msgResult(msg.code.success, {'data': false});
        }
    } catch (e) {
        console.error('%d - /goods/del/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 编辑某一个商品
 */
router.post('/goods/edit', koaBody, function *() {
    try {
        if (!(yield thunkify(goodsData.add)(this.request.body))) {
            this.body = msg.msgResult(msg.code.success, {'data': true});
        }
        else {
            this.body = msg.msgResult(msg.code.success, {'data': false});
        }
    } catch (e) {
        console.error('%d - /goods/edit/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 根据店铺ID获取商品列表 for openapi
 */
router.get('/openapi/goods/list/:pageindex/:shopid', function *() {
    try {
        var goodslist = yield thunkify(goodsData.openapi_find)(this.params.shopid, this.params.pageindex);
        this.body = msg.msgResult(msg.code.success, goodslist);
    } catch (e) {
        console.error('%d - /openapi/goods/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 根据商品名称获取商品列表 for openapi
 */
router.get('/openapi/goods/search/:name', function *() {
    try {
        var goodslist = yield thunkify(goodsData.openapi_search)(this.params.name);
        this.body = msg.msgResult(msg.code.success, goodslist);
    } catch (e) {
        console.error('%d - /openapi/goods/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})