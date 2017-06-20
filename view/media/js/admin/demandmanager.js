var oTable;

function showinfo(innerid) {
    var obj = $('#tipDialog');
    obj.css({width: ''});
    var url = 'http://www.fonbest.com/wechat_web/index.html?openid=#!/view_detail?id=' + innerid + '&type=3';
    var content = '<div class="alert">';
    content += '     <button class="close" data-dismiss="alert" style="top: 6px;"></button>';
    content += '    <iframe style="width: 400px;height: 580px;border: 0px" src="' + url + '"></iframe>';
    content += '</div>';

    obj.html(content);
}

var demandmanager = function () {

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
                "aoColumns": [
                    {"sTitle": "ID", "mData": "innerid", "bVisible": false},
                    {"sTitle": "流水号", "mData": "no", "sWidth": "120px"},
                    {
                        "sTitle": "标题", "mData": "title", "sWidth": "200px", "mRender": function (data, type, full) {
                        var title_div = "<span style='color:rebeccapurple;cursor: pointer;' onclick=showinfo('" + full.innerid + "')>" + (data.length > 13 ? data.substring(0, 13) + " ..." : data) + "</span>"
                        return title_div;
                    }
                    },
                    {"sTitle": "发布人", "mData": "nickname"},
                    {"sTitle": "发布人手机", "mData": "tel"},
                    {"sTitle": "商品费用", "mData": "base_money"},
                    {"sTitle": "服务费用", "mData": "service_money"},
                    {
                        "sTitle": "发布时间",
                        "mData": "createdtime",
                        "sWidth": "140px",
                        "mRender": function (data, type, full) {
                            return new Date(data).format("yyyy-MM-dd hh:mm:ss");
                        }
                    },
                    {
                        "sTitle": "状态", "mData": "state", "mRender": function (data, type, full) {
                        switch (data) {
                            case 1:
                                return "<span>待抢中</span>";
                                break;
                            case 2:
                                return "<span>已被抢完，等待价格协商</span>";
                                break;
                            case 3:
                                return "<span>执行完成</span>";
                                break;
                            case 4:
                                return "<span>价格已确认完成，正在执行</span>";
                                break;
                        }

                        var c_date = new Date(full.createdtime);
                        c_date.setHours(c_date.getHours() + 6);
                        var n_date = new Date();
                        if (c_date < n_date) {
                            return "<span style='color: red'>已过期</span>";
                        }
                    }
                    }
                ],
                "aoColumnDefs": [
                    {
                        'bSortable': false,
                        'aTargets': [0, 1, 2, 3, 4, 5, 6],
                        "targets": 0
                    }
                ]
            });

            //数据请求
            $comm.ajax({
                "url": "/demand/list/0",
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