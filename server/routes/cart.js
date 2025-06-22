const express = require('express');
const router = express.Router();
const db = require('../models/db');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    // First check for cookie-based authentication
    let token = req.cookies.authToken;
    
    // Fall back to Authorization header for backward compatibility
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Get user's cart
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT c.id, c.quantity, c.created_at,
               p.id as product_id, p.name, p.description, p.price, p.category, p.image, p.maker, p.lead_time
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching cart:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const items = results.map(item => ({
            id: item.product_id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            maker: item.maker,
            lead_time: item.lead_time,
            quantity: item.quantity,
            cartItemId: item.id
        }));

        res.json({ items });
    });
});

// Add item to cart
router.post('/', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const addQuantity = quantity ? parseInt(quantity, 10) : 1;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    if (isNaN(addQuantity) || addQuantity < 1) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Check if product exists
    db.query('SELECT id FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error checking product:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if item already exists in cart
        db.query('SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?', 
            [userId, productId], (err, results) => {
            if (err) {
                console.error('Error checking cart:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const queryCallback = (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error while modifying cart' });
                }
                // After modifying the cart, fetch the updated cart and send it back
                getCart(userId, res);
            };

            if (results.length > 0) {
                // Update quantity
                const newQuantity = results[0].quantity + addQuantity;
                db.query('UPDATE cart SET quantity = ? WHERE id = ?', [newQuantity, results[0].id], queryCallback);
            } else {
                // Add new item
                db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, addQuantity], queryCallback);
            }
        });
    });
});

// Helper function to get the full cart contents
function getCart(userId, res) {
    const query = `
        SELECT c.id, c.quantity, c.created_at,
               p.id as product_id, p.name, p.description, p.price, p.category, p.image, p.maker, p.lead_time
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching cart:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const items = results.map(item => ({
            id: item.product_id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            maker: item.maker,
            lead_time: item.lead_time,
            quantity: item.quantity,
            cartItemId: item.id
        }));

        res.json({ items });
    });
}

// Update cart item quantity
router.put('/:productId', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Valid quantity is required' });
    }

    db.query('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', 
        [quantity, userId, productId], (err, result) => {
        if (err) {
            console.error('Error updating cart:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Return updated cart
        const query = `
            SELECT c.id, c.quantity, c.created_at,
                   p.id as product_id, p.name, p.description, p.price, p.category, p.image, p.maker, p.lead_time
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching updated cart:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const items = results.map(item => ({
                id: item.product_id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                image: item.image,
                maker: item.maker,
                lead_time: item.lead_time,
                quantity: item.quantity,
                cartItemId: item.id
            }));

            res.json({ items });
        });
    });
});

// Remove item from cart
router.delete('/:productId', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;

    db.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', 
        [userId, productId], (err, result) => {
        if (err) {
            console.error('Error removing from cart:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Return updated cart
        const query = `
            SELECT c.id, c.quantity, c.created_at,
                   p.id as product_id, p.name, p.description, p.price, p.category, p.image, p.maker, p.lead_time
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching updated cart:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const items = results.map(item => ({
                id: item.product_id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                image: item.image,
                maker: item.maker,
                lead_time: item.lead_time,
                quantity: item.quantity,
                cartItemId: item.id
            }));

            res.json({ items });
        });
    });
});

// Clear entire cart
router.delete('/', authenticateToken, (req, res) => {
    const userId = req.user.id;

    db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
        if (err) {
            console.error('Error clearing cart:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        res.json({ message: 'Cart cleared successfully', items: [] });
    });
});

module.exports = router; 