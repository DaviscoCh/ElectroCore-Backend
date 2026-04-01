const model = require('../models/favorito.models');
const db = require('../config/db');

exports.getMisFavoritos = async (id_usuario) => {
    return await model.findByUsuario(id_usuario);
};

exports.toggle = async (id_usuario, id_producto) => {
    // Verificar que el producto existe
    const prod = await db.query(
        `SELECT id_producto FROM productos WHERE id_producto = $1 AND estado = true`,
        [id_producto]
    );
    if (!prod.rows[0]) {
        const err = new Error('Producto no encontrado');
        err.status = 404;
        throw err;
    }

    // Si ya existe → eliminar. Si no → agregar
    const existe = await model.findItem(id_usuario, id_producto);
    if (existe) {
        await model.remove(id_usuario, id_producto);
        return { accion: 'eliminado', mensaje: 'Eliminado de favoritos' };
    }

    await model.insert(id_usuario, id_producto);
    return { accion: 'agregado', mensaje: 'Agregado a favoritos' };
};