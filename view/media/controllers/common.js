/**
 * Created by admin on 2015/7/8.
 */

/**
 * Common
 * @type {{getconfig: getconfig, ajax: ajax, random: random, confirm: confirm, tipDialog: tipDialog, checklogin: checklogin, clearcookie: clearcookie}}
 */
var $comm = {
    getconfig: function (url) {
        return "http://127.0.0.1:3000";
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
            url: this.getconfig("nodeurl") + options.url,
            type: options.type ? options.type : "get",
            data: options.data,
            async: options.async == undefined ? true : options.async,
            datatype: "json",
            success: function (data, status, req) {
                // var h = req.getResponseHeader();
                if (data.errcode == 0) { //成功
                    callback(false, data);
                } else {
                    callback(true, "");
                }
            },
            error: function (e) {
                callback(true);
            }
        })
    },

    /**
     * 随机数
     * @returns {number}
     */
    random: function () {
        return new Date().getTime();
    },

    /**
     * 确认框
     * @head           {string} 标题
     * @content        {string} 内容
     * @callback1      {string} 确认回调函数
     * @callback2      {string} 取消回调函数
     * @options        {head:"",content:"",success:function(){},cancel:function(){}}
     */
    confirm: function (options) {
        var obj = $('#confirmDailog');
        obj.attr('tabindex', '-1');
        obj.attr('role', 'dialog');
        obj.attr('aria-labelledby', 'myModalLabel');
        obj.attr('aria-hidden', 'true');
        obj.css('width', '400px');
        obj.css('margin-left', '-150px');
        var strcontent;
        strcontent = '    <div class="modal-header">';
        strcontent += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>';
        strcontent += '        <h3 id="myModalLabel3">{0}</h3>';
        strcontent += '    </div>';
        strcontent += '    <div class="modal-body">';
        strcontent += '        <p style="font-size: 20px;"><img src="media/image/comm/question.png" style="width: 60px;">{1}</p>';
        strcontent += '    </div>';
        strcontent += '    <div class="modal-footer">';
        strcontent += '        <button class="btn" id="confirmbttwo" data-dismiss="modal" aria-hidden="true">{2}</button>';
        strcontent += '        <button data-dismiss="modal" id="confirmbtnone" class="btn blue">{3}</button>';
        strcontent += '    </div>';

        if (!options.content) {
            options.content = "请确认，是否执行该操作？";
        }
        strcontent = String.format(strcontent, options.head, options.content, "取 消", "确 定");
        obj.html(strcontent);
        // $("body").append(obj);

        $('#confirmbtnone').bind('click', function () {
            if (options.success) options.success();
            obj.modal('hide');
        });
        $('#confirmbttwo').bind('click', function () {
            if (options.cancel) options.cancel();
            obj.modal('hide');
        });
        obj.modal('toggle');
    },

    /**
     * 信息框
     * @head           {string} 标题
     * @type           {string} 类型（Warning/Success/Error）
     * @width          {string} 宽度（带px）
     * @content        {string} 内容
     * @callback1      {string} 确认回调函数
     * @options        {head:"",content:"",success:function(){}}
     */
    alertDetail: function (options) {
        var imgurl = options.type == undefined ? "media/image/comm/ok.png" : "media/image/comm/error.gif";
        if (options.type == "") {
            imgurl = "";
        }
        var _width = options.width == undefined ? "400px" : options.width;
        var obj = $('#confirmDailog');
        obj.attr('tabindex', '-1');
        obj.attr('role', 'dialog');
        obj.attr('aria-labelledby', 'myModalLabel');
        obj.attr('aria-hidden', 'true');
        obj.css('width', _width);
        obj.css('margin-left', '-150px');
        var strcontent;
        strcontent = '    <div class="modal-header">';
        strcontent += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>';
        strcontent += '        <h3 id="myModalLabel3">{0}</h3>';
        strcontent += '    </div>';
        strcontent += '    <div class="modal-body">';
        strcontent += '        <p style="font-size: 20px;">';
        if (options.type != "-1") {
            strcontent += '        <img src="' + imgurl + '" style="width: 60px;">';
        }
        strcontent += '    {1}</p>';
        strcontent += '    </div>';
        strcontent += '    <div class="modal-footer">';
        //strcontent += '        <button class="btn" id="confirmbttwo" data-dismiss="modal" aria-hidden="true">{2}</button>';
        strcontent += '        <button data-dismiss="modal" id="confirmbtnone" class="btn blue">{2}</button>';
        strcontent += '    </div>';

        strcontent = String.format(strcontent, options.head, options.content, "确 定");
        obj.html(strcontent);

        $('#confirmbtnone').bind('click', function () {
            if (options.success) options.success();
            obj.modal('hide');
        });
        obj.modal('toggle');
    },

    /**
     * 提示对话框
     * @type:       {string} 类型（Warning/Success/Error）
     * @content:    {string} 提示内容
     * @param options
     */
    tipDialog: function (options) {
        var obj = $('#tipDialog');

        var content = '<div class="alert">';
        content += '     <button class="close" data-dismiss="alert" style="top: 6px;"></button>';
        content += '    <strong>Warning!</strong> {0}';
        content += '</div>';

        content = String.format(content, options.content);
        obj.html(content);
    },

    /**
     * 检查是否有cookie
     */
    checklogin: function () {
        if (!$.cookie("sessionid") || $.cookie("sessionid") == "null") {
            window.location.href = "login.html";
        }
    },

    /**
     * 清楚cookies
     */
    clearcookie: function () {
        $.cookie('sessionid', null);
    },

    /**
     * 创建弹出层的表格
     * @param colume  列
     * @param data    数据
     */
    createtable: function (colume, data) {
        var table = '<table class="table table-striped table-hover table-bordered dataTable" id="sample_editable_2"><thead><tr role="row">';

        $.each(colume, function (index, item) {
            table += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 122px;">' + item.name + '</th>';
        })
        table += '</tr></thead><tbody role="alert" aria-live="polite" aria-relevant="all">';

        $.each(data, function (index, item) {
            var _class = "even";

            if (item.xm == "修理费用") {
                table += '<tr class=even ><td colspan=2 style="background-color: #F5F5DC; font-weight:bold;">修理费用</td></tr>';
            }
            else if (item.xm == "材料费用") {
                table += '<tr class=even ><td colspan=2 style="background-color: #F5F5DC;font-weight:bold;">材料费用</td></tr>';
            }
            else if (item.xm == "其它费用") {
                table += '<tr class=even ><td colspan=2 style="background-color: #F5F5DC;font-weight:bold;">其它费用</td></tr>';
            } else {
                var _tr = '<tr class=' + _class + '>';
                for (var i = 0; i < colume.length; i++) {
                    _tr += '<td>' + item[colume[i].key] + '</td>';
                }
                _tr += '</tr>';
                table += _tr;
            }
        })

        table += ' </tbody></table>';
        return table;
    },

    /**
     * 获取URL参数
     * @param name
     * @returns {*}
     */
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var losp = window.location.hash.split('?')[1];
        if (losp) {
            var r = losp.match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
        return null;
    }
}

/**
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

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @param fmt
 * @returns {*}
 */
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

