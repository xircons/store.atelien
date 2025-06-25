const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { requireAuth } = require('../middleware/auth');

// POST /api/checkout - Process checkout
router.post('/', requireAuth, (req, res) => {
    console.log('=== SERVER RECEIVED DATA ===');
    console.log('Full request body:', req.body);
    console.log('Shipping data:', req.body.shipping);
    console.log('=== END SERVER RECEIVED DATA ===');
    
    const {
        shipping,
        shippingMethod,
        cartItems,
        discountCode,
        discountAmount,
        subtotal,
        shippingCost,
        taxes,
        total
    } = req.body;

    // Validate required fields
    if (!shipping || !cartItems || !total) {
        return res.status(400).json({ error: 'Missing required checkout information' });
    }

    // Validate cart items
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    // Create order in database
    const orderData = {
        userId: req.user.id,
        status: 'pending',
        // Combine shipping fields into a single address string
        shipping: `${shipping.address}${shipping.apartment ? ' ' + shipping.apartment : ''}\n${shipping.company ? shipping.company + '\n' : ''}${shipping.city} ${shipping.state} ${shipping.zip}\n${shipping.country}`,
        shippingMethod,
        discountCode: discountCode || null,
        discountAmount: discountAmount || 0,
        subtotal,
        shippingCost,
        taxes,
        total,
        // Only keep product IDs as a comma-separated string
        items: cartItems.map(item => item.id).join(','),
        createdAt: new Date()
    };

    // Insert order into database
    const orderQuery = `
        INSERT INTO orders (
            user_id, status, shipping_info, shipping_method, 
            discount_code, discount_amount, subtotal, shipping_cost, 
            taxes, total, items, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const orderValues = [
        orderData.userId,
        orderData.status,
        orderData.shipping, // now a plain string
        orderData.shippingMethod,
        orderData.discountCode,
        orderData.discountAmount,
        orderData.subtotal,
        orderData.shippingCost,
        orderData.taxes,
        orderData.total,
        orderData.items, // now a comma-separated string of product IDs
        orderData.createdAt
    ];

    // Use callback API instead of promise API
    db.query(orderQuery, orderValues, (error, results) => {
        if (error) {
            console.error('Checkout error details:', {
                message: error.message,
                sqlMessage: error.sqlMessage,
                sqlState: error.sqlState,
                errno: error.errno
            });
            return res.status(500).json({ error: 'Failed to process checkout', details: error.message });
        }

        const orderId = results.insertId;

        // Return success response
        res.json({
            success: true,
            orderId,
            message: 'Order created successfully',
            order: {
                id: orderId,
                status: orderData.status,
                total: orderData.total,
                items: orderData.items.split(',').length
            }
        });
    });
});

// GET /api/checkout/orders - Get user's orders
router.get('/orders', requireAuth, (req, res) => {
    // Check if user is admin - if so, return all orders
    if (req.user.role === 'admin') {
        const query = `
            SELECT o.*, u.email as user_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `;
        
        db.query(query, (error, orders) => {
            if (error) {
                console.error('Error fetching all orders:', error);
                return res.status(500).json({ error: 'Failed to fetch orders' });
            }
            
            res.json(orders);
        });
    } else {
        // Regular user - return only their orders
        const query = `
            SELECT id, status, total, created_at, shipping_info, items
            FROM orders 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        `;
        
        db.query(query, [req.user.id], (error, orders) => {
            if (error) {
                console.error('Error fetching orders:', error);
                return res.status(500).json({ error: 'Failed to fetch orders' });
            }
            
            res.json({
                orders: orders.map(order => ({
                    id: order.id,
                    status: order.status,
                    total: order.total,
                    createdAt: order.created_at,
                    shipping: order.shipping_info,
                    items: order.items.split(',')
                }))
            });
        });
    }
});

// GET /api/checkout/orders/:id - Get specific order
router.get('/orders/:id', requireAuth, (req, res) => {
    const orderId = req.params.id;
    
    const query = `
        SELECT * FROM orders 
        WHERE id = ? AND user_id = ?
    `;
    
    db.query(query, [orderId, req.user.id], (error, orders) => {
        if (error) {
            console.error('Error fetching order:', error);
            return res.status(500).json({ error: 'Failed to fetch order' });
        }
        
        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orders[0];
        
        res.json({
            order: {
                id: order.id,
                status: order.status,
                shipping: order.shipping_info,
                shippingMethod: order.shipping_method,
                discountCode: order.discount_code,
                discountAmount: order.discount_amount,
                subtotal: order.subtotal,
                shippingCost: order.shipping_cost,
                taxes: order.taxes,
                total: order.total,
                items: order.items.split(','),
                createdAt: order.created_at
            }
        });
    });
});

module.exports = router; 