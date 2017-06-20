/**
 * Created by admin on 2015/7/14.
 */
$(function () {

    $comm.ajax({
            "url": "/bind/get?openid=" + $comm.getparam("openid"),
            "type": "get"
        },
        function (err, result) {
            $("#txtname").val(result.msg[0].name);
            $("#txtTel").val(result.msg[0].tel);
            $("#txtcp").val(result.msg[0].platenum);
        })

    function replacehtml(str) {
        if (str == undefined) return str;
        str = str.replace(/\!|\$|\^|&|\<|\>|\?|\\/g, "");
        return str;
    }

    var today = new Date();
    $("#txtdate").mobiscroll().datetime({theme: "android-ics light",
        lang: 'zh',
        display: 'modal',
        minDate: today,
        maxDate: new Date(new Date().valueOf() + 2160 * 60 * 60 * 1000)
    });

    $("#chktiche").click(function () {
        if (this.checked) {
            $("#liaddr").css("display", "");
        } else {
            $("#liaddr").css("display", "none");
        }
    })

    /**
     * 保存
     */
    $("#submit").click(function () {
        var txtname = $('#txtname').val() == undefined ? '' : replacehtml($('#txtname').val());
        var txtTel = $('#txtTel').val() == undefined ? '' : replacehtml($('#txtTel').val());
        var txtcp = $('#txtcp').val() == undefined ? '' : replacehtml($('#txtcp').val());
        var txtxh = $('#txtxh').val() == undefined ? '' : replacehtml($('#txtxh').val());
        var txtstore = $('#selStore').val() == undefined ? '' : replacehtml($('#selStore').val());
        var type = $('#type').val() == undefined ? '' : replacehtml($('#type').val());
        var txtDate = $('#txtdate').val() == undefined ? '' : replacehtml($('#txtdate').val());
        var selPayType = $('#SelPayType').val() == undefined ? '' : replacehtml($('#SelPayType').val());
        var chktiche = $('#chktiche').is(":checked") == true ? 1 : 0;
        var txtaddr = $('#txtaddr').val() == undefined ? '' : replacehtml($('#txtaddr').val());
        var txtremark = $('#txtremark').val() == undefined ? '' : replacehtml($('#txtremark').val());

        if (txtname == "" || txtcp == "" || txtxh == "" || txtTel == "" || txtstore == "") {
            $('.error').html("[姓名/手机/车牌/型号/预约门店]都不能为空！");
            return;
        }

        //验证手机号
        var reg = /^0?1[358]\d{9}$/;
        if (!reg.test(txtTel)) {
            $('.error').html("手机格式不正确");
            return false;
        }

        //验证车牌
        var reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
        if (!reg.test(txtcp)) {
            $('.error').html("车牌号格式不正确");
            return false;
        }

        var data = {"openid": $comm.getparam("openid"),
            "typename": type,
            "remark": txtremark,
            "name": txtname,
            "tel": txtTel,
            "cp": txtcp,
            "cx": txtxh,
            "store": txtstore,
            "paytype": selPayType,
            "orderdate": txtDate,
            "isautotiche": chktiche,
            "address": txtaddr
        }

        var options = {"url": "/order/add",
            "type": "post",
            "data": data }

        //数据请求
        $comm.ajax(options, function (err, result) {
            if (!err) {
                $('.error').html("恭喜您，预约成功！");
            } else {
                $('.error').html("很遗憾，预约失败，请联系客服！");
            }
        })

    })
})