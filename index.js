// =============================================================================
//  This file is the entry point for the whole application. It's responsible
//  for launching the server on application start and for stopping it on ctrl-c
// =============================================================================

var readline = require('readline');
var server = require('./app/server');

// If running on windows, emit SIGINT on ^C from stdin, watch
// http://stackoverflow.com/a/14861513/3376793 for more info
if (process.platform === 'win32') {
    var lineReader = readline.createInterface({
        input  : process.stdin,
        output : process.stdout
    });
    lineReader.on('SIGINT', function() { process.emit('SIGINT'); })
}

// Gracefully close server on Ctrl-c
process.on('SIGINT', function() {
    console.log("Closing server")
    server.close(function() { process.exit(); });
});

// Start server
server.start();
