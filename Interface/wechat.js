/**
 * Created by admin on 2016-11-10.
 */

'use strict';

let thunkify = require('thunkify'),
    crypto = require('crypto'),
    sunhj = require('sunhj-js'),
    co = require('co'),
    uuid = require('node-uuid'),
    wechatFriendData = require('../data/wechatFriendData'),
    grabData = require('../data/grabData'),
    _template_lib = require('../lib/template_lib'),
    xml2json = require('xml2js');
let xml2js = xml2json.parseString;
var js2xml = new xml2json.Builder();
let wx = new sunhj.wx();

let template_lib = new _template_lib();

/**
 * 注册jssdk签名
 */
router.get('/openapi/wechat/jssdk', function *() {
    try {
        var jssdk_config = yield wx.registerJsSdk(this.query.url);
        this.body = msg.msgResult(msg.code.success, jssdk_config);
    } catch (e) {
        console.error('%d - /openapi/wechat/jssdk/ function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 注册微信支付jssdk签名
 * @param payno 支付md5码，在'确认价格'时生成一个md5的支付码，并通过此md5码获取支付的信息
 */
router.get('/openapi/wechat/pay/jssdk/:payno', function *() {
    try {
        var payno = this.params.payno;
        let grabone = yield thunkify(grabData.one_by_payno)(payno);
        if (grabone && grabone.length > 0) {
            var nonce_str = uuid.v4().replace(/-/g, '');

            var jsApiParam = {};
            jsApiParam.appid = conf.wechat.appid;
            jsApiParam.attach = payno;
            jsApiParam.body = "需求单支付";
            jsApiParam.mch_id = "1401910902";
            jsApiParam.nonce_str = nonce_str;
            jsApiParam.notify_url = "http://www.fonbest.com:3000/wechat/pay.action";
            jsApiParam.openid = grabone[0].dopenid;
            jsApiParam.out_trade_no = grabone[0].no + parseInt(Math.random() * 10000);
            jsApiParam.spbill_create_ip = "118.178.224.171";
            jsApiParam.total_fee = 1; //parseInt((grabone[0].service_money + grabone[0].base_money) * 100);
            jsApiParam.trade_type = "JSAPI";

            let payparams = yield wx.registerPayJsSdk(jsApiParam);
            this.body = msg.msgResult(msg.code.success, payparams);
        } else {
            this.body = msg.msgResult(msg.code.pay_no_fail, '');
        }
    } catch (e) {
        console.error('%d - /openapi/wechat/pay/jssdk function is error,err-msg is:' + e, new Date());
        this.body = msg.msgResult(msg.code.fail, {'err': e});
    }
})

/**
 * 微信注册
 */
router.get('/wechat', wx.register, function *() {
    try {
        this.body = this.signature_token;
    } catch (e) {
        console.error('%d - /wechat/register/ function is error,err-msg is:' + e, new Date());
        this.body = false;
    }
});

/**
 * 接受微信推送的信息
 */
router.post('/wechat', function *(next) {
    var formData = "";
    let xml_result = "";
    this.req.on('data', function (data) {
        formData += data;
    })

    this.req.on('end', function () {
        co(function *() {
            xml_result = yield thunkify(xml2js)(formData, {explicitArray: false, ignoreAttrs: true});

            yield buessionAnysc(xml_result);
        }).then(function () {

        }).catch(function (e) {
            console.error('%d - post /wechat function is error,err-msg is:' + e, new Date());
        })
    })

    this.body = "";
})

/**
 * 网页oauth重定向
 */
router.get('/wx/redircto', wx.getOpenidByCode, function *() {
    var action = this.query.f;
    if (action == "1") {
        this.redirect("http://www.fonbest.com/wechat_web/index.html?openid=" + this.openid);
    } else if (action == "2") {
        this.redirect("http://www.fonbest.com/wechat_web/index.html?openid=" + this.openid + "#!/rush");
    } else if (action == "3") {
        this.redirect("http://www.fonbest.com/wechat_web/index.html?openid=" + this.openid + "#!/my_index");
    }
})

/**
 * 微信支付结果处理
 */
router.post('/wechat/pay.action', function *() {
    let formData = "";
    this.req.on('data', function (data) {
        formData += data;
    })

    this.req.on('end', function () {
        co(function *() {
            let xml_result = yield thunkify(xml2js)(formData, {explicitArray: false, ignoreAttrs: true});
            var attach = xml_result.xml.attach;
            if (xml_result.xml.result_code == "SUCCESS") {
                yield thunkify(grabData.update_pay_state)(attach, 1);

                //向抢单人发送支付成功的模板消息
                let url = 'http://www.fonbest.com/wechat_web/paysuccess.html?payno=' + attach;
                let grabone = yield thunkify(grabData.openapi_findall_by_payno)(attach);
                let mydate = new Date();
                let _date = mydate.getFullYear().toString() + "年" + (mydate.getMonth() + 1).toString() + "月" + mydate.getDate().toString() + "日";
                let money = (parseFloat(grabone.gbase_money) + parseFloat(grabone.gservice_money)) + "元";
                let remark = '点击查看详情';
                yield  wx.sendTemplateMsg(template_lib.noticePaySuccessTemplate(grabone.gopenid, url, "您好，对方已经支付成功，请尽快送单", _date, money, remark));
            }
        }).catch(function (e) {
            console.error('%d - post /wechat function is error,err-msg is:' + e, new Date());
        })
    })

    this.body = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
})

/**
 * 微信消息处理
 * @param xml_result
 */
var buessionAnysc = function *(xml_result) {
    var msgtype = xml_result.xml.MsgType;
    var openid = xml_result.xml.FromUserName;
    var origid = xml_result.xml.ToUserName;

    switch (msgtype) {
        case "event":
            let event_type = xml_result.xml.Event;
            if (event_type == "subscribe") {
                let userinfo = yield wx.getUserInfo(openid);

                if (userinfo && userinfo.nickname) {
                    let userJson = {
                        origid: origid, nickname: userinfo.nickname, photo: userinfo.headimgurl, openid: openid,
                        area: userinfo.country + " " + userinfo.province + " " + userinfo.city,
                        sex: userinfo.sex,
                        state: 1,
                        unionid: userinfo.unionid,
                        createtime: new Date(),
                        updatetime: new Date(),
                        tel: '',
                        money: 0
                    };
                    wechatFriendData.subscribe(userJson, function (err) {
                        if (err) {
                            console.info('%d - post /wechat  subscribe userinfo result:[' + openid + "]" + err, new Date());
                        }
                    });

                    let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaff8b9e997fad6fe&redirect_uri=http%3a%2f%2fwww.fonbest.com%2fwx%2fredircto%3ff%3d1&response_type=code&scope=snsapi_base&state=gh_b4606ff0f6c2#wechat_redirect';
                    yield  wx.sendTemplateMsg(template_lib.noticeSubscribeTemplate(openid, url, '您好，欢迎使用方碑联帮平台', userinfo.nickname, '方碑网络科技', '苏州', '区域互帮线上撮合服务', '方碑联帮，您指尖上的全能生活帮手'));
                }
            }
            else if (event_type == "unsubscribe") {
                wechatFriendData.unsubscribe(openid, function (err) {
                    if (err) {
                        console.info('%d - post /wechat unsubscribe userinfo result:[' + openid + "]" + err, new Date());
                    }
                });
            }
            break;
    }
}

router.get('/wechat/userlist', function *() {
    yield getuserlist('oZYTywwwqTt4_3CY_QVidhCarfCc');
})

function *getuserlist(openid) {
    var openidlist = yield wx.getUserList(openid);
    console.log(openidlist.next_openid);
    if (openidlist.total && openidlist.count > 0) {
        openidlist.data.openid.forEach(function (item) {
            if (item) {
                co(function*() {
                    let userinfo = yield wx.getUserInfo(item);

                    if (userinfo && userinfo.nickname) {
                        let userJson = {
                            origid: 'gh_b4606ff0f6c2',
                            nickname:userinfo.nickname,
                            photo: userinfo.headimgurl,
                            openid: item,
                            area: userinfo.country + " " + userinfo.province + " " + userinfo.city,
                            sex: userinfo.sex,
                            state: 1,
                            unionid: userinfo.unionid,
                            createtime: new Date(),
                            updatetime: new Date(),
                            tel: '',
                            money: 0
                        };
                        wechatFriendData.subscribe(userJson, function (err) {
                            console.info('%d - post /wechat  subscribe userinfo result:[' + openid + "]" + err, new Date());
                            //if (err) {
                            //    console.info('%d - post /wechat  subscribe userinfo result:[' + openid + "]" + err, new Date());
                            //}
                        });
                    }
                })
            }
        })
    }

    //if (openidlist.next_openid) {
    //    yield getuserlist(openidlist.next_openid);
    //}
}
