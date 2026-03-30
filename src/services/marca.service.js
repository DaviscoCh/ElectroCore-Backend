const model = require('../models/marca.models');

exports.getAll = async () => {
    return await model.findAll();
};

exports.getById = async (id_marca) => {
    const marca = await model.findById(id_marca);
    if (!marca) {
        const err = new Error('Marca no encontrada');
        err.status = 404;
        throw err;
    }
    return marca;
};

exports.create = async (datos) => {
    return await model.insert(datos);
};

exports.update = async (id_marca, datos) => {
    const marca = await model.findById(id_marca);
    if (!marca) {
        const err = new Error('Marca no encontrada');
        err.status = 404;
        throw err;
    }
    return await model.update(id_marca, datos);
};