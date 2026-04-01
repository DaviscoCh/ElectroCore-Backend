const model = require('../models/notificacion.models');

exports.getMisNotificaciones = async (id_usuario) => {
    const notificaciones = await model.findByUsuario(id_usuario);
    const no_leidas = await model.countNoLeidas(id_usuario);
    return { notificaciones, no_leidas };
};

// Crear notificación — se usará internamente desde otros servicios
exports.crear = async ({ id_usuario, tipo, titulo, mensaje }) => {
    return await model.insert({ id_usuario, tipo, titulo, mensaje });
};

exports.marcarLeida = async (id_usuario, id_notificacion) => {
    const notif = await model.marcarLeida(id_notificacion, id_usuario);
    if (!notif) {
        const err = new Error('Notificación no encontrada');
        err.status = 404;
        throw err;
    }
    return notif;
};

exports.marcarTodasLeidas = async (id_usuario) => {
    await model.marcarTodasLeidas(id_usuario);
};

exports.eliminar = async (id_usuario, id_notificacion) => {
    const notif = await model.remove(id_notificacion, id_usuario);
    if (!notif) {
        const err = new Error('Notificación no encontrada');
        err.status = 404;
        throw err;
    }
    return notif;
};