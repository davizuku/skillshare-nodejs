
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

var server = http.createServer(function (req, res) {
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var method = req.method.toLowerCase();
    var queryStringObject = parsedUrl.query; // This is available due to second parameter in url.parse
    var headers = req.headers
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ?
            router[trimmedPath] :
            handlers.notFound;
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer,
        };
        chosenHandler(data, function(statusCode, payload) {
            statusCode = typeof(statusCode) !== 'undefined' ? statusCode : 200;
            payload = typeof(payload) === 'object' ? payload : {};
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
});

server.listen(config.port, function() {
    console.log("The server is listening on port " + config.port + " in " + config.envName + " mode");
});

var handlers = {};

handlers.sample = function(data, callback) {
    var httpStatusCode = 406
    var payloadObject = {'name': 'sample handler'};
    callback(httpStatusCode, payloadObject);
};

handlers.notFound = function(data, callback) {
    callback(404);
};

var router = {
    'sample': handlers.sample
};
