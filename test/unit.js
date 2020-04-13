const apiHelpers = require('./../api/lib/helpers');
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

module.exports = unit;
