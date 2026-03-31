const db = require('../config/db');

// Ver carrito completo de un usuario con datos del producto
exports.findByUsuario = async (id_usuario) => {
    const result = await db.query(
        `SELECT 
            c.id_carrito,
            c.cantidad,
            c.creado_en,
            p.id_producto,
            p.nombre,
            p.slug,
            p.precio,
            p.imagen_url,
            p.stock,
            (p.precio * c.cantidad) AS subtotal
         FROM carrito c
         JOIN productos p ON c.id_producto = p.id_producto
         WHERE c.id_usuario = $1
         ORDER BY c.creado_en ASC`,
        [id_usuario]
    );
    return result.rows;
};

// Buscar un item específico del carrito
exports.findItem = async (id_usuario, id_producto) => {
    const result = await db.query(
        `SELECT * FROM carrito
         WHERE id_usuario = $1 AND id_producto = $2`,
        [id_usuario, id_producto]
    );
    return result.rows[0];
};

// Buscar por id_carrito
exports.findById = async (id_carrito) => {
    const result = await db.query(
        `SELECT * FROM carrito WHERE id_carrito = $1`,
        [id_carrito]
    );
    return result.rows[0];
};

// Agregar producto al carrito
exports.insert = async (id_usuario, id_producto, cantidad) => {
    const result = await db.query(
        `INSERT INTO carrito (id_usuario, id_producto, cantidad)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [id_usuario, id_producto, cantidad]
    );
    return result.rows[0];
};

// Actualizar cantidad
exports.updateCantidad = async (id_carrito, cantidad) => {
    const result = await db.query(
        `UPDATE carrito SET cantidad = $1
         WHERE id_carrito = $2
         RETURNING *`,
        [cantidad, id_carrito]
    );
    return result.rows[0];
};

// Eliminar un item
exports.remove = async (id_carrito) => {
    const result = await db.query(
        `DELETE FROM carrito WHERE id_carrito = $1 RETURNING *`,
        [id_carrito]
    );
    return result.rows[0];
};

// Vaciar carrito completo
exports.vaciar = async (id_usuario) => {
    await db.query(
        `DELETE FROM carrito WHERE id_usuario = $1`,
        [id_usuario]
    );
};

// Total del carrito
exports.getTotal = async (id_usuario) => {
    const result = await db.query(
        `SELECT 
            COUNT(c.id_carrito) AS items,
            SUM(p.precio * c.cantidad) AS total
         FROM carrito c
         JOIN productos p ON c.id_producto = p.id_producto
         WHERE c.id_usuario = $1`,
        [id_usuario]
    );
    return result.rows[0];
};