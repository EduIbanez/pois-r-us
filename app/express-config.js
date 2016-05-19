// =============================================================================
//  This file configures the express application and its routes
// =============================================================================

var express  = require('express');          // Route management framework
var override = require('method-override');  // PUT, PATCH and DELETE methods
var parser   = require('body-parser');      // Parser for requests' body
var mongoose = require('mongoose');         // MongoDB driver for node
var morgan   = require('morgan');           // Request logger
var path     = require('path');             // Tools for managing fs routes

var config = require("../config");

var userRoutes = require('./route-handlers/user-routes');
var poiRoutes  = require('./route-handlers/poi-routes');
var routeRoutes = require('./route-handlers/route-routes');
var authRoutes = require('./route-handlers/auth-routes');


/* CONFIG VALUES */

var staticFiles = config.statics || path.join(__dirname + '/../public');
var commonFiles = path.join(__dirname + '/../common');


/* MIDDLEWARE SETUP (ORDER DOES MATTER) */

var app  = express(); // Express application

// Set frontend files' path
app.use('/', express.static(staticFiles));
app.use('/common', express.static(commonFiles));

// Log incoming requests
if (config.log.enabled) app.use(morgan(config.log.level));

// Middleware that will allow us to decode request parameteres
app.use(parser.json());
app.use(parser.urlencoded({ 'extended': 'false' }));
app.use(parser.json({ type: 'application/vnd.api+json' }));
app.use(override());

//Enable Cross Origin Requests (only for the API)
app.use('/api/', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
               'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

// Add the routes to the application
app.use('/api/', userRoutes);
app.use('/api/', poiRoutes);
app.use('/api/', routeRoutes);
app.use('/api/', authRoutes);

// Serve the angular application on root
app.get('/', function(req, res) {
    res.sendFile('index.html', {'root': 'public'});
});

module.exports = app;
