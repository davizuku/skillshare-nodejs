
const readline = require('readline');
const util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();

var cli = {};

cli.processInput = function(str) {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
    if (str) {
        var uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info',
        ];
        var matchFound = false;
        var counter = 0;
        uniqueInputs.forEach(function (input) {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                e.emit(input, str);
                return true;
            }
        });
        if (!matchFound) {
            console.log('Sorry, try again');
        }
    }
};

cli.init = function() {
    console.log('\x1b[34m%s\x1b[0m', "The CLI is running");
    var _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> ',
    });
    _interface.prompt();
    _interface.on('line', function (str) {
        cli.processInput(str);
        _interface.prompt();
    });
    _interface.on('close', function() {
        process.exit(0);
    });
};

module.exports = cli;
