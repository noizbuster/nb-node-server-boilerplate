const express = require('express');

// bind router to url
let rootRouter = express.Router();
rootRouter.use('/auth', require('./auth.router'));
rootRouter.use('/users', require('./users.router'));
rootRouter.use('/api', require('./api/index'));

// dev router only loaded development environment
if (process.env.NODE_ENV !== 'production') {
    rootRouter.use('/dev', require('./dev.router'));
    rootRouter.get('/status', function (req, res) {
        res.json(require('../../package.json'));
    });
}

rootRouter.get('/status', function (req, res) {
    res.json(require('../../package.json').version);
});

module.exports = rootRouter;
