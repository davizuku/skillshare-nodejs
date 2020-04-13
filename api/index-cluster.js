
const server = require('./lib/server');
const workers = require('./lib/workers');
const cluster = require('cluster');
const os = require('os');

var app = {};

app.init = function(callback) {
    if (cluster.isMaster) {
        workers.init();
        // In the original code, CLI is started here using a setTimeout.
        callback();

        for (var i = 0; i < os.cpus().length; i++) {
            cluster.fork(); // This will execute the entire file again.
        }
    } else {
        // If not the master thread, start the HTTP server
        server.init();
    }
};

// Self invoke only if required directly
if (require.main === module) {
    app.init(function(){});
}

module.exports = app;
