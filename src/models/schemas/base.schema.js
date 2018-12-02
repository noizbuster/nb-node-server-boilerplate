const _ = require('lodash');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const BaseSchemaDefinition = {
    // @formatter:off
    name:           {type: Schema.Types.String, required: true},
    description:    {type: Schema.Types.String, default: ''},
    parameters:     {type: Schema.Types.Mixed,  default: {}}
    // @formatter:on
};

const BaseSchemaOption = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    toJSON: {virtuals: true}
};

module.exports = {
    definition: BaseSchemaDefinition,
    options: BaseSchemaOption,
    toSchema: (def, opt) => {
        let definition = _.assign({}, BaseSchemaDefinition, def);
        let options = _.assign({}, BaseSchemaOption, opt);
        return new Schema(definition, options);
    },
    expendDefinition: (def) => _.assign({}, BaseSchemaDefinition, def),
    expendOption: (opt) => _.assign({}, BaseSchemaOption, opt),
};
