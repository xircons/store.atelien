const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const db = require('../models/db');

router.post('/client-error', (req, res) => {
    const errorLogPath = path.join(__dirname, '../client-errors.json');
    const errorData = req.body;

    // Read existing log or start new array
    let logs = [];
    if (fs.existsSync(errorLogPath)) {
        try {
            logs = JSON.parse(fs.readFileSync(errorLogPath, 'utf8'));
        } catch (e) {
            logs = [];
        }
    }
    logs.push(errorData);

    fs.writeFileSync(errorLogPath, JSON.stringify(logs, null, 2));
    res.json({ success: true });
});

// POST /api/contact - Save contact form submission
router.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const sql = 'INSERT INTO contact_us (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error saving contact form:', err);
            return res.status(500).json({ success: false, message: 'Failed to save message.' });
        }
        res.json({ success: true, message: 'Message sent successfully.' });
    });
});

module.exports = router; 