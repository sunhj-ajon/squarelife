/**
 * Created by admin on 2016-09-27.
 */

module.exports = suggestSql = function () {
    var suggestModel = orm_db.define("tb_suggest", {
        id: {type: 'number', key: true},
        openid: String,
        content: String,
        label: String,
        createdtime: Date
    }, {cache: false});
    return {
        /**
         * 管理端查询意见
         * @param pageindex
         * @param callback
         */
        find: function (pageindex, callback) {
            var sql = "SELECT aa.id,bb.nickname,aa.label,aa.createdtime,aa.content FROM tb_suggest aa,tbwechat_friend bb WHERE aa.openid=bb.openid ORDER BY aa.createdtime desc";

            orm_db.driver.execQuery(sql, function (err, result) {
                if (err) {
                    callback(true, err);
                } else {
                    callback(false, result);
                }
            })
        },
        /**
         * webapp端 新增意见
         * @param content
         * @param callback
         */
        openapi_add: function (body, callback) {
            suggestModel.create({
                "content": body.content,
                "openid": body.openid,
                "label": body.label,
                "createdtime": new Date()
            }, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(false);
                }
            });
        }
    }
}();