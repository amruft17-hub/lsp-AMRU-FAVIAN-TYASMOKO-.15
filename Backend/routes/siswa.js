const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    db.query(
        `SELECT kode_siswa, nama_siswa, alamat_siswa,
            DATE_FORMAT(tgl_siswa, '%Y-%m-%d') AS tgl_siswa,
            jurusan_siswa
        FROM siswa`,
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Gagal mengambil data siswa',
                    error: err.message
                });
            }

            res.json({
                data: result
            });
        }
    );
});

router.post('/', (req, res) => {
    const {
        kode_siswa,
        nama_siswa,
        alamat_siswa,
        tgl_siswa,
        jurusan_siswa
    } = req.body;

    const sql = `INSERT INTO siswa
    (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa)
    VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [
        kode_siswa,
        nama_siswa,
        alamat_siswa,
        tgl_siswa,
        jurusan_siswa
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Gagal menambahkan data',
                error: err.message
            });
        }

        res.status(201).json({
            message: 'Data siswa berhasil ditambahkan'
        });
    });
});

router.get('/:kode_siswa', (req, res) => {
    const kode = req.params.kode_siswa;

    const sql = `SELECT kode_siswa, nama_siswa, alamat_siswa,
        DATE_FORMAT(tgl_siswa, '%Y-%m-%d') AS tgl_siswa,
        jurusan_siswa
        FROM siswa
        WHERE kode_siswa = ?`;

    db.query(sql, [kode], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Gagal mengambil data'
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({
            data: result[0]
        });
    });
});

router.put('/:kode_siswa', (req, res) => {
    const kode = req.params.kode_siswa;

    const {
        nama_siswa,
        alamat_siswa,
        tgl_siswa,
        jurusan_siswa
    } = req.body;

    const sql = `UPDATE siswa SET
        nama_siswa = ?,
        alamat_siswa = ?,
        tgl_siswa = ?,
        jurusan_siswa = ?
        WHERE kode_siswa = ?`;

    db.query(sql, [
        nama_siswa,
        alamat_siswa,
        tgl_siswa,
        jurusan_siswa,
        kode
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Gagal mengubah data'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({
            message: 'Data siswa berhasil diperbarui'
        });
    });
});

router.delete('/:kode_siswa', (req, res) => {
    const kode = req.params.kode_siswa;

    const sql = 'DELETE FROM siswa WHERE kode_siswa = ?';

    db.query(sql, [kode], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Gagal menghapus data'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({
            message: 'Data siswa berhasil dihapus'
        });
    });
});

module.exports = router;