
const readline = require('readline');
const util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();

var cli = {};

e.on('man', function(str) {
    cli.responders.help();
});

e.on('help', function(str) {
    cli.responders.help();
});

e.on('exit', function(str) {
    cli.responders.exit();
});

e.on('stats', function(str) {
    cli.responders.stats();
});

e.on('list users', function (str) {
    cli.responders.listUsers();
});

e.on('more user info', function (str) {
    cli.responders.moreUserInfo(str);
});

e.on('list checks', function (str) {
    cli.responders.listChecks(str);
});

e.on('more check info', function (str) {
    cli.responders.moreCheckInfo(str);
});

e.on('list logs', function (str) {
    cli.responders.listLogs();
});

e.on('more log info', function (str) {
    cli.responders.moreLogInfo(str);
});

cli.responders = {};

cli.responders.help = function() {
    console.log('You asked for help');
};

cli.responders.exit = function() {
    process.exit(0);
};

cli.responders.stats = function() {
    console.log('You asked for stats');
};

cli.responders.listUsers = function() {
    console.log('You asked to list users');
};

cli.responders.moreUserInfo = function(str) {
    console.log('You asked for more user info', str);
};

cli.responders.listChecks = function(str) {
    console.log('You asked to list checks', str);
};

cli.responders.moreCheckInfo = function(str) {
    console.log('You asked for more check info', str);
};

cli.responders.listLogs = function() {
    console.log('You asked to list logs');
};

cli.responders.moreLogInfo = function(str) {
    console.log('You asked for more log info', str);
};

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
