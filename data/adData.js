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
        find: function (callback) {
            adModel.find().run(function (err, result) {
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
            adModel.find().remove(function (err) {
                if (err) { //操作失败
                    callback(err);
                } else { //操作成功
                    adModel.create(content, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(false);
                        }
                    });
                }
            })
        }
    }
}();