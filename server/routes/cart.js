const express = require('express');
const router = express.Router();
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

    req.user = { id: 'user' }; // Set a default user for client-side cart
    next();
};

// Get user's cart - return cart data from request body or empty cart
router.get('/', authenticateToken, (req, res) => {
    // For GET requests, we can't access body, so return empty cart
    // The frontend should send cart data in POST/PUT requests
    res.json({ items: [] });
});

// Add item to cart - accept cart data from frontend
router.post('/', authenticateToken, (req, res) => {
    const { productId, quantity, cartItems } = req.body;
    const addQuantity = quantity ? parseInt(quantity, 10) : 1;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    if (isNaN(addQuantity) || addQuantity < 1) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    // If cartItems is provided, use it; otherwise return empty cart
    let currentCart = cartItems || [];
    
    // Find if item already exists in cart
    const existingItemIndex = currentCart.findIndex(item => item.id == productId);
    
    if (existingItemIndex !== -1) {
        // Update quantity of existing item
        currentCart[existingItemIndex].quantity += addQuantity;
    } else {
        // The frontend should provide the full item details
        // If cartItems is empty or doesn't contain the new item, return the cart as-is
        // The frontend will handle adding the item with full details
        res.json({ items: currentCart });
        return;
    }

    res.json({ items: currentCart });
});

// Update cart item quantity
router.put('/:productId', authenticateToken, (req, res) => {
    const productId = req.params.productId;
    const { quantity, cartItems } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Valid quantity is required' });
    }

    if (!cartItems || !Array.isArray(cartItems)) {
        return res.status(400).json({ error: 'Cart items are required' });
    }

    // Find and update the item
    const updatedCart = cartItems.map(item => {
        if (item.id == productId) {
            return { ...item, quantity: parseInt(quantity) };
        }
        return item;
    });

    res.json({ items: updatedCart });
});

// Remove item from cart
router.delete('/:productId', authenticateToken, (req, res) => {
    const productId = req.params.productId;
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems)) {
        return res.status(400).json({ error: 'Cart items are required' });
    }

    // Remove the item
    const updatedCart = cartItems.filter(item => item.id != productId);

    res.json({ items: updatedCart });
});

// Clear entire cart
router.delete('/', authenticateToken, (req, res) => {
    res.json({ message: 'Cart cleared successfully', items: [] });
});

module.exports = router; 