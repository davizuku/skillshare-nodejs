const cli = require('./lib/cli');

var app = {};

app.init = function() {
    setTimeout(function () {
        cli.init();
    }, 50);
};

app.init();

module.exports = app;
