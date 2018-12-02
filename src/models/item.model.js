const _ = require('lodash');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const BaseSchema = require('./schemas/base.schema');

const ModelName = 'Item';
const ItemSchema = new Schema({
    // @formatter:off
    item:           {type: Schema.Types.String},
    description:    {type: Schema.Types.String},
    thumbnail_img:  {type: Schema.Types.String},
    original_img:   {type: Schema.Types.String},
    properties:    [{type: Schema.Types.String}],
    // @formatter:on
}, BaseSchema.expendOption({discriminatorKey: 'item_type'}));

module.exports = function (connection) {
    return (connection || mongoose).model(ModelName, ItemSchema, ModelName);
};
