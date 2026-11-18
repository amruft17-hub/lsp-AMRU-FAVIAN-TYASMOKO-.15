const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const siswaRoutes = require('./routes/siswa');

app.use('/api/siswa', siswaRoutes);

app.get('/', (req, res) => {
    res.send('API CRUD Data Siswa Berjalan!');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});