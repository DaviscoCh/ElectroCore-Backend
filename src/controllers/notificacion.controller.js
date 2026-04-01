const service = require('../services/notificacion.service');

exports.getMisNotificaciones = async (req, res, next) => {
    try {
        const data = await service.getMisNotificaciones(req.usuario.id_usuario);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.marcarLeida = async (req, res, next) => {
    try {
        const data = await service.marcarLeida(
            req.usuario.id_usuario,
            req.params.id
        );
        res.json({ success: true, message: 'Notificación marcada como leída', data });
    } catch (err) { next(err); }
};

exports.marcarTodasLeidas = async (req, res, next) => {
    try {
        await service.marcarTodasLeidas(req.usuario.id_usuario);
        res.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
    } catch (err) { next(err); }
};

exports.eliminar = async (req, res, next) => {
    try {
        await service.eliminar(req.usuario.id_usuario, req.params.id);
        res.json({ success: true, message: 'Notificación eliminada' });
    } catch (err) { next(err); }
};