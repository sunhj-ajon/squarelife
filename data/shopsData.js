/**
 * Created by admin on 2016-10-18.
 */

module.exports = shopsSql = function () {
    var shopsModel = orm_db.define("tb_shops", {
        id: {type: 'number', key: true},
        name: String,
        logo: String,
        contacts: String,
        telephone: String,
        mobile: String,
        introduction: String,
        state: Number,
        addr: String,
        sort: Number,  //0表示正常；1表示下架（数据库设计文档中是返回的，文档就不改了）
        longitude: String,
        isrecommend: Number,
        type: String,
        sale_count: Number,
        createdtime: String
    }, {cache: false});
    return {
        /**
         * 管理端列表查询
         * @param name
         * @param pageindex
         * @param callback
         */
        find: function (pageindex, callback) {
            shopsModel.find({sort: 0}, ["createdtime", "Z"]).run(function (err, result) {
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
        findlist: function (shopidlist, callback) {
            var sql = "SELECT id,name,logo,addr FROM tb_shops WHERE FIND_IN_SET(id,'" + shopidlist + "') ";
            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },
        add: function (content, callback) {
            content.createdtime = new Date();
            content.sale_count = 0;
            shopsModel.find({id: content.id}, function (err, d_shop) {
                if (!d_shop || d_shop.length == 0) {
                    delete content.id;
                    shopsModel.create(content, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(false);
                        }
                    });
                } else {
                    d_shop[0].name = content.name;
                    d_shop[0].logo = content.logo;
                    d_shop[0].contacts = content.contacts;
                    d_shop[0].telephone = content.telephone;
                    d_shop[0].mobile = content.mobile;
                    d_shop[0].introduction = content.introduction;
                    d_shop[0].state = content.state;
                    d_shop[0].addr = content.addr;
                    d_shop[0].sort = content.sort;
                    d_shop[0].longitude = content.longitude;
                    d_shop[0].isrecommend = content.isrecommend;
                    d_shop[0].createdtime = content.createdtime;
                    d_shop[0].type = content.type;

                    d_shop[0].save(function (err, result) {
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
            shopsModel.find({id: id}, function (err, result) {
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
            var sql = "update tb_shops set sort=1 where id=" + id;

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(false);
                }
            })
            //shopsModel.find({id: id}).remove(function (err) {
            //    if (err) { //操作失败
            //        callback(err);
            //    } else { //操作成功
            //        callback(false);
            //    }
            //})
        },
        /**
         *  webapp端查询(获取店铺列表)
         * @param name
         * @param pageindex
         * @param callback
         */
        openapi_find: function (pageindex, callback) {
            shopsModel.find({
                isrecommend: 0,
                sort: 0
            }, ['createdtime', 'Z']).limit(10).offset(pageindex * 10).run(function (err, result) {
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
         * webapp端查询（获取推荐店铺前6个）
         * @param callback
         */
        openapi_findbyrecommend: function (callback) {
            shopsModel.find({isrecommend: 1, sort: 0}, ['createdtime', 'Z']).limit(9).run(function (err, result) {
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
        }
    }
}();