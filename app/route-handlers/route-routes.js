var express  = require('express');
var apiPaths = require('../../common/api-routes');
var RouteModel = require('../models/route-model');
var formatConversor = require('../format-conversor');
var authMiddleware  = require('./auth-middleware');

var router = express.Router();

router.route(apiPaths.ROUTES)
    .get(function(req, res) {
        RouteModel.find({}, function(err, data) {
            var response = {};
            if(err) {
                response = { error: true, message: err };
                res.status(500).json(response);
            } else {
                response = {
                    error: false,
                    message: data.map(formatConversor.routeDBtoAPI)
                };
                res.json(response);
            }
        });
    })
    .post(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        new RouteModel({
            name: req.body.name,
            owner_id: req.auth.id,
            pois: req.body.pois
        }).save(function(err, data) {
            var response = {};
            if (err) {
                response = { error: true, message: err };
                res.status(400).json(response);
            } else {
                response = {
                    error: false,
                    message: formatConversor.routeDBtoAPI(data)
                };
                res.json(response);
            }
        });
    });

router.route(apiPaths.SINGLE_ROUTE)
    .get(function(req, res) {
        RouteModel.findById(req.params.routeId, function(err, data) {
            var response = {};
            if(err) {
                response = { error: true, message: err };
                res.status(500).json(response);
            } else {
                response = {
                    error: false,
                    message: formatConversor.routeDBtoAPI(data)
                };
                res.json(response);
            }
        });
    })
    .put(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        RouteModel.findById(req.params.routeId, function(err, data) {
            var response = {};
            if(err) {
                response = { error: true, message: err };
                res.status(500).json(response);
            } else if (data && req.auth.id !== data.owner_id && !req.auth.isAdmin) {
                response = {
                    error: true,
                    message: 'Not authorized to PUT to ' + req.url
                };
                res.status(401).json(response);
            } else if (data) {
                // Score and number of votes shouldn't
                // be updated through PUT /routes/:routes
                data.name = req.body.name || data.name;
                data.pois = req.body.pois || data.pois;
                data.save(function(err, data) {
                    if(err) {
                        response = { error: true, message: err };
                        res.status(400).json(response);
                    } else {
                        response = {
                            error: false,
                            message: formatConversor.routeDBtoAPI(data)
                        };
                        res.json(response);
                    }
                });
            } else {
                response = { error: true, message: data };
                res.status(404).json(response);
            }
        });
    })
    .delete(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        RouteModel.findByIdAndRemove(req.params.RouteId, function(err, data) {
            var response = {};
            if(err) {
                response = { error: true, message: err };
                res.status(500).json(response);
            } else if (data && req.auth.id !== data.owner_id && !req.auth.isAdmin) {
                response = {
                    error: true,
                    message: 'Not authorized to PUT to ' + req.url
                };
                res.status(401).json(response);
            } else if (data) {
                response = {
                    error: false,
                    message: formatConversor.routeDBtoAPI(data)
                };
                res.json(response);
            } else {
                response = { error: true, message: data };
                res.status(404).json(response);
            }
        });
    });

module.exports = router;
