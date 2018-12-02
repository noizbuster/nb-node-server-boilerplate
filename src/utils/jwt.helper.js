const jwt = require('jsonwebtoken');
const config = require('./config');

const JWT_SECRET = config.get('authentication.jwt_secret');

module.exports = {
    verify: function(token){
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (e){
            return null;
        }
    },
    sign: function(payload){
        return jwt.sign(payload, JWT_SECRET, {expiresIn: '15 days'});
    }
};
