const model = require('../models/zona.models');

exports.getZonas = async () => await model.findAll();
exports.getZonasAdmin = async () => await model.findAllAdmin();
exports.getSucursales = async () => await model.findSucursales();

exports.verificarCobertura = async (ciudad) => {
    const zona = await model.findByCiudad(ciudad);
    const sucursales = await model.findSucursalByCiudad(ciudad);
    return {
        tiene_cobertura: !!zona,
        zona: zona || null,
        sucursales_disponibles: sucursales,
        puede_retirar: sucursales.length > 0
    };
};

exports.crearZona = async (datos) => await model.insert(datos);
exports.actualizarZona = async (id, datos) => {
    const zona = await model.findById(id);
    if (!zona) {
        const err = new Error('Zona no encontrada');
        err.status = 404;
        throw err;
    }
    return await model.update(id, datos);
};

exports.crearSucursal = async (datos) => await model.insertSucursal(datos);