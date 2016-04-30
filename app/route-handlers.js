// =============================================================================
//  This file defines the endpoints of the RESTful API and the routes of the
//  application
// =============================================================================

var express = require('express');
var mongoOp = require("./models/mongo");
var API_ROUTES = require('../common/api-routes');


/* API ROUTES */
// -----------------------------------------------------------------------------
var apiRoutes = express.Router();

//Enable Cross Origin Requests (only for the API)
apiRoutes.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// API entry point
apiRoutes.route(API_ROUTES.USERS)
    .get(function(req, res) {
        var response = {};
        mongoOp.find({}, function(err, data) {
            // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else {
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    })
    .post(function(req, res) {
        console.log(req.body);
        var db = new mongoOp();
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        db.userEmail = req.body.email;
        // Hash the password using SHA1 algorithm.
        db.userPassword =  require('crypto')
            .createHash('sha1')
            .update(req.body.password)
            .digest('base64');

        db.save(function(err) {
            // save() will run insert() command of MongoDB.
            // it will add new data in collection.
            if(err) {
                response = {"error" : true, "message" : "Error adding data"};
                res.json(response);

            } else {
                mongoOp.find({}, function(err, data) {
                    // Mongo command to fetch all data from collection.
                    if(err) {
                        response = {"error" : true, "message" : "Error fetching data"};
                    } else {
                        response = {"error" : false, "message" : data};
                    }
                    res.json(response);
                });
            }
        });
    });

apiRoutes.route(API_ROUTES.USERS + "/:id")
    .get(function(req, res) {
        var response = {};
        mongoOp.findById(req.params.id, function(err, data) {
            // This will run Mongo Query to fetch data based on ID.
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else {
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    })
    .put(function(req, res) {
        var response = {};
        // first find out record exists or not
        // if it does then update the record
        mongoOp.findById(req.params.id, function(err, data) {
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else {
                // we got data from Mongo.
                // change it accordingly.
                if(req.body.userEmail !== undefined) {
                    // case where email needs to be updated.
                    data.userEmail = req.body.userEmail;
                }
                if(req.body.userPassword !== undefined) {
                    // case where password needs to be updated
                    data.userPassword = req.body.userPassword;
                }
                // save the data
                data.save(function(err) {
                    if(err) {
                        response = {"error" : true, "message" : "Error updating data"};
                    } else {
                        response = {"error" : false, "message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    })
    .delete(function(req, res) {
        var response = {};
        // find the data
        mongoOp.findById(req.params.id, function(err, data) {
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else {
                // data exists, remove it.
                mongoOp.remove({_id : req.params.id}, function(err) {
                    if(err) {
                        response = {"error" : true, "message" : "Error deleting data"};
                        res.json(response);
                    } else {
                        mongoOp.find({}, function(err, data) {
                            // Mongo command to fetch all data from collection.
                            if(err) {
                                response = {"error" : true, "message" : "Error fetching data"};
                            } else {
                                response = {"error" : false, "message" : data};
                            }
                            res.json(response);
                        });
                    }
                });
            }
        });
    })

/* GLOBAL ROUTES */
// -----------------------------------------------------------------------------
// API endpoints go under '/api' route. Other routes are redirected to
// index.html where AngularJS will handle frontend routes.
var routes = express.Router();
routes.use('/api', apiRoutes);
routes.get('/', function(req, res) {
    res.sendFile('index.html', {'root': 'public'});
});

module.exports = routes;