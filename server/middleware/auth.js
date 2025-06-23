const jwt = require('jsonwebtoken');
const db = require('../models/db');

const requireAuth = (req, res, next) => {
    const token = req.cookies.authToken;
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Get user data from database
        db.query('SELECT id, email, role FROM users WHERE id = ?', [decoded.id], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Set user data in request object
            req.user = results[0];
            next();
        });

    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const requireAdmin = (req, res, next) => {
    requireAuth(req, res, function() {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Admin access required' });
        }
    });
};

module.exports = { requireAuth, requireAdmin }; 