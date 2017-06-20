var oTable;

var shopdel = function (id) {
    if (!id) {
        return;
    }

    //数据请求
    $comm.ajax({
        "url": "/shops/del/" + id,
        "type": "get"
    }, function (err, result) {
        if (!err && result.errcode == 0) {
            //数据请求
            $comm.ajax({
                "url": "/shops/list/0",
                "type": "get"
            }, function (err, result) {
                if (!err) {
                    oTable.fnClearTable();
                    oTable.fnAddData(result.data);
                }
            });
        }
    });
}

var shopsmanager = function () {

    return {
        //main function to initiate the module
        init: function () {

            oTable = $('#sample_editable_1').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"]
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ records per page",
                    "oPaginate": {
                        "sPrevious": "Prev",
                        "sNext": "Next"
                    }
                },
                "aaSorting": [
                    [4, "desc"]
                ],
                "aoColumns": [
                    {"sTitle": "ID", "mData": "id", "bVisible": false},
                    {"sTitle": "商铺名称", "mData": "name"},
                    {"sTitle": "联系人", "mData": "contacts"},
                    {"sTitle": "电话", "mData": "telephone"},
                    {"sTitle": "手机", "mData": "mobile"},
                    {"sTitle": "地里位置", "mData": "longitude"},
                    {"sTitle": "类型", "mData": "type"},
                    {
                        "sTitle": "操作", "mData": "id", "sWidth": "200px", "mRender": function (data, type, full) {
                        return "<a href='#/shopedit?innerid=" + data + "'>[编辑]</a>  " +
                            "<a href='javascript:;' onclick='shopdel(" + data + ")'>[删除]</a>  " +
                            "<a href='#/goodsedit?shopid=" + data + " '>[添加商品]</a>";
                    }
                    }
                ],
                "aoColumnDefs": [
                    {
                        'bSortable': false,
                        'aTargets': [0, 1, 2, 3, 4],
                        "targets": 0
                    }
                ]
            });

            //数据请求
            $comm.ajax({
                "url": "/shops/list/0",
                "type": "get"
            }, function (err, result) {
                if (!err) {
                    oTable.fnAddData(result.data);
                }
            });

            jQuery('#sample_editable_1_wrapper .dataTables_filter input').addClass("m-wrap medium"); // modify table search input
            jQuery('#sample_editable_1_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
            jQuery('#sample_editable_1_wrapper .dataTables_length select').select2({
                showSearchInput: false //hide search box with special css class
            }); // initialzie select2 dropdown

        }

    };

}();