const mysql = require('mysql');
// koneksi ke db

const {MYSQL_HOST,MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE} = process.env;
const db = mysql.createConnection({
    MYSQL: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE
})

// cek koneksi ke db
db.connect((err) => {
    if (err) throw err;
    console.log('Database Connected');
})

module.exports = db;