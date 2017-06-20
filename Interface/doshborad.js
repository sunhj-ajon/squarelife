/**
 * Created by admin on 2016-10-18.
 */

'use strict';

let thunkify = require('thunkify'),
    doshboradData = require('../data/doshboradData');

/**
 * 获取数量统计
 */
router.get('/doshborad/count', function *() {
    try {
        let wechat_friend_count = yield thunkify(doshboradData.find_wechat_friend_count)();
        let demand_count = yield thunkify(doshboradData.find_demand_count)();
        let grad_count = yield thunkify(doshboradData.find_grad_count)();
        let money_count = yield thunkify(doshboradData.find_money_count)();

        this.body = msg.msgResult(msg.code.success, {
            "wechat_friend_count": wechat_friend_count,
            "demand_count": demand_count, "grad_count": grad_count,
            "money_count": money_count
        });
    } catch (e) {
        console.error('%d - /doshborad/count function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 获取需求单每天的统计
 */
router.get('/doshborad/demand/day/list', function *() {
    try {
        let demand_day_list = yield thunkify(doshboradData.find_demand_day_list)();

        this.body = msg.msgResult(msg.code.success, demand_day_list);
    } catch (e) {
        console.error('%d - /doshborad/demand/day/list function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 获取抢单每天的统计
 */
router.get('/doshborad/grad/day/list', function *() {
    try {
        let grad_day_list = yield thunkify(doshboradData.find_grad_day_list)();

        this.body = msg.msgResult(msg.code.success, grad_day_list);
    } catch (e) {
        console.error('%d - /doshborad/grad/day/list function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 获取佣金每天的统计
 */
router.get('/doshborad/commission/day/list', function *() {
    try {
        let commission_day_list = yield thunkify(doshboradData.find_commission_day_list)();

        this.body = msg.msgResult(msg.code.success, commission_day_list);
    } catch (e) {
        console.error('%d - /doshborad/commission/day/list function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})