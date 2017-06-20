/**
 * Created by admin on 2016-10-11.
 */

module.exports = wechatFriendSql = function () {
    var wechatFriendModel = orm_db.define("tbwechat_friend", {
        id: {type: 'number', key: true},
        origid: String,
        nickname: String,
        photo: String,
        openid: String,
        area: String,
        sex: Number,
        state: Number,
        unionid: String,
        createtime: String,
        updatetime: String,
        tel: String,
        money: Number,
        addr: String
    }, {cache: false});
    return {
        find: function (nickname, pageindex, callback) {
            var sql = "select * from tbwechat_friend where 1=1" + (nickname ? " and nickname like '%" + nickname + "%'" : "");
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
        opendapi_findone: function (openid, callback) {
            var sql = "SELECT tbf.nickname,tbf.money,tbf.tel,tbf.photo,tbf.addr FROM tbwechat_friend tbf WHERE tbf.openid='" + openid + "'";
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
        subscribe: function (content, callback) {
            wechatFriendModel.find({openid: content.openid}, function (err, d_fens) {
                if (!d_fens || d_fens.length == 0) {
                    wechatFriendModel.create(content, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(false);
                        }
                    });
                }
                else {
                    d_fens[0].nickname = content.nickname;
                    d_fens[0].photo = content.photo;
                    d_fens[0].area = content.area;
                    d_fens[0].sex = content.sex;
                    d_fens[0].updatetime = content.updatetime;
                    d_fens[0].state = 1;

                    d_fens[0].save(function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(false);
                        }
                    })
                }
            })
        },
        unsubscribe: function (openid, callback) {
            var sql = "update tbwechat_friend set state=0 where openid='" + openid + "'";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },
        /**
         * 更新电话手机号
         * @param openid
         * @param tel
         */
        update_tel: function (openid, tel, addr, callback) {
            var sql = "update tbwechat_friend set tel='" + tel + "',addr='" + addr + "' where  openid='" + openid + "'";

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