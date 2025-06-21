const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'store.atelien'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.stack);
        return;
    }
    console.log('✅ Connected to MySQL');
    
    // Test query for product ID 30
    db.query('SELECT * FROM products WHERE id = 30', (err, results) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        
        if (results.length === 0) {
            console.log('❌ Product 30 not found');
            return;
        }
        
        const product = results[0];
        console.log('=== DATABASE TEST ===');
        console.log('Product ID:', product.id);
        console.log('Product Name:', product.name);
        console.log('image_hover field:', product.image_hover);
        console.log('image_hover type:', typeof product.image_hover);
        console.log('All fields:', Object.keys(product));
        console.log('=== END TEST ===');
        
        db.end();
    });
}); 