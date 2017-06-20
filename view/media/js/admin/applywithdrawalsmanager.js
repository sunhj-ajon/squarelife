var oTable;
var showpay = function (innerid) {
    var obj = $('#confirmDailog');
    obj.attr('tabindex', '-1');
    obj.attr('role', 'dialog');
    obj.attr('aria-labelledby', 'myModalLabel');
    obj.attr('aria-hidden', 'true');
    obj.css('width', '500px');
    obj.css('margin-left', '-150px');
    var strcontent;
    strcontent = '    <div class="modal-header">';
    strcontent += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>';
    strcontent += '        <h3 id="myModalLabel3">支付确认</h3>';
    strcontent += '    </div>';
    strcontent += '    <div class="modal-body">';
    strcontent += ' <form class="form-horizontal" > ' +
        '<div class="control-group">' +
        '<label class="control-label">支付金额</label>' +
        '<div class="controls">' +
        '<input type="text" name="name" id="txtmoney" placeholder="请输入支付金额(必填项)" required>' +
        '<span class="help-inline"></span></div>' +
        '</div>' +
        '<div class="control-group">' +
        '<label class="control-label">支付人</label>' +
        '<div class="controls">' +
        '<input type="text" name="name" id="txtperson" placeholder="请输入支付人(必填项)" required>' +
        '<span class="help-inline"></span></div>' +
        '</div>' +
        '<div class="control-group">' +
        '<label class="control-label">备注</label>' +
        '<div class="controls"><textarea id="txtremark" placeholder="请输入备注" ></textarea>' +
        '<span class="help-inline"></span></div>' +
        '<div id="err_msg"></div>' +
        '</div>' +
        '</form>';
    strcontent += '    </div>';
    strcontent += '    <div class="modal-footer">';
    strcontent += '        <button class="btn" id="confirmbttwo" data-dismiss="modal" aria-hidden="true">取 消</button>';
    strcontent += '        <button data-dismiss="modal" id="confirmbtnone" class="btn blue">确 认</button>';
    strcontent += '    </div>';

    obj.html(strcontent);

    $('#confirmbtnone').bind('click', function () {
        var txtmoney = $("#txtmoney").val();
        var txtperson = $("#txtperson").val();
        var txtremark = $("#txtremark").val();

        if (!txtmoney || !txtperson) {
            $("#err_msg").html("支付金额和支付人不能为空");
        } else {
            $comm.ajax({
                "url": "/apply/withdrawals/pay",
                "type": "Post",
                "data": {innerid: innerid, money: txtmoney, person: txtperson, remark: txtremark}
            }, function (err, result) {
                if (!err) {
                    $comm.ajax({
                        "url": "/apply/withdrawals/list",
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
    });
    obj.modal('toggle');
}

var applywithdrawals = function () {

    return {
        //main function to initiate the module
        init: function () {
            //数据请求
            $comm.ajax({
                "url": "/apply/withdrawals/list",
                "type": "get"
            }, function (err, result) {
                if (!err) {
                    oTable.fnAddData(result.data);
                }
            });

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
                    "sLengthMenu": "_MENU_ 条/页",
                    "oPaginate": {
                        "sPrevious": "上一页",
                        "sNext": "下一页"
                    }
                },
                "aaSorting": [
                    [3, "desc"]
                ],
                "aoColumns": [
                    {"sTitle": "id", "mData": "innerid", "bVisible": false},
                    {"sTitle": "昵称", "mData": "nickname"},
                    {"sTitle": "openID", "mData": "openid"},
                    {
                        "sTitle": "申请时间", "mData": "createdtime", "mRender": function (data, type, full) {
                        return new Date(data).format("yyyy-MM-dd hh:mm:ss");
                    }
                    },
                    {"sTitle": "申请金额", "mData": "money"},
                    {
                        "sTitle": "状态", "mData": "state", "mRender": function (data, type, full) {
                        if (data == "2") {
                            return "<span style='color: green'>执行完成</span>";
                        } else if (data == "1") {
                            return "<span style='color: blue'>申请中</span>";
                        } else {
                            return "<span style='color: red'>无效</span>";
                        }
                    }
                    },
                    {
                        "sTitle": "操作", "mData": "innerid", "mRender": function (data, type, full) {
                        if (full.state == 1) {
                            return "<a href='javascript:;' onclick=showpay('" + data + "')>[支付]</a>";
                        } else {
                            return "-";
                        }
                    }
                    }
                ],
                "aoColumnDefs": [
                    {
                        'bSortable': false,
                        'aTargets': [0, 1, 2, 6],
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