// Middleware de errores centralizado
// Se usa en app.js como último middleware
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    console.error(`❌ [${new Date().toISOString()}] ${req.method} ${req.url} — ${message}`);

    res.status(status).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
