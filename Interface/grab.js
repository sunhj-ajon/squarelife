/**
 * Created by admin on 2016-09-28.
 */

'use strict';

let thunkify = require('thunkify'),
    uuid = require('node-uuid'),
    grabData = require('../data/grabData'),
    demandData = require('../data/demandData'),
    sunhj = require('sunhj-js'),
    _template_lib = require('../lib/template_lib'),
    demandRelationData = require('../data/demandRelationData'),
    commissionData = require('../data/commissionData');

let wx = new sunhj.wx();
let template_lib = new _template_lib();


/**
 * 管理端抢单列表获取
 */
router.get('/grad/list/:pageindex', function *() {
    try {
        var gradlist = yield thunkify(grabData.find)(this.params.pageindex);
        this.body = msg.msgResult(msg.code.success, gradlist);
    } catch (e) {
        console.error('%d - /grad/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * webapp端 抢单（需要队列处理）
 * 参数个数：
 * {
 *      'openid':'抢单人openid',
 *      'demand_id':'需求单ID',
 *      'base_money':'商品费用',
 *      'service_money':'服务费',
 *      'remark':'备注'
 * }
 */
router.post('/openapi/grab/add', koaBody, function *() {
    try {
        var content = this.request.body;
        if (!content.openid || !content.demand_id || !content.service_money) {
            return this.body = msg.msgResult(msg.code.params_invalid, {});
        }
        content.demand_id = content.demand_id.substring(0, 36);
        var v4 = uuid.v4();
        content.innerid = v4;
        var result = yield thunkify(grabData.openapi_add)(content);
        if (result[0].t_error == 0) {
            this.body = msg.msgResult(msg.code.success, content.demand_id + v4);
        } else {
            this.body = msg.msgResult(msg.code.grad_demand_end, '');
        }
    } catch (e) {
        console.error('%d - /openapi/grab/add/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * webapp端 确认价格
 * 参数个数：
 * {
 *      'innerid':'抢单后的数据innerid,抢单成功后会返回',
 *      'base_money':'协商后的，商品费用',
 *      'service_money':'协商后的，服务费用',
 *      'remark':'备注'
 * }
 *
 * 抢单状态表增加：5的状态，表示确认价格后待支付状态
 */
router.post('/openapi/grab/confirm/price', koaBody, function *() {
    try {
        var content = this.request.body;
        if (!content.innerid || !content.service_money) {
            return this.body = msg.msgResult(msg.code.params_invalid, {});
        }
        var result = yield thunkify(grabData.openapi_confirm_price)(content);
        if (result) {
            let demandone = yield thunkify(demandData.one)(content.innerid);

            //新增平台分得的佣金
            commissionData.add({
                money: parseFloat(content.service_money) * 0.14,
                demand_id: demandone.innerid,
                grad_id: content.innerid,
                createdtime: new Date(),
                state: 0
            }, function (err) {
                if (err) {
                    console.error('%d - [' + content.innerid + '] commissionData function result:' + err, new Date());
                } else {
                    console.log('%d - [' + content.innerid + '] commissionData function result:' + err, new Date());
                }
            });
            let url = 'http://www.fonbest.com/wechat_web/paysuccess.html?payno=' + demandone.payno;
            let title = demandone.title.length > 20 ? demandone.title.substring(0, 20) + " ..." : demandone.title;
            let money = (parseFloat(demandone.base_money) + parseFloat(demandone.service_money)) + "元";
            let date = demandone.createdtime;
            let remark = '双方已经确认价格，请点击进行支付';

            yield  wx.sendTemplateMsg(template_lib.getPayTemplate(demandone.openid, url, "支付提醒", title, money, date, remark));

            this.body = msg.msgResult(msg.code.success, {});
        } else {
            this.body = msg.msgResult(msg.code.fail, {'data': false});
        }
    } catch (e) {
        console.error('%d - /openapi/grab/confirm/price/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * webapp端 取消订单
 * 参数个数：
 * {
 *      'innerid':'抢单后的数据innerid,抢单成功后会返回',
 *      'demand_id':'需求单ID',
 *      'remark':'备注'
 * }
 */
router.post('/openapi/grab/cancel', koaBody, function *() {
    try {
        var content = this.request.body;
        if (!content.innerid || !content.demand_id) {
            return this.body = msg.msgResult(msg.code.params_invalid, {});
        }
        var result = yield thunkify(grabData.openapi_cancel)(content);
        if (result[0].t_error == 0) {
            this.body = msg.msgResult(msg.code.success, {});
        } else {
            this.body = msg.msgResult(msg.code.fail, {'data': false});
        }

    } catch (e) {
        console.error('%d - /openapi/grab/cancel/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * webapp端获取抢单列表
 * 如果url参数中带有openid，则获取当前用户自己的抢单列表
 * 参数形式为 /openapi/demand/list/:pageindex?openid=xxxx
 */
router.get('/openapi/grad/list/:pageindex/:openid', function *() {
    try {
        var openid = this.params.openid;
        var grablist = yield thunkify(grabData.openapi_list)(this.params.pageindex, openid);
        if (grablist.length > 0) {

            var demandlist_innerid = '';
            grablist.forEach(function (item) {
                demandlist_innerid += "'" + item.dinnerid + "',";
            })
            demandlist_innerid = demandlist_innerid.substr(0, demandlist_innerid.lastIndexOf(','));

            var demandRelationlist = yield thunkify(demandRelationData.openapi_list)(demandlist_innerid);

            grablist.forEach(function (item) {
                item.goodslist = [];
                demandRelationlist.forEach(function (ritem) {
                    if (item.dinnerid == ritem.demand_id) {
                        item.goodslist.push(ritem);
                    }
                })
            })
            this.body = msg.msgResult(msg.code.success, {'list': grablist});
        } else {
            this.body = msg.msgResult(msg.code.success, {'list': ''});
        }
    } catch (e) {
        console.error('%d - /openapi/demand/list function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * webapp端根据支付码获取需求单及抢单详情
 */
router.get('/openapi/grad/payno/one/:payno', function *() {
    try {
        var grablist = yield thunkify(grabData.openapi_findall_by_payno)(this.params.payno);
        if (grablist) {
            var demandRelationlist = yield thunkify(demandRelationData.openapi_list)("'" + grablist.dinnerid + "'");
            grablist.goodslist = demandRelationlist;
            this.body = msg.msgResult(msg.code.success, grablist);
        } else {
            this.body = msg.msgResult(msg.code.success, {'list': ''});
        }
    } catch (e) {
        console.error('%d - /openapi/demand/list function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * webapp端 送单完成后，更新状态
 * 参数个数：
 * {
 *      'innerid':'抢单表的数据innerid',
 * }
 */
router.post('/openapi/grab/state/update', koaBody, function *() {
    try {
        var content = this.request.body;
        if (!content.innerid) {
            return this.body = msg.msgResult(msg.code.params_invalid, {});
        }
        var result = yield thunkify(grabData.openapi_update_grad_state)(content);
        if (result[0].t_error == 0) {
            this.body = msg.msgResult(msg.code.success, {});
        } else {
            this.body = msg.msgResult(msg.code.fail, {'data': false});
        }

    } catch (e) {
        console.error('%d - /openapi/grab/state/update function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})