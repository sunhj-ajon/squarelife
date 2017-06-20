/**
 * Created by admin on 2016-11-03.
 */

module.exports = NumComm = function () {
    /**
     * 生成流水号
     * @param type 流水单类型（A：需求单；B：抢单）
     */
    NumComm.prototype.getCode = function (type) {
        var _date = new Date();
        var y = _date.getFullYear();
        var m = _date.getMonth() + 1;
        var d = _date.getDate();
        var h = _date.getHours();
        var mn = _date.getMinutes();
        var s = _date.getSeconds();
        var ms = _date.getMilliseconds();

        var _random_num = (Math.random() * 1000).toFixed(0);
        var date_code = type + y + m + d + h + mn + s + ms + _random_num;
        return date_code;
    }
}