
const dotenv = require('dotenv');


function getConfig(env) {
    dotenv.config({path: env});

    return {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
    };
}

module.exports = getConfig;