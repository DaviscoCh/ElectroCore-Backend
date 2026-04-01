const db = require('../config/db');

exports.findAll = async () => {
    const result = await db.query(
        `SELECT * FROM zonas_entrega WHERE activa = true ORDER BY nombre ASC`
    );
    return result.rows;
};

exports.findAllAdmin = async () => {
    const result = await db.query(
        `SELECT * FROM zonas_entrega ORDER BY nombre ASC`
    );
    return result.rows;
};

exports.findById = async (id_zona) => {
    const result = await db.query(
        `SELECT * FROM zonas_entrega WHERE id_zona = $1`,
        [id_zona]
    );
    return result.rows[0];
};

// Buscar zona por ciudad
exports.findByCiudad = async (ciudad) => {
    const result = await db.query(
        `SELECT * FROM zonas_entrega
         WHERE $1 = ANY(ciudades) AND activa = true`,
        [ciudad]
    );
    return result.rows[0];
};

exports.insert = async ({ nombre, provincia, ciudades, costo_envio, tiempo_estimado }) => {
    const result = await db.query(
        `INSERT INTO zonas_entrega (nombre, provincia, ciudades, costo_envio, tiempo_estimado)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [nombre, provincia, ciudades, costo_envio, tiempo_estimado || null]
    );
    return result.rows[0];
};

exports.update = async (id_zona, datos) => {
    const { nombre, provincia, ciudades, costo_envio, tiempo_estimado, activa } = datos;
    const result = await db.query(
        `UPDATE zonas_entrega
         SET nombre=$1, provincia=$2, ciudades=$3,
             costo_envio=$4, tiempo_estimado=$5, activa=$6
         WHERE id_zona=$7 RETURNING *`,
        [nombre, provincia, ciudades, costo_envio, tiempo_estimado, activa, id_zona]
    );
    return result.rows[0];
};

// Sucursales
exports.findSucursales = async () => {
    const result = await db.query(
        `SELECT * FROM sucursales WHERE activa = true ORDER BY nombre ASC`
    );
    return result.rows;
};

exports.findSucursalByCiudad = async (ciudad) => {
    const result = await db.query(
        `SELECT * FROM sucursales
         WHERE LOWER(ciudad) = LOWER($1) AND activa = true`,
        [ciudad]
    );
    return result.rows;
};

exports.insertSucursal = async ({ nombre, direccion, provincia, ciudad, telefono, horario }) => {
    const result = await db.query(
        `INSERT INTO sucursales (nombre, direccion, provincia, ciudad, telefono, horario)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [nombre, direccion, provincia, ciudad, telefono || null, horario || null]
    );
    return result.rows[0];
};