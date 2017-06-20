/**
 * Created by admin on 2015/10/19.
 */

var prizeid = -1;
var prizeitem = {};
var prizeinnerid = "";

function showDiv(content) {
    if (content) {
        $("#popDiv").html(content);
    }
    $("#popDiv").css("display", "block");
    $("#bg").css("display", "block");
}

function closeDiv() {
    $("#popDiv").css("display", "none");
    $("#bg").css("display", "none");
}

var lottery = {
    index: -1,	//当前转动到哪个位置，起点位置
    count: 0,	//总共有多少个位置
    timer: 0,	//setTimeout的ID，用clearTimeout清除
    speed: 20,	//初始转动速度
    times: 0,	//转动次数
    cycle: 50,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize: -1,	//中奖位置
    init: function (id) {
        if ($("#" + id).find(".lottery-unit").length > 0) {
            $lottery = $("#" + id);
            $units = $lottery.find(".lottery-unit");
            this.obj = $lottery;
            this.count = $units.length;
            $lottery.find(".lottery-unit-" + this.index).addClass("active");
        }

        //数据请求 加载页面
        $comm.ajax({"url": "/shake/getdzp",
            "type": "get"}, function (err, result) {
            if (!err) {

                if (!result || !result.msg || !result.msg.innerid) {
                    showDiv("对不起，该活动已经下架！");
                    return;
                }

                prizeinnerid = result.msg.innerid;

                var randomNum = parseInt(12 * Math.random());
                var spaceNum = Math.round(12 / result.msg.prizelist.length);

                $.each(result.msg.prizelist, function (index, item) {
                    var random = index * spaceNum + randomNum;
                    random = random >= 12 ? random - 12 : random;
                    $('.lottery-unit-' + random).html('<img id="' + random + '" prizeid="' + item.id + '" style="width:142px;height:142px;" src="' + $comm.getapiurl() + "/uploads/" + item.img + '">');

                    //加载奖品列表
                    $("#prizeDoc").append("<li>" + item.name + "</li>")
                })
                //加载不中奖图片
                $("#lottery").find("td").not(':has(img)').not(':has(a)').html('<img name="noprize" prizeid="-1" style="width:142px;height:142px;" src="media/image/lottery/3.png">');

                //加载中奖列表
                $.each(result.msg.prizeusr, function (index, item) {
                    $("#prizeuser").append("<li>" + item.nickname + "&nbsp;&nbsp;&nbsp;" + item.name + "</li>")
                })
            } else {
                showDiv();
            }
        })

    },
    roll: function () {
        var index = this.index;
        var count = this.count;
        var lottery = this.obj;
        $(lottery).find(".lottery-unit-" + index).removeClass("active");
        index += 1;
        if (index > count - 1) {
            index = 0;
        }
        $(lottery).find(".lottery-unit-" + index).addClass("active");
        this.index = index;
        return false;
    }
};

function roll() {
    lottery.times += 1;
    lottery.roll();
    if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
        clearTimeout(lottery.timer);
        lottery.prize = -1;
        lottery.times = 0;
        click = false;
        if (prizeitem && prizeitem.id) {
            showDiv("恭喜您，获得 " + (prizeitem.remark || prizeitem.name) + " <br/>请凭收到的微信信息为准");
        }
    } else {
        if (lottery.times < lottery.cycle) {
            lottery.speed -= 10;
        } else if (lottery.times == lottery.cycle) {
            lottery.prize = prizeid;
        } else {
            if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                lottery.speed += 110;
            } else {
                lottery.speed += 20;
            }
        }
        if (lottery.speed < 40) {
            lottery.speed = 40;
        }

        lottery.timer = setTimeout(roll, lottery.speed);
    }
    return false;
}

var click = false;

$(function () {
    lottery.init('lottery');
    $("#lottery a").click(function () {
        if (click) {
            return false;
        } else {
            var notprize = $("#lottery").find("td").not(':has(img[name!=noprize])').not(':has(a)');
            var _class = $(notprize[parseInt(notprize.length * Math.random())]).attr("class");

            if (_class) {
                prizeid = parseInt(_class.substring(_class.lastIndexOf('-') + 1));
            }

            //数据请求 加载页面
            $comm.ajax({"url": "/shakedzp",
                    "type": "post",
                    "data": {'v': $comm.getparam("v"), 'prizeid': prizeinnerid}},
                function (err, result) {
                    if (!err) {
                        if (result.msg == "0") {  //已中奖
                            showDiv("您已经中奖，不能再次参与，谢谢！");
                            return;
                        }
                        else if (result.msg == "-2") {  //已经参与
                            showDiv("您已经参与过了，不能再参与！");
                            return;
                        }
                        else if (result.msg != "-1") {
                            prizeid = $("#lottery").find("img[prizeid=" + result.msg.id + "]")[0].id;
                            prizeitem = result.msg;

                            lottery.speed = 100;
                            roll();
                            click = true;
                            return false;
                        }
                        else {
                            lottery.speed = 100;
                            roll();
                            click = true;
                            return false;
                        }
                    } else {
                        showDiv("对不起，非法进入，请通过正规途径参与！");
                    }
                })
        }
    });
});
