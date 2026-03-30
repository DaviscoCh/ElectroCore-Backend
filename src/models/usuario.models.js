const db = require('../config/db');

// Buscar usuario por correo (incluye datos de persona)
exports.findByCorreo = async (correo) => {
    const result = await db.query(
        `SELECT u.*, p.nombres, p.apellidos, p.telefono, p.direccion
         FROM usuario u
         JOIN persona p ON u.id_persona = p.id_persona
         WHERE u.correo = $1`,
        [correo]
    );
    return result.rows[0];
};

// Buscar usuario por ID
exports.findById = async (id_usuario) => {
    const result = await db.query(
        `SELECT 
            u.id_usuario,
            u.id_persona,
            u.correo,
            u.rol,
            u.estado,
            u.fecha_creacion,
            p.nombres,
            p.apellidos,
            p.telefono,
            p.direccion
         FROM usuario u
         JOIN persona p ON u.id_persona = p.id_persona
         WHERE u.id_usuario = $1`,
        [id_usuario]
    );
    return result.rows[0];
};

// Crear nuevo usuario
exports.insert = async ({ id_persona, correo, password, rol }) => {
    const result = await db.query(
        `INSERT INTO usuario (id_persona, correo, password, rol)
         VALUES ($1, $2, $3, $4)
         RETURNING id_usuario, correo, rol, estado, fecha_creacion`,
        [id_persona, correo, password, rol || 'cliente']
    );
    return result.rows[0];
};
