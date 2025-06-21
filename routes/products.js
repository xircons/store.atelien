const express = require('express');
const router = express.Router();
const db = require('./models/db'); // เชื่อมต่อ MySQL

router.get('/', (req, res) => {
    const collection = req.query.collection || 'all';

    let sql = 'SELECT * FROM products';
    const params = [];

    if (collection !== 'all') {
        sql += ' WHERE category = ?';
        params.push(collection);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;