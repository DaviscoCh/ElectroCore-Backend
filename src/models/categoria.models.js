const db = require('../config/db');

exports.findAll = async () => {
    const result = await db.query(
        `SELECT 
            id_categoria,
            nombre,
            descripcion,
            imagen_url,
            slug,
            estado,
            creado_en
         FROM categorias
         WHERE estado = true
         ORDER BY nombre ASC`
    );
    return result.rows;
};

exports.findBySlug = async (slug) => {
    const result = await db.query(
        `SELECT * FROM categorias WHERE slug = $1 AND estado = true`,
        [slug]
    );
    return result.rows[0];
};

exports.findById = async (id_categoria) => {
    const result = await db.query(
        `SELECT * FROM categorias WHERE id_categoria = $1`,
        [id_categoria]
    );
    return result.rows[0];
};

exports.insert = async ({ nombre, descripcion, imagen_url, slug }) => {
    const result = await db.query(
        `INSERT INTO categorias (nombre, descripcion, imagen_url, slug)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [nombre, descripcion || null, imagen_url || null, slug]
    );
    return result.rows[0];
};

exports.update = async (id_categoria, { nombre, descripcion, imagen_url, slug, estado }) => {
    const result = await db.query(
        `UPDATE categorias
         SET nombre = $1, descripcion = $2, imagen_url = $3, slug = $4, estado = $5
         WHERE id_categoria = $6
         RETURNING *`,
        [nombre, descripcion || null, imagen_url || null, slug, estado, id_categoria]
    );
    return result.rows[0];
};