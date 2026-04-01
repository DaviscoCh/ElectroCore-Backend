const service = require('../services/zona.service');

exports.getZonas = async (req, res, next) => {
    try {
        const data = await service.getZonas();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.getSucursales = async (req, res, next) => {
    try {
        const data = await service.getSucursales();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.verificarCobertura = async (req, res, next) => {
    try {
        const data = await service.verificarCobertura(req.params.ciudad);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

exports.crearZona = async (req, res, next) => {
    try {
        const data = await service.crearZona(req.body);
        res.status(201).json({ success: true, message: 'Zona creada', data });
    } catch (err) { next(err); }
};

exports.actualizarZona = async (req, res, next) => {
    try {
        const data = await service.actualizarZona(req.params.id, req.body);
        res.json({ success: true, message: 'Zona actualizada', data });
    } catch (err) { next(err); }
};

exports.crearSucursal = async (req, res, next) => {
    try {
        const data = await service.crearSucursal(req.body);
        res.status(201).json({ success: true, message: 'Sucursal creada', data });
    } catch (err) { next(err); }
};

exports.getZonasAdmin = async (req, res, next) => {
    try {
        const data = await service.getZonasAdmin();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};