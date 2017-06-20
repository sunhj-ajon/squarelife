/**
 * Created by admin on 2016-09-28.
 */

'use strict';

let thunkify = require('thunkify'),
    crypto = require('crypto'),
    userData = require('../data/userData');


/**
 * 用户登录
 */
router.get('/login/:user/:pwd', function *() {
    try {
        var pwd = crypto.createHash('md5').update(this.params.pwd).digest('hex');
        var userlist = yield thunkify(userData.login)({user: this.params.user, pwd: pwd});
        if (userlist.length > 0) {
            var str = (new Date()).valueOf().toString() + this.params.user + this.params.pwd + 'syjyhj901%!*d';
            str = crypto.createHash('md5').update(str).digest('hex');
            if (yield  thunkify(rediscomm.set)('sessionid', str, 1800)) {
                this.body = msg.msgResult(msg.code.success, {'data': userlist, 'sessionid': str});
            }
            else {
                this.body = msg.msgResult(msg.code.login, '');
            }
        } else {
            this.body = msg.msgResult(msg.code.login, '');
        }
    } catch (e) {
        console.error('%d - /user/login/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 管理端会员列表获取
 */
router.get('/user/list/:pageindex', function *() {
    try {
        var userlist = yield thunkify(userData.find)(this.params.pageindex);
        this.body = msg.msgResult(msg.code.success, userlist);
    } catch (e) {
        console.error('%d - /user/list/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 获取某一个用户的数据
 */
router.get('/user/one/:id', function *() {
    try {
        var userlist = yield thunkify(userData.one)(this.params.id);
        this.body = msg.msgResult(msg.code.success, userlist);
    } catch (e) {
        console.error('%d - /user/one/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 删除某一个用户
 */
router.get('/user/del/:id', function *() {
    try {
        if (!(yield thunkify(userData.del)(this.params.id))) {
            this.body = msg.msgResult(msg.code.success, {'data': true});
        }
        else {
            this.body = msg.msgResult(msg.code.success, {'data': false});
        }
    } catch (e) {
        console.error('%d - /user/one/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 编辑某一个用户
 */
router.post('/user/edit', koaBody, function *() {
    try {
        var content = this.request.body;
        content.password = crypto.createHash('md5').update(content.password).digest('hex');
        if (!(yield thunkify(userData.add)(content))) {
            this.body = msg.msgResult(msg.code.success, {'data': true});
        }
        else {
            this.body = msg.msgResult(msg.code.success, {'data': false});
        }
    } catch (e) {
        console.error('%d - /user/edit/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})