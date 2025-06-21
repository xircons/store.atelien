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
            maker: product.maker
        }));
        
        res.json(products);
    });
});

// Get individual product by ID
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    
    db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const product = results[0];
        
        // Transform result to match expected format
        const productData = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            maker: product.maker,
            lead_time: product.lead_time
        };
        
        res.json(productData);
    });
});

module.exports = router;