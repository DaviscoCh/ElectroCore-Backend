const db = require('../config/db');

exports.generarNumeroFactura = async () => {
    const result = await db.query(`SELECT COUNT(*) FROM facturas`);
    const total = parseInt(result.rows[0].count) + 1;
    const año = new Date().getFullYear();
    return `FAC-${año}-${String(total).padStart(4, '0')}`;
};

exports.insert = async (client, { id_pedido, id_usuario, subtotal, iva, costo_envio, total }) => {
    const numero_factura = `FAC-${new Date().getFullYear()}-${String(
        (await db.query('SELECT COUNT(*) FROM facturas')).rows[0].count * 1 + 1
    ).padStart(4, '0')}`;

    const result = await client.query(
        `INSERT INTO facturas (numero_factura, id_pedido, id_usuario, subtotal, iva, costo_envio, total)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING *`,
        [numero_factura, id_pedido, id_usuario, subtotal, iva, costo_envio, total]
    );
    return result.rows[0];
};

exports.findByUsuario = async (id_usuario) => {
    const result = await db.query(
        `SELECT f.*, p.numero_pedido
         FROM facturas f
         JOIN pedidos p ON f.id_pedido = p.id_pedido
         WHERE f.id_usuario = $1
         ORDER BY f.fecha_emision DESC`,
        [id_usuario]
    );
    return result.rows;
};