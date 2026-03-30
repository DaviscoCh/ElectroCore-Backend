const model = require('../models/producto.models');

exports.getAll = async (filtros) => {
    return await model.findAll(filtros);
};

exports.getBySlug = async (slug) => {
    const producto = await model.findBySlug(slug);
    if (!producto) {
        const err = new Error('Producto no encontrado');
        err.status = 404;
        throw err;
    }
    // Agregar imágenes y especificaciones al detalle
    const imagenes = await model.findImagenes(producto.id_producto);
    const especificaciones = await model.findEspecificaciones(producto.id_producto);

    return { ...producto, imagenes, especificaciones };
};

exports.create = async (datos) => {
    // Verificar SKU único
    const db = require('../config/db');
    const skuExiste = await db.query(
        'SELECT id_producto FROM productos WHERE sku = $1', [datos.sku]
    );
    if (skuExiste.rows.length > 0) {
        const err = new Error('Ya existe un producto con ese SKU');
        err.status = 409;
        throw err;
    }
    return await model.insert(datos);
};

exports.update = async (id_producto, datos) => {
    const producto = await model.findById(id_producto);
    if (!producto) {
        const err = new Error('Producto no encontrado');
        err.status = 404;
        throw err;
    }
    return await model.update(id_producto, datos);
};

exports.remove = async (id_producto) => {
    const producto = await model.findById(id_producto);
    if (!producto) {
        const err = new Error('Producto no encontrado');
        err.status = 404;
        throw err;
    }
    return await model.remove(id_producto);
};