const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { requireAdmin } = require('../middleware/auth');
const XLSX = require('xlsx');

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

// --- Export Coupons & Products to Excel ---
router.get('/export/coupons', async (req, res) => {
    try {
        // Fetch coupons
        const [coupons] = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM discount_coupons', (err, results) => {
                if (err) return reject(err);
                resolve([results]);
            });
        });
        // Fetch products
        const [products] = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM products', (err, results) => {
                if (err) return reject(err);
                resolve([results]);
            });
        });
        // Prepare workbook
        const wb = XLSX.utils.book_new();
        // Coupons sheet
        if (coupons && coupons.length > 0) {
            const couponSheet = XLSX.utils.json_to_sheet(coupons);
            XLSX.utils.book_append_sheet(wb, couponSheet, 'Coupons');
        }
        // Products sheet
        if (products && products.length > 0) {
            const productSheet = XLSX.utils.json_to_sheet(products);
            XLSX.utils.book_append_sheet(wb, productSheet, 'Products');
        }
        // Generate buffer
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Disposition', 'attachment; filename="coupons_products_export.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buf);
    } catch (err) {
        console.error('Export error:', err);
        res.status(500).json({ error: 'Failed to export data' });
    }
});

// --- Export Coupons Only to Excel ---
router.get('/export/coupons', async (req, res) => {
    try {
        const [coupons] = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM discount_coupons', (err, results) => {
                if (err) return reject(err);
                resolve([results]);
            });
        });
        const wb = XLSX.utils.book_new();
        if (coupons && coupons.length > 0) {
            // Convert all date/time-like fields to string and set wide columns
            const dateLike = name => /date|time|expires|created_at|updated_at/i.test(name);
            coupons.forEach(row => {
                Object.keys(row).forEach(key => {
                    if (dateLike(key) && row[key]) row[key] = String(row[key]);
                });
            });
            const couponSheet = XLSX.utils.json_to_sheet(coupons);
            couponSheet['!cols'] = Object.keys(coupons[0]).map(key =>
                dateLike(key) ? { wch: 30 } : { wch: 12 }
            );
            XLSX.utils.book_append_sheet(wb, couponSheet, 'Coupons');
        }
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Disposition', 'attachment; filename="coupons_export.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buf);
    } catch (err) {
        console.error('Export error:', err);
        res.status(500).json({ error: 'Failed to export coupons' });
    }
});

// --- Export Products Only to Excel ---
router.get('/export/products', async (req, res) => {
    try {
        const [products] = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM products', (err, results) => {
                if (err) return reject(err);
                resolve([results]);
            });
        });
        const wb = XLSX.utils.book_new();
        if (products && products.length > 0) {
            // Convert date fields to string
            products.forEach(row => {
                if (row.created_at) row.created_at = String(row.created_at);
                if (row.updated_at) row.updated_at = String(row.updated_at);
            });
            const productSheet = XLSX.utils.json_to_sheet(products);
            productSheet['!cols'] = Object.keys(products[0]).map(key =>
                (key === 'created_at' || key === 'updated_at') ? { wch: 30 } : { wch: 12 }
            );
            XLSX.utils.book_append_sheet(wb, productSheet, 'Products');
        }
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Disposition', 'attachment; filename="products_export.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buf);
    } catch (err) {
        console.error('Export error:', err);
        res.status(500).json({ error: 'Failed to export products' });
    }
});

module.exports = router; 