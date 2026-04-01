const service = require('../services/pedido.service');

exports.crearPedido = async (req, res, next) => {
    try {
        const data = await service.crearPedido(req.usuario.id_usuario, req.body);
        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            data
        });
    } catch (err) { next(err); }
};

exports.getMisPedidos = async (req, res, next) => {
    try {
        const data = await service.getMisPedidos(req.usuario.id_usuario);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.getDetallePedido = async (req, res, next) => {
    try {
        const data = await service.getDetallePedido(
            req.usuario.id_usuario, req.params.id
        );
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.getAllPedidos = async (req, res, next) => {
    try {
        const data = await service.getAllPedidos(req.query);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.updateEstado = async (req, res, next) => {
    try {
        const data = await service.updateEstado(req.params.id, req.body.estado);
        res.json({ success: true, message: 'Estado actualizado', data });
    } catch (err) { next(err); }
};