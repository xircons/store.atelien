-- Database setup for store.atelien
-- Run these commands in phpMyAdmin SQL tab

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `store.atelien`;
USE `store.atelien`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) DEFAULT NULL,
    `maker` VARCHAR(255) DEFAULT NULL,
    `price` DECIMAL(10,2) DEFAULT NULL,
    `lead_time` VARCHAR(100) DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `category` VARCHAR(100) DEFAULT NULL,
    `image` TEXT DEFAULT NULL
);

-- Cart table
CREATE TABLE IF NOT EXISTS `cart` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT,
    `product_id` INT,
    `quantity` INT DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `status` VARCHAR(50) DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT,
    `product_id` INT,
    `quantity` INT NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);

-- Sample data for products table (optional)
INSERT INTO `products` (`name`, `maker`, `price`, `lead_time`, `description`, `category`, `image`) VALUES
('ARV Dining Chair with Armrest', 'Brdr. Krüger', 1250.00, '12-14 Weeks', 'Discover one of the most iconic chairs ever commissioned by René Redzepi, acclaimed head chef and founder of Noma.', 'seating', 'https://store.leibal.com/cdn/shop/t/24/assets/avr-dining-chair-6.jpg?v=96125140651365390181717481387'),
('Modern Coffee Table', 'Design Studio', 850.00, '8-10 Weeks', 'Elegant modern coffee table with clean lines and premium materials.', 'tables', '/images/product/chair.webp'),
('Pendant Light', 'Lighting Co', 450.00, '6-8 Weeks', 'Contemporary pendant light with adjustable height and warm glow.', 'lighting', '/images/product/chair.webp'),
('Storage Cabinet', 'Furniture Works', 1200.00, '10-12 Weeks', 'Versatile storage cabinet with multiple compartments and sliding doors.', 'storage', '/images/product/chair.webp'),
('Decorative Vase', 'Artisan Crafts', 180.00, '2-4 Weeks', 'Handcrafted ceramic vase with unique texture and modern design.', 'accessories', '/images/product/chair.webp'); 