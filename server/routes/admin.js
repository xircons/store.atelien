const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { requireAdmin } = require('../middleware/auth');

// All routes below require admin access
router.use(requireAdmin);

// --- Orders Management ---
router.get('/orders', (req, res) => {
    db.query('SELECT * FROM orders', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

router.put('/orders/:id', (req, res) => {
    const { status } = req.body;
    db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
});

// --- Discount Coupons Management ---
router.get('/coupons', (req, res) => {
    db.query('SELECT * FROM discount_coupons', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

router.post('/coupons', (req, res) => {
    const { code, discount, expires_at } = req.body;
    db.query('INSERT INTO discount_coupons (code, discount, expires_at) VALUES (?, ?, ?)', [code, discount, expires_at], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true, id: result.insertId });
    });
});

router.put('/coupons/:id', (req, res) => {
    const { code, discount, expires_at } = req.body;
    db.query('UPDATE discount_coupons SET code = ?, discount = ?, expires_at = ? WHERE id = ?', [code, discount, expires_at, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
});

// --- Products Management ---
router.get('/products', (req, res) => {
    db.query('SELECT id, name, description, price, category, image, image_hover, maker, lead_time, created_at, visuality FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

router.post('/products', (req, res) => {
    const { name, description, price, category, image, image_hover, maker, lead_time, visuality } = req.body;
    db.query('INSERT INTO products (name, description, price, category, image, image_hover, maker, lead_time, visuality) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, description, price, category, image, image_hover, maker, lead_time, visuality], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true, id: result.insertId });
    });
});

router.put('/products/:id', (req, res) => {
    const { name, description, price, category, image, image_hover, maker, lead_time, visuality } = req.body;
    db.query('UPDATE products SET name = ?, description = ?, price = ?, category = ?, image = ?, image_hover = ?, maker = ?, lead_time = ?, visuality = ? WHERE id = ?', [name, description, price, category, image, image_hover, maker, lead_time, visuality, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
});

module.exports = router; 