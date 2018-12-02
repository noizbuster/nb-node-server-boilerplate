const express = require('express');
const _ = require('lodash');

const DB = require('./../models');
const User = DB.model('User');

let router = express.Router();

router.post('/', async function (req, res) {
    try {
        let user = await User.findOne({email: req.body.email}).select('+password');
        if (user) {
            let isPasswordCorrect = await user.comparePassword(req.body.password);
            if (isPasswordCorrect) {
                return res.json({token: await user.createAuthToken()});
            } else {
                return res.status(400).json({msg: 'password is not correct'});
            }
        } else {
            return res.status(404).json({msg: 'user is not exist'});
        }
    } catch (err) {
        return res.status(500).json({msg: 'server error', details: err});
    }
});

router.post('/token', async function (req, res) {
    try{
        let user = await User.getUser(req.body.email, req.body.password);
        res.json(user);
    } catch (err){
        if(err.hasOwnProperty('status')){
            res.status(err.status).end(err);
        }
    }
});

module.exports = router;
