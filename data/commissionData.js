/**
 * Created by admin on 2016-10-18.
 */


module.exports = commissionSql = function () {
    var commissionModel = orm_db.define("tb_commission", {
        id: {type: 'number', key: true},
        money: Number,
        demand_id: String,
        grad_id: String,
        createdtime: Date,
        state: Number
    }, {cache: false});
    return {
        find: function (callback) {
            commissionModel.find().run(function (err, result) {
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
            commissionModel.create(content, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(false);
                }
            });
        }
    }
}();