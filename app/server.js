// =============================================================================
//  This file is the entry point for the server. Here are defined the start and
//  stop functions, which configure the router, the database connection and
//  the server itself.
// =============================================================================

/* DEPENDENCIES */
// -----------------------------------------------------------------------------
//External packages
var express  = require('express');          // Route management framework
var override = require('method-override');  // PUT, PATCH and DELETE methods
var parser   = require('body-parser');      // Parser for requests' body
var mongoose = require('mongoose');         // MongoDB driver for node
var morgan   = require('morgan');           // Request logger
var path     = require('path');             // Tools for managing fs routes
//Internal dependencies
var routes = require("./route-handlers");
var config = require("../config");


/* SERVER CONFIG */
// -----------------------------------------------------------------------------
var app  = express(); // Initialise express application
var port = process.env.PORT || config.port || 3000;
var staticFiles = config.statics || path.join(__dirname + '/../public');
var commonFiles = path.join(__dirname + '/../common');

/* Middleware setup (ORDER DOES MATTER) */
// Set frontend files' path
app.use('/', express.static(staticFiles));
app.use('/common', express.static(commonFiles));
// Log incoming requests
if (config.log.enabled) app.use(morgan(config.log.level));
// Middleware that will allow us to decode request parameteres
app.use(parser.json());
app.use(parser.urlencoded({'extended': 'false'}));
app.use(parser.json({ type: 'application/vnd.api+json' }));
app.use(override());
// Last, add the routes to the application
app.use(routes);


/* DEFINE STARTUP AND SHUTDOWN FUNCTIONS */
// -----------------------------------------------------------------------------
var server; // Keep a reference to the server instance

/*
 * Connects to the database and starts the server. It takes a callback, that
 * can be executed once everything is done.
 */
function start(cb) {
    mongoose.connect(config.database.uri);
    server = app.listen(port, function() {
        console.log("Something beautiful is happening on port " + port);
        if (cb) cb();
    });
}

/*
 * Disconnects from the database and stops the server. It takes a callback,
 * that can be executed once everything is done.
 */
function close(cb) {
    mongoose.connection.close(function() {
        console.log('Terminated mongoose connection');
        server.close(function() {
            console.log('Shutting down the server');
            if (cb) cb();
        });
    });
};

module.exports = {
    start: start,
    close: close,
}
