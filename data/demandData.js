/**
 * Created by admin on 2016-10-18.
 */

var demandRelationData = require('./demandRelationData');
var wechatFriendData = require('./wechatFriendData')

module.exports = demandSql = function () {
    var demandModel = orm_db.define("tb_demand", {
        innerid: {type: 'text', key: true},
        no: String,
        openid: String,
        title: String,
        exec_addr: String,
        deliver_addr: String,
        starttime: Date,
        base_money: Number,
        service_money: Number,
        longitude: String,
        state: Number,
        createdtime: Date,
        remark: String,
        shopid: Number
    }, {cache: false});
    return {
        /**
         * 后台管理端
         * @param pageindex
         * @param callback
         */
        find: function (pageindex, callback) {
            var sql = "SELECT CONCAT(d.innerid,d.grabid) AS innerid,d.no,d.title,f.nickname,f.tel,d.base_money,d.service_money,d.createdtime,d.state FROM tb_demand d,tbwechat_friend f WHERE d.openid=f.openid ORDER BY d.createdtime desc";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },

        /**
         * 查询某一个需求的信息
         * @param innerid
         * @param callback
         */
        one: function (innerid, callback) {
            var sql = "SELECT aa.payno,aa.service_money,aa.base_money,bb.title,DATE_FORMAT(bb.createdtime,'%Y-%m-%d') AS createdtime,bb.openid,bb.innerid FROM tb_grab aa,tb_demand bb WHERE aa.demand_id=bb.innerid AND aa.innerid='" + innerid + "'";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result[0]);
                }
            })
        },

        /**
         * webapp端新增一个需求单
         * @param content
         * @param callback
         */
        openapi_add: function (content, callback) {
            content.createtime = new Date();
            demandModel.create({
                innerid: content.innerid,
                no: content.no,
                openid: content.openid,
                title: content.title,
                exec_addr: content.exec_addr,
                deliver_addr: content.deliver_addr,
                starttime: content.createtime,
                base_money: content.base_money,
                service_money: content.service_money,
                longitude: JSON.stringify(content.longitude),
                state: 1,
                createdtime: content.createtime,
                remark: content.remark,
                shopid: content.shopid,
                grabid:'a'
            }, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    demandRelationData.openapi_add(content.goods, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(false);
                        }
                    })
                    //更新手机号
                    wechatFriendData.update_tel(content.openid, content.mobile, content.deliver_addr, function () {

                    })
                }
            });
        },

        /**
         * webapp端查询所有需求单
         * @param pageindex 页码
         */
        openapi_list: function (pageindex, openid, callback) {
            var limit = " limit " + pageindex * 10 + ",10";
            var where = openid ? " AND aa.openid='" + openid + "' " : " AND aa.state=1 AND DATE_ADD(aa.starttime,INTERVAL 20 HOUR)>=NOW() ";
            var sql = "SELECT CONCAT(aa.innerid,aa.grabid) AS innerid,aa.innerid as dinnerid,aa.title,`no`,aa.openid,bb.photo,bb.tel,aa.longitude,aa.base_money," +
                "aa.service_money,aa.exec_addr,aa.deliver_addr,aa.remark,aa.state,ss.name AS shopname," +
                "ss.logo AS shoplogo,ss.addr AS shopaddr,cc.base_money as gbase_money,cc.service_money as gservice_money,cc.state as gstate" +
                " FROM tb_demand aa LEFT JOIN tb_grab cc ON cc.demand_id=aa.innerid,tbwechat_friend bb,tb_shops ss" +
                " WHERE aa.openid=bb.openid AND ss.id=aa.shopid " + where + " ORDER BY aa.createdtime DESC " + limit;
            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },

        /**
         * 根据需求单ID获取需求单及抢单详情
         * @param payno
         * @param callback
         */
        openapi_findall_by_demandid: function (demandid, grad_id, callback) {
            var sql = " SELECT bb.innerid as dinnerid,bb.no,bb.title,bb.exec_addr,bb.deliver_addr,(select concat(cc.nickname,'(',cc.tel,')') from tbwechat_friend cc where cc.openid=bb.openid) as dnickname, " +
                " bb.base_money as dbase_money,bb.remark as dremark,bb.service_money AS dservice_money, bb.state as dstate,bb.remark as dremark,aa.state AS gstate," +
                " (SELECT concat(dd.nickname,'(',dd.tel,')') FROM tbwechat_friend dd WHERE dd.openid=aa.openid) AS gnickname,aa.base_money AS gbase_money,aa.service_money AS gservice_money,aa.remark as gremark, " +
                " ss.name as shopname,ss.logo as shoplogo,ss.addr as shopaddr,aa.innerid as ginnerid " +
                " FROM tb_demand bb LEFT JOIN tb_grab aa ON aa.demand_id=bb.innerid,tb_shops ss " +
                " WHERE bb.shopid=ss.id AND CONCAT(bb.innerid,IFNULL(aa.innerid,'a'))='" + demandid + "'";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result[0]);
                }
            })
        }
    }
}();