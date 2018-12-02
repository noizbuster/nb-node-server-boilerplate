const _ = require('lodash');
const asyncHandler = require('express-async-handler');
const jwtHelper = require('../utils/jwt.helper');
const DB = require('../models/index');
const ERR = require('http-errors');

function jwt_authenticate(req, res, next) {
    let jwtToken = null;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        jwtToken = req.headers.authorization.split(' ')[1];
    } else {
        return next(ERR(401, 'invalid authentication token', {details: {exception_code: 1}}));
    }
    const tokenPayload = jwtHelper.verify(jwtToken);
    if (tokenPayload) {
        _.set(req, 'jwt.payload', tokenPayload);
        // TODO put logger here
        // console.log('token parsed', req.jwt.payload);
        return next();
    } else {
        return next(ERR(401, 'invalid authentication token', {details: {exception_code: 2}}));
    }
}

async function populateUser(req, res, next) {
    const User = DB.model('User');
    const userId = _.get(req, 'jwt.payload.id');
    if (!userId) {
        return next(ERR(500, 'failed to populateUser from jwt payload'));
    }
    req.player = await User.findById(userId);
    if (!req.player) {
        return next(ERR(500, 'user does not exist'));
    }
    return next();
}

module.exports = {
    authenticate: jwt_authenticate,
    populateUser: asyncHandler(populateUser)
};
