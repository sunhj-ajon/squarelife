/**
 * Created by admin on 2016-09-28.
 */

module.exports = l_route = function () {
    return {
        init: function () {
            require('../Interface/token.js');
            require('../Interface/user.js');
            require('../Interface/wechatFriend.js');
            require('../Interface/shops.js');
            require('../Interface/ad.js');
            require('../Interface/goods.js');
            require('../Interface/sms.js');
            require('../Interface/demand.js');
            require('../Interface/grab.js');
            require('../Interface/wechat.js');
            require('../Interface/fileupload.js');
            require('../Interface/suggest.js');
            require('../Interface/applywithdrawals.js');
            require('../Interface/withdrawcash.js');
            require('../Interface/doshborad.js');
        }
    }
}();