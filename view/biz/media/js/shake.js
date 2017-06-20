/**
 * Created by admin on 2015/7/21.
 */
var SHAKE_THRESHOLD = 1000;
var last_update = 0;
var x = y = z = last_x = last_y = last_z = 0;

if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler, false);
} else {
    alert('本设备不支持devicemotion事件');
}

function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();

    if ((curTime - last_update) > 100) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD) {
            doResult();
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}

function doResult() {
    var _v = $comm.getparam("v");

    var options = {"url": "/shake",
        "type": "post",
        "data": {'v': _v} }

    //数据请求
    $comm.ajax(options, function (err, result) {
        if (!err) {
            var msg;
            var pic;
            if (result.msg == "-1") {
                pic = "media/image/weizhong.jpg";
                msg = "很遗憾，未中奖，再接再厉，继续摇！";
            } else if (result.msg == "0") {
                pic = "media/image/yzj.jpg";
                msg = "您已中奖！";
            } else {
                if (result.msg.img) {
                    pic = result.msg.img;
                } else {
                    pic = "media/image/zjdefault.jpg";
                }
                msg = "恭喜您，获得" + result.msg.name;
                SHAKE_THRESHOLD = 1000000;
            }
            document.getElementById("result").className = "result";
            document.getElementById("loading").className = "loading loading-show";
            setTimeout(function () {
                $("#resultmsg").html(msg);
                $(".pic").css("background-image", "url(" + pic + ")");
                document.getElementById("result").className = "result result-show";
                document.getElementById("loading").className = "loading";
            }, 1000);
        } else {
            pic = "media/image/weizhong.jpg";
            msg = "很遗憾，未中奖，再接再厉，继续摇！";

            document.getElementById("result").className = "result";
            document.getElementById("loading").className = "loading loading-show";
            setTimeout(function () {
                $("#resultmsg").html(msg);
                $(".pic").css("background-image", "url(" + pic + ")");
                document.getElementById("result").className = "result result-show";
                document.getElementById("loading").className = "loading";
            }, 1000);

        }
    })
}
