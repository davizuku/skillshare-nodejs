
const net = require('net');

var server = net.createServer(function (connection) {
    var outboundMessage = 'pong';
    connection.write(outboundMessage);

    connection.on('data', function (inboundMessage) {
        console.log("I wrote " + outboundMessage + " and they said " + inboundMessage);
    });
});
server.listen(6000);
