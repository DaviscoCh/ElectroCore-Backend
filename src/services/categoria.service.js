const model = require('../models/categoria.models');

exports.getAll = async () => {
    return await model.findAll();
};

exports.getBySlug = async (slug) => {
    const categoria = await model.findBySlug(slug);
    if (!categoria) {
        const err = new Error('Categoría no encontrada');
        err.status = 404;
        throw err;
    }
    return categoria;
};

exports.create = async (datos) => {
    // Verificar que el slug no exista
    const existe = await model.findBySlug(datos.slug);
    if (existe) {
        const err = new Error('Ya existe una categoría con ese slug');
        err.status = 409;
        throw err;
    }
    return await model.insert(datos);
};

exports.update = async (id_categoria, datos) => {
    const categoria = await model.findById(id_categoria);
    if (!categoria) {
        const err = new Error('Categoría no encontrada');
        err.status = 404;
        throw err;
    }
    return await model.update(id_categoria, datos);
};