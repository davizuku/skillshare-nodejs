
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

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
        res.end("Hello World\n");
        console.log('Request received');
        console.log('Method: ' + method);
        console.log('Path: ' + trimmedPath);
        console.log('Query string: ', queryStringObject);
        console.log('Headers: ', headers);
        console.log('Buffer: ', buffer);
    });
});

server.listen(3000, function() {
    console.log("The server is listening on port 3000 now");
});
