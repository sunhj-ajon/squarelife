/**
 * Created by Administrator on 2016/12/8.
 */

module.exports = job = function () {
    job.prototype.work = function () {
        var grabData = require('../data/grabData');
        console.log('%d - job_work function is start:', new Date());
        grabData.find_no_complete_grad(function (err, result) {
            if (!err && result.length > 0) {
                result.forEach(function (index, item) {
                    grabData.openapi_update_grad_state({innerid: result.innerid}, function (err, result) {
                        if (err) {
                            console.error('%d - job_work function is error,err-msg is:' + e, new Date());
                        } else {
                            console.log('%d - job_work function result:' + result, new Date());
                        }
                    });
                })
            }
        });
    }
}