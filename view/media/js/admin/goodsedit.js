$(function () {
    $('#file_upload').change(function () {
        var formdata = new FormData();
        var fileObj = $(this)[0].files;

        $.each(fileObj, function (key, value) {
            formdata.append("upfile", value);
        })

        $.ajax({
            url: $comm.getconfig() + '/file/upload?action=uploadimage',
            type: 'POST',
            data: formdata,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                $("#divcover_img").css({"display": ""});
                $("#divcover_img").attr("src", data.data);
                $('#span_text').css({"display": 'none'});
            }
        })
    })

    $("#btnCancel").click(function () {
        window.location.href = "index.html#/goods";
    })

    $("#btnOK").click(function () {
        var logo = $('#divcover_img').attr('src');
        var txtname = $("#txtname").val();
        var txtoldprice = $("#txtoldprice").val();
        var txtrebateprice = $("#txtrebateprice").val();
        var txtstocknum = $("#txtstocknum").val();
        var txtunit = $("#txtunit").val();
        var txtintro = $("#txtintro").val();
        var txtshopid = $("#sel_shop").children('option:selected').val();


        var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if (!exp.test(txtoldprice)) {
            alert("原始价格,请输入金额类型值");
            return;
        }
        else if (!exp.test(txtrebateprice)) {
            alert("优惠价格,请输入金额类型值");
            return;
        }
        else if (!exp.test(txtstocknum)) {
            alert("库存,请输入金额类型值");
            return;
        }

        $comm.ajax({
            "url": "/goods/edit",
            "type": "post",
            "data": {
                id: innerid, shopid: txtshopid,
                name: txtname, old_price: txtoldprice, rebate_price: txtrebateprice,
                stock_num: txtstocknum, unit: txtunit, img: logo, introduction: txtintro,
                createdtime: new Date()
            }
        }, function (err, result) {
            if (!err && result.errcode == 0) {
                window.location.href = "index.html#/goods";
            }
            else {
                $comm.alertDetail({
                    "head": "操作提示",
                    "width": "500px",
                    "type": "Error",
                    "content": " 很遗憾，保存失败",
                    success: function () {
                    }
                });
            }
        });

    })

    var innerid = "", shopid = "";
    var init = function () {
        //加载店铺数据
        $comm.ajax({
            "url": "/shops/list/0",
            "type": "get"
        }, function (err, result) {
            if (!err && result.errcode == 0 && result.data.length > 0) {
                $('#sel_shop').append('<option value="-1">--请选择店铺--</option>')
                $.each(result.data, function (index, item) {
                    $('#sel_shop').append('<option value="' + item.id + '">' + item.name + '</option>');
                })

                shopid = $comm.getUrlParam("shopid") ? $comm.getUrlParam("shopid") : shopid;
                if (shopid) {
                    $("#sel_shop").val(shopid);
                }
            }
        })


        innerid = $comm.getUrlParam("innerid") ? $comm.getUrlParam("innerid") : innerid;
        if (innerid) {
            $comm.ajax({
                "url": "/goods/one/" + innerid,
                "type": "get"
            }, function (err, result) {
                console.log(result);
                if (!err && result.errcode == 0) {
                    $('#divcover_img').css({"display": ""});
                    $('#span_text').css({"display": "none"});
                    $('#divcover_img').attr('src', result.data.img);
                    $("#txtname").val(result.data.name);
                    $("#txtoldprice").val(result.data.old_price);
                    $("#txtrebateprice").val(result.data.rebate_price);
                    $("#txtstocknum").val(result.data.stock_num);
                    $("#txtunit").val(result.data.unit);
                    $("#txtintro").val(result.data.introduction);
                    $("#sel_shop").val(result.data.shopid);
                    shopid = result.data.shopid;
                }
            })
        }
    }

    init();
})