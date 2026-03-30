const db = require('../config/db');

// Buscar persona por correo
exports.findByCorreo = async (correo) => {
    const result = await db.query(
        'SELECT * FROM persona WHERE correo = $1',
        [correo]
    );
    return result.rows[0];
};

// Crear nueva persona
exports.insert = async ({ nombres, apellidos, correo, telefono, direccion }) => {
    const result = await db.query(
        `INSERT INTO persona (nombres, apellidos, correo, telefono, direccion)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [nombres, apellidos, correo, telefono || null, direccion || null]
    );
    return result.rows[0];
};

// Buscar persona por ID
exports.findById = async (id_persona) => {
    const result = await db.query(
        'SELECT * FROM persona WHERE id_persona = $1',
        [id_persona]
    );
    return result.rows[0];
};
