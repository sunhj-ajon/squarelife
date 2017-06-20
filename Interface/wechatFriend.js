/**
 * Created by admin on 2016-10-11.
 */

'use strict';

let thunkify = require('thunkify'),
    wechatFriendData = require('../data/wechatFriendData');

/**
 * 管理端会员列表获取
 */
router.get('/wechat/friend/list/:pageindex', function *() {
    try {
        var wechatFriend = yield thunkify(wechatFriendData.find)(this.query.nickname, this.params.pageindex);
        this.body = msg.msgResult(msg.code.success, wechatFriend);
    } catch (e) {
        console.error('%d - /wechat/friend/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 根据openid获取粉丝资料
 */
router.get('/openapi/wechat/friend/one/:openid', function *() {
    try {
        var wechatFriend = yield thunkify(wechatFriendData.opendapi_findone)(this.params.openid);
        this.body = msg.msgResult(msg.code.success, wechatFriend);
    } catch (e) {
        console.error('%d - /wechat/friend/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})