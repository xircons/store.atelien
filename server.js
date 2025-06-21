const express = require('express');
const path = require('path');
const app = express();

// Static file serving
app.use(express.static(path.join(__dirname, '.')));

// API Route
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Start server
app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});