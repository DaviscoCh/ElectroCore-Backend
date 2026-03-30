const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
    try {
        const resultado = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: resultado
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const resultado = await authService.login(req.body);
        res.json({
            success: true,
            message: 'Sesión iniciada exitosamente',
            data: resultado
        });
    } catch (err) {
        next(err);
    }
};

exports.me = async (req, res, next) => {
    try {
        const usuarioModel = require('../models/usuario.models');
        const usuario = await usuarioModel.findById(req.usuario.id_usuario);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ success: true, data: usuario });
    } catch (err) {
        next(err);
    }
};
