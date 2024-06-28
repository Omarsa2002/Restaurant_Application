const CONFIG = require('../config/config.js');

module.exports = {
    v1routes: function (app) {
        app.use(`${CONFIG.BASEURL}/auth`, require('./auth/auth.route.js'));
        //app.use(`${CONFIG.BASEURL}/user`, require("./user/user.route.js"));
        app.use(`${CONFIG.BASEURL}/food`, require("./food/food.route.js")); 
    }
};
