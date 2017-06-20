var oTable;

var suggestmanager = function () {

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
                    {"sTitle": "ID", "mData": "id", "bVisible": false},
                    {"sTitle": "提出人", "mData": "nickname"},
                    {
                        "sTitle": "提出时间", "mData": "createdtime", "mRender": function (data, type, full) {
                        return new Date(data).format("yyyy-MM-dd hh:mm");
                    }
                    },

                    {"sTitle": "分类标签", "mData": "label"},
                    {"sTitle": "建议内容", "mData": "content"}
                ],
                "aoColumnDefs": [
                    {
                        'bSortable': false,
                        'aTargets': [0, 1, 3, 4],
                        "targets": 0
                    }
                ]
            });

            //数据请求
            $comm.ajax({
                "url": "/suggest/list/0",
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