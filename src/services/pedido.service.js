const pedidoModel = require('../models/pedido.models');
const facturaModel = require('../models/factura.models');
const carritoModel = require('../models/carrito.models');
const emailService = require('./email.service');
const db = require('../config/db');

const IVA = 0.15; // 15% IVA Ecuador

exports.crearPedido = async (id_usuario, datos) => {
    const {
        tipo_entrega, id_sucursal, id_zona,
        direccion_envio, ciudad_envio, provincia_envio,
        metodo_pago, comentario
    } = datos;

    // 1. Obtener carrito del usuario
    const carrito = await carritoModel.findByUsuario(id_usuario);
    if (!carrito.length) {
        const err = new Error('El carrito está vacío');
        err.status = 400;
        throw err;
    }

    // 2. Verificar stock de cada producto
    for (const item of carrito) {
        if (item.stock < item.cantidad) {
            const err = new Error(`Stock insuficiente para "${item.nombre}". Disponible: ${item.stock}`);
            err.status = 400;
            throw err;
        }
    }

    // 3. Calcular totales
    const subtotalBruto = carrito.reduce((acc, item) =>
        acc + (parseFloat(item.precio) * item.cantidad), 0
    );

    // Costo de envío
    let costo_envio = 0;
    if (tipo_entrega === 'domicilio' && id_zona) {
        const zonaResult = await db.query(
            `SELECT costo_envio FROM zonas_entrega WHERE id_zona = $1`,
            [id_zona]
        );
        costo_envio = parseFloat(zonaResult.rows[0]?.costo_envio) || 0;
    }

    const subtotal = parseFloat(subtotalBruto.toFixed(2));
    const iva = parseFloat((subtotal * IVA).toFixed(2));
    const total = parseFloat((subtotal + iva + costo_envio).toFixed(2));

    // 4. Generar número de pedido
    const numero_pedido = await pedidoModel.generarNumeroPedido();

    // 5. Transacción
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // Crear pedido
        const pedido = await pedidoModel.insert(client, {
            numero_pedido, id_usuario, subtotal, iva,
            costo_envio, total, tipo_entrega,
            id_sucursal, id_zona, direccion_envio,
            ciudad_envio, provincia_envio,
            metodo_pago, comentario
        });

        // Crear detalle y descontar stock
        for (const item of carrito) {
            await pedidoModel.insertDetalle(client, {
                id_pedido: pedido.id_pedido,
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                precio_unitario: parseFloat(item.precio)
            });
            await pedidoModel.descontarStock(client, item.id_producto, item.cantidad);
        }

        // Crear factura
        const factura = await facturaModel.insert(client, {
            id_pedido: pedido.id_pedido,
            id_usuario, subtotal, iva, costo_envio, total
        });

        // Vaciar carrito
        await client.query(
            `DELETE FROM carrito WHERE id_usuario = $1`, [id_usuario]
        );

        await client.query('COMMIT');

        // 6. Email de confirmación (no bloqueante)
        const usuarioResult = await db.query(
            `SELECT u.correo, p.nombres 
             FROM usuario u JOIN persona p ON u.id_persona = p.id_persona
             WHERE u.id_usuario = $1`,
            [id_usuario]
        );
        const usuario = usuarioResult.rows[0];

        emailService.enviarConfirmacionPedido({
            correo: usuario.correo,
            nombres: usuario.nombres,
            numero_pedido,
            total,
            items: carrito
        }).catch(err => console.error('⚠️ Error enviando email:', err.message));

        return { pedido, factura };

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

exports.getMisPedidos = async (id_usuario) => {
    return await pedidoModel.findByUsuario(id_usuario);
};

exports.getDetallePedido = async (id_usuario, id_pedido) => {
    const pedido = await pedidoModel.findById(id_pedido);
    if (!pedido) {
        const err = new Error('Pedido no encontrado');
        err.status = 404;
        throw err;
    }
    if (pedido.id_usuario !== id_usuario) {
        const err = new Error('No tienes acceso a este pedido');
        err.status = 403;
        throw err;
    }
    return pedido;
};

exports.getAllPedidos = async (filtros) => {
    return await pedidoModel.findAll(filtros);
};

exports.updateEstado = async (id_pedido, estado) => {
    const estadosValidos = ['pendiente','confirmado','preparando','enviado','entregado','cancelado'];
    if (!estadosValidos.includes(estado)) {
        const err = new Error('Estado no válido');
        err.status = 400;
        throw err;
    }
    const pedido = await pedidoModel.updateEstado(id_pedido, estado);
    if (!pedido) {
        const err = new Error('Pedido no encontrado');
        err.status = 404;
        throw err;
    }
    return pedido;
};