var express   = require('express');
var crypto    = require('crypto');
var apiPaths  = require('../../common/api-routes');
var UserModel = require('../models/user-model');

var router = express.Router();

router.route(apiPaths.USERS)
    .get(function(req, res) {
        UserModel.find({}, function(err, data) {
            var response = {};
            if (err) {
                response = { error: true, message: 'Error fetching data' };
                res.status(500).json(response);
            } else {
                response = { error: false, message: data };
                res.json(response);
            }
        });
    })
    .post(function(req, res) {
        var _password = crypto.randomBytes(16).toString('hex');
        new UserModel({
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: _password
        }).save(function(err, data) {
            var response = {};
            if (err) {
                response = { error: true, message: err };
                res.status(400).json(response);
            } else {
                response = { error: false, message: data, password: _password };
                res.json(response);
            }
        });
    });

router.route(apiPaths.SINGLE_USER)
    .get(function(req, res) {
        UserModel.findById(req.params.userId, function(err, data) {
            var response = {};
            if(err) {
                response = { error: true, message: err };
                res.status(400).json(response);
            } else if (data) {
                response = { error: false, message: data };
                res.json(response);
            } else {
                response = { error: true, message: data };
                res.status(404).json(response);
            }
        });
    })
    .put(function(req, res) {
        UserModel.findById(req.params.userId, function(err, data) {
            var response = {};
            if(err) {
                response = { error: true, message: err };
                res.status(500).json(response);
            } else if (data) {
                data.email = req.body.email || data.email;
                data.password = req.body.password || data.password;
                data.first_name = req.body.first_name || data.first_name;
                data.last_name = req.body.last_name || data.last_name;
                data.save(function(err, data) {
                    if(err) {
                        response = { error: true, message: err };
                        res.status(400).json(response);
                    } else {
                        response = { error: false, message: data };
                        res.json(response);
                    }
                });
            } else {
                response = { error: true, message: data };
                res.status(404).json(response);
            }
        });
    })
    .delete(function(req, res) {
        UserModel.findByIdAndRemove(req.params.userId, function(err, data) {
            var response = {};
            if(err) {
                response = { error: true, message: err };
                res.status(500).json(response);
            } else if (data) {
                response = { error: false, message: data };
                res.json(response);
            } else {
                response = { error: true, message: data };
                res.status(404).json(response);
            }
        });
    })

// THIS IS ONLY FOR DEBUGGING 
// Try this at /api/debug/:userId/checkPass?password=:password
router.get('/debug/:userId/checkPass', function(req, res) {
    UserModel.findById(req.params.userId, function(err, data) {
        data.validatePassword(req.query.password, function(err, match) {
            var response = {};
            if (err) {
                response = { error: true, message: err };
                res.status(500).json(response);
            } else {
                response = { error: false, match: match };
                res.json(response);
            }
        });
    });
});

module.exports = router;
