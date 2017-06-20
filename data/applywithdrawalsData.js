/**
 * Created by admin on 2016-10-18.
 */


module.exports = applywithdrawalsSql = function () {
    var applywithdrawalsModel = orm_db.define("tb_apply_withdrawals", {
        innerid: {type: 'text', key: true},
        openid: String,
        createdtime: String,
        money: Number,
        channel: Number,
        state: Number,
        remark: String
    }, {cache: false});
    return {
        find: function (callback) {
            var sql = "SELECT aa.innerid,bb.nickname,aa.createdtime,aa.money,aa.channel,aa.state,aa.openid FROM tb_apply_withdrawals aa,tbwechat_friend bb WHERE aa.openid=bb.openid ";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },
        openapi_find_one: function (content, callback) {
            applywithdrawalsModel.count({openid: content.openid, state: 1}, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    if (result && result.length != 0) {
                        callback(false, result);
                    } else {
                        callback(false, "");
                    }
                }
            })
        },
        openapi_add: function (content, callback) {
            applywithdrawalsModel.create(content, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(false);
                }
            });
        },
        /**
         * 支付提现
         * @param content
         * @param callback
         */
        pay: function (content, callback) {
            var sql = "CALL sp_add_withdraw_cash('" + content.innerid + "','" + content.money + "','" + content.person + "','" + content.remark + "')";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err || result.t_error) {
                    callback(true, true);
                } else {
                    callback(false, false);
                }
            })
        },
    }
}();