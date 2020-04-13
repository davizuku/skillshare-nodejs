
const tls = require('tls');
const fs = require('fs');
const path = require('path');

var options = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};

var server = tls.createServer(options, function (connection) {
    var outboundMessage = 'pong';
    connection.write(outboundMessage);

    connection.on('data', function (inboundMessage) {
        console.log("I wrote " + outboundMessage + " and they said " + inboundMessage);
    });
});
server.listen(6000);
