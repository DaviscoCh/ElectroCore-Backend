const service = require('../services/favorito.service');

exports.getMisFavoritos = async (req, res, next) => {
    try {
        const data = await service.getMisFavoritos(req.usuario.id_usuario);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.toggle = async (req, res, next) => {
    try {
        const data = await service.toggle(
            req.usuario.id_usuario,
            req.params.id_producto
        );
        res.json({ success: true, ...data });
    } catch (err) { next(err); }
};