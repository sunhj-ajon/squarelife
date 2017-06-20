/**
 * Created by admin on 2016-09-26.
 */

'use strict';

var crypto = require('crypto'),
    thunkify = require('thunkify');

/**
 * 根据appid和appservect生成token
 * @param appid
 * @param appserect
 */
router.get('/authenticate/:appid/:appserect', function *(next) {
    try {
        let appid = this.params.appid;
        let appserect = this.params.appserect;
        if (appid && appserect) {
            var token = yield thunkify(rediscomm.get)('api_token');
            if (token) {
                this.body = msg.msgResult(msg.code.success, {'token': token});
                //console.info('%d - getToken from redis ,token Value is :' + token, new Date());
            } else {
                var str = (new Date()).valueOf().toString() + appid + appserect + 'syjyhj901%!*d';
                var md5sum = crypto.createHash('md5').update(str);
                str = md5sum.digest('base64').replace(/\//g, '');

                //console.info('%d - getToken from md5 ,token Value is :' + str, new Date());
                if (yield  thunkify(rediscomm.set)('api_token', str, 7200)) {
                    this.body = msg.msgResult(msg.code.success, {'token': str});
                }
                else {
                    this.body = msg.msgResult(msg.code.fail, {});
                }
            }
        }
        else {
            this.body = msg.msgResult(msg.code.fail, {});
        }
    } catch (e) {
        console.error('%d - authenticate function is error,err-msg is:' + e);
    }
});
