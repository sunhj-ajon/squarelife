/**
 * Created by admin on 2016-10-18.
 */


module.exports = adSql = function () {
    var adModel = orm_db.define("tb_ad", {
        id: {type: 'number', key: true},
        name: String,
        img_url: String,
        href_url: String
    }, {cache: false});
    return {
        find_wechat_friend_count: function (callback) {
            var sql = "SELECT COUNT(1) as `count` FROM tbwechat_friend";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result[0].count);
                }
            })
        },
        find_demand_count: function (callback) {
            var sql = "SELECT COUNT(1) as `count` FROM tb_demand";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result[0].count);
                }
            })
        },
        find_grad_count: function (callback) {
            var sql = "SELECT COUNT(1) as `count` FROM tb_grab";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result[0].count);
                }
            })
        },
        find_money_count: function (callback) {
            var sql = "SELECT (SUM(service_money)+SUM(base_money)) as `count` FROM tb_grab";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result[0].count);
                }
            })
        },
        find_demand_day_list: function (callback) {
            var sql = "SELECT DATE_FORMAT(createdtime,'%d/%m') AS `date`,COUNT(1) AS `count` FROM tb_demand GROUP BY DATE_FORMAT(createdtime,'%Y-%m-%d') ORDER BY createdtime DESC LIMIT 7";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },
        find_grad_day_list: function (callback) {
            var sql = "SELECT DATE_FORMAT(createdtime,'%d/%m') AS `date`,COUNT(1) AS `count` FROM tb_grab GROUP BY DATE_FORMAT(createdtime,'%Y-%m-%d') ORDER BY createdtime DESC LIMIT 7";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },
        find_commission_day_list: function (callback) {
            var sql = "SELECT DATE_FORMAT(createdtime,'%d/%m') AS `date`,SUM(money) AS `count` FROM tb_commission GROUP BY DATE_FORMAT(createdtime,'%Y-%m-%d') ORDER BY createdtime DESC LIMIT 7";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },
    }
}();