/**
 * Created by admin on 2016-11-03.
 */


'use strict';
var thunkify = require('thunkify');
let request = require("request");
let uuid = require('node-uuid');
var crypto = require('crypto');

router.get('/openapi/sms/send/:mobile', function *() {
    try {
        var ver_code = Math.floor(Math.random() * 9000) + 1000;
        var mobile = this.params.mobile;

        if (yield  thunkify(rediscomm.set)(mobile + "_ver_code", ver_code, 300)) {

            var paramString = '{"code":"' + ver_code + '","product":""}';
            var signName = '方碑联帮';
            var timestamp = (new Date().toISOString()).split('.')[0] + "Z";
            var signatureNonce = uuid.v4();
            var params = 'AccessKeyId=LTAIYWgLGuo3QiNe' +
                '&Action=SingleSendSms' +
                '&Format=JSON' +
                '&ParamString=' + paramString +
                '&RecNum=' + mobile +
                '&SignName=' + signName +
                '&SignatureMethod=HMAC-SHA1' +
                '&SignatureNonce=' + signatureNonce +
                '&SignatureVersion=1.0' +
                '&TemplateCode=SMS_25465143' +
                '&Timestamp=' + timestamp +
                '&Version=2016-09-27';

            var encode_params = 'AccessKeyId=LTAIYWgLGuo3QiNe' +
                '&Action=SingleSendSms' +
                '&Format=JSON' +
                '&ParamString=' + encodeURIComponent(paramString) +
                '&RecNum=' + mobile +
                '&SignName=' + encodeURIComponent(signName) +
                '&SignatureMethod=HMAC-SHA1' +
                '&SignatureNonce=' + signatureNonce +
                '&SignatureVersion=1.0' +
                '&TemplateCode=SMS_25465143' +
                '&Timestamp=' + encodeURIComponent(timestamp) +
                '&Version=2016-09-27';

            var hmac_sh1_txt = encodeURIComponent(crypto.createHmac('sha1', 'PMfFh4NdWltndKaP8NTUCe23iyOLbb&').update('POST&%2F&' + encodeURIComponent(encode_params)).digest().toString('base64'));

            var url = 'https://sms.aliyuncs.com/';
            var options = {
                url: url,
                method: "post",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: 'Signature=' + hmac_sh1_txt + "&" + params
            }

            var result = yield thunkify(requesthttp)(options);  //{Code: ''};
            console.log('%d - /sms/send/ mobile :' + mobile + "[" + ver_code + "]" + " result:" + JSON.stringify(result), new Date());
            if (!result.Code) {
                this.body = msg.msgResult(msg.code.success, {});
            } else {
                this.body = msg.msgResult(msg.code.sms_fail, {msg: result.Message, code: result.Code});
            }
        }
        else {
            this.body = msg.msgResult(msg.code.fail, {});
        }
    } catch (e) {
        console.error('%d - /sms/send/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})


var requesthttp = function (options, callback) {
    request(options, function (e, r, body) {
        if (!e) {
            try {
                body = JSON.parse(body);
                if (body.errcode) {
                    e = null;
                }
            }
            catch (error) {
                e = error;
            }
        }
        callback && callback(e, body);
    });
}