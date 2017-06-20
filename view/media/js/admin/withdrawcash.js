var withdrawcash = function () {

    return {
        //main function to initiate the module
        init: function () {
            //数据请求
            $comm.ajax({
                "url": "/withdrawcash/list",
                "type": "get"
            }, function (err, result) {
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
                    [2, "desc"]
                ],
                "aoColumns": [
                    {"sTitle": "id", "mData": "innerid", "bVisible": false},
                    {"sTitle": "接受人", "mData": "nickname"},
                    {"sTitle": "头像", "mData": "photo", "mRender": function (data, type, full) {
                        return "<img src='" + data + "' width='60px' height='60px'/>";
                    }},
                    {
                        "sTitle": "支付时间", "mData": "createdtime", "mRender": function (data, type, full) {
                        return new Date(data).format("yyyy-MM-dd hh:mm:ss");
                    }
                    },
                    {"sTitle": "支付金额", "mData": "money"},
                    {"sTitle": "支付人", "mData": "person"},
                    {"sTitle": "备注", "mData": "remark"}
                ],
                "aoColumnDefs": [
                    {
                        'bSortable': false,
                        'aTargets': [0, 1],
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