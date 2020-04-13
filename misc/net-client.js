
const net = require('net');

var outboundMessage = "ping";
var client = net.createConnection({'port': 6000}, function () {
    client.write(outboundMessage);
});
client.on('data', function (inboundMessage) {
    console.log("I wrote " + outboundMessage + " and they said " + inboundMessage);
    client.end();
});
