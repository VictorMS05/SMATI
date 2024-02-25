require('dotenv').config();

const mysql = require('mysql2');
const { promisify } = require('util');
// Configuración de la base de datos
const fs = require('fs');
const rawConfig = fs.readFileSync('api/bd/appconfig.json');
const config = JSON.parse(rawConfig);
// Reemplazar los marcadores de posición con valores de variables de entorno
// config.conexionDB.host = process.env.DB_HOST;
// config.conexionDB.port = process.env.DB_PORT;
// config.conexionDB.user = process.env.DB_USER;
// config.conexionDB.password = process.env.DB_PASSWORD;
// config.conexionDB.database = process.env.DB_NAME;
// config.conexionDB.url = process.env.DB_URL;

// const conexionBD = config.conexionDB;
// const conexionBD = require('./appconfig.json').conexionDB;

const pool = mysql.createPool(process.env.DB_URL);
pool.getConnection((err, con) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('La conexión fue cerrada.');
        }
        else if (err.code === 'ERR_CON_COUNT_ERROR') {
            console.log('La base de datos tiene muchas onexiones abiertas.')
        }
        else if (err.code === 'ECONREFUSED') {
            console.log('Conexión rechazada.')
        }
    }

    if (con) {
        con.release();
    }

    console.log('La conexión a la base de datos está lista.');
    return;
});

pool.query = promisify(pool.query);
module.exports = pool;