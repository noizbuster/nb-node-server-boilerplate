const mongoose = require('mongoose');
const config = require('../utils/config');

const DB_URL = 'mongodb://' + config.get('database.mongodb.hostname') + '/' + config.get('database.mongodb.database');
let DB = mongoose.createConnection(
    DB_URL ,
    {useNewUrlParser: true});

require('./item.model')(DB); // discriminate model
require('./blueprint.model')(DB);
require('./user.model')(DB);

require('./item-music-album.model')(DB);

module.exports = DB;
