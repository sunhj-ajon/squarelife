/**
 * Created by admin on 2015/12/4.
 * 说明：
 * 1、普通用户进入url中的参数为openid和type=1；
 * 2、客服进入url中显示openid和type=2;
 */

/**
 * 获取url参数的值
 */
function getparam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return "";
}

/**
 * change chat receiveid
 * @param receiveid
 */
function changechatuser(_receiveid) {
    receiveid = _receiveid;
    $("div [name=messagelist]").hide();
    $("#messagelist" + _receiveid).show();
    messagelist = $("#messagelist" + _receiveid);
}

var socket, receiveid, messagelist, isinterval;

var receivephoto, senderphoto;
function createClient(action) {
    socket = new io.connect("http://127.0.0.1:3000/");
    var type = getparam("type"); //type=1表示客户
    action = type == 1 ? action : "";
    socket.on("isconnect", function (data) {
        console.log(data);
        if (data) {
            socket.emit("clientinfo", {"clientid": getparam("openid"), "action": action});
            isinterval = setInterval(function () {
                socket.emit("heartbeat", {"clientid": getparam("openid")})
            }, 5000);
            $("#spwelcome").text("Welcome");
        } else {
            $("#spwelcome").text("Sorry");
        }
    });

    /**
     * 第二次握手，获取客服信息
     */
    socket.on("custService", function (data, hismsg) {
        receiveid = data.receiveid;
        receivephoto = data.receivephoto;
        senderphoto = data.senderphoto;
        $(".floatingImg").attr("src", receivephoto);
        showhistory(hismsg);
    });

    /**
     * 获取实时数据
     */
    socket.on("stcmsg", function (data, issuccess) {
        var msgdiv = $('#chat-messages');
        if (getparam("type") != "1") {
            receivephoto = data.senderphoto;
            senderphoto = data.receivephoto;
            var _receiveid = data.sender;
            if ($("#userlist").length == 0) {
                $("#profile").after("<div id='userlist'></div><hr>");
            }

            if ($("#userlist" + _receiveid).length == 0) {
                $("#userlist").append("<img src='" + receivephoto + "'style='margin-right: 15px;width:40px;' id=userlist" + _receiveid + " onclick=changechatuser('" + _receiveid + "')>");
            }

            if ($("#messagelist" + _receiveid).length == 0) {
                msgdiv.append("<div id=messagelist" + _receiveid + " name=messagelist></div>");
            }
            var _date = new Date();
            var _time = _date.getHours() + ":" + _date.getMinutes() + ":" + _date.getSeconds();
            if (!data) {
                return;
            }
            var content = ' <div class="message"><img src="' + receivephoto + '"/>' +
                '<div class="bubble">' + data.msg +
                '<div class="corner"></div><span>' + _time + '</span></div></div>';
            if (receiveid && receiveid != _receiveid) {
                $("#messagelist" + _receiveid).hide();
            }
            $("#messagelist" + _receiveid).append(content);
            messagelist = $("#messagelist" + _receiveid);
        }
        else {
            var _date = new Date();
            var _time = _date.getHours() + ":" + _date.getMinutes() + ":" + _date.getSeconds();
            if (!data) {
                return;
            }
            var content = ' <div class="message"><img src="' + receivephoto + '"/>' +
                '<div class="bubble">' + data.msg +
                '<div class="corner"></div><span>' + _time + '</span></div></div>';
            if (!issuccess) {
                messagelist.append("<div style='text-align: center;color:#CDCDC1 '>--当前客服不在线，已经通知客服--</div>");
            } else {
                messagelist.append(content);
            }
            msgdiv[0].scrollTop = msgdiv[0].scrollHeight;
        }
        if (issuccess) {
            receiveid = data.sender;
        }
    })
}

/**
 * 显示历史信息
 * @param hismsg
 */
