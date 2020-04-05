
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

var httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});
httpServer.listen(config.httpPort, function() {
    console.log("The server is listening on port " + config.httpPort + " in " + config.envName + " mode");
});
var httpsServerOptions = {
    'key': fs.readFileSync(__dirname + '/https/key.pem'),
    'cert': fs.readFileSync(__dirname + '/https/cert.pem'),
};
var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res);
});
httpsServer.listen(config.httpsPort, function() {
    console.log("The server is listening on port " + config.httpsPort + " in " + config.envName + " mode");
});

var unifiedServer = function (req, res) {
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var method = req.method.toLowerCase();
    var queryStringObject = parsedUrl.query; // This is available due to second parameter in url.parse
    var headers = req.headers
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ?
            router[trimmedPath] :
            handlers.notFound;
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer,
        };
        chosenHandler(data, function (statusCode, payload) {
            statusCode = typeof (statusCode) !== 'undefined' ? statusCode : 200;
            payload = typeof (payload) === 'object' ? payload : {};
            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log({
                'request': data,
                'response': payload,
            });
        });
    });
};

var handlers = {};

handlers.ping = function(data, callback) {
    callback(200);
};

handlers.notFound = function(data, callback) {
    callback(404);
};

var router = {
    'ping': handlers.ping,
};
