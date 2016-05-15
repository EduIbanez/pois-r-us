var express   = require('express');
var crypto    = require('crypto');
var apiPaths  = require('../../common/api-routes');
var UserModel = require('../models/user-model');
var formatConversor = require('../format-conversor');
var authMiddleware  = require('./auth-middleware');

var router = express.Router();

router.route(apiPaths.USERS)
    .get(function(req, res) {
        UserModel.find({},
                       { _id: 1, first_name: 1, last_name: 1 },
                       function(err, data) {
            if (err) {
                var response = { error: true, message: 'Error fetching data' };
                res.status(500).json(response);
            } else {
                var response = {
                    error: false,
                    message: data.map(formatConversor.userDBtoAPI)
                };
                res.json(response);
            }
        });
    })
    .post(function(req, res) {
        var _password = crypto.randomBytes(4).toString('hex');
        new UserModel(formatConversor.userAPItoDB({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: _password
        })).save(function(err, data) {
            if (err) {
                var response = { error: true, message: err };
                res.status(400).json(response);
            } else {
                var response = {
                    error: false,
                    message: formatConversor.userDBtoAPI(data),
                    password: _password
                };
                res.json(response);
            }
        });
    });

router.route(apiPaths.SINGLE_USER)
    .get(authMiddleware.basicHttp, function(req, res) {
        var projection = { _id: 1, first_name: 1, last_name: 1, created_at: 1 };
        if (req.auth.id && req.auth.id.toString() === req.params.userId) {
            projection.email = 1;
        }
        UserModel.findById(req.params.userId, projection, function(err, data) {
            if (err) {
                var response = { error: true, message: err };
                res.status(400).json(response);
            } else if (data) {
                var response = {
                    error: false,
                    message: formatConversor.userDBtoAPI(data)
                };
                res.json(response);
            } else {
                var response = { error: true, message: data };
                res.status(404).json(response);
            }
        });
    })
    .put(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        var _newData = formatConversor.userAPItoDB(req.body);
        if (req.auth.id.toString() === req.params.userId) {
            UserModel.findById(req.params.userId, function(err, data) {
                if (err) {
                    var response = { error: true, message: err };
                    res.status(500).json(response);
                } else if (data) {
                    data.email      = _newData.email || data.email;
                    data.password   = _newData.password || data.password;
                    data.first_name = _newData.first_name || data.first_name;
                    data.last_name  = _newData.last_name || data.last_name;
                    data.save(function(err, data) {
                        if(err) {
                            var response = { error: true, message: err };
                            res.status(400).json(response);
                        } else {
                            var response = {
                                error: false,
                                message: formatConversor.userDBtoAPI(data)
                            };
                            res.json(response);
                        }
                    });
                } else {
                    var response = { error: true, message: data };
                    res.status(404).json(response);
                }
            });
        } else {
            res.status(401).json({ error: true, message: 'Not authorized' });
        }
    })
    .delete(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        if (req.auth.id.toString() === req.params.userId) {
            UserModel.findByIdAndRemove(req.params.userId, function(err, data) {
                var response = {};
                if(err) {
                    response = { error: true, message: err };
                    res.status(500).json(response);
                } else if (data) {
                    response = {
                        error: false,
                        message: formatConversor.userDBtoAPI(data)
                    };
                    res.json(response);
                } else {
                    response = { error: true, message: data };
                    res.status(404).json(response);
                }
            });
        } else {
            res.status(401).json({ error: true, message: 'Not authorized' });
        }
    });

// THIS IS ONLY FOR DEBUGGING 
router.get('/debug/:userId/checkInterception', authMiddleware.basicHttp, function(req, res) {
    res.json({ message: 'That was easy, man', auth: req.auth });
});
router.get('/debug/:userId/checkRestriction', authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
    res.json({ message: 'You did it, man!!'});
});

module.exports = router;