function showhistory(hismsg) {
    var msgdiv = $('#chat-messages');

    $.each(hismsg, function (index, item) {
        var _date = new Date(item.createtime);
        var _time = _date.getHours() + ":" + _date.getMinutes() + ":" + _date.getSeconds();
        if (item.sender == getparam("openid")) {
            var content = ' <div class="message right"><img src="' + item.senderphoto + '"/>' +
                '<div class="bubble">' + item.msg +
                '<div class="corner"></div><span>' + _time + '</span></div></div>';
        } else {
            var content = ' <div class="message"><img src="' + item.receivephoto + '"/>' +
                '<div class="bubble">' + item.msg +
                '<div class="corner"></div><span>' + _time + '</span></div></div>';
        }
        msgdiv.append(content);
    })
    msgdiv[0].scrollTop = msgdiv[0].scrollHeight;
}

$(document).ready(function () {
    var preloadbg = document.createElement('img');
    preloadbg.src = 'img/timeline1.png';
    $('#searchfield').focus(function () {
        if ($(this).val() == 'Search contacts...') {
            $(this).val('');
        }
    });
    $('#searchfield').focusout(function () {
        if ($(this).val() == '') {
            $(this).val('Search contacts...');
        }
    });
    $('#sendmessage input').focus(function () {
        if ($(this).val() == 'Send message...') {
            $(this).val('');
        }
    });
    $('#sendmessage input').focusout(function () {
        if ($(this).val() == '') {
            $(this).val('Send message...');
        }
    });

    /**
     * 选择对象
     */
    $('.friend').each(function () {
        $(this).click(function () {
            createClient($(this).attr("action"));

            var childOffset = $(this).offset();
            var parentOffset = $(this).parent().parent().offset();
            var childTop = childOffset.top - parentOffset.top;
            var clone = $(this).find('img').eq(0).clone();
            var top = childTop + 12 + 'px';
            $(clone).css({ 'top': top }).addClass('floatingImg').appendTo('#chatbox');
            setTimeout(function () {
                $('#profile p').addClass('animate');
                $('#profile').addClass('animate');
            }, 100);
            setTimeout(function () {
                $('#chat-messages').addClass('animate');
                $('.cx, .cy').addClass('s1');
                setTimeout(function () {
                    $('.cx, .cy').addClass('s2');
                }, 100);
                setTimeout(function () {
                    $('.cx, .cy').addClass('s3');
                }, 200);
            }, 150);
            $('.floatingImg').animate({
                'width': '68px',
                'left': '41%',
                'top': '20px'
            }, 200);
            var name = $(this).find('p strong').html();
            var email = $(this).find('p span').html();
            $('#profile p').html(name);
            $('#profile span').html(email);
            $('.message').not('.right').find('img').attr('src', $(clone).attr('src'));
            $('#friendslist').fadeOut();
            $('#chatview').fadeIn();
            $('#close').unbind('click').click(function () {
                socket.disconnect();
                clearInterval(isinterval);
                $('#chat-messages, #profile, #profile p').removeClass('animate');
                $('.cx, .cy').removeClass('s1 s2 s3');
                $('.floatingImg').animate({
                    'width': '40px',
                    'top': top,
                    'left': '12px'
                }, 200, function () {
                    $('.floatingImg').remove();
                });
                setTimeout(function () {
                    $('#chatview').fadeOut();
                    $('#friendslist').fadeIn();
                }, 50);
            });
        });
    });

    /**
     * 发送信息
     */
    $('#send').click(function () {
        var msgdiv = $('#chat-messages');
        if (!messagelist || messagelist.length == 0) {
            messagelist = msgdiv;
        }
        var msg = $("#msgContent").val();
        var _date = new Date();
        var _time = _date.getHours() + ":" + _date.getMinutes() + ":" + _date.getSeconds();
        if (!msg) {
            return;
        }
        var content = ' <div class="message right"><img src="' + senderphoto + '"/>' +
            '<div class="bubble">' + msg +
            '<div class="corner"></div><span>' + _time + '</span></div></div>';
        messagelist.append(content);
        $("#msgContent").val("");
        socket.emit("ctsmsg", {"sender": getparam("openid"), "to": receiveid, "msg": msg, "senderphoto": senderphoto, "receivephoto": receivephoto});
        msgdiv[0].scrollTop = msgdiv[0].scrollHeight;
    })
});
