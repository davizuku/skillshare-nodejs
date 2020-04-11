const helpers = require('./helpers');

var handlers = {};

handlers.index = function (data, callback) {
    if (data.method == 'get') {
        helpers.getTemplate('index', function (err, str) {
            if (!err && str) {
                callback(200, str);
            } else {
                callback(500);
            }
        });
    } else {
        callback(405);
    }
};

handlers.ping = function (data, callback) {
    callback(200);
};

handlers.notFound = function (data, callback) {
    callback(404);
};

module.exports = handlers;
