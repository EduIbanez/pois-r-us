var express  = require('express');
var apiPaths = require('../../common/api-routes');
var PoiModel = require('../models/poi-model');
var formatConversor = require('../format-conversor');
var authMiddleware  = require('./auth-middleware');

var router = express.Router();

router.route(apiPaths.POIS)
    .get(function(req, res) {
        PoiModel.find({}, function(err, data) {
            var response = {};
            if(err) {
                response = { error: true, message: err };
                res.status(500).json(response);
            } else {
                response = {
                    error: false,
                    message: data.map(formatConversor.poiDBtoAPI)
                };
                res.json(response);
            }
        });
    })
    .post(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        new PoiModel({
            name: req.body.name,
            description: req.body.description,
            owner_id: req.auth.id,
            file_uri: req.body.file_uri,
            coordinates: {
                lat: req.body.lat,
                lon: req.body.lon
            }
        }).save(function(err, data) {
            var response = {};
            if (err) {
                response = { error: true, message: err };
                res.status(400).json(response);
            } else {
                response = {
                    error: false,
                    message: formatConversor.poiDBtoAPI(data)
                };
                res.json(response);
            }
        });
    });

router.route(apiPaths.SINGLE_POI)
    .get(function(req, res) {
        PoiModel.findById(req.params.poiId, function(err, data) {
            var response = {};
            if(err) {
                response = { error: true, message: err };
                res.status(500).json(response);
            } else {
                response = {
                    error: false,
                    message: formatConversor.poiDBtoAPI(data)
                };
                res.json(response);
            }
        });
    })
    .put(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        PoiModel.findById(req.params.poiId, function(err, data) {
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
                // Coordinates, score and number of votes shouldn't
                // be updated through PUT /pois/:poiId
                data.name = req.body.name || data.name;
                data.description = req.body.description || data.description;
                data.file_uri = req.body.file_uri;
                data.save(function(err, data) {
                    if(err) {
                        response = { error: true, message: err };
                        res.status(400).json(response);
                    } else {
                        response = {
                            error: false,
                            message: formatConversor.poiDBtoAPI(data)
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
        PoiModel.findByIdAndRemove(req.params.poiId, function(err, data) {
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
                    message: formatConversor.poiDBtoAPI(data)
                };
                res.json(response);
            } else {
                response = { error: true, message: data };
                res.status(404).json(response);
            }
        });
    })

router.route(apiPaths.POI_RATINGS)
    .post(authMiddleware.basicHttp, authMiddleware.authRestriction, function(req, res) {
        PoiModel.findById(req.params.poiId, function(err, data) {
            var response = {};
            if(err) {
                response = { error: true, message: err };
                res.status(500).json(response);
            } else if (data) {
                data.addRating(req.body.score, function(err, data) {
                    if(err) {
                        response = { error: true, message: err };
                        res.status(400).json(response);
                    } else {
                        response = {
                            error: false,
                            message: formatConversor.poiDBtoAPI(data)
                        };
                        res.json(response);
                    }
                });
            } else {
                response = { error: true, message: data };
                res.status(404).json(response);
            }
        });
    });

router.route(apiPaths.MAX)
    .get(function(req, res) {
        //PoiModel.find().sort({_id:-1}).limit(1).pretty()
        PoiModel.find({$query:{}, $orderby : { avg_punctuation : -1 }}, function(err, data) {
            var response = {};
            if(err) {
                response = { error: true, message: err };
                res.status(500).json(response);
            } else {
                response = {
                    error: false,
                    message: data.map(formatConversor.poiDBtoAPI)
                };
                res.json(response);
            }
        });
    })

module.exports = router;
