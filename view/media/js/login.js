var Login = function () {

    return {
        //main function to initiate the module
        init: function () {
            var self = this;
            $('.login-form').validate({
                errorElement: 'label', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    username: {
                        required: true
                    },
                    password: {
                        required: true
                    },
                    remember: {
                        required: false
                    }
                },

                messages: {
                    username: {
                        required: "Username is required."
                    },
                    password: {
                        required: "Password is required."
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit
                    $('.alert-error', $('.login-form')).show();
                },

                highlight: function (element) { // hightlight error inputs

                    $(element)
                        .closest('.control-group').addClass('error'); // set error class to the control group
                },

                success: function (label) {
                    label.closest('.control-group').removeClass('error');
                    label.remove();
                },

                errorPlacement: function (error, element) {
                    error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
                },

                submitHandler: function (form) {
                    self.login();
                }
            });

            $('.login-form input').keypress(function (e) {
                if (e.which == 13) {
                    if ($('.login-form').validate().form()) {
                        self.login();
                    }
                    return false;
                }
            });
        },

        login: function () {
            var username = $("#username").val();
            var password = $("#password").val();

            $comm.ajax({
                    "url": "/login/" + username + "/" + password,
                    "type": "get"
                },
                function (err, result) {
                    if (!err && result.data != "") {
                        $.cookie("sessionid", result.data.sessionid);
                        $.cookie("power", result.data.data[0].power);
                        window.location.href = "index.html";
                    } else {
                        $("#errdiv").html('<span>username or password is error.</span>');
                        $("#errdiv").show();
                    }
                });
        }
    };

}();