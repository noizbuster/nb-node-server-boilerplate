const crudHelper = require('../../utils/crud.helper');
const express = require('express');
const DB = require('../../models/index');

let apiRouter = express.Router();

// @formatter:off
apiRouter.use('/blueprints'     , crudHelper.genCRUD(DB.model('BluePrint')));
apiRouter.use('/items'          , crudHelper.genCRUD(DB.model('Item')));
apiRouter.use('/itemmusicalbums', crudHelper.genCRUD(DB.model('ItemMusicAlbum')));
// @formatter:on

module.exports = apiRouter;