const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_siswa'
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi database gagal:', err);
        return;
    }

    console.log('Database berhasil terhubung!');
});

module.exports = db;