
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

var lib = {};

lib.baseDir = path.join(__dirname, '/../.logs/');

lib.append = function (fileName, str, callback) {
    fs.open(lib.baseDir + '/' + fileName + '.log', 'a', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            fs.appendFile(fileDescriptor, str + '\n', function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing file that was being appended');
                        }
                    });
                } else {
                    callback('Error appending to file');
                }
            });
        } else {
            callback('Could not open file for appending');
        }
    });
};

module.exports = lib;
