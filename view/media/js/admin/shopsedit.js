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
        window.location.href = "index.html#/shops";
    })

    $("#btnOK").click(function () {
        var logo = $('#divcover_img').attr('src');
        var txtname = $("#txtname").val();
        var txtcontacts = $("#txtcontacts").val();
        var txtmobile = $("#txtmobile").val();
        var txttel = $("#txttel").val();
        var txtaddr = $("#txtaddr").val();
        var txtintro = $("#txtintro").val();
        var txtsort = $("#txtsort").val() || 0;
        var txtlongitude_j = $("#txtlongitude_j").val();
        var txtlongitude_w = $("#txtlongitude_w").val();
        var txtisrecommend = 0;

        $('input:radio').each(function (index, item) {
            if ($(item).parent().attr("class") == "checked") {
                txtisrecommend = $(item).val();
            }
        })
        var txttype = $("#txttype").val();

        $comm.ajax({
            "url": "/shops/edit",
            "type": "post",
            // "async":false,
            "data": {
                id: innerid,
                name: txtname, logo: logo, contacts: txtcontacts, telephone: txttel,
                mobile: txtmobile, introduction: txtintro, state: 1, addr: txtaddr,
                sort: txtsort, longitude: JSON.stringify({lat: txtlongitude_j, lng: txtlongitude_w}),
                isrecommend: txtisrecommend, type: txttype, createdtime: new Date()
            }
        }, function (err, result) {
            if (!err && result.errcode == 0) {
                window.location.href = "index.html#/shops";
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
                "url": "/shops/one/" + innerid,
                "type": "get"
            }, function (err, result) {
                console.log(result);
                if (!err && result.errcode == 0) {
                    try {

                        $('#divcover_img').css({"display": ""});
                        $('#span_text').css({"display": "none"});

                        $('#divcover_img').attr('src', result.data.logo);
                        $("#txtname").val(result.data.name);
                        $("#txtcontacts").val(result.data.contacts);
                        $("#txtmobile").val(result.data.mobile);
                        $("#txttel").val(result.data.telephone);
                        $("#txtaddr").val(result.data.addr);
                        $("#txtintro").val(result.data.introduction);
                        $("#txtsort").val(result.data.sort);
                        $("#txtlongitude_j").val(JSON.parse(result.data.longitude).lat);
                        $("#txtlongitude_w").val(JSON.parse(result.data.longitude).lng);
                        $("#txttype").val(result.data.type);

                        $.each($("div input[type=radio]"), function (index, _item) {
                            if ($(_item).val() == result.data.isrecommend) {
                                $(_item).attr("checked", true);
                                $(_item).parent().addClass("checked");
                            } else {
                                $(_item).attr("checked", false);
                                $(_item).parent().removeClass("checked");
                            }
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