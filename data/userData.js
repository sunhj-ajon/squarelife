/**
 * Created by admin on 2016-09-27.
 */

module.exports = userSql = function () {
    var userModel = orm_db.define("tbbase_user", {
        id: {type: 'number', key: true},
        username: String,
        password: String,
        name: String,
        power: String,
        createtime: Date
    }, {cache: false});
    return {
        find: function (pageindex, callback) {
            userModel.find(['createtime', 'Z']).run(function (err, result) {
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
            content.createtime = new Date();
            userModel.find({id: content.id}, function (err, d_user) {
                if (!d_user || d_user.length == 0) {
                    delete content.id;
                    userModel.create(content, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(false);
                        }
                    });
                } else {
                    d_user[0].username = content.username;
                    d_user[0].password = content.password;
                    d_user[0].name = content.name;
                    d_user[0].power = content.power;
                    d_user[0].createtime = content.createtime;

                    d_user[0].save(function (err, result) {
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
            userModel.find({id: id}, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    if (result && result.length != 0) {
                        callback(false, result[0]);
                    } else {
                        callback(false, "");
                    }
                }
            })
        },
        del: function (id, callback) {
            userModel.find({id: id}).remove(function (err) {
                if (err) { //操作失败
                    callback(err);
                } else { //操作成功
                    callback(false);
                }
            })
        },
        login: function (condition, callback) {
            userModel.find({
                username: condition.user,
                password: condition.pwd
            }).only('name', 'power').run(function (err, result) {
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