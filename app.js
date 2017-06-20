/**
 * Created by sunhj on 2016-09-23.
 */

const koa = require('koa');
var cors = require('koa-cors');
const app = koa();
global.conf = require('./conf.js');
const sunhj = require('sunhj-js');
const _msg = require('./lib/msg_lib');
global.msg = new _msg();
const _number = require('./lib/number_lib');
global.numCode = new _number();
var koa_Body = require('koa-body');
global.koaBody = new koa_Body();

app.use(cors());
const require_lib = require('./lib/require_lib');
const schedule = require('node-schedule');
const job = require("./lib/schedule_lib");

sunhj.run(app, function (err) {
    if (!err) {
        require_lib.init();

        schedule.scheduleJob({hour: 1, minute: 59}, function () {
            var _job = new job();
            _job.work();
        });
    }
});
app.listen(3000);

