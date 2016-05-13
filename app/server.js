// =============================================================================
//  This file is the entry point for the server. Here are defined the start and
//  stop functions, which configure the router, the database connection and
//  the server itself.
// =============================================================================

var mongoose   = require('mongoose');
var expressApp = require("./express-config");
var config     = require("../config");

var server;  // Keep a reference to the server instance
var port = process.env.PORT || config.port || 3000;

/*
 * Connects to the database and starts the server. It takes a callback, that
 * can be executed once everything is done.
 */
function start(cb) {
    mongoose.connect(config.database.uri);
    server = expressApp.listen(port, function() {
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
