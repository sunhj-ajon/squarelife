/**
 * Created by admin on 2016-11-24.
 */

module.exports = template_json = function () {
    /**
     * 订单未付款通知
     * @returns {string}
     * @constructor
     */
    template_json.prototype.getPayTemplate = function (openid, url, first, keyword1, keyword2, keyword3, remark) {
        var templatejson = ' {"touser":"' + openid + '","template_id":"2cf8xloOnWbPJTF3di6NW9zB1MbU3zOVaGt9G_dFHsc",';
        templatejson += ' "url":"' + url + '",';
        templatejson += ' "topcolor":"#FF0000",';
        templatejson += '"data":{';
        templatejson += '  "first": {';
        templatejson += '      "value":"' + first + '",';
        templatejson += '           "color":"#173177"';
        templatejson += '   },';
        templatejson += '   "keyword1":{';
        templatejson += '       "value":"' + keyword1 + '",';
        templatejson += '           "color":"#173177"';
        templatejson += '   },';
        templatejson += '    "keyword2": {';
        templatejson += '        "value":"' + keyword2 + '",';
        templatejson += '            "color":"#173177"';
        templatejson += '    },';
        templatejson += '    "keyword3": {';
        templatejson += '        "value":"' + keyword3 + '",';
        templatejson += '            "color":"#173177"';
        templatejson += '    },';
        templatejson += '    "remark":{';
        templatejson += '        "value":"' + remark + '",';
        templatejson += '            "color":"#173177"';
        templatejson += '    }';
        templatejson += ' }';
        templatejson += '}';

        return templatejson;
    }

    /**
     * 支付成功提醒
     * @param openid
     * @param url
     * @param first
     * @param keyword1
     * @param keyword2
     * @param remark
     */
    template_json.prototype.noticePaySuccessTemplate = function (openid, url, first, keyword1, keyword2, remark) {
        var templatejson = ' {"touser":"' + openid + '","template_id":"9G-GY3lwVnCMNB_Q3irO5xtG3Yztkj1rL32sdmT7MOA",';
        templatejson += ' "url":"' + url + '",';
        templatejson += ' "topcolor":"#FF0000",';
        templatejson += '"data":{';
        templatejson += '  "first": {';
        templatejson += '      "value":"' + first + '",';
        templatejson += '           "color":"#173177"';
        templatejson += '   },';
        templatejson += '   "keyword1":{';
        templatejson += '       "value":"' + keyword1 + '",';
        templatejson += '           "color":"#173177"';
        templatejson += '   },';
        templatejson += '    "keyword2": {';
        templatejson += '        "value":"' + keyword2 + '",';
        templatejson += '            "color":"#173177"';
        templatejson += '    },';
        templatejson += '    "remark":{';
        templatejson += '        "value":"' + remark + '",';
        templatejson += '            "color":"#173177"';
        templatejson += '    }';
        templatejson += ' }';
        templatejson += '}';

        return templatejson;
    }

    /**
     * 关注成功后推送的消息
     * @param openid
     * @param url
     * @param first
     * @param keyword1
     * @param keyword2
     * @param remark
     */
    template_json.prototype.noticeSubscribeTemplate = function (openid, url, first, keyword1, keyword2, keyword3, keyword4, remark) {
        var templatejson = ' {"touser":"' + openid + '","template_id":"cb9H2dOlBTI6D89RvJiDD-No-u3-6ZvX7G0H3sEldNk",';
        templatejson += ' "url":"' + url + '",';
        templatejson += ' "topcolor":"#FF0000",';
        templatejson += '"data":{';
        templatejson += '  "first": {';
        templatejson += '      "value":"' + first + '",';
        templatejson += '           "color":"#173177"';
        templatejson += '   },';
        templatejson += '   "keyword1":{';
        templatejson += '       "value":"' + keyword1 + '",';
        templatejson += '           "color":"#173177"';
        templatejson += '   },';
        templatejson += '    "keyword2": {';
        templatejson += '        "value":"' + keyword2 + '",';
        templatejson += '            "color":"#173177"';
        templatejson += '    },';
        templatejson += '    "keyword3": {';
        templatejson += '        "value":"' + keyword3 + '",';
        templatejson += '            "color":"#173177"';
        templatejson += '    },';
        templatejson += '    "keyword4": {';
        templatejson += '        "value":"' + keyword4 + '",';
        templatejson += '            "color":"#173177"';
        templatejson += '    },';
        templatejson += '    "remark":{';
        templatejson += '        "value":"' + remark + '",';
        templatejson += '            "color":"#173177"';
        templatejson += '    }';
        templatejson += ' }';
        templatejson += '}';

        return templatejson;
    }
}