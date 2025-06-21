const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcryptjs');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Check if email already exists
        db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Hash password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Password hashing error:', err);
                    return res.status(500).json({ error: 'Password hashing error' });
                }

                // Insert new user (without username field)
                const newUser = {
                    email,
                    password: hashedPassword,
                    role: 'user'
                };

                db.query('INSERT INTO users SET ?', newUser, (err, result) => {
                    if (err) {
                        console.error('User creation error:', err);
                        return res.status(500).json({ error: 'Failed to create user' });
                    }

                    res.status(201).json({
                        success: true,
                        message: 'User registered successfully',
                        userId: result.insertId
                    });
                });
            });
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = results[0];

            // Compare password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Password comparison error:', err);
                    return res.status(500).json({ error: 'Password comparison error' });
                }

                if (!isMatch) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }

                // Create user session data (without password)
                const userData = {
                    id: user.id,
                    username: user.username || null,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at
                };

                res.json({
                    success: true,
                    message: 'Login successful',
                    user: userData
                });
            });
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile (protected route)
router.get('/profile', (req, res) => {
    // This would be protected by middleware in a real app
    // For now, we'll require user ID in query params
    const userId = req.query.userId;

    if (!userId) {
        return res.status(401).json({ error: 'User ID required' });
    }

    db.query('SELECT id, email, role, created_at FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user: results[0]
        });
    });
});

module.exports = router; 