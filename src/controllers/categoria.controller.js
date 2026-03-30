const service = require('../services/categoria.service');

exports.getAll = async (req, res, next) => {
    try {
        const data = await service.getAll();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.getBySlug = async (req, res, next) => {
    try {
        const data = await service.getBySlug(req.params.slug);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
    try {
        const data = await service.create(req.body);
        res.status(201).json({ success: true, message: 'Categoría creada', data });
    } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
    try {
        const data = await service.update(req.params.id, req.body);
        res.json({ success: true, message: 'Categoría actualizada', data });
    } catch (err) { next(err); }
};