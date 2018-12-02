const express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors'),
    errorHandler = require('express-api-error-handler');
const config = require('./utils/config');
require('./models/index'); // just for loading

let app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// CORS
app.use(cors());

// Routers
app.use('/', require('./routes/index'));

// Error Handling
app.use(errorHandler.errorHandler({
    log: ({err, body}) => {
        if (err.details) {
            body.details = err.details;
        }
        if (err.status >= 500) {
            console.error(`${err.status}: ${err.message}:\n${err.stack}`, err.details);
        } else {
            console.warn(`${err.status}: ${err.message}:\n${err.stack}`, err.details);
        }
    },
    hideProdErrors: true
}));
app.use(errorHandler.notFoundHandler({
    log: ({req}) => {
        console.log('Not Found: ' + req.originalUrl);
    }
}));

app.server = app.listen(config.get('port'));

module.exports = app;
