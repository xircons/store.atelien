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
            cost_price: product.cost_price,
            category: product.category,
            image: product.image,
            image_hover: product.image_hover,
            maker: product.maker,
            lead_time: product.lead_time,
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
            cost_price: product.cost_price,
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

// Create new product
router.post('/', (req, res) => {
    console.log('=== ROUTE CALLED ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request headers:', req.headers);
    
    const { name, description, price, cost_price, category, image, image_hover, maker, lead_time } = req.body;
    
    // Debug logging
    console.log('=== CREATE PRODUCT DEBUG ===');
    console.log('Received data:', req.body);
    console.log('cost_price value:', cost_price);
    console.log('cost_price type:', typeof cost_price);
    console.log('cost_price === null:', cost_price === null);
    console.log('cost_price === undefined:', cost_price === undefined);
    console.log('cost_price === "":', cost_price === "");
    console.log('cost_price === "0":', cost_price === "0");
    console.log('cost_price === 0:', cost_price === 0);
    console.log('===========================');
    
    // Validate required fields
    if (!name || !description || !price || !category) {
        return res.status(400).json({ error: 'Name, description, price, and category are required' });
    }
    
    // Validate category enum values
    const validCategories = ['seating', 'tables', 'lighting', 'storage', 'accessories'];
    if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category. Must be one of: ' + validCategories.join(', ') });
    }
    
    // Validate price is a positive number
    if (isNaN(price) || parseFloat(price) < 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
    }
    
    // Validate cost_price if provided
    if (cost_price !== undefined && cost_price !== null && cost_price !== '') {
        if (isNaN(cost_price) || parseFloat(cost_price) < 0) {
            return res.status(400).json({ error: 'Cost price must be a positive number' });
        }
    }
    
    const query = `
        INSERT INTO products (id, name, description, price, cost_price, category, image, image_hover, maker, lead_time, created_at, status)
        VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp(), 'enable')
    `;
    
    const params = [name, description, price, cost_price || null, category, image || null, image_hover || null, maker || null, lead_time || null];
    
    console.log('SQL Query:', query);
    console.log('Parameters:', params);
    console.log('Parameter types:', params.map(p => typeof p));
    
    db.query(query, params, (err, results) => {
        console.log('=== DATABASE QUERY RESULT ===');
        console.log('Error:', err);
        console.log('Results:', results);
        console.log('============================');
        
        if (err) {
            console.error('Error creating product:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        console.log('Product created successfully with ID:', results.insertId);
        
        res.status(201).json({ 
            message: 'Product created successfully',
            productId: results.insertId
        });
    });
});

// Update existing product
router.put('/:id', (req, res) => {
    const productId = req.params.id;
    
    console.log('=== UPDATE PRODUCT DEBUG ===');
    console.log('Updating product ID:', productId);
    console.log('Received data:', req.body);
    
    const { name, description, price, cost_price, category, image, image_hover, maker, lead_time } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !category) {
        return res.status(400).json({ error: 'Name, description, price, and category are required' });
    }
    
    // Validate category enum values
    const validCategories = ['seating', 'tables', 'lighting', 'storage', 'accessories'];
    if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category. Must be one of: ' + validCategories.join(', ') });
    }
    
    // Validate price is a positive number
    if (isNaN(price) || parseFloat(price) < 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
    }
    
    // Validate cost_price if provided
    if (cost_price !== undefined && cost_price !== null && cost_price !== '') {
        if (isNaN(cost_price) || parseFloat(cost_price) < 0) {
            return res.status(400).json({ error: 'Cost price must be a positive number' });
        }
    }
    
    // First check if product exists
    db.query('SELECT id FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error checking product existence:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Update the product
        const updateQuery = `
            UPDATE products 
            SET name = ?, description = ?, price = ?, cost_price = ?, category = ?, 
                image = ?, image_hover = ?, maker = ?, lead_time = ?
            WHERE id = ?
        `;
        
        const updateParams = [
            name, description, price, cost_price || null, category, 
            image || null, image_hover || null, maker || null, lead_time || null, productId
        ];
        
        console.log('Update SQL Query:', updateQuery);
        console.log('Update Parameters:', updateParams);
        
        db.query(updateQuery, updateParams, (updateErr, updateResults) => {
            if (updateErr) {
                console.error('Error updating product:', updateErr);
                return res.status(500).json({ error: 'Database error' });
            }
            
            console.log('Product updated successfully');
            console.log('=== END UPDATE PRODUCT DEBUG ===');
            
            res.json({ 
                message: 'Product updated successfully',
                productId: productId
            });
        });
    });
});

module.exports = router;