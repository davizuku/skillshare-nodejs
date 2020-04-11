
const fs = require('fs');
const path = require('path');
const config = require('./config');

var lib = {};

// Node will throw an error if JSON parsing fails. This function avoids this.
lib.parseJsonToObject = function (str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
};

lib.getTemplate = function (templateName, data, callback) {
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ?
        templateName :
        false;
    data = typeof (data) == 'object' && data !== null ? data : {};
    if (templateName) {
        var templatesDir = path.join(__dirname + '/../templates/');
        fs.readFile(templatesDir + templateName + '.html', 'utf8', function (err, str) {
            if (!err && str && str.length > 0) {
                finalStr = lib.interpolate(str, data);
                callback(false, finalStr);
            } else {
                callback('No template could be found');
            }
        });
    } else {
        callback('A valid template name was not specified');
    }
};

lib.addUniversalTemplates = function(str, data, callback) {
    str = typeof (str) == 'string' && str.length > 0 ? str : '';
    data = typeof (data) == 'object' && data !== null ? data : {};
    lib.getTemplate('_header', data, function (err, headerString) {
        if (!err && headerString) {
            lib.getTemplate('_footer', data, function (err, footerString) {
                if (!err && footerString) {
                    var fullString = headerString + str + footerString;
                    callback(false, fullString);
                } else {
                    callback('Could not find the footer template');
                }
            });
        } else {
            callback('Could not find the header template');
        }
    });
}

lib.interpolate = function (str, data) {
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};
    for (var keyName in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(keyName)) {
            data['global.' + keyName] = config.templateGlobals[keyName];
        }
    }
    for (var key in data) {
        if (data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
            var replace = data[key];
            var find = '{' + key + '}';
            str = str.replace(find, replace);
        }
    }
    return str;
};

lib.getStaticAsset = function (fileName, callback) {
    fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
    if (fileName) {
        var publicDir = path.join(__dirname + '/../public/');
        fs.readFile(publicDir + fileName, function (err, data) {
            if (!err && data) {
                callback(false, data);
            } else {
                callback('No file could be found');
            }
        });
    } else {
        callback('A valid file name was not specified');
    }
};

module.exports = lib;
