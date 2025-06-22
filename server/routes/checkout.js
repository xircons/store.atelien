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
        shipping: {
            firstName: shipping.firstName,
            lastName: shipping.lastName,
            company: shipping.company || '',
            address: shipping.address,
            apartment: shipping.apartment || '',
            city: shipping.city,
            state: shipping.state,
            zip: shipping.zip,
            phone: shipping.phone || '',
            country: shipping.country
        },
        shippingMethod,
        discountCode: discountCode || null,
        discountAmount: discountAmount || 0,
        subtotal,
        shippingCost,
        taxes,
        total,
        items: cartItems,
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
        JSON.stringify(orderData.shipping),
        orderData.shippingMethod,
        orderData.discountCode,
        orderData.discountAmount,
        orderData.subtotal,
        orderData.shippingCost,
        orderData.taxes,
        orderData.total,
        JSON.stringify(orderData.items),
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
                items: orderData.items.length
            }
        });
    });
});

// GET /api/checkout/orders - Get user's orders
router.get('/orders', requireAuth, (req, res) => {
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
                shipping: JSON.parse(order.shipping_info),
                items: JSON.parse(order.items)
            }))
        });
    });
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
                shipping: JSON.parse(order.shipping_info),
                shippingMethod: order.shipping_method,
                discountCode: order.discount_code,
                discountAmount: order.discount_amount,
                subtotal: order.subtotal,
                shippingCost: order.shipping_cost,
                taxes: order.taxes,
                total: order.total,
                items: JSON.parse(order.items),
                createdAt: order.created_at
            }
        });
    });
});

module.exports = router; 