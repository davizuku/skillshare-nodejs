
const _data = require('./data');
const helpers = require('./helpers');

var handlers = {};

handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._users = {};

// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function (data, callback) {
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ?
        data.payload.firstName :
        false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ?
        data.payload.lastName :
        false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ?
        data.payload.phone :
        false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?
        data.payload.password :
        false;
    var tosAgreement = (typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement);
    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't already exist
        _data.read('users', phone, function (err, data) {
            if (err) {
                var hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    var user = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': true,
                    };
                    _data.create('users', phone, user, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'Could not create the new user'});
                        }
                    });
                } else {
                    callback(500, {'Error': 'Could not hash the user\'s password'});
                }
            } else {
                callback(400, {'Error': 'A user with that phone number already exists'});
            }
        });
    } else {
        callback(400, {'Error': 'Missing required fields'});
    }
};

// Required data: phone
// Optional data: none
// @TODO Only let authenticated user access their object. Don't let them get anyone else's
handlers._users.get = function (data, callback) {
    var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ?
        data.queryStringObject.phone :
        false;
    if (phone) {
        _data.read('users', phone, function (err, data) {
            if (!err && data) {
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {'Error': 'Missing required field'})
    }
};

// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO only let authenticated users update their own object. Don't let them update anyone else's
handlers._users.put = function (data, callback) {
    var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ?
        data.payload.firstName :
        false;
    var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ?
        data.payload.lastName :
        false;
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ?
        data.payload.phone :
        false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?
        data.payload.password :
        false;
    if (phone) {
        if (firstName || lastName || password) {
            _data.read('users', phone, function (err, userData) {
                if (!err && userData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }
                    _data.update('users', phone, userData, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'Could not update the user'});
                        }
                    })
                } else {
                    callback(400, {'Error': 'The specified user does not exist'});
                }
            })
        } else {
            callback(400, {'Error': 'Missing fields to update'});
        }
    } else {
        callback(400, {'Error': 'Missing required field'});
    }
};

// Required data: phone
// Optional data: none
// @TODO Only let authenticated user delete their object. Don't let them delete anyone else's
// @TODO Cleanup any other data files associated with this user
handlers._users.delete = function (data, callback) {
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ?
        data.queryStringObject.phone :
        false;
    if (phone) {
        _data.read('users', phone, function (err, data) {
            if (!err && data) {
                _data.delete('users', phone, function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {'Error': 'Could not delete the specified user'});
                    }
                });
            } else {
                callback(400, {'Error': 'Could not find the specified user'});
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' })
    }
};

handlers.tokens = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._tokens = {};

// Required data: phone, password
// Optional data: none
handlers._tokens.post = function (data, callback) {
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ?
        data.payload.phone :
        false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?
        data.payload.password :
        false;
    if (phone && password) {
        _data.read('users', phone, function (err, userData) {
            if (!err && userData) {
                var hashedPassword = helpers.hash(password);
                if (userData.hashedPassword === hashedPassword) {
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60;
                    var tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        'expires': expires,
                    };
                    _data.create('tokens', tokenId, tokenObject, function(err) {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {'Error': 'Could not create the new token'});
                        }
                    })
                } else {
                    callback(400, {'Error': 'Password did not match the specified user\'s stored password'});
                }
            } else {
                callback(400, {'Error': 'Could not find the specified user'});
            }
        })
    } else {
        callback(400, {'Error': 'Missing required fields'});
    }
};
// Required data: id
// Optional data: none
handlers._tokens.get = function (data, callback) {
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ?
        data.queryStringObject.id :
        false;
    if (id) {
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' })
    }
};
// Required data: id, extend
// Optional data: none
handlers._tokens.put = function (data, callback) {
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ?
        data.payload.id :
        false;
    var extend = (typeof(data.payload.extend) == 'boolean' && data.payload.extend);
    if (id && extend) {
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                if (tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    _data.update('tokens', id, tokenData, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { 'Error': 'Could not update the token\'s expiration' });
                        }
                    });
                } else {
                    callback(400, {'Error': 'The token has already expired and cannot be extended'});
                }
            } else {
                callback(400, { 'Error': 'The specified token does not exist' });
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required field(s) or field(s) are invalid' });
    }
};
// Required data: id
// Optional data: none
handlers._tokens.delete = function (data, callback) {
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ?
        data.queryStringObject.id :
        false;
    if (id) {
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                _data.delete('tokens', id, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { 'Error': 'Could not delete the specified token' });
                    }
                });
            } else {
                callback(400, { 'Error': 'Could not find the specified token' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' })
    }
};

handlers.ping = function (data, callback) {
    callback(200);
};

handlers.notFound = function (data, callback) {
    callback(404);
};

module.exports = handlers;
