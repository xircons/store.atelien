const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',      // หรือ host ของคุณ
    user: 'root',           // เปลี่ยนถ้ามี user อื่น
    password: '',           // ใส่รหัสผ่านของ MySQL
    database: 'store.atelien'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.stack);
        return;
    }
    console.log('✅ Connected to MySQL as id', db.threadId);
});

module.exports = db;