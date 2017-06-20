/**
 * Created by admin on 2016-10-18.
 */

module.exports = demandRelationSql = function () {
    var demandRelationModel = orm_db.define("tb_demand_relation", {
        id: {type: 'number', key: true},
        demand_id: String,
        goods_id: Number,
        count: Number
    }, {cache: false});
    return {
        /**
         * webapp端新增一个需求单（增加需求商品）
         * @param content
         * @param callback
         */
        openapi_add: function (content, callback) {
            demandRelationModel.create(content, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(false);
                }
            });
        },
        /**
         * webapp端查询所有需求单的商品列表信息
         */
        openapi_list: function (condition, callback) {
            var sql = "SELECT bb.demand_id,cc.name,cc.rebate_price,bb.count,cc.img ,cc.shopid " +
                " FROM tb_demand_relation bb,tb_goods cc " +
                " WHERE cc.id=bb.goods_id AND bb.demand_id in(" + condition + ")";
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