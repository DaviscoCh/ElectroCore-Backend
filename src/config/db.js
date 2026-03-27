const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false  // requerido por Supabase
    }
});

// Verificar conexión al arrancar
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error conectando a Supabase:', err.message);
    } else {
        console.log('✅ Conexión a Supabase establecida');
        release();
    }
});

module.exports = pool;
