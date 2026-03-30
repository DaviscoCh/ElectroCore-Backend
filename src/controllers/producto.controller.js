const service = require('../services/producto.service');

exports.getAll = async (req, res, next) => {
    try {
        const data = await service.getAll(req.query);
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
        res.status(201).json({ success: true, message: 'Producto creado', data });
    } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
    try {
        const data = await service.update(req.params.id, req.body);
        res.json({ success: true, message: 'Producto actualizado', data });
    } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
    try {
        await service.remove(req.params.id);
        res.json({ success: true, message: 'Producto desactivado correctamente' });
    } catch (err) { next(err); }
};