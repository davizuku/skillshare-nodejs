
const path = require('path');
const fs = require('fs');
const _data = require('./data');
const https = require('https');
const http = require('http');
const helpers = require('./helpers');
const url = require('url');
const _logs = require('./logs')

var workers = {};

workers.gatherAllChecks = function (){
    _data.list('checks', function (err, checks) {
        if (!err && checks && checks.length > 0) {
            checks.forEach(function (check) {
                _data.read('checks', check, function (err, originalCheckData) {
                    if (!err && originalCheckData) {
                        workers.validateCheckData(originalCheckData);
                    } else {
                        console.log("Error reading one of the check's data");
                    }
                });
            });
        } else {
            console.log("Error: could not find any checks to process");
        }
    });
};

workers.validateCheckData = function(checkData) {
    checkData = typeof(checkData) == 'object' && checkData !== null ?
        checkData :
        {};
    checkData.id = typeof(checkData.id) == 'string' && checkData.id.trim().length == 20 ?
        checkData.id :
        false;
    checkData.userPhone = typeof(checkData.userPhone) == 'string' && checkData.userPhone.trim().length == 10 ?
        checkData.userPhone :
        false;
    checkData.protocol = typeof(checkData.protocol) == 'string' && ['http', 'https'].indexOf(checkData.protocol) > -1 ?
        checkData.protocol :
        false;
    checkData.url = typeof (checkData.url) == 'string' && checkData.url.trim().length > 0 ?
        checkData.url :
        false;
    checkData.method = typeof (checkData.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(checkData.method) > -1 ?
        checkData.method :
        false;
    checkData.successCodes = typeof(checkData.successCodes) == 'object' && checkData.successCodes instanceof Array && checkData.successCodes.length > 0 ?
        checkData.successCodes :
        false;
    checkData.timeoutSeconds = typeof (checkData.timeoutSeconds) == 'number' && checkData.timeoutSeconds % 1 === 0 && checkData.timeoutSeconds > 0 && checkData.timeoutSeconds <= 5 ?
        checkData.timeoutSeconds :
        false;
    // Keys added by the workers
    checkData.state = typeof (checkData.state) == 'string' && ['up', 'down'].indexOf(checkData.state) > -1 ?
        checkData.state :
        'down';
    checkData.lastChecked = typeof (checkData.lastChecked) == 'number' && checkData.lastChecked % 1 === 0 && checkData.lastChecked > 0 ?
        checkData.lastChecked :
        false;

    if (checkData.id &&
        checkData.userPhone &&
        checkData.protocol &&
        checkData.url &&
        checkData.method &&
        checkData.successCodes &&
        checkData.timeoutSeconds
    ) {
        workers.performCheck(checkData);
    } else {
        console.log("Error: One of the checks is not properly formtted. Skipping it.");
    }
};

workers.performCheck = function(checkData) {
    var checkOutcome = {
        'error': false,
        'responseCode': false,
    };
    var outcomeSent = false;
    var parsedUrl = url.parse(checkData.protocol + '://' + checkData.url, true);
    var hostName = parsedUrl.hostname;
    var path = parsedUrl.path; // using path and not "pathname" because we want the querystring
    var requestDetails = {
        'protocol': checkData.protocol + ':',
        'hostname': hostName,
        'method': checkData.method.toUpperCase(),
        'path': path,
        'timeout': checkData.timeoutSeconds * 1000,
    };
    var _moduleToUse = checkData.protocol == 'http' ? http : https;
    var req = _moduleToUse.request(requestDetails, function (res) {
        var status = res.statusCode;
        checkOutcome.responseCode = status;
        if (!outcomeSent) {
            workers.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });
    req.on('error', function (e) {
        checkOutcome.error = {
            'error': true,
            'value': e,
        };
        if (!outcomeSent) {
            workers.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });
    req.on('timeout', function (e) {
        checkOutcome.error = {
            'error': true,
            'value': 'timeout',
        };
        if (!outcomeSent) {
            workers.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });
    req.end();
};

workers.processCheckOutcome = function(checkData, checkOutcome) {
    var state = !checkOutcome.error && checkOutcome.responseCode && checkData.successCodes.indexOf(checkOutcome.responseCode) > -1 ?
        'up' :
        'down';
    var alertWarranted = checkData.lastChecked && checkData.state != state;
    var timeOfCheck = Date.now();
    workers.log(checkData, checkOutcome, state, alertWarranted, timeOfCheck);

    var newCheckData = checkData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeOfCheck;
    _data.update('checks', newCheckData.id, newCheckData, function (err) {
        if (!err) {
            if (alertWarranted) {
                workers.alertUserToStatusChange(newCheckData);
            } else {
                console.log('Check outcome has not changed, no alert needed');
            }
        } else {
            console.log('Error trying to save updates to one of the checks');
        }
    });
};

workers.alertUserToStatusChange = function (checkData) {
    var msg = 'Alert: Your check for ' + checkData.method.toUpperCase() + ' ' +
        checkData.protocol + '://' + checkData.url + ' is currently ' + checkData.status;
    helpers.sendTwilioSms(checkData.userPhone, msg, function (err) {
        if (!err) {
            console.log("Success: User was alerted to a status change in their check, via sms: ", msg);
        } else {
            console.log("Error: Could not send sms alert to user who had a state change in their check");
        }
    });
};

workers.log = function(checkData, checkOutcome, state, alertWarranted, timeOfCheck) {
    var logData = {
        'check': checkData,
        'outcome': checkOutcome,
        'state': state,
        'alert': alertWarranted,
        'time': timeOfCheck,
    };
    var logString = JSON.stringify(logData);
    var logFileName = checkData.id;
    _logs.append(logFileName, logString, function(err) {
        if (!err) {
            console.log("Logging to file succeeded");
        } else {
            console.log("Logging to file failed");
        }
    });
};

workers.loop = function() {
    setInterval(function (){
        workers.gatherAllChecks();
    }, 1000 * 10);
};

workers.init = function() {
    workers.gatherAllChecks();
    workers.loop();
};

module.exports = workers;
