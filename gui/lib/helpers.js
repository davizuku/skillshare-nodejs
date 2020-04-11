
const fs = require('fs');
const path = require('path');

var lib = {};

// Node will throw an error if JSON parsing fails. This function avoids this.
lib.parseJsonToObject = function (str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
};

lib.getTemplate = function (templateName, callback) {
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ?
        templateName :
        false;
    if (templateName) {
        var templatesDir = path.join(__dirname + '/../templates/');
        fs.readFile(templatesDir + templateName + '.html', 'utf8', function (err, str) {
            if (!err && str && str.length > 0) {
                callback(false, str);
            } else {
                callback('No template could be found');
            }
        });
    } else {
        callback('A valid template name was not specified');
    }
};

module.exports = lib;
