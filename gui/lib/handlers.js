const helpers = require('./helpers');

var handlers = {};

handlers.index = function (data, callback) {
    if (data.method == 'get') {
        var templateData = {
            'head.title': 'Uptime Monitoring - Made Simple',
            'head.description': 'We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down, we\'ll send you a text to let you know',
            'body.class': 'index',
        };
        helpers.getTemplate('index', templateData, function(err, str) {
            if (!err && str) {
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        callback(200, str, 'html');
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

handlers.favicon = function (data, callback) {
    if (data.method == 'get') {
        helpers.getStaticAsset('favicon.ico', function (err, data) {
            if (!err && data) {
                callback(200, data, 'favicon');
            } else {
                callback(500);
            }
        });
    } else {
        callback(405);
    }
};

handlers.public = function (data, callback) {
    if (data.method == 'get') {
        var trimmedAssetName = data.trimmedPath.replace('public/', '');
        if (trimmedAssetName.length > 0) {
            helpers.getStaticAsset(trimmedAssetName, function (err, data) {
                if (!err && data) {
                    var contentType = 'plain';
                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css';
                    } else if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png';
                    } else if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    } else if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    } else if (trimmedAssetName.indexOf('.js') > -1) {
                        contentType = 'js';
                    }
                    callback(200, data, contentType);
                } else {
                    callback(500);
                }
            });
        } else {
            callback(404);
        }
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
