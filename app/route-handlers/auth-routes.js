var express   = require('express');
var apiPaths  = require('../../common/api-routes');
var authMiddleware = require('./auth-middleware');

var router = express.Router();

router.route(apiPaths.AUTH)
    .get(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        var response = { error: false, message: req.auth };
        res.json(response);
    })

module.exports = router;
