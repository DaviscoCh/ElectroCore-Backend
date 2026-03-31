const service = require('../services/carrito.service');

exports.getCarrito = async (req, res, next) => {
    try {
        const data = await service.getCarrito(req.usuario.id_usuario);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.agregar = async (req, res, next) => {
    try {
        const data = await service.agregar(req.usuario.id_usuario, req.body);
        res.status(201).json({
            success: true,
            message: 'Producto agregado al carrito',
            data
        });
    } catch (err) { next(err); }
};

exports.actualizarCantidad = async (req, res, next) => {
    try {
        const data = await service.actualizarCantidad(
            req.usuario.id_usuario,
            req.params.id,
            req.body.cantidad
        );
        res.json({ success: true, message: 'Cantidad actualizada', data });
    } catch (err) { next(err); }
};

exports.eliminar = async (req, res, next) => {
    try {
        await service.eliminar(req.usuario.id_usuario, req.params.id);
        res.json({ success: true, message: 'Producto eliminado del carrito' });
    } catch (err) { next(err); }
};

exports.vaciar = async (req, res, next) => {
    try {
        await service.vaciar(req.usuario.id_usuario);
        res.json({ success: true, message: 'Carrito vaciado' });
    } catch (err) { next(err); }
};