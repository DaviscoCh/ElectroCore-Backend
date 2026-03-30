const jwt = require('jsonwebtoken');

// Middleware — verifica que el JWT sea válido
exports.verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado — token requerido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // { id_usuario, rol }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

// Middleware — verifica que el usuario tenga el rol requerido
exports.verificarRol = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({
                error: 'No tienes permisos para realizar esta acción'
            });
        }
        next();
    };
};
