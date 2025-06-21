-- Drop existing users table if it exists
DROP TABLE IF EXISTS users;

-- Create users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role ENUM('user', 'admin') DEFAULT 'user',
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Insert admin user with password "1234" (hashed)
-- Password: 1234
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@atelien.com', '$2b$10$LqLPwMRmYgEeG2rLFtz63OzivHjMy9XiMQrl67VoSPS2IwuPSA13m', 'admin')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- Note: The above password hash is for testing. In production, use bcrypt to hash passwords properly. 