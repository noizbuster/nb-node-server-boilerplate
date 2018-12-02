const _ = require('lodash');
const createError = require('http-errors');
const DEFAULT_PAGE_SIZE = 1000;

function ensurePagenate(defaultPageSize = DEFAULT_PAGE_SIZE) {
    return function (req, res, next) {
        let limit = defaultPageSize.toString();
        try {
            let queryLimit = parseInt(req.query.limit);
            if (queryLimit <= defaultPageSize) {
                limit = queryLimit.toString();
            }
        } catch {
            // ignore
        }
        _.set(req, 'query.limit', limit);
        _.set(req, 'query.offset', _.get(req, 'query.offset') || '0');
        next()
    }
}

function isOID(candidate) {
    const OIDPattern = RegExp(/^[a-fA-F0-9]{24}$/);
    return OIDPattern.test(candidate);
}

function ensureOID(fieldName = 'id') {
    return function (req, res, next) {
        let queryId = _.get(req.params, fieldName);

        if (queryId && isOID(queryId)) {
            next();
        } else {
            const errorMSG = `${fieldName}: "${queryId}" is not a valid ObjectId to query`;
            const errorDetails = {url: req.originalUrl, body: req.body};
            console.log('[ensureQueryId]:' + errorMSG, errorDetails);
            throw createError(400, errorMSG, {details: errorDetails});
        }
    }
}

function normalizeArg(filter_func, argument) {
    // Assume data is a string
    if (argument && argument.toLowerCase && argument.toLowerCase() === 'true') {
        return true;
    } else if (argument && argument.toLowerCase && argument.toLowerCase() === 'false') {
        return false;
    } else if (filter_func === 'limit' || filter_func === 'skip') {
        return parseInt(argument);
    } else {
        return argument;
    }
}

function filterable(props, subfilters) {
    return {
        filter: function (key, value, quer) {
            if (props[key]) {
                return props[key](normalizeArg(key, value), quer);
            }
            let field = key.split('__'),
                filter_func = field[1] || 'equals',
                data = normalizeArg(filter_func, value);

            // Turn data into array for $in and $nin clause
            if (filter_func === 'in' || filter_func === 'nin') {
                data = data.split(',');
            }

            return subfilters[filter_func](data, quer.where(field[0]));
        },
        contains: function (key, quer) {
            if (key in props) {
                return true;
            }
            let field = key.split('__');
            let filter_func = field[1] || 'equals';
            return field[0] in quer.model.schema.paths && filter_func in subfilters;
        }
    }
}

function query(key) {
    return function (val, query) {
        return query[key](val);
    };
}

const valid_filters = filterable({
    'populate': query('populate'),
    'limit': query('limit'),
    'skip': query('skip'),
    'offset': query('offset'),
    'select': query('select'),
    'sort': query('sort'),
}, {
    'equals': query('equals'),
    'gte': query('gte'),
    'gt': query('gt'),
    'lt': query('lt'),
    'lte': query('lte'),
    'ne': query('ne'),
    'regex': function (val, query) {
        let regParts = val.match(/^\/(.*?)\/([gim]*)$/);
        if (regParts) {
            // the parsed pattern had delimiters and modifiers. handle them.
            val = new RegExp(regParts[1], regParts[2]);
        } else {
            // we got pattern string without delimiters
            val = new RegExp(val);
        }

        return query.regex(val);
    },
    'in': query('in'),
    'nin': query('nin'),
});

function almightyQuery(model, req, query) {
    req.query = req.query || {};
    let quer = query || req.quer || null;
    if (!quer) {
        quer = model.find({});
    }
    Object.keys(req.query).filter(function (potential_filter) {
        return valid_filters.contains(potential_filter, quer);
    }).forEach(function (valid_key) {
        quer = valid_filters.filter(valid_key, filterableData[valid_key], quer);
    });

    return quer;
}

module.exports = {
    ensureOID,
    ensurePagenate,
    almightyQuery,
    isOID
};