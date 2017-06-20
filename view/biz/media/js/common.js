/**
 * Created by admin on 2015/7/8.
 */

var $comm = {

    /**
     * 返回接口API地址
     * @returns {string}
     */
    getapiurl: function () {
        return "http://127.0.0.1:901";
    },

    /**
     * ajax提交
     * @param options
     *   "url":"url",
     *   "type":get/Post/Del/...,
     *   "data":data,
     *   "async":true/false(default:true)
     */
    ajax: function (options, callback) {
        $.ajax({
            url: "http://127.0.0.1:901" + options.url,
            type: options.type ? options.type : "get",
            data: options.data,
            async: options.async == undefined ? true : options.async,
            datatype: "json",
            success: function (data) {
                if (data.code == 200) { //成功
                    callback(false, data);
                } else {
                    callback(true, "");
                }
            },
            error: function (e) {
                alert(e);
                callback(true);
            }
        })
    },

    /**
     * 获取url参数的值
     */
    getparam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return "";
    }

}

/*
 * String.format.
 */
String.format = function () {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};