const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

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

module.exports = router; 