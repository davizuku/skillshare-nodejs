
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

module.exports = helpers;
