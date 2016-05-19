var express   = require('express');
var crypto    = require('crypto');
var apiPaths  = require('../../common/api-routes');
var UserModel = require('../models/user-model');
var PoiModel  = require('../models/poi-model');
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
        var projection = {
            _id: 1,
            first_name: 1,
            last_name: 1,
            followees: 1,
            favourites: 1,
            created_at: 1
        };
        if (req.auth.id && (req.auth.id.toString() === req.params.userId
                            || req.auth.isAdmin)) {
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

router.route(apiPaths.USER_FOLLOWEES)
    .get(function(req, res) {
        UserModel.findById(req.params.userId, { followees: 1 })
            .then(function(data) {
                if (data) {
                    var projection = { first_name: 1, last_name: 1 };
                    return UserModel.find({ _id: { $in: data.followees }},
                                          projection);
                } else {
                    return null;
                }
            })
            .then(function(data) {
                if (data) {
                    var response = {
                        error: false,
                        message: data.map(formatConversor.userDBtoAPI)
                    };
                    res.json(response);
                } else {
                    var response = { error: true, message: 'User not found' };
                    res.status(404).json(response);
                }
            })
            .catch(function(err) {
                var response = { error: true, message: err };
                res.status(500).json(response);
            });
    })
    .post(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        if (req.auth.id.toString() === req.params.userId) {
            UserModel.findById(req.params.userId, function(err, data) {
                var response = {};
                if(err) {
                    response = { error: true, message: err };
                    res.status(500).json(response);
                } else if (!req.body.followee) {
                    response = { error: true, message: '"followee" field required' };
                    res.status(400).json(response);
                } else if (data
                           && data.followees.indexOf(req.body.followee) === -1) {
                    data.followees.push(req.body.followee);
                    data.save(function(err, data) {
                        if(err) {
                            response = { error: true, message: err };
                            res.status(500).json(response);
                        } else {
                            response = {
                                error: false,
                                message: 'You are following ' + req.body.followee
                            };
                            res.json(response);
                        }
                    });
                } else if (data) { // Already following that user
                    response = {
                        error: false,
                        message: 'You are already following ' + req.body.followee
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
    })
    .delete(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        if (req.auth.id.toString() === req.params.userId) {
            UserModel.findById(req.params.userId, function(err, data) {
                var response = {};
                if(err) {
                    response = { error: true, message: err };
                    res.status(500).json(response);
                } else if (!req.body.followee) {
                    response = { error: true, message: '"followee" field required' };
                    res.status(400).json(response);
                } else if (data) {
                    data.followees.splice(data.followees.indexOf(req.body.followee));
                    data.save(function(err, data) {
                        if(err) {
                            response = { error: true, message: err };
                            res.status(500).json(response);
                        } else {
                            response = {
                                error: false,
                                message: 'You not are following '
                                    + req.body.followee
                                    + ' anymore'
                            };
                            res.json(response);
                        }
                    });
                } else {
                    response = { error: true, message: data };
                    res.status(404).json(response);
                }
            });
        } else {
            res.status(401).json({ error: true, message: 'Not authorized' });
        }
    });

router.route(apiPaths.USER_FAVOURITES)
    .get(function(req, res) {
        UserModel.findById(req.params.userId, { favourites: 1 })
            .then(function(data) {
                if (data) {
                    return PoiModel.find({ _id: { $in: data.favourites }});
                } else {
                    return null;
                }
            })
            .then(function(data) {
                if (data) {
                    var response = {
                        error: false,
                        message: data.map(formatConversor.poiDBtoAPI)
                    };
                    res.json(response);
                } else {
                    var response = { error: true, message: 'User not found' };
                    res.status(404).json(response);
                }
            })
            .catch(function(err) {
                var response = { error: true, message: err };
                res.status(500).json(response);
            });
    })
    .post(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        if (req.auth.id.toString() === req.params.userId) {
            UserModel.findById(req.params.userId, function(err, data) {
                var response = {};
                if(err) {
                    response = { error: true, message: err };
                    res.status(500).json(response);
                } else if (!req.body.poi) {
                    response = { error: true, message: '"poi" field required' };
                    res.status(400).json(response);
                } else if (data
                           && data.favourites.indexOf(req.body.followee) === -1) {
                    data.favourites.push(req.body.poi);
                    data.save(function(err, data) {
                        if(err) {
                            response = { error: true, message: err };
                            res.status(500).json(response);
                        } else {
                            response = {
                                error: false,
                                message: 'POI ' + req.params.userId
                                    + ' added to favourites'
                            };
                            res.json(response);
                        }
                    });
                } else if (data) { // Already following that user
                    response = {
                        error: false,
                        message: 'POI ' + req.params.userId
                            + ' already in favourites'
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
    })
    .delete(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        if (req.auth.id.toString() === req.params.userId) {
            UserModel.findById(req.params.userId, function(err, data) {
                var response = {};
                if(err) {
                    response = { error: true, message: err };
                    res.status(500).json(response);
                } else if (!req.body.poi) {
                    response = { error: true, message: '"poi" field required' };
                    res.status(400).json(response);
                } else if (data) {
                    data.favourites.splice(data.favourites.indexOf(req.body.poi));
                    data.save(function(err, data) {
                        if(err) {
                            response = { error: true, message: err };
                            res.status(500).json(response);
                        } else {
                            response = {
                                error: false,
                                message: 'POI '
                                    + req.params.userId
                                    + ' is not your favourite anymore'
                            };
                            res.json(response);
                        }
                    });
                } else {
                    response = { error: true, message: data };
                    res.status(404).json(response);
                }
            });
        } else {
            res.status(401).json({ error: true, message: 'Not authorized' });
        }
    });

module.exports = router;
