var oTable, shopid;

var goodsdel = function (id) {
    if (!id) {
        return;
    }

    //数据请求
    $comm.ajax({
        "url": "/goods/del/" + id,
        "type": "get"
    }, function (err, result) {
        if (!err && result.errcode == 0) {
            //数据请求
            $comm.ajax({
                "url": "/goods/list/0/" + shopid,
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

var goodsmanager = function () {
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
                "sDom": "<'row-fluid'<'span6'l<'#mytoolbox'>><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
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
                    {"sTitle": "商品名称", "mData": "name"},
                    {"sTitle": "店铺名称", "mData": "shopname"},
                    {"sTitle": "原始价格(RMB)", "mData": "old_price"},
                    {"sTitle": "优惠价格(RMB)", "mData": "rebate_price"},
                    {"sTitle": "库存", "mData": "stock_num"},
                    {"sTitle": "单位", "mData": "unit"},
                    {
                        "sTitle": "操作", "mData": "id", "sWidth": "120px", "mRender": function (data, type, full) {
                        return "<a href='#/goodsedit?innerid=" + data + "'>[编辑]</a>  <a href='javascript:;' onclick='goodsdel(" + data + ")'>[删除]</a>";
                    }
                    }
                ],
                "aoColumnDefs": [
                    {
                        'bSortable': false,
                        'aTargets': [0, 1, 2, 3, 4],
                        "targets": 0
                    }
                ],
                "fnInitComplete": function () {
                    //数据请求
                    $comm.ajax({
                        "url": "/shops/list/0",
                        "type": "get"
                    }, function (err, result) {
                        if (!err && result.errcode == 0 && result.data.length > 0) {
                            var optionlist = '<option value="-1">--请选择店铺--</option>';
                            $.each(result.data, function (index, item) {
                                optionlist += '<option value="' + item.id + '">' + item.name + '</option>';
                            })
                            var dataPlugin = '<div style="margin-left: 400px">' +
                                '<select class="m-wrap small" style="width: 400px" id="sel_shoplist">' + optionlist + '</select></div>';
                            $('#mytoolbox').append(dataPlugin);
                            $('#sel_shoplist').change(function () {
                                shopid = $(this).children('option:selected').val();

                                $comm.ajax({
                                    "url": "/goods/list/0/" + shopid,
                                    "type": "get"
                                }, function (err, result) {
                                    if (!err) {
                                        oTable.fnClearTable();
                                        oTable.fnAddData(result.data);
                                    }
                                });
                            })
                        }
                    });
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