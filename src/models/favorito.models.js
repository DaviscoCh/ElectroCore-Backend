const db = require('../config/db');

exports.findByUsuario = async (id_usuario) => {
    const result = await db.query(
        `SELECT 
            f.id_favorito,
            f.fecha_agregado,
            p.id_producto,
            p.nombre,
            p.slug,
            p.precio,
            p.imagen_url,
            p.stock
         FROM favoritos f
         JOIN productos p ON f.id_producto = p.id_producto
         WHERE f.id_usuario = $1
         ORDER BY f.fecha_agregado DESC`,
        [id_usuario]
    );
    return result.rows;
};

exports.findItem = async (id_usuario, id_producto) => {
    const result = await db.query(
        `SELECT * FROM favoritos
         WHERE id_usuario = $1 AND id_producto = $2`,
        [id_usuario, id_producto]
    );
    return result.rows[0];
};

exports.insert = async (id_usuario, id_producto) => {
    const result = await db.query(
        `INSERT INTO favoritos (id_usuario, id_producto)
         VALUES ($1, $2) RETURNING *`,
        [id_usuario, id_producto]
    );
    return result.rows[0];
};

exports.remove = async (id_usuario, id_producto) => {
    const result = await db.query(
        `DELETE FROM favoritos
         WHERE id_usuario = $1 AND id_producto = $2
         RETURNING *`,
        [id_usuario, id_producto]
    );
    return result.rows[0];
};