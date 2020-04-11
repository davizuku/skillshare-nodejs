
var environments = {};

environments.staging = {
    'httpPort': 3002,
    'httpsPort': 3003,
    'envName': 'staging',
};

environments.production = {
    'httpPort': 5002,
    'httpsPort': 5003,
    'envName': 'production',
};

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ?
    process.env.NODE_ENV.toLowerCase() :
    '';

var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ?
    environments[currentEnvironment] :
    environments.staging;

module.exports = environmentToExport;
