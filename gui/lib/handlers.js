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

handlers.accountCreate = function (data, callback) {
    if (data.method == 'get') {
        var templateData = {
            'head.title': 'Create an Account',
            'head.description': 'Sign up is easy and only takes a few seconds',
            'body.class': 'accountCreate',
        };
        helpers.getTemplate('accountCreate', templateData, function (err, str) {
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

handlers.sessionCreate = function (data, callback) {
    if (data.method == 'get') {
        var templateData = {
            'head.title': 'Login to your Account',
            'head.description': 'Please enter your phone number and password to access your account',
            'body.class': 'sessionCreate',
        };
        helpers.getTemplate('sessionCreate', templateData, function (err, str) {
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

handlers.sessionDeleted = function (data, callback) {
    if (data.method == 'get') {
        var templateData = {
            'head.title': 'Logged Out',
            'head.description': 'You have been logged out of your account',
            'body.class': 'sessionDeleted',
        };
        helpers.getTemplate('sessionDeleted', templateData, function (err, str) {
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

handlers.accountEdit = function (data, callback) {
    if (data.method == 'get') {
        var templateData = {
            'head.title': 'Account Settings',
            'body.class': 'accountEdit',
        };
        helpers.getTemplate('accountEdit', templateData, function (err, str) {
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

handlers.accountDeleted = function (data, callback) {
    if (data.method == 'get') {
        var templateData = {
            'head.title': 'Account Deleted',
            'head.description': 'Your account has been deleted',
            'body.class': 'accountDeleted',
        };
        helpers.getTemplate('accountDeleted', templateData, function (err, str) {
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

handlers.checksCreate = function (data, callback) {
    if (data.method == 'get') {
        var templateData = {
            'head.title': 'Create a new check',
            'body.class': 'checksCreate',
        };
        helpers.getTemplate('checksCreate', templateData, function (err, str) {
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

handlers.checksList = function (data, callback) {
    if (data.method == 'get') {
        var templateData = {
            'head.title': 'Dashboard',
            'body.class': 'checksList',
        };
        helpers.getTemplate('checksList', templateData, function (err, str) {
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
