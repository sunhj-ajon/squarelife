/**
 * Created by admin on 2016-10-18.
 */


module.exports = withdrawcashSql = function () {
    var withdrawcashModel = orm_db.define("tb_withdraw_cash", {
        innerid: {type: 'text', key: true},
        openid: String,
        createdtime: String,
        money: Number,
        channel: Number,
        person: String,
        remark: String,
        imglist: String
    }, {cache: false});
    return {
        find: function (callback) {
            var sql = "SELECT aa.innerid,bb.nickname,aa.createdtime,aa.money,aa.channel,aa.remark,aa.person,aa.openid,bb.photo FROM tb_withdraw_cash aa,tbwechat_friend bb WHERE aa.openid=bb.openid";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        }
    }
}();