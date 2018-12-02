const _ = require('lodash');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ThropySchemaDefinition = {
    // @formatter:off
    item:       {type: Schema.Types.ObjectId, ref: 'Item', required: true},
    relations: [{type: Schema.Types.String}],
    relevance:  {type: Schema.Types.Number, default: 1}
    // @formatter:on
};

module.exports = {
    definition: ThropySchemaDefinition,
    toSchema: (def, opt) => {
        let definition = _.assign({}, ThropySchemaDefinition, def);
        return new Schema(definition, opt);
    },
    expendDefinition: (def) => _.assign({}, ThropySchemaDefinition, def),
};
