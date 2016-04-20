// =============================================================================
//  This file defines the endpoints of the RESTful API and the routes of the
//  application
// =============================================================================

var express    = require('express');
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
apiRoutes.get(API_ROUTES.GREETING, function(req, res) {
    // res.set('Content-Type', 'text/plain');
    // res.send('Welcome to the coolest API this side of the Mississippi :D');
    res.json({message: "Welcome to the coolest API this side of the Mississippi!"});
});


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
