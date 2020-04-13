
const tls = require('tls');
const fs = require('fs');
const path = require('path');

var options = {
    // This is only required because we are using a self-signed certificate
    'ca': fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};

var outboundMessage = "ping";
var client = tls.connect(6000, options, function () {
    client.write(outboundMessage);
});
client.on('data', function (inboundMessage) {
    console.log("I wrote " + outboundMessage + " and they said " + inboundMessage);
    client.end();
});
