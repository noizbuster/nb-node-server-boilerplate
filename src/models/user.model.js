const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_WORK_FACTOR = 10;
const BaseSchema = require('./schemas/base.schema');
const ERR = require('http-errors');

const ModelName = 'User';
const UserSchema = BaseSchema.toSchema({
    // @formatter:off
    email:          {type: Schema.Types.String,     unique: true,       required: true},
    username:       {type: Schema.Types.String},
    password:       {type: Schema.Types.String,     select: false},
    blueprints:    [{type: Schema.Types.ObjectId,   ref: 'BluePrint'}],
    last_login:     {type: Schema.Types.Date},
    profile_img:    {type: Schema.Types.String},
    newsletter:     {type: Schema.Types.Boolean},
    settings:       {type: Schema.Types.Mixed}
    // @formatter:on
}, {});

// Instance methods
UserSchema.methods.comparePassword = async function (candidatePassword) {
    console.log('check password', candidatePassword, this.password);
    let isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('isMatch', isMatch);

    return isMatch;
};

UserSchema.methods.createAuthToken = function () {
    let payload = _.omit(this.toJSON(), ['password']);
    console.log('payload', payload);
    return jwt.sign(payload, 'not_secure_server_password', {expiresIn: '15 days'});
};

// Static methods
UserSchema.statics.getUser = async function (email, password) {
    let user = await this.authenticate(email, password);
    if (!user) {
        throw ERR(404, 'cannot found user');
    } else {
        return user;
    }
};

UserSchema.statics.authenticate = async function (email, password) {
    let user = await this.findOne({email: email}).select('password');
    if (!user) {
        throw ERR(400, 'cannot found user by email');
    }
    if (bcrypt.compareSync(password, user.password)) {
        console.log('success password is correct');
        return _.omit(user.toJSON(), 'password');
    } else {
        throw ERR(400, 'password is wrong');
    }
};

// Hooks
// @see: http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
UserSchema.pre('save', function (next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

module.exports = function (connection) {
    return (connection || mongoose).model(ModelName, UserSchema, ModelName);
};
