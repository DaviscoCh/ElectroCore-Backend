const db = require('../config/db');

exports.findByProducto = async (id_producto) => {
    const result = await db.query(
        `SELECT 
            r.id_resena,
            r.calificacion,
            r.comentario,
            r.creado_en,
            p.nombres,
            p.apellidos
         FROM resenas r
         JOIN usuario u ON r.id_usuario = u.id_usuario
         JOIN persona p ON u.id_persona = p.id_persona
         WHERE r.id_producto = $1 AND r.estado = 'aprobada'
         ORDER BY r.creado_en DESC`,
        [id_producto]
    );
    return result.rows;
};

exports.getPromedio = async (id_producto) => {
    const result = await db.query(
        `SELECT 
            ROUND(AVG(calificacion), 1) AS promedio,
            COUNT(*) AS total
         FROM resenas
         WHERE id_producto = $1 AND estado = 'aprobada'`,
        [id_producto]
    );
    return result.rows[0];
};

exports.findMia = async (id_usuario, id_producto) => {
    const result = await db.query(
        `SELECT * FROM resenas
         WHERE id_usuario = $1 AND id_producto = $2`,
        [id_usuario, id_producto]
    );
    return result.rows[0];
};

exports.insert = async (id_usuario, id_producto, { calificacion, comentario }) => {
    const result = await db.query(
        `INSERT INTO resenas (id_usuario, id_producto, calificacion, comentario)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [id_usuario, id_producto, calificacion, comentario || null]
    );
    return result.rows[0];
};

exports.updateEstado = async (id_resena, estado) => {
    const result = await db.query(
        `UPDATE resenas SET estado = $1 WHERE id_resena = $2 RETURNING *`,
        [estado, id_resena]
    );
    return result.rows[0];
};

exports.findPendientes = async () => {
    const result = await db.query(
        `SELECT 
            r.*,
            p.nombres, p.apellidos,
            pr.nombre AS producto
         FROM resenas r
         JOIN usuario u ON r.id_usuario = u.id_usuario
         JOIN persona p ON u.id_persona = p.id_persona
         JOIN productos pr ON r.id_producto = pr.id_producto
         WHERE r.estado = 'pendiente'
         ORDER BY r.creado_en ASC`
    );
    return result.rows;
};