
import React, { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000/api/siswa';
const BACKEND_HEALTH_URL = new URL(API_URL).origin;

function formatBirthDate(value) {
  if (!value) return '-';

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return '-';

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    return '-';
  }

  return `${day}/${month}/${year.slice(-2)}`;
}

function App() {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    let active = true;

    const checkBackend = async () => {
      try {
        const response = await fetch(BACKEND_HEALTH_URL, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Backend health check failed');
        }

        if (active) setBackendStatus('connected');
      } catch {
        if (active) setBackendStatus('disconnected');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const [siswa, setSiswa] = useState([]);

  const [form, setForm] = useState({
    kode_siswa: '',
    nama_siswa: '',
    alamat_siswa: '',
    tgl_siswa: '',
    jurusan_siswa: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // READ: Mengambil semua data siswa
  const getSiswa = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Gagal mengambil data siswa');
      }

      const result = await response.json();
      if (!Array.isArray(result.data)) {
        throw new Error('Format data siswa dari server tidak valid');
      }

      setSiswa(result.data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSiswa();
  }, []);

  // Mengubah nilai input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // CREATE dan UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editMode
      ? `${API_URL}/${encodeURIComponent(form.kode_siswa)}`
      : API_URL;

    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          tgl_siswa: form.tgl_siswa || null
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      alert(result.message);

      resetForm();
      getSiswa();

    } catch (err) {
      alert(err.message);
    }
  };

  // Mengisi form untuk edit
  const handleEdit = (data) => {
    setForm({
      kode_siswa: data.kode_siswa,
      nama_siswa: data.nama_siswa,
      alamat_siswa: data.alamat_siswa || '',
      tgl_siswa: data.tgl_siswa
        ? String(data.tgl_siswa).slice(0, 10)
        : '',
      jurusan_siswa: data.jurusan_siswa || ''
    });

    setEditMode(true);
  };

  // DELETE: Menghapus data siswa
  const handleDelete = async (kode) => {
    const yakin = window.confirm(
      'Apakah kamu yakin ingin menghapus data siswa ini?'
    );

    if (!yakin) return;

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(kode)}`,
        {
          method: 'DELETE'
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menghapus data');
      }

      alert(result.message);
      getSiswa();

    } catch (err) {
      alert(err.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      kode_siswa: '',
      nama_siswa: '',
      alamat_siswa: '',
      tgl_siswa: '',
      jurusan_siswa: ''
    });

    setEditMode(false);
  };

  return (
    <div className="container">

      <header className="header">
        <div>
          <h1> Data Siswa</h1>
          <p>Kelola data siswa dengan mudah</p>
        </div>

        <div className="total">
          <div className="total-count">
            <span>Total Siswa</span>
            <h2>{siswa.length}</h2>
          </div>
          <div
            className={`backend-status ${backendStatus}`}
            role="status"
            aria-live="polite"
          >
            <span className="backend-status-dot" aria-hidden="true" />
            {backendStatus === 'checking'
              ? 'Memeriksa backend...'
              : backendStatus === 'connected'
                ? 'Backend terhubung'
                : 'Backend tidak terhubung'}
          </div>
        </div>
      </header>

      <section className="form-section">
        <h2>
          {editMode ? 'Edit Data Siswa' : 'Tambah Data Siswa'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-group">
              <label>Kode Siswa</label>
              <input
                type="text"
                name="kode_siswa"
                placeholder="Contoh: S001"
                value={form.kode_siswa}
                onChange={handleChange}
                disabled={editMode}
                required
              />
            </div>

            <div className="form-group">
              <label>Nama Siswa</label>
              <input
                type="text"
                name="nama_siswa"
                placeholder="Masukkan nama siswa"
                value={form.nama_siswa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Alamat Siswa</label>
              <input
                type="text"
                name="alamat_siswa"
                placeholder="Masukkan alamat"
                value={form.alamat_siswa}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tanggal Lahir Siswa</label>
              <input
                type="date"
                name="tgl_siswa"
                value={form.tgl_siswa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Jurusan Siswa</label>
              <select
                name="jurusan_siswa"
                value={form.jurusan_siswa}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jurusan</option>
                <option value="Teknik Informatika">
                  Teknik Informatika
                </option>
                <option value="Sistem Informasi">
                  Sistem Informasi
                </option>
                <option value="Manajemen">
                  Manajemen
                </option>
                <option value="Akuntansi">
                  Akuntansi
                </option>
              </select>
            </div>

          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editMode ? 'Update Siswa' : 'Tambah Siswa'}
            </button>

            {editMode && (
              <button
                type="button"
                className="btn-cancel"
                onClick={resetForm}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h2>Daftar Data Siswa</h2>

          <button onClick={getSiswa} className="btn-refresh">
            Refresh Data
          </button>
        </div>

        {error && (
          <p className="error" role="alert">
            {error}. Pastikan server backend aktif, lalu coba refresh data.
          </p>
        )}

        {loading ? (
          <p className="table-status" role="status">Memuat data siswa...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Siswa</th>
                  <th>Nama Siswa</th>
                  <th>Alamat</th>
                  <th>Tanggal Lahir </th>
                  <th>Jurusan</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {siswa.length > 0 ? (
                  siswa.map((item, index) => (
                    <tr key={item.kode_siswa}>
                      <td>{index + 1}</td>
                      <td>{item.kode_siswa}</td>
                      <td>{item.nama_siswa}</td>
                      <td>{item.alamat_siswa}</td>
                      <td>{formatBirthDate(item.tgl_siswa)}</td>
                      <td>{item.jurusan_siswa}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn-delete"
                            onClick={() =>
                              handleDelete(item.kode_siswa)
                            }
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty">
                      Belum ada data siswa
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}

export default App;
