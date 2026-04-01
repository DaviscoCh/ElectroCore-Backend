const db = require('../config/db');

exports.findByUsuario = async (id_usuario) => {
    const result = await db.query(
        `SELECT * FROM notificaciones
         WHERE id_usuario = $1
         ORDER BY creado_en DESC
         LIMIT 50`,
        [id_usuario]
    );
    return result.rows;
};

exports.countNoLeidas = async (id_usuario) => {
    const result = await db.query(
        `SELECT COUNT(*) FROM notificaciones
         WHERE id_usuario = $1 AND leida = false`,
        [id_usuario]
    );
    return parseInt(result.rows[0].count);
};

exports.insert = async ({ id_usuario, tipo, titulo, mensaje }) => {
    const result = await db.query(
        `INSERT INTO notificaciones (id_usuario, tipo, titulo, mensaje)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [id_usuario, tipo, titulo, mensaje]
    );
    return result.rows[0];
};

exports.marcarLeida = async (id_notificacion, id_usuario) => {
    const result = await db.query(
        `UPDATE notificaciones SET leida = true
         WHERE id_notificacion = $1 AND id_usuario = $2
         RETURNING *`,
        [id_notificacion, id_usuario]
    );
    return result.rows[0];
};

exports.marcarTodasLeidas = async (id_usuario) => {
    await db.query(
        `UPDATE notificaciones SET leida = true
         WHERE id_usuario = $1`,
        [id_usuario]
    );
};

exports.remove = async (id_notificacion, id_usuario) => {
    const result = await db.query(
        `DELETE FROM notificaciones
         WHERE id_notificacion = $1 AND id_usuario = $2
         RETURNING *`,
        [id_notificacion, id_usuario]
    );
    return result.rows[0];
};