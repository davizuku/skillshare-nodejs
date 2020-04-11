const helpers = require('./helpers');

var handlers = {};

handlers.index = function (data, callback) {
    if (data.method == 'get') {
        var templateData = {
            'head.title': 'This is the title',
            'head.description': 'This is the meta description',
            'body.title': 'Hello templated world',
            'body.class': 'index',
        };
        helpers.getTemplate('index', templateData, function(err, str) {
            if (!err && str) {
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        callback(200, str);
                    } else {
                        callback(500);
                    }
                });
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
