const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get products by collection and status
router.get('/', (req, res) => {
    const collection = req.query.collection;
    const status = req.query.status;
    
    let query = 'SELECT * FROM products';
    let params = [];
    let whereClauses = [];
    
    if (collection && collection !== 'all') {
        whereClauses.push('category = ?');
        params.push(collection);
    }
    if (status) {
        whereClauses.push('status = ?');
        params.push(status);
    }
    if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
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
            maker: product.maker,
            status: product.status
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
            lead_time: product.lead_time,
            status: product.status
        };
        
        console.log('Final product data being sent:', productData);
        console.log('=== END SERVER DEBUG ===');
        
        res.json(productData);
    });
});

// Toggle product status
router.put('/:id/toggle-status', (req, res) => {
    const productId = req.params.id;
    
    console.log('=== SERVER DEBUG: Toggling status for product ID', productId, '===');
    
    // First, get the current status
    db.query('SELECT status FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product status:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            console.log('Product not found for status toggle');
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const currentStatus = results[0].status;
        const newStatus = currentStatus === 'enable' ? 'disable' : 'enable';
        
        // Update the status
        db.query('UPDATE products SET status = ? WHERE id = ?', [newStatus, productId], (updateErr, updateResults) => {
            if (updateErr) {
                console.error('Error updating product status:', updateErr);
                return res.status(500).json({ error: 'Database error' });
            }
            
            console.log('Product status updated successfully from', currentStatus, 'to', newStatus);
            console.log('=== END SERVER DEBUG ===');
            
            res.json({ 
                message: 'Product status updated successfully',
                status: newStatus,
                previousStatus: currentStatus
            });
        });
    });
});

// Delete product by ID
router.delete('/:id', (req, res) => {
    const productId = req.params.id;
    
    console.log('=== SERVER DEBUG: Deleting product ID', productId, '===');
    
    db.query('DELETE FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.affectedRows === 0) {
            console.log('Product not found for deletion');
            return res.status(404).json({ error: 'Product not found' });
        }
        
        console.log('Product deleted successfully');
        console.log('=== END SERVER DEBUG ===');
        
        res.json({ message: 'Product deleted successfully' });
    });
});

module.exports = router;