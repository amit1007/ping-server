const crypto = require('crypto');

module.exports = {
    isLoggedIn: function isLoggedIn(req, res, next) {
        //console.log(req.isAuthenticated());
    if (req.isAuthenticated())
        return next();
 
    res.sendStatus(401);
    }
}