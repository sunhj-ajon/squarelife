var friendmanager = function () {

    return {
        //main function to initiate the module
        init: function () {
            //数据请求
            $comm.ajax({
                "url": "/wechat/friend/list/0",
                "type": "get"}, function (err, result) {
                if (!err) {
                    oTable.fnAddData(result.data);
                }
            });

            var oTable = $('#sample_editable_1').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"]
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ 条/页",
                    "oPaginate": {
                        "sPrevious": "上一页",
                        "sNext": "下一页"
                    }
                },
                "aaSorting": [
                    [5, "desc"]
                ],
                "aoColumns": [
                    {"sTitle": "id", "mData": "id", "bVisible": false},
                    {"sTitle": "openid", "mData": "openid", "bVisible": false},
                    {"sTitle": "头像", "mData": "photo", "mRender": function (data, type, full) {
                        return "<img src='" + data + "' width='60px' height='60px'/>";
                    }},
                    {"sTitle": "昵称", "mData": "nickname"},
                    {"sTitle": "地区", "mData": "area"},
                    {"sTitle": "性别", "mData": "sex", "mRender": function (data, type, full) {
                        if (data == "1") {
                            return "男";
                        } else if (data == "0") {
                            return "女";
                        } else {
                            return "未知";
                        }
                    }},
                    {"sTitle": "关注时间", "mData": "createtime", "mRender": function (data, type, full) {
                        return new Date(data).format("yyyy-MM-dd hh:mm:ss");
                    }}
                    // ,
                    // {"sTitle": "操作", "mData": "openid", "mRender": function (data, type, full) {
                    //     return "<a href='javascript:;'>发送信息</a>";
                    // }}
                ],
                "aoColumnDefs": [
                    {
                        'bSortable': false,
                        'aTargets': [0, 1, 2, 3, 4, 5],
                        "targets": 0
                    }
                ]
            });

            jQuery('#sample_editable_1_wrapper .dataTables_filter input').addClass("m-wrap medium"); // modify table search input
            jQuery('#sample_editable_1_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
            jQuery('#sample_editable_1_wrapper .dataTables_length select').select2({
                showSearchInput: false //hide search box with special css class
            }); // initialzie select2 dropdown

        }

    };

}();