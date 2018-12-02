const app = require('./src/server');
const config = require('./src/utils/config');
console.log(config.get());
module.exports = app;
