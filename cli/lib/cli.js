
const readline = require('readline');
const util = require('util');
var debug = util.debuglog('cli');
const os = require('os');
const v8 = require('v8');
const events = require('events');
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
    var commands = {
        'exit': 'Kill the CLI application',
        'man': 'Show this help page',
        'help': 'Alias of the "man" command',
        'stats': 'Get statistics on the underlying operating system and resource utilization',
        'list users': 'Show a list of all the registered (undeleted) users in the system',
        'more user info --{userId}': 'Show details of a specific user',
        'list checks --up --down': 'Show a list of all the active checks in the system, including their state. The "--up" and the "--down" flags are both optional. ',
        'more check info --{checkId}': 'Show details of a specified check',
        'list logs': 'Show a list of all the log files available to be read (compressed and uncompressed)',
        'more log info --{fileName}': 'Show details of a specified log file',
    };
    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);
    for (var key in commands) {
        if (commands.hasOwnProperty(key)) {
            var value = commands[key];
            var line = '\x1b[33m' + key + '\x1b[0m';
            var padding = 60 - line.length;
            for (var i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }
    cli.verticalSpace(1);
    cli.horizontalLine();
};

cli.verticalSpace = function(lines) {
    lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
    for (var i = 0; i < lines; i++) {
        console.log('');
    }
};

cli.horizontalLine = function() {
    var width = process.stdout.columns;
    var line = '';
    for (var i = 0; i < width; ++i) {
        line += '-';
    }
    console.log(line);
};

cli.centered = function (str) {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';
    var width = process.stdout.columns;
    var leftPadding = Math.floor((width - str.length)/2);
    var line = '';
    for (var i = 0; i < leftPadding; ++i) {
        line += ' ';
    }
    line += str;
    console.log(line);
};

cli.responders.exit = function() {
    process.exit(0);
};

cli.responders.stats = function() {

    var stats = {
        'Load Average': os.loadavg().join(' '),
        'CPU Count': os.cpus().length,
        'Free Memory': os.freemem(),
        'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
        'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        'Uptime (secs)': os.uptime(),
    };
    cli.horizontalLine();
    cli.centered('SYSTEM STATISTICS');
    cli.horizontalLine();
    cli.verticalSpace(2);
        for (var key in stats) {
            if (stats.hasOwnProperty(key)) {
                var value = stats[key];
                var line = '\x1b[33m' + key + '\x1b[0m';
                var padding = 60 - line.length;
                for (var i = 0; i < padding; i++) {
                    line += ' ';
                }
                line += value;
                console.log(line);
                cli.verticalSpace();
            }
        }
        cli.verticalSpace(1);
        cli.horizontalLine();
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
