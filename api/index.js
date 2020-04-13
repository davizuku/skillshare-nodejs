
const server = require('./lib/server');
const workers = require('./lib/workers');

var app = {};

app.init = function(callback) {
    server.init();
    workers.init();
    // In the original code, CLI is started here using a setTimeout.
    callback();
};

// Self invoke only if required directly
if (require.main === module) {
    app.init(function(){});
}

module.exports = app;
