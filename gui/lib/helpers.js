
var lib = {};

// Node will throw an error if JSON parsing fails. This function avoids this.
lib.parseJsonToObject = function (str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
};

lib.getTemplate = function (name, callback) {

};

module.exports = lib;
