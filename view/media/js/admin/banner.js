var oTable;

$("#btnsubmit").click(function () {
    if ((window.listnum + 1) > 5) {
        alertmsg("最多只能上传4个");
        return false
    }
    f_Save("保存成功",window.jsondata);
});
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
            window.uploadimage = data.data;
            var uploadimagedata = window.jsondata==undefined?[]:window.jsondata;
            
            uploadimagedata.push({'img_url': window.uploadimage});
            f_success(uploadimagedata)
            // 选中当前上传的图片
            initswpier(uploadimagedata.length - 1);
        }
    })
});
function f_Del() {
    if (confirm("是否删除")) {
        var uploadimagedata = window.jsondata;
        uploadimagedata.splice(window.index, 1);
        f_Save("删除成功",uploadimagedata)// 保存删除操作
    }
}
function f_Save(msg,obj) {
    //数据请求
    $comm.ajax({
        "url": "/ad/edit",
        "data": {"ad":obj},
        "type": "post"
    }, function (err, result) {
        if (!err) {
            alert(msg || "保存成功");
            f_SearchList()
        }
    });
}
function f_SearchList() {
    //数据请求
    $comm.ajax({
        "url": "/ad/list",
        "type": "get"
    }, function (err, result) {
        if (!err) {
            window.listdata = result.data;
            f_success(result.data);
        }
    });
}
// 同步生成渲染页面的中List
function f_success(objJson) {
    try {
        if (objJson.length > 0) {
            window.jsondata = objJson;
            var html = '';
            var html2 = '';
            window.listnum = jsondata.length;
            if (window.listnum==0) {
                $("#pic").html('<div style="width:300px;height:200px;>上传图片</div>');
                $("#list").hide();
                $("#txttitle").val()
                $("#txtaddress").val()
            } else {
                $("#list").show();
                for (var i = 0; i < jsondata.length; i++) {
                    html += '<li><img src="' + jsondata[i].img_url + '" alt=""><a title="删除" class="btn btn-danger" onclick="f_Del()"><i class="icon-trash icon-white"></i></a></li>'
                    html2 += '<li>' + (i + 1) + '</li>'
                }
                $("#pic").html(html);
                $("#list").html(html2);
            }
            initswpier()
        } else {
            $("#pic").html('<div style="text-align: center">请上传图片</div>');
            $("#list").hide();
            $("#txttitle").val()
            $("#txtaddress").val()
        }
    }
    catch (e) {
        alert('生成失败', e.Message)
    }
}
function initswpier(num) {
    var wrap = document.getElementById('swiper'),
            pic = document.getElementById('pic').getElementsByTagName("li"),
            list = document.getElementById('list').getElementsByTagName('li');
    window.index = num || 0
    // 定义并调用自动播放函数
    //timer = setInterval(autoPlay, 2000);
    // 鼠标划过整个容器时停止自动播放
    wrap.onmouseover = function () {
        //clearInterval(timer);
    }
    // 鼠标离开整个容器时继续播放至下一张
    wrap.onmouseout = function () {
        //timer = setInterval(autoPlay, 2000);
    }
    // 遍历所有数字导航实现划过切换至对应的图片
    $('#list li').bind("click", function (e) {
        window.index = $(this).index();
        changePic(window.index);
    })
    changePic(window.index);
    // function autoPlay () {
    //  if (++index >= pic.length) index = 0;
    //    changePic(index);
    // }
    // 定义图片切换函数
    //
    $("#txttitle").change(function () {
        jsondata[window.index].name = $("#txttitle").val();
    })
    $("#txtaddress").change(function () {
        jsondata[window.index].href_url = $("#txtaddress").val();
    })
    function changePic(curIndex) {
        for (var i = 0; i < pic.length; ++i) {
            pic[i].style.display = "none";
            list[i].className = "";
        }
        pic[curIndex].style.display = "block";
        list[curIndex].className = "on";
        //给两个Input赋值
        $("#txttitle").val(jsondata[curIndex].name);
        $("#txtaddress").val(jsondata[curIndex].href_url);
    }
}
var banner = function () {

    return {
        //main function to initiate the module
        init: function () {
            f_SearchList()
            jQuery('#sample_editable_1_wrapper .dataTables_filter input').addClass("m-wrap medium"); // modify table search input
            jQuery('#sample_editable_1_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
            jQuery('#sample_editable_1_wrapper .dataTables_length select').select2({
                showSearchInput: false //hide search box with special css class
            }); // initialzie select2 dropdown

        }

    };

}();