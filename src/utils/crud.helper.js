const queryHelper = require('./query.helper'),
    ensureOID = queryHelper.ensureOID;
const asyncHandler = require('express-async-handler');

const genCRUD = function (model, router) {
    let routes = router || require('express').Router();
    // CREATE
    routes.post('/', async (req, res) => {
        return await post(model, req, res);
    });

    // READ List
    routes.get('/', asyncHandler(async (req, res) => {
        return await get(model, req, res);
    }));

    // READ One
    routes.get('/:id', ensureOID('id'), asyncHandler(async (req, res) => {
        let result = await model.findById(req.params.id);
        return res.json(result);
    }));

    // UPDATE
    routes.put('/:id', ensureOID('id'), asyncHandler(async (req, res) => {
        return await update(model, req, res);
    }));

    // DELETE
    routes.delete('/:id', ensureOID('id'), asyncHandler(async (req, res) => {
        return await remove(model, req, res);
    }));

    return routes;
};

async function get(model, req, res) {
    let result = await queryHelper.almightyQuery(model, req);

    if (!result) {
        return res.json([]);
    } else {
        return res.json(result);
    }
}

async function post(model, req, res) {
    const createdResource = await (new model(req.body)).save();
    return res.json(createdResource);
}

async function update(model, req, res) {
    let result = await model.findByIdAndUpdate(req.params.id, req.body, {new: true});
    return res.json(result);
}

async function remove(model, req, res) {
    if (typeof model.removeWithAssociate === 'function') {
        return res.json(await model.removeWithAssociate(req.params.id));
    } else {
        return res.json(await model.findByIdAndRemove(req.params.id));
    }
}

module.exports = {
    get, post, update, remove,
    genCRUD
};
