const service = require('../services/resena.service');

exports.getByProducto = async (req, res, next) => {
    try {
        const data = await service.getByProducto(req.params.id_producto);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.crear = async (req, res, next) => {
    try {
        const data = await service.crear(
            req.usuario.id_usuario,
            req.params.id_producto,
            req.body
        );
        res.status(201).json({
            success: true,
            message: 'Reseña enviada, pendiente de aprobación',
            data
        });
    } catch (err) { next(err); }
};

exports.getPendientes = async (req, res, next) => {
    try {
        const data = await service.getPendientes();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.moderarResena = async (req, res, next) => {
    try {
        const data = await service.moderarResena(req.params.id, req.body.estado);
        res.json({ success: true, message: 'Reseña moderada', data });
    } catch (err) { next(err); }
};