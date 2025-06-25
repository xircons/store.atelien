const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { requireAdmin } = require('../middleware/auth');
const XLSX = require('xlsx');

// All routes below require admin access
// router.use(requireAdmin); // TEMPORARILY DISABLED FOR TESTING

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
            const couponSheet = XLSX.utils.json_to_sheet(coupons);
            // Set column widths
            couponSheet['!cols'] = Object.keys(coupons[0]).map(key =>
                key === 'created_at' ? { wch: 22 } : { wch: 12 }
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
            const productSheet = XLSX.utils.json_to_sheet(products);
            // Set column widths
            productSheet['!cols'] = Object.keys(products[0]).map(key =>
                key === 'created_at' ? { wch: 22 } : { wch: 12 }
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

// --- Dashboard Analytics ---

// GET /api/admin/monthly-stats?years=2024,2025
router.get('/monthly-stats', (req, res) => {
    let years = req.query.years;
    if (!years) {
        years = [new Date().getFullYear()];
    } else {
        years = years.split(',').map(y => parseInt(y.trim())).filter(Boolean);
    }
    if (!years.length) years = [new Date().getFullYear()];
    db.query(
        'SELECT metric, year, month, value FROM monthly_stats WHERE year IN (?) ORDER BY year, metric, month',
        [years],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            // Prepare data for each year and metric
            const data = {};
            years.forEach(y => {
                data[y] = { revenue: Array(12).fill(0), orders: Array(12).fill(0), users: Array(12).fill(0) };
            });
            results.forEach(row => {
                if (data[row.year] && data[row.year][row.metric] && row.month >= 1 && row.month <= 12) {
                    data[row.year][row.metric][row.month - 1] = row.value;
                }
            });
            res.json(data);
        }
    );
});

// GET /api/admin/top-products?year=2025&month=12
router.get('/top-products', (req, res) => {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || (new Date().getMonth() + 1);
    // Get top 6 products for the given month, with previous month for growth
    const sql = `
        SELECT p.id as product_id, p.name, p.image, h.units_sold,
            ROUND(
                CASE WHEN prev.units_sold IS NULL OR prev.units_sold = 0 THEN NULL
                ELSE (h.units_sold - prev.units_sold) / prev.units_sold END, 4
            ) AS growth
        FROM product_sales_history h
        JOIN products p ON h.product_id = p.id
        LEFT JOIN product_sales_history prev
            ON prev.product_id = h.product_id AND prev.year = h.year AND prev.month = h.month - 1
        WHERE h.year = ? AND h.month = ?
        ORDER BY p.image
        LIMIT 6
    `;
    db.query(sql, [year, month], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        // Map image to full URL if needed
        const products = results.map(row => ({
            product_id: row.product_id,
            name: row.name,
            image_url: row.image && (row.image.startsWith('http://') || row.image.startsWith('https://'))
                ? row.image
                : (row.image ? `/public/images/product/${row.image}` : '/public/images/product/default-fallback-image.png'),
            units_sold: row.units_sold,
            growth: row.growth !== null ? row.growth : null
        }));
        res.json(products);
    });
});

// GET /api/admin/contact-messages - fetch all contact messages for admin
router.get('/contact-messages', (req, res) => {
    const sql = 'SELECT id, name, email, message, submitted_at, status FROM contact_us ORDER BY id ASC';
    req.app.get('db').query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching contact messages:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch contact messages.' });
        }
        res.json({ success: true, messages: results });
    });
});

// POST /api/admin/update-contact-status - update contact message status
router.post('/update-contact-status', (req, res) => {
    const { messageId, status } = req.body;
    
    if (!messageId || !status) {
        return res.status(400).json({ success: false, message: 'Message ID and status are required.' });
    }
    
    const validStatuses = ['New', 'Read', 'Responded'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    
    const sql = 'UPDATE contact_us SET status = ? WHERE id = ?';
    req.app.get('db').query(sql, [status, messageId], (err, result) => {
        if (err) {
            console.error('Error updating contact status:', err);
            return res.status(500).json({ success: false, message: 'Failed to update status.' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Message not found.' });
        }
        
        res.json({ success: true, message: 'Status updated successfully.' });
    });
});

// POST /api/admin/confirm-update-contact-status - ask for confirmation before updating status
router.post('/confirm-update-contact-status', (req, res) => {
    const { messageId, status } = req.body;
    if (!messageId || !status) {
        return res.status(400).json({ success: false, message: 'Message ID and status are required.' });
    }
    res.json({ success: true, message: `Are you sure you want to update the status to '${status}'?` });
});

module.exports = router; 