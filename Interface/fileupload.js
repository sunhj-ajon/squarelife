/**
 * Created by admin on 2016-11-15.
 */

var bodyParse = require('koa-better-body');
var fs = require('fs');
var path = require('path');

router.post('/file/upload', bodyParse({multipart: true}), uploadfile)

function *uploadfile() {
    try {
        var files = this.request.fields.upfile;
        if (files && files.length > 0) {
            for (var item in files) {
                var tmpath = files[item]['path'];
                var tmparr = files[item]['name'].split('.');
                var ext = '.' + tmparr[tmparr.length - 1];
                var newpath = path.join('./view/media/upload', parseInt(Math.random() * 100) + Date.parse(new Date()).toString() + ext);
                var stream = fs.createWriteStream(newpath);//创建一个可写流
                fs.createReadStream(tmpath).pipe(stream);//可读流通过管道写入可写流
            }
            this.body = msg.msgResult(msg.code.success, this.request.header.origin + "/" + newpath.replace('view/', ''));
        } else {
            this.body = msg.msgResult(msg.code.success, this.request.header.origin + "/");
        }
    } catch (err) {
        console.log(err);
    }
}