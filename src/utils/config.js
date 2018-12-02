const Config = require('nb-config');
const packageInfo = require('../../package');

let config = new Config(packageInfo.name, null, {
    defaultDir: process.cwd()
});

module.exports = config;
