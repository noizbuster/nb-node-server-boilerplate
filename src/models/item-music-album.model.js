const _ = require('lodash');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ModelName = 'ItemMusicAlbum';
const ItemMusicAlbumSchema = new Schema({
    // @formatter:off
    issued_at:     {type: Schema.Types.Date},
    // @formatter:on
});

module.exports = function (connection) {
    let ItemMusicAlbum = (connection || mongoose).model('Item');
    return ItemMusicAlbum.discriminator(ModelName, ItemMusicAlbumSchema, ModelName);
};
