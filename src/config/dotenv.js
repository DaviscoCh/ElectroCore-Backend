require('dotenv').config();

// Variables requeridas para que el servidor funcione
const requeridas = [
    'PG_CONNECTION_STRING',
    'JWT_SECRET',
    'JWT_EXPIRES_IN'
];

const faltantes = requeridas.filter(v => !process.env[v]);

if (faltantes.length > 0) {
    console.error('❌ Faltan variables de entorno requeridas:');
    faltantes.forEach(v => console.error(`   - ${v}`));
    console.error('📋 Crea un archivo .env basado en .env.example');
    process.exit(1); // detiene el servidor inmediatamente
}

module.exports = process.env;
