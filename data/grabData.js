/**
 * Created by admin on 2016-10-18.
 */


module.exports = grabSql = function () {
    var grabModel = orm_db.define("tb_grab", {
        innerid: {type: 'text', key: true},
        demand_id: String,
        openid: String,
        service_money: Number,
        createdtime: Date,
        remark: String,
        base_money: Number,
        state: Number,
        payno: String,
        pay_state: Number
    }, {cache: false});
    return {
        /**
         * 后台管理端
         * @param pageindex
         * @param callback
         */
        find: function (pageindex, callback) {
            var sql = "SELECT aa.innerid,cc.nickname,bb.title,aa.createdtime,aa.service_money," +
                "aa.base_money,aa.state,aa.pay_state,CONCAT(bb.innerid,aa.innerid) as demand_id  " +
                "FROM tb_grab aa,tb_demand bb,tbwechat_friend cc " +
                "WHERE aa.demand_id=bb.innerid AND aa.openid=cc.openid ORDER BY aa.createdtime DESC";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },
        /**
         * 抢单
         * @param content
         * @param callback
         */
        openapi_add: function (content, callback) {
            var sql = "CALL sp_add_grad('" + content.innerid + "','" + content.demand_id + "','" + content.openid + "'," + content.service_money + "," + content.base_money + ",'" + content.remark + "')"
            orm_db.driver.execQuery(sql, function (err, result) {
                if (err || result.t_error) {
                    callback(true, err);
                } else {
                    callback(false, result[0]);
                }
            })
        },
        /**
         * 确认价格
         * @param content
         * @param callback
         */
        openapi_confirm_price: function (content, callback) {
            var sql = `update tb_grab set state=5,base_money=${content.base_money},service_money=${content.service_money},remark=concat(remark,'${content.remark}') where innerid='${content.innerid}'`;
            //var sql = "update tb_grab set state=4,base_money=" + content.base_money + ",remark=concat(remark,'," + content.remark + "') where innerid='" + content.innerid + "'";;
            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, true);
                }
            })
        },
        /**
         * 取消订单
         * @param content
         * @param callback
         */
        openapi_cancel: function (content, callback) {
            var sql = "CALL sp_cancel_grad('" + content.innerid + "','" + content.demand_id + "')";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err || result.t_error) {
                    callback(true, err);
                } else {
                    callback(false, result[0]);
                }
            })
        },
        /**
         * 获取当前粉丝用户的抢单
         * @param
         * @param callback
         */
        openapi_list: function (pageindex, openid, callback) {
            var limit = " limit " + pageindex * 10 + ",10";
            var where = openid ? " AND aa.openid='" + openid + "' " : "";
            var sql = "SELECT aa.innerid,CONCAT(bb.innerid,aa.innerid) as demand_id,bb.innerid as dinnerid,aa.service_money,aa.base_money,aa.state,aa.createdtime,bb.title," +
                "bb.createdtime AS dcreatedtime,bb.deliver_addr,bb.exec_addr " +
                "FROM tb_grab aa,tb_demand bb WHERE aa.demand_id=bb.innerid " + where + " ORDER BY aa.createdtime DESC" + limit;
            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },
        /**
         * 根据支付码获取支付信息
         * @param payno
         * @param callback
         */
        one_by_payno: function (payno, callback) {
            var sql = "SELECT aa.*,bb.openid as dopenid,bb.no FROM tb_grab aa,tb_demand bb WHERE aa.demand_id=bb.innerid AND FIND_IN_SET(aa.state,'5') AND aa.pay_state<>1 and aa.payno='" + payno + "'";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },
        /**
         * 支付后，更新支付状态
         * @param payno
         * @param callback
         */
        update_pay_state: function (payno, pay_state, callback) {
            var sql = "update tb_grab set pay_state=" + pay_state + ",state=1 where payno='" + payno + "'";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },
        /**
         * 根据支付码获取需求单及抢单详情
         * @param payno
         * @param callback
         */
        openapi_findall_by_payno: function (payno, callback) {
            var sql = " SELECT bb.innerid AS dinnerid,bb.no,bb.title,bb.exec_addr,bb.deliver_addr,aa.pay_state as pay_state, " +
                " (SELECT CONCAT(cc.nickname,'(',cc.tel,')') FROM tbwechat_friend cc WHERE cc.openid=bb.openid) AS dnickname, " +
                " bb.base_money AS dbase_money,bb.remark AS dremark,bb.service_money AS dservice_money, aa.openid as gopenid," +
                " (SELECT CONCAT(dd.nickname,'(',dd.tel,')') FROM tbwechat_friend dd WHERE dd.openid=aa.openid) AS gnickname, " +
                " aa.base_money AS gbase_money,aa.service_money AS gservice_money,aa.remark AS gremark,bb.state as dstate," +
                " ss.name AS shopname,ss.logo AS shoplogo,ss.addr AS shopaddr " +
                " FROM tb_grab aa,tb_demand bb,tb_shops ss  " +
                " WHERE aa.demand_id=bb.innerid AND bb.shopid=ss.id AND  aa.payno='" + payno + "'";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result[0]);
                }
            })
        },
        /**
         * 送单完成后，更新状态
         * @param content
         * @param callback
         */
        openapi_update_grad_state: function (content, callback) {
            var sql = "CALL sp_update_grad_state('" + content.innerid + "')"
            orm_db.driver.execQuery(sql, function (err, result) {
                if (err || result.t_error) {
                    callback(true, err);
                } else {
                    callback(false, result[0]);
                }
            })
        },
        /**
         * 查询超3天未完成的抢单
         */
        find_no_complete_grad: function (callback) {
            var sql = "SELECT innerid FROM tb_grab WHERE state=1 AND DATE_ADD(createdtime,INTERVAL 3 DAY)<NOW()";
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