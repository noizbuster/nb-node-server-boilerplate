const _ = require('lodash');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const BaseSchema = require('./schemas/base.schema');
const ThropySchema = require('./schemas/thropy.schema');

const ModelName = 'BluePrint';
const BluePrintSchema = new Schema({
    // @formatter:off
    name:           {type: Schema.Types.String},
    description:    {type: Schema.Types.String},
    items:          [ThropySchema.toSchema()],
    // @formatter:on
}, BaseSchema.options);

module.exports = function (connection) {
    return (connection || mongoose).model(ModelName, BluePrintSchema, ModelName);
};
