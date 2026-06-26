const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 4000;

// Настройка подключения к PostgreSQL
const pool = new Pool({
    host: process.env.PGHOST || 'psgr',
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '1234',
    database: process.env.PGDATABASE || 'mydata',
});

// Middleware для CORS (разрешаем запросы с любого источника, для разработки)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Главный эндпоинт
app.get('/api/women', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM women');
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка запроса:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`API-сервер запущен на порту ${PORT}`);
});