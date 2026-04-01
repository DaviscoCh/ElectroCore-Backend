const model = require('../models/resena.models');
const db = require('../config/db');

exports.getByProducto = async (id_producto) => {
    const resenas = await model.findByProducto(id_producto);
    const promedio = await model.getPromedio(id_producto);
    return { resenas, promedio };
};

exports.crear = async (id_usuario, id_producto, datos) => {
    // Verificar que no haya reseñado antes
    const existe = await model.findMia(id_usuario, id_producto);
    if (existe) {
        const err = new Error('Ya has reseñado este producto');
        err.status = 409;
        throw err;
    }
    return await model.insert(id_usuario, id_producto, datos);
};

exports.getPendientes = async () => {
    return await model.findPendientes();
};

exports.moderarResena = async (id_resena, estado) => {
    const estadosValidos = ['aprobada', 'rechazada'];
    if (!estadosValidos.includes(estado)) {
        const err = new Error('Estado no válido');
        err.status = 400;
        throw err;
    }
    return await model.updateEstado(id_resena, estado);
};