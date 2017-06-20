var Index = function () {


    return {

        //main function to initiate the module
        init: function () {
            App.addResponsiveHandler(function () {
                jQuery('.vmaps').each(function () {
                    var map = jQuery(this);
                    map.width(map.parent().width());
                });
            });

            if ($.cookie("menutype") && $.cookie("menutype") == "1") {
                $("#wc").hide();

                $("#liorder").hide();
                $("#libind").hide();
                $("#liprize").hide();
                $("#lirepair").hide();

                $("#co").hide();
            }

            var power = $.cookie("power");
            var _powerall = "wechat,demand,grad,banner,shops,goods,applywithdrawals,withdrawcash,suggest,user";

            if (power) {
                $.each(_powerall.split(','), function (index, item) {
                    if (power.indexOf(item) == -1) {
                        $("." + item).remove();
                    }
                })

                if (power.indexOf("demand") == -1 && power.indexOf("grad") == -1 && power.indexOf("banner") == -1) {
                    $(".bussion").remove();
                }

                if (power.indexOf("user") == -1) {
                    $(".system").remove();
                }

                if (power.indexOf("shops") == -1 && power.indexOf("goods") == -1) {
                    $(".shopgoods").remove();
                }

                if (power.indexOf("applywithdrawals") == -1 && power.indexOf("withdrawcash") == -1) {
                    $(".money").remove();
                }
            }
        }
    };

}();