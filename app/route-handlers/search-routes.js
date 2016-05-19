var express  = require('express');
var apiPaths = require('../../common/api-routes');
var UserModel = require('../models/user-model');
var PoiModel = require('../models/poi-model');
var formatConversor = require('../format-conversor');

var router = express.Router();

router.route(apiPaths.SEARCH_USERS)
    .get(function(req, res) {
        UserModel.find({
            $or: [
                {first_name: {'$regex': req.query.first_name}},
                {last_name: {'$regex': req.query.last_name}}
            ]
        }, function (err, data) {
            var response = {};
            if (err) {
                response = {error: true, message: err};
                res.status(500).json(response);
            } else {
                response = {
                    error: false,
                    message: data.map(formatConversor.userDBtoAPI)
                };
                res.json(response);
            }
        });
    });

router.route(apiPaths.SEARCH_POIS)
    .get(function(req, res) {
        PoiModel.find({$or:[
            {name : {'$regex' : req.query.name}},
            {description : {'$regex' : req.query.description}}
        ]}, function(err, data) {
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
    });

module.exports = router;
