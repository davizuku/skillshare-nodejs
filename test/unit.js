const apiHelpers = require('./../api/lib/helpers');
const logs = require('./../api/lib/logs');
const exampleDebuggingProblem = require('./../api/lib/exampleDebuggingProblem');
const assert = require('assert');

var unit = {};

unit['helpers.getANumber should return a number'] = function (done) {
    var val = apiHelpers.getANumber();
    assert.equal(typeof (val), 'number');
    done();
};

unit['helpers.getANumber should return 1'] = function (done) {
    var val = apiHelpers.getANumber();
    assert.equal(val, 1);
    done();
};

unit['helpers.getANumber should return 2'] = function (done) {
    var val = apiHelpers.getANumber();
    assert.equal(val, 2);
    done();
};

unit['logs.list should callback a false error and an array of log names'] = function (done) {
    logs.list(true, function (err, logFileNames) {
        assert.equal(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    });
};

unit['logs.truncate should not throw if the log id does not exist. It should callback an error instead'] = function (done) {
    assert.doesNotThrow(function () {
        logs.truncate('I do not exist', function (err) {
            assert.ok(err);
            done();
        });
    }, TypeError);
};

unit['exampleDebuggingProblem.init should not throw when called'] = function (done) {
    assert.doesNotThrow(function () {
        exampleDebuggingProblem.init();
        done();
    }, TypeError);
};

module.exports = unit;
