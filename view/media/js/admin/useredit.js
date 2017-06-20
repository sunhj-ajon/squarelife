$(function () {

    $("#btnCancel").click(function () {
        window.location.href = "index.html#/user";
    })

    $("#btnOK").click(function () {
        var txtusername = $("#txtusername").val();
        var txtname = $("#txtname").val();
        var txtpwd = $("#txtpwd").val();
        var power = '';

        $('input:checkbox').each(function (index, item) {
            if ($(item).parent().attr("class") == "checked") {
                power += $(item).val() + ",";
            }
        })

        $comm.ajax({
            "url": "/user/edit",
            "type": "post",
            "data": {
                id: innerid,
                username: txtusername,
                password: txtpwd,
                name: txtname,
                power: power,
                createtime: new Date()
            }
        }, function (err, result) {
            if (!err && result.errcode == 0) {
                window.location.href = "index.html#/user";
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

    var innerid = "";
    var init = function () {
        innerid = $comm.getUrlParam("innerid") ? $comm.getUrlParam("innerid") : innerid;
        if (innerid) {
            $comm.ajax({
                "url": "/user/one/" + innerid,
                "type": "get"
            }, function (err, result) {
                if (!err && result.errcode == 0) {
                    try {
                        $("#txtusername").val(result.data.username);
                        $("#txtname").val(result.data.name);
                        $("#txtpwd").val(result.data.password);

                        $.each(result.data.power.split(','), function (index, item) {
                            $.each($("div input[type=checkbox]"), function (index, _item) {
                                if ($(_item).val() == item) {
                                    $(_item).attr("checked", true);
                                    $(_item).parent().addClass("checked");
                                }
                            })
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
            })
        }
    }

    init();
})