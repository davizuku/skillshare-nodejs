const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
var debug = util.debuglog('server');

var server = {};

server.httpServer = http.createServer(function (req, res) {
    server.unifiedServer(req, res);
});

server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../../https/cert.pem')),
};
server.httpsServer = https.createServer(server.httpsServerOptions, function (req, res) {
    server.unifiedServer(req, res);
});

server.unifiedServer = function (req, res) {
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
        var chosenHandler = typeof (server.router[trimmedPath]) !== 'undefined' ?
            server.router[trimmedPath] :
            handlers.notFound;
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer),
        };
        chosenHandler(data, function (statusCode, payload) {
            statusCode = typeof (statusCode) !== 'undefined' ? statusCode : 200;
            payload = typeof (payload) === 'object' ? payload : {};
            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            if (statusCode == 200) {
                debug('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
            } else {
                debug('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
            }
        });
    });
};

server.router = {
    'ping': handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.checks,
};

server.init = function() {
    server.httpServer.listen(config.httpPort, function () {
        console.log('\x1b[36m%s\x1b[0m', "The HTTP server is listening on port " + config.httpPort + " in " + config.envName + " mode");
    });
    server.httpsServer.listen(config.httpsPort, function () {
        console.log('\x1b[35m%s\x1b[0m', "The HTTPS server is listening on port " + config.httpsPort + " in " + config.envName + " mode");
    });
}

module.exports = server;
