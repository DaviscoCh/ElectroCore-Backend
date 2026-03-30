const db = require('../config/db');

exports.findAll = async () => {
    const result = await db.query(
        `SELECT 
            id_marca,
            nombre,
            descripcion,
            logo_url,
            estado
         FROM marcas
         WHERE estado = true
         ORDER BY nombre ASC`
    );
    return result.rows;
};

exports.findById = async (id_marca) => {
    const result = await db.query(
        `SELECT * FROM marcas WHERE id_marca = $1`,
        [id_marca]
    );
    return result.rows[0];
};

exports.insert = async ({ nombre, descripcion, logo_url }) => {
    const result = await db.query(
        `INSERT INTO marcas (nombre, descripcion, logo_url)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [nombre, descripcion || null, logo_url || null]
    );
    return result.rows[0];
};

exports.update = async (id_marca, { nombre, descripcion, logo_url, estado }) => {
    const result = await db.query(
        `UPDATE marcas
         SET nombre = $1, descripcion = $2, logo_url = $3, estado = $4
         WHERE id_marca = $5
         RETURNING *`,
        [nombre, descripcion || null, logo_url || null, estado, id_marca]
    );
    return result.rows[0];
};