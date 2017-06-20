/**
 * Created by admin on 2016-10-26.
 */

module.exports = shopsSql = function () {
    var goodsModel = orm_db.define("tb_goods", {
        id: {type: 'number', key: true},
        shopid: Number,
        name: String,
        old_price: Number,
        rebate_price: Number,
        stock_num: Number,
        unit: String,
        img: String,
        introduction: String,
        createdtime: Date,
        state: Number
    }, {cache: false});
    return {
        /**
         * 管理端列表查询
         * @param name
         * @param pageindex
         * @param callback
         */
        find: function (pageindex, shopid, callback) {
            var sql = "SELECT g.*,s.name AS shopname FROM tb_goods g,tb_shops s WHERE g.state=0 and s.id=g.shopid and s.id='" + shopid + "'";
            orm_db.driver.execQuery(sql, function (err, result) {
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
        add: function (content, callback) {
            content.createdtime = new Date();
            content.state = 0;
            goodsModel.find({id: content.id}, function (err, d_good) {
                if (!d_good || d_good.length == 0) {
                    delete content.id;
                    goodsModel.create(content, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(false);
                        }
                    });
                } else {
                    d_good[0].name = content.name;
                    d_good[0].shopid = content.shopid;
                    d_good[0].old_price = content.old_price;
                    d_good[0].rebate_price = content.rebate_price;
                    d_good[0].stock_num = content.stock_num;
                    d_good[0].unit = content.unit;
                    d_good[0].img = content.img;
                    d_good[0].introduction = content.introduction;
                    d_good[0].createdtime = content.createdtime;

                    d_good[0].save(function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(false);
                        }
                    })
                }
            })
        },
        one: function (id, callback) {
            goodsModel.find({id: id}, function (err, result) {
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
        del: function (id, callback) {
            var sql = "update tb_goods set state=1 where id=" + id;

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(false);
                }
            })

            //goodsModel.find({id: id}).remove(function (err) {
            //    if (err) { //操作失败
            //        callback(err);
            //    } else { //操作成功
            //        callback(false);
            //    }
            //})
        },
        /**
         *  webapp端查询(根据店铺ID获取商品列表)
         * @param name
         * @param pageindex
         * @param callback
         */
        openapi_find: function (shopid, pageindex, callback) {
            goodsModel.find({
                shopid: shopid,
                state: 0
            }, ['createdtime', 'Z']).limit(8).offset(pageindex * 8).run(function (err, result) {
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
        /**
         *  webapp端查询(根据商品关键字查询商品列表)
         * @param name
         * @param callback
         */
        openapi_search: function (name, callback) {
            var sql = "SELECT g.id AS goodsid, g.name AS goodsname,s.id AS shopid,s.name AS shopname,s.logo as shoplogo,s.type as shoptype FROM tb_goods g,tb_shops s WHERE g.state=0 AND g.shopid = s.id AND g.name LIKE '%" + name + "%'";
            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },
        /**
         * 查询商品信息
         * @param name
         * @param pageindex
         * @param callback
         */
        findbygoodidlist: function (shopid, goodidlist, callback) {
            var sql = "SELECT id,name,rebate_price FROM tb_goods WHERE shopid='" + shopid + "' AND  FIND_IN_SET(id,'" + goodidlist + "')";
            orm_db.driver.execQuery(sql, function (err, result) {
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
    }
}();