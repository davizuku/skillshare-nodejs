
var environments = {};

environments.staging = {
    'httpPort': 3002,
    'httpsPort': 3003,
    'envName': 'staging',
    'templateGlobals': {
        'appName': 'UptimeChecker',
        'companyName': 'Skillshare Node.js',
        'yearCreated': '2020',
        'baseUrl': 'http://localhost:3002',
    }
};

environments.production = {
    'httpPort': 5002,
    'httpsPort': 5003,
    'envName': 'production',
    'templateGlobals': {
        'appName': 'UptimeChecker',
        'companyName': 'Skillshare Node.js',
        'yearCreated': '2020',
        'baseUrl': 'http://localhost:5002',
    }
};

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ?
    process.env.NODE_ENV.toLowerCase() :
    '';

var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ?
    environments[currentEnvironment] :
    environments.staging;

module.exports = environmentToExport;
