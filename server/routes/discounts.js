const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { requireAuth } = require('../middleware/auth');

// POST /api/discounts/validate - Validate discount code (case-insensitive)
router.post('/validate', requireAuth, (req, res) => {
    const { code, subtotal } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Discount code is required' });
    }

    // Convert to uppercase for case-insensitive comparison
    const upperCode = code.toUpperCase().trim();
    
    const query = `
        SELECT * FROM discount_coupons 
        WHERE UPPER(code) = ? 
        AND status = 'enable' 
        AND (max_uses IS NULL OR used_count < max_uses)
    `;
    
    db.query(query, [upperCode], (error, results) => {
        if (error) {
            console.error('Error validating discount code:', error);
            return res.status(500).json({ error: 'Failed to validate discount code' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Invalid or expired discount code' });
        }
        
        const coupon = results[0];
        
        // Check minimum order amount
        if (subtotal && coupon.min_order_amount > 0 && subtotal < coupon.min_order_amount) {
            return res.status(400).json({ 
                error: `Minimum order amount of $${coupon.min_order_amount} required for this discount` 
            });
        }
        
        // Calculate discount amount
        let discountAmount = 0;
        if (coupon.discount_type === 'fixed') {
            discountAmount = parseFloat(coupon.discount_value);
        } else if (coupon.discount_type === 'percentage') {
            discountAmount = (subtotal * parseFloat(coupon.discount_value)) / 100;
        }
        
        res.json({
            success: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discount_type,
                discountValue: discountAmount,
                minOrderAmount: coupon.min_order_amount
            }
        });
    });
});

// POST /api/discounts/apply - Apply discount code and increment usage
router.post('/apply', requireAuth, (req, res) => {
    const { code, subtotal } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Discount code is required' });
    }

    // Convert to uppercase for case-insensitive comparison
    const upperCode = code.toUpperCase().trim();
    
    // First validate the coupon
    const validateQuery = `
        SELECT * FROM discount_coupons 
        WHERE UPPER(code) = ? 
        AND status = 'enable' 
        AND (max_uses IS NULL OR used_count < max_uses)
    `;
    
    db.query(validateQuery, [upperCode], (error, results) => {
        if (error) {
            console.error('Error validating discount code:', error);
            return res.status(500).json({ error: 'Failed to validate discount code' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Invalid or expired discount code' });
        }
        
        const coupon = results[0];
        
        // Check minimum order amount
        if (subtotal && coupon.min_order_amount > 0 && subtotal < coupon.min_order_amount) {
            return res.status(400).json({ 
                error: `Minimum order amount of $${coupon.min_order_amount} required for this discount` 
            });
        }
        
        // Calculate discount amount
        let discountAmount = 0;
        if (coupon.discount_type === 'fixed') {
            discountAmount = parseFloat(coupon.discount_value);
        } else if (coupon.discount_type === 'percentage') {
            discountAmount = (subtotal * parseFloat(coupon.discount_value)) / 100;
        }
        
        // Increment usage count
        const updateQuery = `
            UPDATE discount_coupons 
            SET used_count = used_count + 1, 
                updated_at = NOW(),
                status = CASE 
                    WHEN max_uses IS NOT NULL AND used_count + 1 >= max_uses THEN 'disable'
                    ELSE status
                END
            WHERE id = ?
        `;
        
        db.query(updateQuery, [coupon.id], (updateError) => {
            if (updateError) {
                console.error('Error updating coupon usage:', updateError);
                return res.status(500).json({ error: 'Failed to apply discount code' });
            }
            
            res.json({
                success: true,
                coupon: {
                    id: coupon.id,
                    code: coupon.code,
                    description: coupon.description,
                    discountType: coupon.discount_type,
                    discountValue: parseFloat(coupon.discount_value),
                    discountAmount: discountAmount,
                    minOrderAmount: parseFloat(coupon.min_order_amount || 0)
                }
            });
        });
    });
});

// GET /api/discounts/:id - Get specific discount coupon (admin only)
router.get('/:id', requireAuth, (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const couponId = req.params.id;
    
    const query = 'SELECT * FROM discount_coupons WHERE id = ?';
    
    db.query(query, [couponId], (error, results) => {
        if (error) {
            console.error('Error fetching discount coupon:', error);
            return res.status(500).json({ error: 'Failed to fetch discount coupon' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Discount coupon not found' });
        }
        
        const coupon = results[0];
        
        res.json({
            coupon: {
                id: coupon.id,
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discount_type,
                discountValue: coupon.discount_value,
                minOrderAmount: coupon.min_order_amount,
                maxUses: coupon.max_uses,
                usedCount: coupon.used_count,
                isActive: coupon.status === 'enable',
                createdAt: coupon.created_at,
                updatedAt: coupon.updated_at
            }
        });
    });
});

// GET /api/discounts - Get all discount coupons (admin only)
router.get('/', requireAuth, (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const query = `
        SELECT * FROM discount_coupons 
        ORDER BY created_at DESC
    `;
    
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching discount coupons:', error);
            return res.status(500).json({ error: 'Failed to fetch discount coupons' });
        }
        
        res.json({
            coupons: results.map(coupon => ({
                id: coupon.id,
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discount_type,
                discountValue: coupon.discount_value,
                minOrderAmount: coupon.min_order_amount,
                maxUses: coupon.max_uses,
                usedCount: coupon.used_count,
                isActive: coupon.status === 'enable',
                createdAt: coupon.created_at,
                updatedAt: coupon.updated_at
            }))
        });
    });
});

