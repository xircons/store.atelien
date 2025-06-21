const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get products by collection
router.get('/', (req, res) => {
    const collection = req.query.collection;
    
    let query = 'SELECT * FROM products';
    let params = [];
    
    if (collection && collection !== 'all') {
        query += ' WHERE category = ?';
        params.push(collection);
    }
    
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        // Transform results to match expected format
        const products = results.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            image_hover: product.image_hover,
            maker: product.maker
        }));
        
        res.json(products);
    });
});

// Get individual product by ID
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    
    console.log('=== SERVER DEBUG: Fetching product ID', productId, '===');
    
    db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            console.log('Product not found in database');
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const product = results[0];
        
        console.log('Raw database result:', product);
        console.log('image_hover from database:', product.image_hover);
        console.log('image_hover type:', typeof product.image_hover);
        
        // Transform result to match expected format
        const productData = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            image_hover: product.image_hover,
            maker: product.maker,
            lead_time: product.lead_time
        };
        
        console.log('Final product data being sent:', productData);
        console.log('=== END SERVER DEBUG ===');
        
        res.json(productData);
    });
});

module.exports = router;