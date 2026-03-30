const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuario.models');
const personaModel = require('../models/persona.models');
const emailService = require('./email.service');

// Registrar nuevo usuario
exports.register = async ({ nombres, apellidos, correo, password, telefono, direccion }) => {

    // 1. Verificar si el correo ya existe
    const usuarioExiste = await usuarioModel.findByCorreo(correo);
    if (usuarioExiste) {
        const error = new Error('Este correo ya está registrado');
        error.status = 409;
        throw error;
    }

    // 2. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Crear persona y usuario en transacción
    const db = require('../config/db');
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // Crear persona
        const personaResult = await client.query(
            `INSERT INTO persona (nombres, apellidos, correo, telefono, direccion)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nombres, apellidos, correo, telefono || null, direccion || null]
        );
        const persona = personaResult.rows[0];

        // Crear usuario
        const usuarioResult = await client.query(
            `INSERT INTO usuario (id_persona, correo, password, rol)
             VALUES ($1, $2, $3, 'cliente')
             RETURNING id_usuario, correo, rol, fecha_creacion`,
            [persona.id_persona, correo, passwordHash]
        );
        const usuario = usuarioResult.rows[0];

        await client.query('COMMIT');

        // 4. Enviar email de bienvenida (no bloqueante)
        emailService.enviarBienvenida({ correo, nombres }).catch(err =>
            console.error('⚠️ Error enviando email de bienvenida:', err.message)
        );

        // 5. Generar JWT
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return {
            usuario: {
                id_usuario: usuario.id_usuario,
                nombres: persona.nombres,
                apellidos: persona.apellidos,
                correo: usuario.correo,
                rol: usuario.rol
            },
            token
        };

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// Login
exports.login = async ({ correo, password }) => {

    // 1. Buscar usuario
    const usuario = await usuarioModel.findByCorreo(correo);
    if (!usuario) {
        const error = new Error('Correo o contraseña incorrectos');
        error.status = 401;
        throw error;
    }

    // 2. Verificar que la cuenta esté activa
    if (!usuario.estado) {
        const error = new Error('Tu cuenta está desactivada');
        error.status = 403;
        throw error;
    }

    // 3. Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
        const error = new Error('Correo o contraseña incorrectos');
        error.status = 401;
        throw error;
    }

    // 4. Generar JWT
    const token = jwt.sign(
        { id_usuario: usuario.id_usuario, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
        usuario: {
            id_usuario: usuario.id_usuario,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            rol: usuario.rol
        },
        token
    };
};