// POST /api/discounts - Create new discount coupon (admin only)
router.post('/', requireAuth, (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const {
        code,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_uses,
        status
    } = req.body;
    
    // Validate required fields
    if (!code || !discount_type || !discount_value) {
        return res.status(400).json({ error: 'Code, discount type, and discount value are required' });
    }
    
    // Convert code to uppercase for consistency
    const upperCode = code.toUpperCase().trim();
    
    // Check if code already exists
    const checkQuery = 'SELECT id FROM discount_coupons WHERE UPPER(code) = ?';
    db.query(checkQuery, [upperCode], (checkError, checkResults) => {
        if (checkError) {
            console.error('Error checking existing code:', checkError);
            return res.status(500).json({ error: 'Failed to create discount coupon' });
        }
        
        if (checkResults.length > 0) {
            return res.status(400).json({ error: 'Discount code already exists' });
        }
        
        // Insert new coupon
        const insertQuery = `
            INSERT INTO discount_coupons (
                code, description, discount_type, discount_value, 
                min_order_amount, max_uses, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            upperCode,
            description || null,
            discount_type,
            discount_value,
            min_order_amount || 0,
            max_uses || null,
            status !== undefined ? status : 'enable'
        ];
        
        db.query(insertQuery, values, (insertError, results) => {
            if (insertError) {
                console.error('Error creating discount coupon:', insertError);
                return res.status(500).json({ error: 'Failed to create discount coupon' });
            }
            
            res.json({
                success: true,
                message: 'Discount coupon created successfully',
                couponId: results.insertId
            });
        });
    });
});

// PUT /api/discounts/:id - Update discount coupon (admin only)
router.put('/:id', requireAuth, (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const couponId = req.params.id;
    const {
        code,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_uses,
        status
    } = req.body;
    
    // Convert code to uppercase if provided
    const upperCode = code ? code.toUpperCase().trim() : null;
    
    // Check if code already exists (excluding current coupon)
    if (upperCode) {
        const checkQuery = 'SELECT id FROM discount_coupons WHERE UPPER(code) = ? AND id != ?';
        db.query(checkQuery, [upperCode, couponId], (checkError, checkResults) => {
            if (checkError) {
                console.error('Error checking existing code:', checkError);
                return res.status(500).json({ error: 'Failed to update discount coupon' });
            }
            
            if (checkResults.length > 0) {
                return res.status(400).json({ error: 'Discount code already exists' });
            }
            
            updateCoupon();
        });
    } else {
        updateCoupon();
    }
    
    function updateCoupon() {
        const updateQuery = `
            UPDATE discount_coupons SET
                code = COALESCE(?, code),
                description = ?,
                discount_type = COALESCE(?, discount_type),
                discount_value = COALESCE(?, discount_value),
                min_order_amount = COALESCE(?, min_order_amount),
                max_uses = ?,
                status = COALESCE(?, status),
                updated_at = NOW()
            WHERE id = ?
        `;
        
        const values = [
            upperCode,
            description,
            discount_type,
            discount_value,
            min_order_amount,
            max_uses,
            status,
            couponId
        ];
        
        db.query(updateQuery, values, (updateError) => {
            if (updateError) {
                console.error('Error updating discount coupon:', updateError);
                return res.status(500).json({ error: 'Failed to update discount coupon' });
            }
            
            res.json({
                success: true,
                message: 'Discount coupon updated successfully'
            });
        });
    }
});

// DELETE /api/discounts/:id - Delete discount coupon (admin only)
router.delete('/:id', requireAuth, (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const couponId = req.params.id;
    
    const deleteQuery = 'DELETE FROM discount_coupons WHERE id = ?';
    
    db.query(deleteQuery, [couponId], (error) => {
        if (error) {
            console.error('Error deleting discount coupon:', error);
            return res.status(500).json({ error: 'Failed to delete discount coupon' });
        }
        
        res.json({
            success: true,
            message: 'Discount coupon deleted successfully'
        });
    });
});

// PUT /api/discounts/:id/toggle-status - Toggle coupon status (admin only)
router.put('/:id/toggle-status', requireAuth, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    const couponId = req.params.id;
    // Get current status
    const getQuery = 'SELECT status FROM discount_coupons WHERE id = ?';
    db.query(getQuery, [couponId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        const currentStatus = results[0].status;
        const newStatus = currentStatus === 'enable' ? 'disable' : 'enable';
        const updateQuery = 'UPDATE discount_coupons SET status = ?, updated_at = NOW() WHERE id = ?';
        db.query(updateQuery, [newStatus, couponId], (updateErr) => {
            if (updateErr) {
                return res.status(500).json({ error: 'Failed to update coupon status' });
            }
            res.json({ isActive: newStatus === 'enable' });
        });
    });
});

module.exports = router; 