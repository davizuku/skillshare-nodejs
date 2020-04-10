
const crypto = require('crypto');
const config = require('../config');
const https = require('https');
const querystring = require('querystring');

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

helpers.sendTwilioSms = function (phone, msg, callback) {
    phone = typeof(phone) == 'string' && phone.trim().length <= 10 ?
        phone.trim() :
        false;
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ?
        msg.trim() :
        false;
    if (phone && msg) {
        var payload = {
            'From': config.twilio.fromPhone,
            'To': '+34' + phone,
            'Body': msg,
        };
        var stringPayload = querystring.stringify(payload);
        var requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
            'auth': config.twilio.accountSid + ':' + config.twilio.authToken,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload),
            }
        };
        var req = https.request(requestDetails, function(res) {
            var status = res.statusCode;
            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback('Status code returned was ' + statusCode)
            }
        });
        req.on('error', function(e) {
            callback(e);
        });
        req.write(stringPayload);
        req.end();
    } else {
        callback('Given parameters were missing or invalid');
    }
};

module.exports = helpers;
