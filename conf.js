/**
 * Created by admin on 2016-09-26.
 */

module.exports = {
    redis: {   //缓存数据库配置
        host: '127.0.0.1',
        port: 6379,
        db: 10
    },
    orm: {   //MySQL数据库配置
         database: "squarelife",
         protocol: "mysql",
         host: "127.0.0.1",
         user: "root",
         password: "123456",
         query: {pool: true, debug: false}
    },
    wechat: {   //微信相关配置
        token: '',    //对接注册token
        appid: '',    
        appsecret: '',
        paykey:''
    }
}
