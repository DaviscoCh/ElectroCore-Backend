const db = require('../config/db');

// Generar número de pedido correlativo
exports.generarNumeroPedido = async () => {
    const result = await db.query(
        `SELECT COUNT(*) FROM pedidos`
    );
    const total = parseInt(result.rows[0].count) + 1;
    const año = new Date().getFullYear();
    return `EC-${año}-${String(total).padStart(4, '0')}`;
};

// Crear pedido
exports.insert = async (client, datos) => {
    const {
        numero_pedido, id_usuario, subtotal, iva, costo_envio, total,
        tipo_entrega, id_sucursal, id_zona, direccion_envio,
        ciudad_envio, provincia_envio, metodo_pago, comentario
    } = datos;

    const result = await client.query(
        `INSERT INTO pedidos (
            numero_pedido, id_usuario, subtotal, iva, costo_envio, total,
            tipo_entrega, id_sucursal, id_zona, direccion_envio,
            ciudad_envio, provincia_envio, metodo_pago, comentario
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         RETURNING *`,
        [
            numero_pedido, id_usuario, subtotal, iva, costo_envio, total,
            tipo_entrega, id_sucursal || null, id_zona || null,
            direccion_envio || null, ciudad_envio || null,
            provincia_envio || null, metodo_pago, comentario || null
        ]
    );
    return result.rows[0];
};

// Crear detalle del pedido
exports.insertDetalle = async (client, { id_pedido, id_producto, cantidad, precio_unitario }) => {
    const subtotal = cantidad * precio_unitario;
    const result = await client.query(
        `INSERT INTO pedido_detalle (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING *`,
        [id_pedido, id_producto, cantidad, precio_unitario, subtotal]
    );
    return result.rows[0];
};

// Descontar stock
exports.descontarStock = async (client, id_producto, cantidad) => {
    await client.query(
        `UPDATE productos SET stock = stock - $1, actualizado_en = NOW()
         WHERE id_producto = $2`,
        [cantidad, id_producto]
    );
};

// Mis pedidos
exports.findByUsuario = async (id_usuario) => {
    const result = await db.query(
        `SELECT 
            p.id_pedido,
            p.numero_pedido,
            p.total,
            p.estado,
            p.tipo_entrega,
            p.metodo_pago,
            p.fecha_pedido,
            COUNT(pd.id_detalle) AS cantidad_items
         FROM pedidos p
         LEFT JOIN pedido_detalle pd ON p.id_pedido = pd.id_pedido
         WHERE p.id_usuario = $1
         GROUP BY p.id_pedido
         ORDER BY p.fecha_pedido DESC`,
        [id_usuario]
    );
    return result.rows;
};

// Detalle de un pedido
exports.findById = async (id_pedido) => {
    const result = await db.query(
        `SELECT p.*,
            json_agg(json_build_object(
                'nombre', pr.nombre,
                'sku', pr.sku,
                'cantidad', pd.cantidad,
                'precio_unitario', pd.precio_unitario,
                'subtotal', pd.subtotal
            )) AS items
         FROM pedidos p
         LEFT JOIN pedido_detalle pd ON p.id_pedido = pd.id_pedido
         LEFT JOIN productos pr ON pd.id_producto = pr.id_producto
         WHERE p.id_pedido = $1
         GROUP BY p.id_pedido`,
        [id_pedido]
    );
    return result.rows[0];
};

// Admin — todos los pedidos
exports.findAll = async ({ estado, pagina, limite }) => {
    let conditions = [];
    let params = [];
    let i = 1;

    if (estado) {
        conditions.push(`p.estado = $${i++}`);
        params.push(estado);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const lim = parseInt(limite) || 20;
    const offset = ((parseInt(pagina) || 1) - 1) * lim;

    const result = await db.query(
        `SELECT 
            p.id_pedido, p.numero_pedido, p.total, p.estado,
            p.tipo_entrega, p.fecha_pedido,
            u.correo AS cliente_correo,
            pe.nombres AS cliente_nombres,
            pe.apellidos AS cliente_apellidos
         FROM pedidos p
         JOIN usuario u ON p.id_usuario = u.id_usuario
         JOIN persona pe ON u.id_persona = pe.id_persona
         ${where}
         ORDER BY p.fecha_pedido DESC
         LIMIT $${i++} OFFSET $${i++}`,
        [...params, lim, offset]
    );
    return result.rows;
};

// Admin — cambiar estado del pedido
exports.updateEstado = async (id_pedido, estado) => {
    const result = await db.query(
        `UPDATE pedidos SET estado = $1, fecha_actualizacion = NOW()
         WHERE id_pedido = $2 RETURNING *`,
        [estado, id_pedido]
    );
    return result.rows[0];
};