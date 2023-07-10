const mysql = require("mysql2/promise");
const translit = require('ua-en-translit');
const { transliterate : tr } = require('transliteration')

async function toEnTranslit(from, to, env, uk) {
    const [from_table, from_row] = from.split('.');
    const [to_table, to_row] = to.split('.');
    const db_config = require('./config/db')(env);
    const connection = await mysql.createConnection(db_config);
    
    let [data] = await connection.query(
        `SELECT id, ${from_row} FROM ${from_table} WHERE id IN (SELECT id FROM ${to_table} WHERE ${to_row} IS NULL) LIMIT 1 `
    );

    if (data.length == 0) {
        connection.close();
        return;
    }

    if (uk) {
        data = data.map(el => {
            el[to_row] = translit(el[from_row]);
            return el;
        });
    } else {
        data = data.map(el => {
            el[to_row] = tr(el[from_row]);
            return el;
        });
    }

    for (let i = 0; i < data.length; i++) {
        await connection.query(
            `UPDATE ${to_table} SET ${to_row} = '${data[i][to_row]}' WHERE id = ${data[i]['id']}`
        );
    }

    connection.close();
}

module.exports = toEnTranslit;