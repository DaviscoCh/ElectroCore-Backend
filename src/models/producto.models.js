const db = require('../config/db');

// Listar productos con filtros opcionales
exports.findAll = async ({ categoria, marca, destacado, busqueda, orden, pagina, limite }) => {
    let conditions = ['p.estado = true'];
    let params = [];
    let i = 1;

    if (categoria) {
        conditions.push(`c.slug = $${i++}`);
        params.push(categoria);
    }
    if (marca) {
        conditions.push(`m.nombre ILIKE $${i++}`);
        params.push(`%${marca}%`);
    }
    if (destacado === 'true') {
        conditions.push(`p.destacado = true`);
    }
    if (busqueda) {
        conditions.push(`(p.nombre ILIKE $${i++} OR p.descripcion ILIKE $${i++})`);
        params.push(`%${busqueda}%`);
        params.push(`%${busqueda}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Ordenamiento
    const ordenMap = {
        'precio_asc':  'p.precio ASC',
        'precio_desc': 'p.precio DESC',
        'nombre_asc':  'p.nombre ASC',
        'reciente':    'p.creado_en DESC'
    };
    const orderBy = ordenMap[orden] || 'p.creado_en DESC';

    // Paginación
    const lim = parseInt(limite) || 12;
    const offset = ((parseInt(pagina) || 1) - 1) * lim;

    const result = await db.query(
        `SELECT 
            p.id_producto,
            p.nombre,
            p.descripcion,
            p.precio,
            p.stock,
            p.sku,
            p.slug,
            p.imagen_url,
            p.destacado,
            p.creado_en,
            c.nombre   AS categoria,
            c.slug     AS categoria_slug,
            m.nombre   AS marca
         FROM productos p
         LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
         LEFT JOIN marcas m     ON p.id_marca = m.id_marca
         ${where}
         ORDER BY ${orderBy}
         LIMIT $${i++} OFFSET $${i++}`,
        [...params, lim, offset]
    );

    // Total para paginación
    const total = await db.query(
        `SELECT COUNT(*) FROM productos p
         LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
         LEFT JOIN marcas m     ON p.id_marca = m.id_marca
         ${where}`,
        params
    );

    return {
        productos: result.rows,
        total: parseInt(total.rows[0].count),
        pagina: parseInt(pagina) || 1,
        limite: lim,
        totalPaginas: Math.ceil(parseInt(total.rows[0].count) / lim)
    };
};

// Detalle de producto por slug
exports.findBySlug = async (slug) => {
    const result = await db.query(
        `SELECT 
            p.*,
            c.nombre AS categoria,
            c.slug   AS categoria_slug,
            m.nombre AS marca,
            m.logo_url AS marca_logo
         FROM productos p
         LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
         LEFT JOIN marcas m     ON p.id_marca = m.id_marca
         WHERE p.slug = $1 AND p.estado = true`,
        [slug]
    );
    return result.rows[0];
};

exports.findById = async (id_producto) => {
    const result = await db.query(
        `SELECT p.*, c.nombre AS categoria, m.nombre AS marca
         FROM productos p
         LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
         LEFT JOIN marcas m     ON p.id_marca = m.id_marca
         WHERE p.id_producto = $1`,
        [id_producto]
    );
    return result.rows[0];
};

exports.insert = async ({ id_categoria, id_marca, nombre, descripcion, precio, stock, sku, slug, imagen_url, destacado }) => {
    const result = await db.query(
        `INSERT INTO productos 
            (id_categoria, id_marca, nombre, descripcion, precio, stock, sku, slug, imagen_url, destacado)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING *`,
        [id_categoria, id_marca || null, nombre, descripcion || null,
         precio, stock || 0, sku, slug, imagen_url || null, destacado || false]
    );
    return result.rows[0];
};

exports.update = async (id_producto, campos) => {
    const { id_categoria, id_marca, nombre, descripcion, precio, stock, sku, slug, imagen_url, destacado, estado } = campos;
    const result = await db.query(
        `UPDATE productos SET
            id_categoria = $1, id_marca = $2, nombre = $3, descripcion = $4,
            precio = $5, stock = $6, sku = $7, slug = $8,
            imagen_url = $9, destacado = $10, estado = $11,
            actualizado_en = NOW()
         WHERE id_producto = $12
         RETURNING *`,
        [id_categoria, id_marca || null, nombre, descripcion || null,
         precio, stock, sku, slug, imagen_url || null, destacado, estado, id_producto]
    );
    return result.rows[0];
};

exports.remove = async (id_producto) => {
    // Soft delete — no borramos, solo desactivamos
    const result = await db.query(
        `UPDATE productos SET estado = false, actualizado_en = NOW()
         WHERE id_producto = $1 RETURNING *`,
        [id_producto]
    );
    return result.rows[0];
};

// Imágenes adicionales del producto
exports.findImagenes = async (id_producto) => {
    const result = await db.query(
        `SELECT * FROM imagenes_producto
         WHERE id_producto = $1
         ORDER BY orden ASC`,
        [id_producto]
    );
    return result.rows;
};

// Especificaciones técnicas del producto
exports.findEspecificaciones = async (id_producto) => {
    const result = await db.query(
        `SELECT clave, valor FROM especificaciones_producto
         WHERE id_producto = $1`,
        [id_producto]
    );
    return result.rows;
};