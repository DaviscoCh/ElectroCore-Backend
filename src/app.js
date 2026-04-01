const express = require('express');
const cors = require('cors');

// ── Configuración de CORS por entorno ──────────────────────
const allowedOrigins = [
    process.env.CORS_ORIGIN_DEV,    // frontend cliente (localhost:5173)
    process.env.CORS_ORIGIN_ADMIN,  // panel admin (localhost:5174)
].filter(Boolean); // elimina valores undefined si no están en .env

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        // Permitir requests sin origin (Postman, mobile, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS bloqueado para: ${origin}`));
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Ruta de salud — para verificar que el servidor corre ───
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        proyecto: 'ElectroCore API',
        entorno: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// ── Rutas de la API ────────────────────────────────────────
// (las iremos agregando aquí conforme creemos cada módulo)
// app.use('/api/categorias', require('./routes/categoria.routes'));
// app.use('/api/productos',  require('./routes/producto.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/categorias', require('./routes/categoria.routes'));
app.use('/api/marcas', require('./routes/marca.routes'));
app.use('/api/productos', require('./routes/producto.routes'));
app.use('/api/carrito', require('./routes/carrito.routes'));
app.use('/api/pedidos',       require('./routes/pedido.routes'));
app.use('/api/favoritos',        require('./routes/favorito.routes'));
app.use('/api/resenas',          require('./routes/resena.routes'));
app.use('/api/zonas',            require('./routes/zona.routes'));

// Rutas admin — protegidas
app.use('/api/admin/marcas', require('./routes/admin/marca.admin.routes'));
app.use('/api/admin/productos', require('./routes/admin/producto.admin.routes'));
app.use('/api/admin/pedidos', require('./routes/admin/pedido.admin.routes'));
app.use('/api/admin/resenas',    require('./routes/admin/resena.admin.routes'));
app.use('/api/admin/zonas',      require('./routes/admin/zona.admin.routes'));


// ── Middleware de errores global — siempre al final ────────
app.use((err, req, res, next) => {
    console.error(`❌ Error: ${err.message}`);
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor'
    });
});

module.exports = app;
