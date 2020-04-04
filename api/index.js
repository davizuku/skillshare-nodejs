
const http = require('http');
const url = require('url');

var server = http.createServer(function (req, res) {
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var method = req.method.toLowerCase();
    var queryStringObject = parsedUrl.query; // This is available due to second parameter in url.parse
    var headers = req.headers


    res.end("Hello World\n");

    console.log('Request received on path: ' + trimmedPath + ' with method: ' + method);
    console.log('Query string: ', queryStringObject);
    console.log('Headers: ', headers);
});

server.listen(3000, function() {
    console.log("The server is listening on port 3000 now");
});
