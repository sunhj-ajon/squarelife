/**
 * Created by admin on 2016-11-03.
 */


'use strict';
var thunkify = require('thunkify'),
    uuid = require('node-uuid'),
    demandData = require('../data/demandData'),
    goodsData = require('../data/goodsData'),
    shopsData = require('../data/shopsData'),
    co = require('co'),
    demandRelationData = require('../data/demandRelationData');

/**
 * 管理端会员列表获取
 */
router.get('/demand/list/:pageindex', function *() {
    try {
        var demandlist = yield thunkify(demandData.find)(this.params.pageindex);
        this.body = msg.msgResult(msg.code.success, demandlist);
    } catch (e) {
        console.error('%d - /demand/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * webapp端新增一个需求单
 * 参数格式：
 * {
 *   "openid":"提交需求单的用户openid",
 *   "mobile":"手机号码",
 *   "ver_code":"验证码",
 *   "deliver_addr":"用户地址",
 *   "remark":"用户备注",
 *   "shopid":"执行商家ID",
 *   "shopname":"执行商家名称",
 *   "exec_addr":"执行商家地址",
 *   "base_money":"基础费用（商品费用）",
 *   "service_money":"服务费",
 *   "longitude":"当前用户的经纬度，JSON值={L:12.1231234,W:141.1521}",
 *   "goods":[
 *   {"goods_id":"商品ID","count":"商品数量","name":"商品名称"},
 *   {"goods_id":"商品ID","count":"商品数量","name":"商品名称"}
 *   ]
 *  }
 */
router.post('/openapi/demand/add', koaBody, function *() {
    try {
        var content = this.request.body;
        //必要参数判断是否为空
        if (!content.ver_code || !content.openid || !content.mobile || parseFloat(content.service_money) <= 0) {
            return this.body = msg.msgResult(msg.code.params_invalid, {});
        }
        var ver_code = yield  thunkify(rediscomm.get)(content.mobile + '_ver_code');
        //判断验证码是否一致
        if (ver_code != content.ver_code) {
            return this.body = msg.msgResult(msg.code.ver_code_invalid, {});
        }
        content.innerid = uuid.v4();
        content.no = numCode.getCode("A");
        content.title = "";

        var goodsidlist = "";
        content.goods.forEach(function (item) {
            item.demand_id = content.innerid;
            goodsidlist += item.goods_id + ","
        });

        let goodlist = yield thunkify(goodsData.findbygoodidlist)(content.shopid, goodsidlist);

        let goods_money = 0;
        let title = ' ';
        goodlist.forEach(function (_item) {
            content.goods.forEach(function (item) {
                if (_item.id == item.goods_id) {
                    title += _item.name + "×" + item.count + " ";
                    goods_money += parseInt(item.count) * parseFloat(_item.rebate_price);
                }
            })
        })
        content.title = content.shopname + title;
        content.base_money = goods_money;

        if (!(yield  thunkify(demandData.openapi_add)(content))) {
            this.body = msg.msgResult(msg.code.success, {'data': true});
        }
        else {
            this.body = msg.msgResult(msg.code.fail, {'data': false});
        }

    } catch (e) {
        console.error('%d - /openapi/demand/add function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * webapp端获取需求单列表
 * 如果url参数中带有openid，则获取当前用户自己的需求单列表
 * 参数形式为 /openapi/demand/list/:pageindex?openid=xxxx
 */
router.get('/openapi/demand/list/:pageindex', function *() {
    try {
        var openid = this.query.openid;
        var demandlist = yield thunkify(demandData.openapi_list)(this.params.pageindex, openid);
        if (demandlist.length > 0) {

            var demandlist_innerid = '';
            demandlist.forEach(function (item) {
                demandlist_innerid += "'" + item.dinnerid + "',";
            })
            demandlist_innerid = demandlist_innerid.substr(0, demandlist_innerid.lastIndexOf(','));

            var demandRelationlist = yield thunkify(demandRelationData.openapi_list)(demandlist_innerid);

            demandlist.forEach(function (item) {
                item.goodslist = [];

                demandRelationlist.forEach(function (ritem) {
                    if (item.dinnerid == ritem.demand_id) {
                        item.goodslist.push(ritem);
                    }
                })
            })

            this.body = msg.msgResult(msg.code.success, {'list': demandlist});
        } else {
            this.body = msg.msgResult(msg.code.success, {'list': ''});
        }
    } catch (e) {
        console.error('%d - /openapi/demand/list function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * webapp端根据需求单ID获取需求单及抢单详情
 */
router.get('/openapi/demand/one/:demandid', function *() {
    try {
        var grad_id = this.query.grabid;
        var demandone = yield thunkify(demandData.openapi_findall_by_demandid)(this.params.demandid, grad_id);
        if (demandone) {
            var demandRelationlist = yield thunkify(demandRelationData.openapi_list)("'" + demandone.dinnerid + "'");
            demandone.goodslist = demandRelationlist;
            this.body = msg.msgResult(msg.code.success, demandone);
        } else {
            this.body = msg.msgResult(msg.code.success, {'list': ''});
        }
    } catch (e) {
        console.error('%d - /openapi/demand/list function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})