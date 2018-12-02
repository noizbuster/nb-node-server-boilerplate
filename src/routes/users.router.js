const express = require('express');
const _ = require('lodash');

const DB = require('./../models');
const User = DB.models.User;

let router = express.Router();

router.get('/', async function (req, res) {
    // TODO pagenate, limit, offset
    let users = await User.find();
    res.json(users);
});

router.post('/', async function (req, res) {
    console.log('request body', req.body);
    try {
        if (_.get(req, 'body.email') && _.get(req, 'body.password')) {
            const userInfo = _.pick(req.body, ['email', 'password']);
            let newUser = new User(userInfo);
            try {
                let result = await newUser.save();
                let createdUser = await User.findOne({email: req.body.email});
                return res.json(createdUser);
            } catch (e) {
                return res.status(400).json({msg: 'user creation failed', details: e});
            }
        } else {
            return res.status(400).json({msg: 'password and email should be passed'});
        }
    } catch (err) {
        return res.status(500).json({msg: 'server error', details: err});
    }
});

module.exports = router;
