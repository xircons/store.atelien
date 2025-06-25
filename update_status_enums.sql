-- Update status enum values
ALTER TABLE `orders` 
MODIFY COLUMN `status` enum('pending', 'paid', 'failed', 'cancelled') NOT NULL DEFAULT 'pending';

-- Update status_delivery enum values  
ALTER TABLE `orders` 
MODIFY COLUMN `status_delivery` enum('pending', 'in_transit', 'delivered', 'failed', 'cancelled') NOT NULL DEFAULT 'pending';

-- Update existing records to use valid enum values
UPDATE `orders` SET `status_delivery` = 'pending' WHERE `status_delivery` NOT IN ('pending', 'in_transit', 'delivered', 'failed', 'cancelled'); 