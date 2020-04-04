
const http = require('http');

var server = http.createServer(function (req, res) {
    res.end("hello world\n");
});

server.listen(3000, function() {
    console.log("The server is listening on port 3000 now");
});
