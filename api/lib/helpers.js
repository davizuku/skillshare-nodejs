
const crypto = require('crypto');
const config = require('../config');

var helpers = {};

helpers.hash = function (str) {
    if (typeof(str) == 'string' && str.length > 0) {
        return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    }
    return false;
}

// Node will throw an error if JSON parsing fails. This function avoids this.
helpers.parseJsonToObject = function (str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
}

helpers.createRandomString = function(strLength) {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        var possibleCharacters = 'abcdefghijklmnoprstuvwxyz0123456789';
        var str = '';
        for (var i = 0; i < strLength; i++) {
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomCharacter;
        }
        return str;
    } else {
        return false;
    }
}

module.exports = helpers;
