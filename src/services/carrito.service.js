const model = require('../models/carrito.models');
const db = require('../config/db');

// Ver carrito con total
exports.getCarrito = async (id_usuario) => {
    const items = await model.findByUsuario(id_usuario);
    const totales = await model.getTotal(id_usuario);

    return {
        items,
        resumen: {
            cantidad_items: parseInt(totales.items) || 0,
            total: parseFloat(totales.total) || 0
        }
    };
};

// Agregar producto al carrito
exports.agregar = async (id_usuario, { id_producto, cantidad = 1 }) => {

    // 1. Verificar que el producto existe y tiene stock
    const productoResult = await db.query(
        `SELECT id_producto, nombre, precio, stock
         FROM productos WHERE id_producto = $1 AND estado = true`,
        [id_producto]
    );
    const producto = productoResult.rows[0];

    if (!producto) {
        const err = new Error('Producto no encontrado');
        err.status = 404;
        throw err;
    }

    if (producto.stock < cantidad) {
        const err = new Error(`Stock insuficiente. Disponible: ${producto.stock}`);
        err.status = 400;
        throw err;
    }

    // 2. Si ya existe en el carrito, actualizar cantidad
    const itemExiste = await model.findItem(id_usuario, id_producto);

    if (itemExiste) {
        const nuevaCantidad = itemExiste.cantidad + cantidad;

        if (producto.stock < nuevaCantidad) {
            const err = new Error(`Stock insuficiente. Disponible: ${producto.stock}`);
            err.status = 400;
            throw err;
        }

        return await model.updateCantidad(itemExiste.id_carrito, nuevaCantidad);
    }

    // 3. Si no existe, crear nuevo item
    return await model.insert(id_usuario, id_producto, cantidad);
};

// Actualizar cantidad de un item
exports.actualizarCantidad = async (id_usuario, id_carrito, cantidad) => {

    // Verificar que el item pertenece al usuario
    const item = await model.findById(id_carrito);
    if (!item || item.id_usuario !== id_usuario) {
        const err = new Error('Item no encontrado');
        err.status = 404;
        throw err;
    }

    if (cantidad <= 0) {
        // Si cantidad es 0 o menos, eliminar el item
        return await model.remove(id_carrito);
    }

    // Verificar stock
    const stockResult = await db.query(
        `SELECT stock FROM productos WHERE id_producto = $1`,
        [item.id_producto]
    );
    const stock = stockResult.rows[0]?.stock;

    if (stock < cantidad) {
        const err = new Error(`Stock insuficiente. Disponible: ${stock}`);
        err.status = 400;
        throw err;
    }

    return await model.updateCantidad(id_carrito, cantidad);
};

// Eliminar item del carrito
exports.eliminar = async (id_usuario, id_carrito) => {
    const item = await model.findById(id_carrito);
    if (!item || item.id_usuario !== id_usuario) {
        const err = new Error('Item no encontrado');
        err.status = 404;
        throw err;
    }
    return await model.remove(id_carrito);
};

// Vaciar carrito
exports.vaciar = async (id_usuario) => {
    await model.vaciar(id_usuario);
};