-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 24, 2025 at 01:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `store.atelien`
--

-- --------------------------------------------------------

--
-- Table structure for table `discount_coupons`
--

CREATE TABLE `discount_coupons` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_type` enum('fixed','percentage') NOT NULL DEFAULT 'fixed',
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `max_uses` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('enable','disable') NOT NULL DEFAULT 'enable'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `discount_coupons`
--

INSERT INTO `discount_coupons` (`id`, `code`, `description`, `discount_type`, `discount_value`, `min_order_amount`, `max_uses`, `used_count`, `created_at`, `updated_at`, `status`) VALUES
(2, 'ATELIEN', 'Special Atelien discount - Save $500', 'fixed', 500.00, 0.00, 1, 1, '2025-06-22 22:32:00', '2025-06-24 08:46:15', 'disable'),
(3, 'WELCOME10', 'Welcome discount - 10% off', 'percentage', 10.00, 1000.00, 200, 101, '2025-06-22 22:32:00', '2025-06-24 08:43:43', 'enable'),
(4, 'FREETAX', 'Free tax - 7% off', 'percentage', 7.00, 0.00, 0, 0, '2025-06-24 08:07:18', '2025-06-24 08:48:07', 'enable');

-- --------------------------------------------------------

--
-- Table structure for table `monthly_stats`
--

CREATE TABLE `monthly_stats` (
  `id` int(11) NOT NULL,
  `metric` enum('revenue','orders','users') NOT NULL,
  `year` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `value` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `monthly_stats`
--

INSERT INTO `monthly_stats` (`id`, `metric`, `year`, `month`, `value`, `created_at`) VALUES
(1, 'revenue', 2025, 1, 22061, '2025-06-24 10:56:49'),
(2, 'orders', 2025, 1, 367, '2025-06-24 10:56:49'),
(3, 'users', 2025, 1, 210, '2025-06-24 10:56:49'),
(4, 'revenue', 2025, 2, 37156, '2025-06-24 10:56:49'),
(5, 'orders', 2025, 2, 382, '2025-06-24 10:56:49'),
(6, 'users', 2025, 2, 248, '2025-06-24 10:56:49'),
(7, 'revenue', 2025, 3, 37939, '2025-06-24 10:56:49'),
(8, 'orders', 2025, 3, 127, '2025-06-24 10:56:49'),
(9, 'users', 2025, 3, 260, '2025-06-24 10:56:49'),
(10, 'revenue', 2025, 4, 25337, '2025-06-24 10:56:49'),
(11, 'orders', 2025, 4, 206, '2025-06-24 10:56:49'),
(12, 'users', 2025, 4, 54, '2025-06-24 10:56:49'),
(13, 'revenue', 2025, 5, 25145, '2025-06-24 10:56:49'),
(14, 'orders', 2025, 5, 497, '2025-06-24 10:56:49'),
(15, 'users', 2025, 5, 246, '2025-06-24 10:56:49'),
(16, 'revenue', 2025, 6, 43348, '2025-06-24 10:56:49'),
(17, 'orders', 2025, 6, 248, '2025-06-24 10:56:49'),
(18, 'users', 2025, 6, 297, '2025-06-24 10:56:49'),
(19, 'revenue', 2025, 7, 32241, '2025-06-24 10:56:49'),
(20, 'orders', 2025, 7, 286, '2025-06-24 10:56:49'),
(21, 'users', 2025, 7, 91, '2025-06-24 10:56:49'),
(22, 'revenue', 2025, 8, 36611, '2025-06-24 10:56:49'),
(23, 'orders', 2025, 8, 383, '2025-06-24 10:56:49'),
(24, 'users', 2025, 8, 189, '2025-06-24 10:56:49'),
(25, 'revenue', 2025, 9, 29126, '2025-06-24 10:56:49'),
(26, 'orders', 2025, 9, 105, '2025-06-24 10:56:49'),
(27, 'users', 2025, 9, 168, '2025-06-24 10:56:49'),
(28, 'revenue', 2025, 10, 43704, '2025-06-24 10:56:49'),
(29, 'orders', 2025, 10, 107, '2025-06-24 10:56:49'),
(30, 'users', 2025, 10, 133, '2025-06-24 10:56:49'),
(31, 'revenue', 2025, 11, 26215, '2025-06-24 10:56:49'),
(32, 'orders', 2025, 11, 335, '2025-06-24 10:56:49'),
(33, 'users', 2025, 11, 120, '2025-06-24 10:56:49'),
(34, 'revenue', 2025, 12, 26119, '2025-06-24 10:56:49'),
(35, 'orders', 2025, 12, 423, '2025-06-24 10:56:49'),
(36, 'users', 2025, 12, 269, '2025-06-24 10:56:49');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  `shipping_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`shipping_info`)),
  `shipping_method` varchar(50) NOT NULL,
  `discount_code` varchar(50) DEFAULT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping_cost` decimal(10,2) NOT NULL,
  `taxes` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `status`, `shipping_info`, `shipping_method`, `discount_code`, `discount_amount`, `subtotal`, `shipping_cost`, `taxes`, `total`, `items`, `created_at`, `updated_at`) VALUES
(25, 2, 'pending', '{\"firstName\":\"1\",\"lastName\":\"1\",\"company\":\"\",\"address\":\"1\",\"apartment\":\"\",\"city\":\"1\",\"state\":\"Kanchanaburi\",\"zip\":\"1\",\"phone\":\"1\",\"country\":\"TH\"}', 'express', 'atelien', 650.00, 21170.00, 800.00, 1436.40, 22756.40, '[{\"id\":\"1\",\"name\":\"PK24 - Leather\",\"quantity\":1,\"price\":21170,\"image\":\"https://store.leibal.com/cdn/shop/files/pk24-side-natural.jpg?crop=center&height=2048&v=1685311498&width=2048\",\"maker\":\"Fritz Hansen\",\"lead_time\":\"10-12 Weeks\"}]', '2025-06-22 21:19:20', '2025-06-22 21:19:20'),
(26, 9, 'pending', '{\"firstName\":\"Wuttikan\",\"lastName\":\"Suksan\",\"company\":\"Chiang Mai uni\",\"address\":\"123\",\"apartment\":\"\",\"city\":\"Chiang Mai\",\"state\":\"Chiang Mai\",\"zip\":\"50000\",\"phone\":\"0933199416\",\"country\":\"TH\"}', 'express', 'save100', 100.00, 49200.00, 800.00, 3437.00, 53337.00, '[{\"id\":\"47\",\"name\":\"Large Portal Vase\",\"quantity\":1,\"price\":1200,\"image\":\"https://store.leibal.com/cdn/shop/files/portal-2.jpg?crop=center&height=2048&v=1707531159&width=2048\",\"maker\":\"Origin Made\",\"lead_time\":\"6-8 Weeks\"},{\"id\":\"26\",\"name\":\"OBJ-06 Coffee Table\",\"quantity\":3,\"price\":16000,\"image\":\"https://store.leibal.com/cdn/shop/files/obj-06.jpg?crop=center&height=2048&v=1713300179&width=2048\",\"maker\":\"Manu Bano\",\"lead_time\":\"10-12 Weeks\"}]', '2025-06-22 21:40:10', '2025-06-22 21:40:10'),
(27, 1, 'pending', '{\"firstName\":\"Wuttikan\",\"lastName\":\"Suksan\",\"company\":\"\",\"address\":\"123\",\"apartment\":\"\",\"city\":\"Cnx\",\"state\":\"Chiang Mai\",\"zip\":\"50000\",\"phone\":\"093\",\"country\":\"TH\"}', 'express', 'weLcoMe10', 1840.00, 18400.00, 800.00, 1159.20, 18519.20, '[{\"id\":\"10\",\"name\":\"O Stool\",\"quantity\":1,\"price\":5800,\"image\":\"https://store.leibal.com/cdn/shop/products/ostool2.jpg?crop=center&height=2048&v=1571439761&width=2048\",\"maker\":\"Estudio Persona\",\"lead_time\":\"6-8 Weeks\"},{\"id\":\"30\",\"name\":\"Beam Desk\",\"quantity\":2,\"price\":6300,\"image\":\"https://store.leibal.com/cdn/shop/files/beam-desk-2.jpg?crop=center&height=2048&v=1728424349&width=2048\",\"maker\":\"Marquel Williams\",\"lead_time\":\"8-10 Weeks\"}]', '2025-06-23 05:28:05', '2025-06-23 05:28:05'),
(28, 1, 'pending', '{\"firstName\":\"test\",\"lastName\":\"test\",\"company\":\"\",\"address\":\"123\",\"apartment\":\"\",\"city\":\"cnx\",\"state\":\"Bangkok\",\"zip\":\"12\",\"phone\":\"00\",\"country\":\"TH\"}', 'standard', NULL, 0.00, 12100.00, 650.00, 847.00, 13597.00, '[{\"id\":\"33\",\"name\":\"Puffball Pendant\",\"quantity\":1,\"price\":8500,\"image\":\"https://store.leibal.com/cdn/shop/files/puffball-pendant-lg.jpg?crop=center&height=2048&v=1704144082&width=2048\",\"maker\":\"Matter Made\",\"lead_time\":\"8-10 Weeks\"},{\"id\":\"47\",\"name\":\"Large Portal Vase\",\"quantity\":3,\"price\":1200,\"image\":\"https://store.leibal.com/cdn/shop/files/portal-2.jpg?crop=center&height=2048&v=1707531159&width=2048\",\"maker\":\"Origin Made\",\"lead_time\":\"6-8 Weeks\"}]', '2025-06-23 05:32:52', '2025-06-23 05:32:52'),
(29, 1, 'pending', '{\"firstName\":\"wutti\",\"lastName\":\"sd\",\"company\":\"\",\"address\":\"123\",\"apartment\":\"\",\"city\":\"cnx\",\"state\":\"Ang Thong\",\"zip\":\"2\",\"phone\":\"000\",\"country\":\"TH\"}', 'express', 'WELCOME10', 1094.00, 10940.00, 800.00, 689.22, 11335.22, '[{\"id\":\"36\",\"name\":\"Puffball Table Lamp\",\"quantity\":2,\"price\":5470,\"image\":\"https://store.leibal.com/cdn/shop/files/puff-table-1.jpg?crop=center&height=2048&v=1703796523&width=2048\",\"maker\":\"Matter Made\",\"lead_time\":\"10-12 Weeks\"}]', '2025-06-23 06:04:50', '2025-06-23 06:04:50'),
(30, 10, 'pending', '{\"firstName\":\"s\",\"lastName\":\"s\",\"company\":\"\",\"address\":\"1\",\"apartment\":\"\",\"city\":\"s\",\"state\":\"Ang Thong\",\"zip\":\"1\",\"phone\":\"1\",\"country\":\"TH\"}', 'express', 'ATELIEN', 650.00, 18570.00, 800.00, 1254.40, 19974.40, '[{\"id\":\"26\",\"name\":\"OBJ-06 Coffee Table\",\"quantity\":1,\"price\":16000,\"image\":\"https://store.leibal.com/cdn/shop/files/obj-06.jpg?crop=center&height=2048&v=1713300179&width=2048\",\"maker\":\"Manu Bano\",\"lead_time\":\"10-12 Weeks\"},{\"id\":\"57\",\"name\":\"ST02 Side Table\",\"quantity\":2,\"price\":1285,\"image\":\"https://store.leibal.com/cdn/shop/files/ast-1.jpg?crop=center&height=2048&v=1698260320&width=2048\",\"maker\":\"Johan Viladrich\",\"lead_time\":\"8-10 Weeks\"}]', '2025-06-23 06:54:19', '2025-06-23 06:54:19'),
(31, 2, 'pending', '{\"firstName\":\"ss\",\"lastName\":\"ss\",\"company\":\"\",\"address\":\"123\",\"apartment\":\"\",\"city\":\"s\",\"state\":\"Ang Thong\",\"zip\":\"12\",\"phone\":\"123\",\"country\":\"TH\"}', 'express', 'WELCOME10', 7215.40, 72154.00, 800.00, 4545.70, 70284.30, '[{\"id\":\"40\",\"name\":\"Eileen Bedside Table + Tray\",\"quantity\":1,\"price\":4000,\"image\":\"https://store.leibal.com/cdn/shop/files/eileen-2.jpg?crop=center&height=2048&v=1715395088&width=2048\",\"maker\":\"Obstacles\",\"lead_time\":\"10-12 Weeks\"},{\"id\":\"6\",\"name\":\"Covent Residential Sofa\",\"quantity\":1,\"price\":8799,\"image\":\"https://store.leibal.com/cdn/shop/files/covent-residential-lana-2.jpg?crop=center&height=2048&v=1724877349&width=2048\",\"maker\":\"New Works\",\"lead_time\":\"6-8 Weeks\"},{\"id\":\"39\",\"name\":\"OBJ-04 Shelf\",\"quantity\":1,\"price\":9500,\"image\":\"https://store.leibal.com/cdn/shop/files/obj-4-1.jpg?crop=center&height=2048&v=1712099900&width=2048\",\"maker\":\"Manu Bano\",\"lead_time\":\"10-12 Weeks\"},{\"id\":\"50\",\"name\":\"Double Tray\\r\\n\",\"quantity\":1,\"price\":1100,\"image\":\"https://store.leibal.com/cdn/shop/files/double-tray-3.jpg?crop=center&height=2048&v=1705973769&width=2048\",\"maker\":\"whenobjectswork\",\"lead_time\":\"6-8 Weeks\"},{\"id\":\"51\",\"name\":\"MATUREWARE Lever Handle - Curved\\r\\n\",\"quantity\":1,\"price\":895,\"image\":\"https://store.leibal.com/cdn/shop/files/knob-curve-circle.jpg?crop=center&height=2048&v=1704311997&width=2048\",\"maker\":\"Futagami\",\"lead_time\":\"4-6 Weeks\"},{\"id\":\"26\",\"name\":\"OBJ-06 Coffee Table\",\"quantity\":1,\"price\":16000,\"image\":\"https://store.leibal.com/cdn/shop/files/obj-06.jpg?crop=center&height=2048&v=1713300179&width=2048\",\"maker\":\"Manu Bano\",\"lead_time\":\"10-12 Weeks\"},{\"id\":\"27\",\"name\":\"BB Coffee Table\",\"quantity\":3,\"price\":10620,\"image\":\"https://store.leibal.com/cdn/shop/files/bb-ct-1.jpg?crop=center&height=2048&v=1713299342&width=2048\",\"maker\":\"CORPUS STUDIO\",\"lead_time\":\"16-20 Weeks\"}]', '2025-06-23 08:47:39', '2025-06-23 08:47:39'),
(32, 1, 'pending', '{\"firstName\":\"1\",\"lastName\":\"1\",\"company\":\"\",\"address\":\"1\",\"apartment\":\"\",\"city\":\"1\",\"state\":\"Krabi\",\"zip\":\"1\",\"phone\":\"1\",\"country\":\"TH\"}', 'standard', 'welcome10', 580.00, 5800.00, 650.00, 365.40, 6235.40, '[{\"id\":\"10\",\"name\":\"O Stool\",\"quantity\":1,\"price\":5800,\"image\":\"https://store.leibal.com/cdn/shop/products/ostool2.jpg?crop=center&height=2048&v=1571439761&width=2048\",\"maker\":\"Estudio Persona\",\"lead_time\":\"6-8 Weeks\"}]', '2025-06-24 07:02:49', '2025-06-24 07:02:49');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `category` enum('seating','tables','lighting','storage','accessories') NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `image_hover` varchar(500) DEFAULT NULL,
  `maker` varchar(255) DEFAULT NULL,
  `lead_time` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('enable','disable') NOT NULL DEFAULT 'enable'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `cost_price`, `category`, `image`, `image_hover`, `maker`, `lead_time`, `created_at`, `status`) VALUES
(1, 'PK24 - Leather', 'The PK24™ Chaise Longue, one of the most distinguished pieces in Fritz Hansen\'s Poul Kjærholm collection, seamlessly blends historical influence with modern materials and methods. Drawing inspiration from the Rococo period and the French chaise longue, Kjærholm reimagined the concept using steel, rendering a support system for a smoothly flowing form. Known also as the \'Hammock Chair\', the PK24™ puts forward a unique design principle — suspending the body between two points. This structural design underscores the practical function of the chair, offering unparalleled comfort while maintaining a sculptural, fluid aesthetic.\n\nThe chair’s flowing form, achieved through Kjærholm\'s ingenious use of steel, offers a seamless blend of strength and elegance. It captures the essence of modern design while hinting at historical periods, creating a timeless piece that appeals to a wide range of aesthetics. For architects and design professionals, the PK24™ Chaise Longue is not just a chair; it is an embodiment of innovative design that draws from the past while shaping the future. Whether placed in a minimalist workspace or a classical interior, the PK24™ brings both style and function, making a bold statement about the appreciation of enduring design.', 21170.00, 1000.00, 'seating', 'https://store.leibal.com/cdn/shop/files/pk24-side-natural.jpg?crop=center&height=2048&v=1685311498&width=2048', NULL, 'Fritz Hansen', '10-12 Weeks', '2025-06-21 16:33:49', 'disable'),
(2, 'PK24 - Wicker', 'The PK24™ Chaise Longue, one of the most distinguished pieces in Fritz Hansen\'s Poul Kjærholm collection, seamlessly blends historical influence with modern materials and methods. Drawing inspiration from the Rococo period and the French chaise longue, Kjærholm reimagined the concept using steel, rendering a support system for a smoothly flowing form. Known also as the \'Hammock Chair\', the PK24™ puts forward a unique design principle — suspending the body between two points. This structural design underscores the practical function of the chair, offering unparalleled comfort while maintaining a sculptural, fluid aesthetic.\r\n\r\nThe chair’s flowing form, achieved through Kjærholm\'s ingenious use of steel, offers a seamless blend of strength and elegance. It captures the essence of modern design while hinting at historical periods, creating a timeless piece that appeals to a wide range of aesthetics. For architects and design professionals, the PK24™ Chaise Longue is not just a chair; it is an embodiment of innovative design that draws from the past while shaping the future. Whether placed in a minimalist workspace or a classical interior, the PK24™ brings both style and function, making a bold statement about the appreciation of enduring design.', 26847.00, NULL, 'seating', 'https://store.leibal.com/cdn/shop/files/pk24-wicker-black-2.jpg?crop=center&height=2048&v=1685310872&width=2048', NULL, 'Fritz Hansen', '10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(3, 'OBJ-05 Chair', 'Manu Bañó\'s latest series delves into the capabilities and boundaries of copper, crafted in the enchanting town of Santa Clara del Cobre, Michoacán, Mexico, renowned for its extensive goldsmith heritage and craftsmen skilled in creating diminutive copper items like pots and vessels. This collection features three items: a chair, a coffee table, and a wall lamp. Each piece is meticulously shaped by hand from a slender copper sheet. The manual hammering process not only fortifies the material but also adds a three-dimensional quality to the designs.', 18000.00, NULL, 'seating', 'https://store.leibal.com/cdn/shop/files/obj-05-2.jpg?crop=center&height=2048&v=1713210368&width=2048', 'https://store.leibal.com/cdn/shop/files/obj-05-1.jpg?crop=center&height=2048&v=1713210368&width=2048', 'Manu Bano', '10-12 Weeks', '2025-06-21 16:33:49', 'disable'),
(4, 'Marina Sofa', 'In contrast to Crude\'s signature clean-lined designs, the Marina Sofa stands out with its understated curvature, adding a touch of elegance to any space. Crafted with an oak veneered frame, its versatility shines through with removable marble powder backrests, effortlessly transforming it into a luxurious chaise lounge. With a blend of natural and synthetic feather cushions, it offers a hypoallergenic seating solution. Tailored to fit any project, its size and wood frame color can be customized, while a diverse selection of linen upholstery colors ensures a perfect match for every client\'s preferences.', 13750.00, NULL, 'seating', 'https://store.leibal.com/cdn/shop/files/marina-2.jpg?crop=center&height=2048&v=1715395591&width=2048', 'https://store.leibal.com/cdn/shop/files/marina-1.jpg?crop=center&height=2048&v=1715395592&width=2048', 'Obstacles', '10-12 Weeks', '2025-06-21 16:33:49', 'disable'),
(5, 'Nido Sofa', 'The Nido Sofa is a creative interpretation of the interplay between contrasting shapes. The design features a leather upholstered wooden seat, possessing an egg-like form that nestles within the sofa\'s solid wood frame crafted in a cross shape. This thoughtful juxtaposition of shapes gives the sofa its name - Nido, which translates to \'nest\' in Spanish. Built on a base available in either walnut or white oak, the Nido Sofa embodies a fusion of style and stability. Its strong lines offer a robust foundation, which, when coupled with the soft and round contours of the leather seat, creates a piece that prioritizes both comfort and design aesthetic.\r\n\r\nThe Nido Sofa goes beyond being a seating solution; it represents a playful blend of shapes, materials, and comfort. The union of its distinctive rounded seat and solid cross-shaped base creates a dynamic visual interest, making the Nido Sofa a focal point in any space. For design professionals and architects, the Nido Sofa embodies the harmony of geometric interplay and comfort. Whether it\'s integrated into a modern minimalist setting or a more traditional interior, the Nido enhances the ambiance with its distinctive design and comfortable appeal. It stands as a testament to the power of thoughtful and innovative design in furniture.', 12000.00, NULL, 'seating', 'https://store.leibal.com/cdn/shop/files/nido-sofa-black-front.jpg?crop=center&height=2048&v=1685405450&width=2048', 'https://store.leibal.com/cdn/shop/products/nido5.jpg?crop=center&height=2048&v=1685405450&width=2048', 'Estudio Persona', '10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(6, 'Covent Residential Sofa', 'Introducing the Covent Residential Sofa: a cozy twist on the timeless Covent Sofa. This new design boasts a spacious seat and loose cushions for ultimate relaxation. While maintaining the signature elegance of the Covent series, it offers a homey comfort perfect for any living space. The firm, curved exterior and subtly defined armrests preserve the distinct precision that sets the Covent line apart, making this sofa a striking centerpiece in any room. The ample seating and four plush cushions provide a welcoming invitation to sink into luxurious softness and warmth.', 8799.00, NULL, 'seating', 'https://store.leibal.com/cdn/shop/files/covent-residential-lana-2.jpg?crop=center&height=2048&v=1724877349&width=2048', 'https://store.leibal.com/cdn/shop/files/covent-residential-lana-1.jpg?crop=center&height=2048&v=1724877349&width=2048', 'New Works', '6-8 Weeks', '2025-06-21 16:33:49', 'enable'),
(7, 'Beam Lounge Chair', 'Beams is inspired by the use of structural supports in architectural buildings, further contextualized within the structures they inhabit. The Beam Chair features precisely angled I-beams and laser cut aluminum sheets. The surface is treated with a waxed finish, balancing a sense of rigid industrialism with utility. Edition of 10.', 7750.00, NULL, 'seating', 'https://store.leibal.com/cdn/shop/files/beam-lounge-4_c5a6d6ab-e595-4ed1-8ae4-3bf25f52e789.jpg?crop=center&height=2048&v=1728335435&width=2048', 'https://store.leibal.com/cdn/shop/files/beam-lounge-4_c5a6d6ab-e595-4ed1-8ae4-3bf25f52e789.jpg?crop=center&height=2048&v=1728335435&width=2048', 'Marquel Williams', '8-10 Weeks', '2025-06-21 16:33:49', 'enable'),
(8, 'Nido Chair', 'The Nido Chair emerges from a thoughtful exploration of shapes and their interplay. The design features a leather upholstered wooden seat with an egg-like shape, nestled within a cross-shaped solid wood frame. This intriguing juxtaposition of forms gives the chair its name - Nido, meaning \'nest\' in Spanish. The solidity and linear design of the Nido\'s base, available in either walnut or white oak, provide a stylish foundation and dependable stability. This robust frame, contrasted with the soft, round contours of the leather seat, ensures that comfort is not compromised for the sake of style.\r\n\r\nThe Nido Chair is more than a seating solution; it\'s a fusion of contrasting shapes, materials, and textures, creating a unique piece that combines form and function. The interplay of the rounded seat and the solid cross-shaped base generates a dynamic visual appeal, making the Nido a standout piece in any setting. For design professionals and architects, the Nido Chair represents a synthesis of geometry and comfort. Whether it\'s featured in a modern minimalist interior or a traditional setting, the Nido enhances the space with its unique form and comfortable design. It serves not just as a piece of furniture, but as a testament to the power of innovative design.', 7200.00, NULL, 'seating', 'https://store.leibal.com/cdn/shop/files/nido_black.jpg?crop=center&height=2048&v=1685404336&width=2048', NULL, 'Estudio Persona', '10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(9, 'Ele Armchair', 'The creative process wasn\'t guided by any predetermined ambition; instead, it was allowed to organically emerge from the environment itself. This environment was composed of nothing more than wooden planks and an assortment of surplus fabric discovered within the confines of the workspace. Over the course of this solitary month, the designer\'s journey was punctuated with fleeting moments of trial and error.\r\n\r\nThe resulting fragments of ideas, material samples, and proposals were like breadcrumbs in a forest, scattered signposts that led to the creation of a unique object. However, this object, as it stood at the end of that first month, defied conventional definitions of functionality—it was impossible to sit on. The essence of this object remained enigmatic, even to the designer. Over the subsequent five years, it existed in a state of flux, oscillating between states of completion and incompletion. Prototypes of this object, along with numerous photographs, served as a silent testament to its evolution, accompanying the designer on their creative journey.', 6400.00, NULL, 'seating', 'https://store.leibal.com/cdn/shop/files/ele-2.jpg?crop=center&height=2048&v=1704599167&width=2048', 'https://store.leibal.com/cdn/shop/files/ele-2.jpg?crop=center&height=2048&v=1704599167&width=2048', 'Jaume Ramirez Studio', ' 10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(10, 'O Stool', 'The O Stool harnesses the circular form, pushing its boundaries through a series of unfolding and folding actions, transforming the typically rigid steel into a depiction of fluid softness. This dynamic form captures the play of light and shadows, as they gather and curve outward, embodying a steady sense of ebb and flow. Fabricated from blackened steel, each piece is meticulously bent and welded together. The stool demonstrates not just aesthetic finesse, but also remarkable durability, making it suitable for both outdoor and indoor use.\r\n\r\nThe O Stool is crafted by hand in Los Angeles, California, underscoring a commitment to local craftsmanship and sustainable practices by using locally sourced materials. This stool is more than a seating solution; it\'s a sculptural piece that captures the fluidity of form and the interplay of light and shadow. For design professionals and architects, the O Stool offers an intriguing blend of form, functionality, and craftsmanship. Its unique design and durability make it a versatile addition to any space, from contemporary settings to more traditional environments. The O Stool stands as a testament to the power of innovative design and sustainable practices.', 5800.00, NULL, 'seating', 'https://store.leibal.com/cdn/shop/products/ostool2.jpg?crop=center&height=2048&v=1571439761&width=2048', 'https://store.leibal.com/cdn/shop/products/ostool4.jpg?crop=center&height=2048&v=1571439761&width=2048', 'Estudio Persona', '6-8 Weeks', '2025-06-21 16:33:49', 'enable'),
(11, 'Block Chair', 'The Block Chair, a standout piece from the Connection collection, encapsulates the exploration of volumes and construction principles. This collection represents an innovative approach to design, focusing on the interaction of different elements to create functional and aesthetically appealing pieces.\r\n\r\nThe Block Chair also marks the studio\'s initial exploration into the realm of color, drawing inspiration from a discourse on \"chromophobia.\" This introduction of color serves to redefine the perception of the pieces, adding a new dimension to their visual appeal.\r\n\r\nThe underlying idea of the Block Chair, and the Connection collection as a whole, is to arrange and interconnect the individual pieces in a manner that maximises functionality. In doing so, the collection encourages a fresh perspective on spatial relationships and surroundings.\r\n\r\nFor design professionals and architects, the Block Chair signifies a shift in design philosophy - an exploration of form, functionality, and color that brings a new vitality to any space. Whether incorporated into a modernist setting or a more traditional interior, the Block Chair offers a fresh perspective on design and functionality, encouraging viewers to reimagine their environments.', 5500.00, NULL, 'seating', 'https://store.leibal.com/cdn/shop/products/Block2.jpg?crop=center&height=2048&v=1685401872&width=2048', 'https://store.leibal.com/cdn/shop/products/Block4.jpg?crop=center&height=2048&v=1685401872&width=2048', 'Estudio Persona', '6-8 Weeks', '2025-06-21 16:33:49', 'enable'),
(12, 'Arv Lounge Chair', 'Fifth-generation furniture makers Brdr. Krüger has collaborated with David Thulstrup to create a lounge chair version of the acclaimed and award-winning ARV Chair, initially designed for restaurant Noma.\r\n\r\nThulstrup seeks to balance beauty with durability, lightness with comfort, and materials that will only become more expressed over time.', 3840.00, NULL, 'seating', 'https://store.leibal.com/cdn/shop/products/oiled_oak_front.jpg?crop=center&height=2048&v=1687024589&width=2048', 'https://store.leibal.com/cdn/shop/products/oiled_oak_front.jpg?crop=center&height=2048&v=1687024589&width=2048', 'Brdr. Krüger', ' 12-14 Weeks', '2025-06-21 16:33:49', 'enable'),
(25, 'Cosmos Table', 'Introducing the Cosmos Table, a stunning collaboration with Spanish artist, Yoyo Balagué. Inspired by Yoyo\'s expertise in \"pit-firing\" ceramics, an ancient technique of firing clay in a pit or hole dug in the ground, this table embodies a fusion of natural elements and artistic craftsmanship. Yoyo\'s dedication to \"pit-firing\" ceramics inspired the creation of this unique piece, where wood and clay converge in a harmonious union. Through the transformative power of fire, these materials intertwine to reveal a captivating texture and character, making each table a testament to the beauty of natural processes and artistic collaboration.', 17000.00, NULL, 'tables', 'https://store.leibal.com/cdn/shop/files/cosmos-1.jpg?crop=center&height=2048&v=1715649249&width=2048', 'https://store.leibal.com/cdn/shop/files/cosmos-2.jpg?crop=center&height=2048&v=1715649249&width=2048', 'Obstacles', '10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(26, 'OBJ-06 Coffee Table', 'Manu Bañó\'s latest collection delves into the capabilities and boundaries of copper, crafted in the enchanting town of Santa Clara del Cobre, Michoacán, Mexico, renowned for its extensive goldsmith heritage and craftsmen skilled in creating diminutive copper items like pots and vessels.\r\n\r\nThis collection features three items: a chair, a coffee table, and a wall lamp. Each piece is meticulously shaped by hand from a slender copper sheet. The manual hammering process not only fortifies the material but also adds a three-dimensional quality to the designs.', 16000.00, NULL, 'tables', 'https://store.leibal.com/cdn/shop/files/obj-06.jpg?crop=center&height=2048&v=1713300179&width=2048', 'https://store.leibal.com/cdn/shop/files/obj-06-2.jpg?crop=center&height=2048&v=1713300179&width=2048', 'Manu Bano', '10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(27, 'BB Coffee Table', 'BB Coffee Table is a minimalist coffee table designed by Paris-based practice CORPUS STUDIO. This series notably features a distinct approach to design through the division, repetition, and assembly of a straightforward element: a wheel crafted from aluminium. This methodical process transforms the wheel into various functional items that not only serve practical purposes but also captivate with their visual appeal. At the heart of the collection lies a table, ingeniously constructed from four cast metal elements that double as supports and potential storage solutions. These elements are brought together by a tabletop, creating a harmonious structure.', 10620.00, NULL, 'tables', 'https://store.leibal.com/cdn/shop/files/bb-ct-1.jpg?crop=center&height=2048&v=1713299342&width=2048', 'https://store.leibal.com/cdn/shop/files/bb-ct-2.jpg?crop=center&height=2048&v=1713299342&width=2048', 'CORPUS STUDIO', '16-20 Weeks', '2025-06-21 16:33:49', 'enable'),
(28, 'NM21', 'The NM21 Dining Table, designed by NM3 in Milan in 2022, is available in 1.5mm BA inox steel, 1.5mm Scotchbrite inox steel, 1.5mm Zinc plated iron and is also available in powder-coated with RAL. The NM21 features a minimalist, linear form achieved through 2D numerical control cutting and dry assembly. Its design emphasizes geometric precision and functional simplicity, with untreated surfaces that highlight the raw qualities of the material. The NM21 is made to order within a 10–12 week lead time and is produced exclusively in Italy, specifically within Milan’s local supply chain. NM3’s production approach prioritizes sustainability through the use of 100% recyclable materials and small-batch manufacturing to prevent overproduction. The robust metal construction reflects a focus on durability, intended to ensure long-term use.', 10200.00, NULL, 'tables', 'https://store.leibal.com/cdn/shop/files/nm21-1.jpg?crop=center&height=2048&v=1742413740&width=2048', 'https://store.leibal.com/cdn/shop/files/nm21-2.jpg?crop=center&height=2048&v=1742413740&width=2048', 'NM3', '10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(29, 'THEWALL#07', 'Inspired by stories of China\'s border architecture, this series continues the exploration begun in the Chinese Architecture Memory collection from 2020. The collection draws on the concept of a wall—a structure that both separates and connects, symbolizing the attraction and friction between differing entities. Borders between kingdoms become places where civilizations confront and merge.', 9145.00, NULL, 'tables', 'https://store.leibal.com/cdn/shop/files/the-wall-07-01.jpg?crop=center&height=2048&v=1724704828&width=2048', 'https://store.leibal.com/cdn/shop/files/thewall_07-2_PhotographyfromSINGCHAN.jpg?crop=center&height=2048&v=1724704829&width=2048', 'Sing Chan', '6-8 Weeks', '2025-06-21 16:33:49', 'disable'),
(30, 'Beam Desk', 'Beams is inspired by the use of structural supports in architectural buildings, further contextualized within the structures they inhabit. The Beam Chair features precisely angled I-beams and laser cut aluminum sheets. The surface is treated with a waxed finish, balancing a sense of rigid industrialism with utility. Edition of 5.', 6300.00, NULL, 'tables', 'https://store.leibal.com/cdn/shop/files/beam-desk-2.jpg?crop=center&height=2048&v=1728424349&width=2048', 'https://store.leibal.com/cdn/shop/files/beam-desk-2.jpg?crop=center&height=2048&v=1728424349&width=2048', 'Marquel Williams', ' 8-10 Weeks', '2025-06-21 16:33:49', 'enable'),
(31, 'Puffball Cloud Pendant', 'Designed for modern simplicity, Puffball seamlessly fits into a variety of environments. The elemental inspiration and material choices make it an appealing option for design professionals and architects seeking a minimal yet impactful lighting solution. Illuminate your space with Puffball, a collection that effortlessly integrates natural forms into functional and aesthetically pleasing lighting designs.', 17375.00, NULL, 'lighting', 'https://store.leibal.com/cdn/shop/files/puffball.jpg?crop=center&height=2048&v=1703898208&width=2048', 'https://store.leibal.com/cdn/shop/files/puffball-2.jpg?crop=center&height=2048&v=1703898208&width=2048', 'Matter Made', '10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(32, 'Variegated Berea Sandstone Lamp 1', 'The Variegated Berea Sandstone Lamp 1 is one of eleven unique editions within an exclusive collection curated by HB-AS, presenting their singular sandstone lighting fixtures in collaboration with Leibal. Crafted by San Francisco-based designers Hank Beyer and Alex Sizemore, these lamps reflect their dedication to craftsmanship and innovative material usage, echoing Leibal\'s commitment to minimalist design. This collection showcases years of exploration and experimentation with sandstone, salvaging artifacts from both ancient and modern processes to create sculptural luminaires. Each lamp, a collage of minimally modified parts, celebrates the distinct origins of its sandstone piece, imbued with a history spanning 350 million years. From the fine details to the dynamic textures produced by industrial processes, each lamp tells a unique story of time and transformation.', 8760.00, NULL, 'lighting', 'https://store.leibal.com/cdn/shop/files/HB-ASBereaSandstoneLamps11-1.jpg?crop=center&height=2048&v=1715824127&width=2048', 'https://store.leibal.com/cdn/shop/files/HB-ASBereaSandstoneLamps11-2.jpg?crop=center&height=2048&v=1715824127&width=2048', 'Leibal', '4-6 Weeks', '2025-06-21 16:33:49', 'enable'),
(33, 'Puffball Pendant', 'Designed for modern simplicity, Puffball seamlessly fits into a variety of environments. The elemental inspiration and material choices make it an appealing option for design professionals and architects seeking a minimal yet impactful lighting solution. Illuminate your space with Puffball, a collection that effortlessly integrates natural forms into functional and aesthetically pleasing lighting designs.', 8500.00, NULL, 'lighting', 'https://store.leibal.com/cdn/shop/files/puffball-pendant-lg.jpg?crop=center&height=2048&v=1704144082&width=2048', NULL, 'Matter Made', '8-10 Weeks', '2025-06-21 16:33:49', 'enable'),
(34, 'Berea Sandstone Lamp 10', 'The Berea Sandstone Lamp 10 is one of eleven unique editions within an exclusive collection curated by HB-AS, presenting their singular sandstone lighting fixtures in collaboration with Leibal. Crafted by San Francisco-based designers Hank Beyer and Alex Sizemore, these lamps reflect their dedication to craftsmanship and innovative material usage, echoing Leibal\'s commitment to minimalist design. This collection showcases years of exploration and experimentation with sandstone, salvaging artifacts from both ancient and modern processes to create sculptural luminaires. Each lamp, a collage of minimally modified parts, celebrates the distinct origins of its sandstone piece, imbued with a history spanning 350 million years. From the fine details to the dynamic textures produced by industrial processes, each lamp tells a unique story of time and transformation.', 5800.00, NULL, 'lighting', 'https://store.leibal.com/cdn/shop/files/HB-ASBereaSandstoneLamps10-1.jpg?crop=center&height=2048&v=1715823885&width=2048', 'https://store.leibal.com/cdn/shop/files/HB-ASBereaSandstoneLamps10-3.jpg?crop=center&height=2048&v=1715823924&width=2048', 'Leibal', '4-6 Weeks', '2025-06-21 16:33:49', 'enable'),
(35, 'Luce Orizzontale', 'The suspended lamp is composed of interconnected glass modules with lengths of 65.1 inches (S1), 81.5 inches (S2), and 98 inches (S3), accompanied by a 106.3-inch suspended power cable. These cylindrical, transparent glass modules are crafted through an artisanal process that involves pouring glass into a rotating mold. This results in an exclusive finish, making each piece unique. The internal structure is made of polished, extruded aluminum and is fitted with two linear LED modules for both direct and indirect downward lighting. These modules are easily removable for maintenance.', 7495.00, NULL, 'lighting', 'https://store.leibal.com/cdn/shop/products/S1-luce-orizzontale-still-01-1200px.jpg?crop=center&height=2048&v=1693845294&width=2048', 'https://store.leibal.com/cdn/shop/files/S1-luce-orizzontale-still-02-1200px.jpg?crop=center&height=2048&v=1693845302&width=2048', 'Flos', ' 0-2 Weeks', '2025-06-21 16:33:49', 'disable'),
(36, 'Puffball Table Lamp', 'The use of raw fiberglass and aluminum not only enhances the lamps\' durability but also contributes to the warm luminosity they emit. Designed for modern simplicity, Puffball effortlessly integrates into a range of environments. The elemental inspiration and choice of materials make it an appealing choice for design professionals and architects seeking a minimal yet impactful lighting solution. Illuminate your space with Puffball, a collection that captures the essence of natural forms while providing functional and aesthetically pleasing lighting.', 5470.00, NULL, 'lighting', 'https://store.leibal.com/cdn/shop/files/puff-table-1.jpg?crop=center&height=2048&v=1703796523&width=2048', 'https://store.leibal.com/cdn/shop/files/puff-table-2.jpg?crop=center&height=2048&v=1703796523&width=2048', 'Matter Made', '10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(37, 'OBJ-07 Wall Lamp', 'Manu Bañó\'s latest collection delves into the capabilities and boundaries of copper, crafted in the enchanting town of Santa Clara del Cobre, Michoacán, Mexico, renowned for its extensive goldsmith heritage and craftsmen skilled in creating diminutive copper items like pots and vessels.', 5000.00, NULL, 'lighting', 'https://store.leibal.com/cdn/shop/files/obj-07-2.jpg?crop=center&height=2048&v=1713811438&width=2048', 'https://store.leibal.com/cdn/shop/files/obj-07-1.jpg?crop=center&height=2048&v=1713811374&width=2048', 'Manu Bano', '10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(38, 'Taccia', 'The Castiglioni brothers consistently crafted designs that shifted our perceptions, and the Taccia is a brilliant illustration of this – resembling an inverted hanging lamp. Conceived by this renowned pair in 1962, the emblematic Taccia features a concave spun aluminum reflector with a matte white finish. Its illumination can be manually adjusted by repositioning the blown glass diffuser as needed. The base of this designer table lamp is crafted from extruded aluminum and is offered in either a matte black anodized or a natural sandblasted finish. The Taccia LED Table Lamp, with its glass diffuser, emits reflected light and is dimmable. This modern adjustable table lamp comes in black/anodized aluminum and offers two choices for its light source: HSGSR or a remote phosphor LED. The inspiration for the design: The industrial roots of Achille and Pier Giacomo Castiglioni shine through this creation, showcasing their minimalist approach to reimagining everyday objects.', 3825.00, NULL, 'lighting', 'https://store.leibal.com/cdn/shop/products/taccialarge-black.jpg?crop=center&height=2048&v=1691694598&width=2048', 'https://store.leibal.com/cdn/shop/products/tacciasmall-silver.jpg?crop=center&height=2048&v=1691685294&width=2048', 'Flos', '0-2 Weeks', '2025-06-21 16:33:49', 'enable'),
(39, 'OBJ-04 Shelf', 'Introducing OBJ-04, a modular shelving system designed from a single sheet of steel, commercially sourced and transformed through precise laser cutting to serve as a display for various objects. This system is crafted from hot rolled steel, retaining its natural imperfections and textures from the production process. It offers the versatility to expand both vertically and horizontally to any desired extent.', 9500.00, NULL, 'storage', 'https://store.leibal.com/cdn/shop/files/obj-4-1.jpg?crop=center&height=2048&v=1712099900&width=2048', 'https://store.leibal.com/cdn/shop/files/obj-4-2.jpg?crop=center&height=2048&v=1712099900&width=2048', 'Manu Bano', '10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(40, 'Eileen Bedside Table + Tray', 'Introducing the versatile Eileen Bedside Table + Tray: an ingenious fusion of a drawer and a detachable tray, designed to seamlessly accommodate your evolving requirements. Inspired by the concept of enjoying breakfast in bed or creating a cozy workspace within your sanctuary, this innovative piece effortlessly transforms to suit your needs. Simply detach the top section to use it as a convenient tray for any item, while the bottom part remains a functional drawer, ensuring practicality and style meet harmoniously in your bedroom space.', 4000.00, NULL, 'storage', 'https://store.leibal.com/cdn/shop/files/eileen-2.jpg?crop=center&height=2048&v=1715395088&width=2048', 'https://store.leibal.com/cdn/shop/files/eileen-1.jpg?crop=center&height=2048&v=1715395088&width=2048', 'Obstacles', '10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(41, 'USM Credenza E2', 'A timeless solution to your storage needs, this versatile credenza presents an elegant fusion of style and functionality. The design features four drop-down doors, each securing effortlessly with a simple coin-twist lock mechanism. This feature, alongside its inherent spaciousness, ensures that your storage necessities are met with convenience and security.', 3695.00, NULL, 'storage', 'https://store.leibal.com/cdn/shop/products/e2_pure_white_front.jpg?crop=center&height=2048&v=1685561141&width=2048', 'https://store.leibal.com/cdn/shop/files/e2_pure_white_back.jpg?crop=center&height=2048&v=1685561147&width=2048', 'USM', '8-10 Weeks', '2025-06-21 16:33:49', 'enable'),
(42, 'Angle Shelf', 'Angle Shelf is a minimal shelf designed by Rotterdam-based designer Johan Viladrich. The privately commissioned piece is constructed of waxed aluminum and connects to the wall at a 90 degree angle. The angle is formed through the curvature of the shelf surfaces, which are then connected to the plates attached to the wall.', 3200.00, NULL, 'storage', 'https://store.leibal.com/cdn/shop/files/aws-1.jpg?crop=center&height=2048&v=1698259710&width=2048', 'https://store.leibal.com/cdn/shop/files/aws-2.jpg?crop=center&height=2048&v=1698259710&width=2048', 'Johan Viladrich', '8-10 Weeks', '2025-06-21 16:33:49', 'enable'),
(43, 'Rivet Case\r\n', 'The Rivet Case impresses with its robust and adaptable design. Whether positioned vertically or horizontally, it serves as a table, storage unit, or display area. Constructed through a riveting method ideal for creating right-angle joints between distinct, laser-cut raw aluminum sheets, the case is meticulously hand-assembled using a hammer in a unique cold-forming assembly process, a technique pioneered by designer Jonas Trampedach in 2011.', 1940.00, NULL, 'storage', 'https://store.leibal.com/cdn/shop/files/rivet-case_2.jpg?crop=center&height=2048&v=1689784903&width=2048', 'https://store.leibal.com/cdn/shop/files/rivet-case_1.jpg?crop=center&height=2048&v=1689784906&width=2048', 'Frama', '8-10 Weeks', '2025-06-21 16:33:49', 'enable'),
(44, 'Rivet Shelf', 'Each Rivet Shelf is meticulously hand-assembled, employing a hammer in a cold-forming assembly process. This technique, developed by designer Jonas Trampedach in 2011, speaks to the craftsmanship involved in its creation, imbuing each piece with individual charm. The Rivet Shelf serves as a multifunctional addition to any space, seamlessly merging utility with visual appeal. Its distinct design and handmade quality make it an excellent selection for design professionals and architects looking for a practical yet aesthetically pleasing storage and display soluti', 1100.00, NULL, 'storage', 'https://store.leibal.com/cdn/shop/files/rivetshelf2.jpg?crop=center&height=2048&v=1685488936&width=2048', 'https://store.leibal.com/cdn/shop/products/rivetshelf3.jpg?crop=center&height=2048&v=1571439762&width=2048', 'Frama', '2-4 Weeks', '2025-06-21 16:33:49', 'enable'),
(45, 'Bronze Casting Bowl', 'Ann Van Hoey, a celebrated ceramic artist, presents a collection that embodies the convergence of art and functionality, catering to the discerning tastes of design professionals and architects. Her transition from a twenty-year career to pursue ceramics has led to the creation of a unique ceramic language, deeply influenced by diverse cultures and local techniques.', 7950.00, NULL, 'accessories', 'https://store.leibal.com/cdn/shop/files/bronze-bowl-2.jpg?crop=center&height=2048&v=1705441863&width=2048', 'https://store.leibal.com/cdn/shop/files/bronze-bowl-1.jpg?crop=center&height=2048&v=1705441863&width=2048', 'whenobjectswork', ' 6-8 Weeks', '2025-06-21 16:33:49', 'enable'),
(46, 'Vase', 'Expertly crafted with a focus on minimalism, this architecturally inspired piece embodies both simplicity and sophistication. Renowned for a monastic yet elegantly intricate design, it presents a harmonious blend of space and material. Constructed from the finest quality solid walnut or German limestone, it showcases precision in every line and curve. Its minimalist aesthetic offers a soulful and refined touch, perfect for complementing modern interiors. Ideal for design professionals and architects, this piece not only stands as a testament to minimalist furniture but also as a versatile addition to any minimal interior. Embrace the essence of minimalist design with this exquisite piece, a true representation of refined simplicity and architectural elegance.', 1550.00, NULL, 'accessories', 'https://store.leibal.com/cdn/shop/files/vase-walnut-1.jpg?crop=center&height=2048&v=1705614537&width=2048', 'https://store.leibal.com/cdn/shop/files/vase-limtestone-2.jpg?crop=center&height=2048&v=1705614537&width=2048', 'whenobjectswork', '6-8 Weeks', '2025-06-21 16:33:49', 'enable'),
(47, 'Large Portal Vase', 'Crafted through meticulous hand-pressing techniques that introduce captivating deformations to their cylindrical shapes, these oversized Barro Preto vases form a unique series. Collaboratively created by designer Christian Haas and craftsman António Marques, this endeavor redefines the concept of \"hand-formed,\" resulting in a novel approach to shaping each vase into a one-of-a-kind piece.', 1200.00, NULL, 'accessories', 'https://store.leibal.com/cdn/shop/files/portal-2.jpg?crop=center&height=2048&v=1707531159&width=2048', 'https://store.leibal.com/cdn/shop/files/portal-1.jpg?crop=center&height=2048&v=1707531159&width=2048', 'Origin Made', '6-8 Weeks', '2025-06-21 16:33:49', 'enable'),
(48, 'Bowl', 'The bowl is a testament to Schuybroek\'s skill in blending monastic minimalism with a sophisticated, soulful touch. His designs are recognized for their rigorous and contextual approach, capturing the essence of space and materials in every detail. This product is not just a bowl; it\'s a key household object designed to evolve and mature with its environment, enhancing the minimalist interiors of design-conscious professionals and architects.', 1400.00, NULL, 'accessories', 'https://store.leibal.com/cdn/shop/files/bowl-lime-4.jpg?crop=center&height=2048&v=1705695003&width=2048', 'https://store.leibal.com/cdn/shop/files/bowl-black-1.jpg?crop=center&height=2048&v=1705695011&width=2048', 'whenobjectswork', '6-8 Weeks', '2025-06-21 16:33:49', 'enable'),
(49, 'Flight Sculpture', 'Building upon the Ark series, these miniature stoneware sculptures bring together a trio of elements: the transformation of classical architecture into contemporary design, the meticulous craftsmanship of skilled stonemasons who hand-polish intricate details, and the natural beauty of raw travertine stone. The unique geological patterns found in travertine ensure that each sculpture is distinct. In the Spiral sculpture, the continuous horizontal lines merge into a gracefully ascending curve, offering a poetic contrast to the Flight sculpture, which showcases a commitment to straight lines.', 1140.00, NULL, 'accessories', 'https://store.leibal.com/cdn/shop/files/flight_4.jpg?crop=center&height=2048&v=1707775242&width=2048', 'https://store.leibal.com/cdn/shop/files/flight_1.jpg?crop=center&height=2048&v=1707775242&width=2048', 'Origin Made', '4-6 Weeks', '2025-06-21 16:33:49', 'enable'),
(50, 'Double Tray\r\n', 'Introducing the Double Tray by John Pawson, a testament to minimalist elegance and functionality. Crafted with exceptional skill, this piece originates from John Pawson\'s design for a new Cistercian monastery in Bohemia. It embodies the essence of minimalist design, with its roots in the creation of essential dining equipment for the monastery\'s refectory. This solid oak double tray, a highlight of the collection, is notable for its versatility. The two separate trays can be used independently, offering flexibility in use. Their design is not just about aesthetic appeal but also about enhancing the dining experience.', 1100.00, NULL, 'accessories', 'https://store.leibal.com/cdn/shop/files/double-tray-3.jpg?crop=center&height=2048&v=1705973769&width=2048', 'https://store.leibal.com/cdn/shop/files/double-tray-1.jpg?crop=center&height=2048&v=1705973769&width=2048', 'whenobjectswork', '6-8 Weeks', '2025-06-21 16:33:49', 'enable'),
(51, 'MATUREWARE Lever Handle - Curved\r\n', 'Crafted to emphasize the beauty of minimalist design, our MATUREWARE Lever Handles redefine the elegance of door hardware. Each handle, expertly cast in solid brass, is an embodiment of minimalist aesthetics and functionality. The set offers versatility with three distinct plate designs - Circle, Hexagon, and Square - allowing for 12 unique combinations to suit any minimalist interior. The lever handles come with a high-quality passage mortise kit, developed by a leading Japanese lock manufacturer. This kit ensures durability and stability, perfectly complementing the solid brass handles for long-lasting use. ', 895.00, NULL, 'accessories', 'https://store.leibal.com/cdn/shop/files/knob-curve-circle.jpg?crop=center&height=2048&v=1704311997&width=2048', 'https://store.leibal.com/cdn/shop/files/knob-curve-hexagon.jpg?crop=center&height=2048&v=1704312151&width=2048', 'Futagami', '4-6 Weeks', '2025-06-21 16:33:49', 'enable'),
(52, 'Bookends', 'Designed for those who appreciate the evolution of objects within a space, these book-ends develop a unique patina over time, ensuring that each piece matures and integrates seamlessly into its surroundings. Perfect for design professionals and architects who value minimalist furniture that resonates with both functionality and elegance, these book-ends are an epitome of Schuybroek\'s philosophy: embracing simplicity and warmth in every design.', 600.00, NULL, 'accessories', 'https://store.leibal.com/cdn/shop/files/bookend-2.jpg?crop=center&height=2048&v=1705694185&width=2048', 'https://store.leibal.com/cdn/shop/files/bookend-1.jpg?crop=center&height=2048&v=1705694184&width=2048', 'whenobjectswork', '6-8 Weeks', '2025-06-21 16:33:49', 'enable'),
(53, 'Sphere Oil Diffuser', 'The Sphere, a striking oil diffuser, draws its unique design inspiration from Marcel Duchamp’s ‘Rotoreliefs’, a renowned series of geometric sculptures crafted between 1924 and 1936. Constructed from high-quality steel, this spherical diffuser, when warmed by a tealight, gradually disperses the essential oils held within, elevating the olfactory ambiance of any space. Both decorative and functional, the Sphere enriches the environment by creating an inviting and soothing atmosphere. Alongside the Sphere, comes the Beratan Essential Oil Dropper in a 10mL home fragrance edition.', 290.00, NULL, 'accessories', 'https://store.leibal.com/cdn/shop/files/Frama-Sphere-Oil-Diffuser-1.jpg?crop=center&height=2048&v=1689729561&width=2048', 'https://store.leibal.com/cdn/shop/files/Frama-Sphere-Oil-Diffuser-9.jpg?crop=center&height=2048&v=1689729562&width=2048', 'Frama', '2-4 Weeks', '2025-06-21 16:33:49', 'enable'),
(54, 'Ceramic Orchid Pot', 'Handcrafted by talented ceramic artisans in Europe, the Black Ceramic Orchid Pot is a one-of-a-kind creation, individually made and varying slightly in size. This exquisite vessel is meticulously crafted to accommodate orchids and an array of plants with elegance. Each piece is unique due to its handmade nature, boasting a water-resistant glazed finish. We recommend hand washing for optimal care.', 248.00, NULL, 'accessories', 'https://store.leibal.com/cdn/shop/files/orchid-pot-black-2.jpg?crop=center&height=2048&v=1720213304&width=2048', 'https://store.leibal.com/cdn/shop/files/orchid-pot-black-1.jpg?crop=center&height=2048&v=1720213305&width=2048', 'Devon Liedtke', '2-4 Weeks', '2025-06-21 16:33:49', 'enable'),
(55, 'Offcut 01', 'Lærke Ryom\' Offcut Collection explores the aesthetics of end grain and is made with the intention of emphasizing the potential of the byproduct from Dinesen’s flooring production. The rhythmic shapes, characterizing the fourteen objects, originates from the existing width and sizes determined by the production. Considering the patterning appearing when offsetting and stacking material elements, the collection pays tribute to the natural ornamentation of the grain. Both shape and ornament thereby originate from the material itself, offering a new aesthetic perspective and experience of the familiar material. Offcut Collection is made of Douglas offcuts kindly granted by Dinesen.', 2600.00, NULL, 'tables', 'https://store.leibal.com/cdn/shop/files/offcut-1.jpg?crop=center&height=2048&v=1698576683&width=2048', 'https://store.leibal.com/cdn/shop/files/offcut-2.jpg?crop=center&height=2048&v=1698576682&width=2048', 'Lærke Ryom', '2-4 Weeks', '2025-06-21 16:33:49', 'enable'),
(56, 'PK61', 'The PK61™ Coffee Table is an emblem of Poul Kjærholm\'s minimalist design philosophy. Embodying a square aesthetic design, this table is a powerful testament to Kjærholm\'s evolution from an industrial designer to an acclaimed furniture architect. Minimalist yet impactful, the PK61™ showcases the power of simplicity in design. Its square form and sleek lines are a visual distillation of Kjærholm\'s approach to furniture design, where every element serves a purpose and nothing is superfluous. The PK61™ Coffee Table, while serving its primary function, also acts as a design manifesto, showcasing Kjærholm\'s distinct design principles.', 6256.00, NULL, 'tables', 'https://store.leibal.com/cdn/shop/files/pk61-glass.jpg?crop=center&height=2048&v=1685323681&width=2048', 'https://store.leibal.com/cdn/shop/files/pk61-white.jpg?crop=center&height=2048&v=1685323681&width=2048', 'Fritz Hansen', '10-12 Weeks', '2025-06-21 16:33:49', 'enable'),
(57, 'ST02 Side Table', 'ST02 is a minimal side table created by Rotterdam-based designer Johan Viladrich. Constructed of waxed aluminum, the seat utilizes a perpendicular geometry to maintain its stability. Consistent with his design typology, the screws are left exposed joining the sheets together. In total, six plates are used to compose the structure.', 1285.00, NULL, 'tables', 'https://store.leibal.com/cdn/shop/files/ast-1.jpg?crop=center&height=2048&v=1698260320&width=2048', 'https://store.leibal.com/cdn/shop/files/ast-2.jpg?crop=center&height=2048&v=1698260321&width=2048', 'Johan Viladrich', '8-10 Weeks', '2025-06-21 16:33:49', 'enable'),
(559, 'ARV Dining Chair with Armrest - Woven', 'The award-winning Arv chair draws on the classic virtues of Danish Modern design with timeless qualities, yet it has the spirit of a new generation. The conceptual design feature is a ‘branch’ formation that organically connects the different parts – like branches growing from a tree trunk. Originally designed for Noma Restaurant in Copenhagen, David Thulstrup created the ARV collection to compliment the spirit of the space.', 1960.00, NULL, 'seating', 'https://store.leibal.com/cdn/shop/products/woven_arm_whiteoak.jpg?crop=center&height=2048&v=1687100311&width=2048', 'https://store.leibal.com/cdn/shop/files/back_woven_whiteoak.jpg?crop=center&height=2048&v=1687101963&width=2048', 'Brdr. Krüger', '12-14 Weeks', '2025-06-22 12:30:27', 'disable'),
(561, 'NM02', 'The NM02 Coffee Table, designed by NM3 in Milan in 2022, is constructed from stainless steel and is available in 3mm BA inox steel, 3mm hot rolled black iron, 3mm pickled iron, or powder-coated with custom RAL finishes. The NM02 features a minimalist, linear form achieved through 2D numerical control cutting and dry assembly. Its design emphasizes geometric precision and functional simplicity, with untreated surfaces that highlight the raw qualities of the material. The NM02 is made to order within a 10–12 week lead time and is produced exclusively in Italy, specifically within Milan’s local supply chain. NM3’s production approach prioritizes sustainability through the use of 100% recyclable materials and small-batch manufacturing to prevent overproduction. The robust metal construction reflects a focus on durability, intended to ensure long-term use.', 2860.00, NULL, 'tables', 'https://store.leibal.com/cdn/shop/files/nm02.jpg?crop=center&height=2048&v=1739936390&width=2048', 'https://store.leibal.com/cdn/shop/files/nm02-3.jpg?crop=center&height=2048&v=1739936559&width=2048', 'NM3', '10-12 Weeks', '2025-06-23 20:35:23', 'enable'),
(562, 'Primitive Structure', 'Primitive Structure is Michael Anastassiades’ first task light. Simply stacked in a T-shape are two geometric rectangular forms of black anodized aluminum. The point where they rest is the point of rotation allowing for a sequence of dimmable light that alternates on a 180 degree pivot. The task light is wireless allowing the user the flexibility of placing it in any possible location. This lamp has a battery life of eight hours and can be recharged by USB.', 3629.00, NULL, 'lighting', 'https://store.leibal.com/cdn/shop/products/2_f94d05a0-cf1d-46d8-ae88-d673ea035fd4.jpg?crop=center&height=2048&v=1573771680&width=2048', 'https://store.leibal.com/cdn/shop/products/3_a193e190-5d5e-43e8-8962-78ba6cefb10c.jpg?crop=center&height=2048&v=1573771644&width=2048', 'Michael Anastassiades', '10-12 Weeks', '2025-06-23 22:41:21', 'enable'),
(563, 'Pagoda#03', 'The Pagoda#02 display case draws inspiration from the poetic solitude of ancient frontier landscapes, encapsulating the essence of distant horizons and the enduring passage of time. This design presents a deliberate openness, revealing the raw, unpolished beauty of the metal, a nod to the impermanence and evolution of materials. The exposed surfaces invite interaction, allowing the subtle imprints of human touch—sweat, oil, and time itself—to alter the piece organically. Each contact leaves a mark, creating a unique narrative that echoes the meditative experiences of poets who journeyed to the edges of the known world, confronting the stark contrast between civilization and the vast, uncharted wilderness. The Pagoda#02 is not just a display case; it’s a canvas for personal history, evolving with each encounter, and capturing the quiet, contemplative spirit of those who once wandered the frontiers.', 7680.00, NULL, 'storage', 'https://store.leibal.com/cdn/shop/files/pagoda-3-1.jpg?crop=center&height=2048&v=1725309834&width=2048', 'https://store.leibal.com/cdn/shop/files/pagoda-3-2.jpg?crop=center&height=2048&v=1725309834&width=2048', 'Sing Chan', '4-6 Weeks', '2025-06-23 22:44:33', 'enable');

-- --------------------------------------------------------

--
-- Table structure for table `product_sales_history`
--

CREATE TABLE `product_sales_history` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `units_sold` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `product_sales_history`
--

INSERT INTO `product_sales_history` (`id`, `product_id`, `year`, `month`, `units_sold`, `created_at`) VALUES
(1, 1, 2025, 1, 38, '2025-01-24 17:00:00'),
(2, 2, 2025, 1, 66, '2025-01-06 17:00:00'),
(3, 3, 2025, 1, 77, '2025-01-13 17:00:00'),
(4, 4, 2025, 1, 144, '2025-01-02 17:00:00'),
(5, 5, 2025, 1, 77, '2025-01-19 17:00:00'),
(6, 6, 2025, 1, 89, '2025-01-18 17:00:00'),
(7, 1, 2025, 2, 29, '2025-02-16 17:00:00'),
(8, 2, 2025, 2, 69, '2025-02-26 17:00:00'),
(9, 3, 2025, 2, 155, '2025-02-25 17:00:00'),
(10, 4, 2025, 2, 196, '2025-02-03 17:00:00'),
(11, 5, 2025, 2, 164, '2025-02-15 17:00:00'),
(12, 6, 2025, 2, 59, '2025-02-01 17:00:00'),
(13, 1, 2025, 3, 77, '2025-03-10 17:00:00'),
(14, 2, 2025, 3, 31, '2025-03-01 17:00:00'),
(15, 3, 2025, 3, 53, '2025-03-11 17:00:00'),
(16, 4, 2025, 3, 105, '2025-03-08 17:00:00'),
(17, 5, 2025, 3, 46, '2025-03-04 17:00:00'),
(18, 6, 2025, 3, 96, '2025-03-08 17:00:00'),
(19, 1, 2025, 4, 177, '2025-04-05 17:00:00'),
(20, 2, 2025, 4, 186, '2025-04-10 17:00:00'),
(21, 3, 2025, 4, 148, '2025-04-12 17:00:00'),
(22, 4, 2025, 4, 83, '2025-04-10 17:00:00'),
(23, 5, 2025, 4, 176, '2025-04-04 17:00:00'),
(24, 6, 2025, 4, 178, '2025-04-11 17:00:00'),
(25, 1, 2025, 5, 66, '2025-05-21 17:00:00'),
(26, 2, 2025, 5, 174, '2025-05-19 17:00:00'),
(27, 3, 2025, 5, 134, '2025-05-23 17:00:00'),
(28, 4, 2025, 5, 196, '2025-05-14 17:00:00'),
(29, 5, 2025, 5, 84, '2025-05-11 17:00:00'),
(30, 6, 2025, 5, 143, '2025-05-07 17:00:00'),
(31, 1, 2025, 6, 123, '2025-06-18 17:00:00'),
(32, 2, 2025, 6, 120, '2025-06-04 17:00:00'),
(33, 3, 2025, 6, 120, '2025-06-21 17:00:00'),
(34, 4, 2025, 6, 81, '2025-06-10 17:00:00'),
(35, 5, 2025, 6, 128, '2025-06-24 17:00:00'),
(36, 6, 2025, 6, 185, '2025-06-27 17:00:00'),
(37, 1, 2025, 7, 191, '2025-07-04 17:00:00'),
(38, 2, 2025, 7, 91, '2025-07-27 17:00:00'),
(39, 3, 2025, 7, 55, '2025-07-02 17:00:00'),
(40, 4, 2025, 7, 196, '2025-07-24 17:00:00'),
(41, 5, 2025, 7, 21, '2025-07-09 17:00:00'),
(42, 6, 2025, 7, 80, '2025-07-26 17:00:00'),
(43, 1, 2025, 8, 48, '2025-08-12 17:00:00'),
(44, 2, 2025, 8, 150, '2025-08-12 17:00:00'),
(45, 3, 2025, 8, 128, '2025-08-25 17:00:00'),
(46, 4, 2025, 8, 68, '2025-08-25 17:00:00'),
(47, 5, 2025, 8, 63, '2025-08-17 17:00:00'),
(48, 6, 2025, 8, 189, '2025-08-01 17:00:00'),
(49, 1, 2025, 9, 52, '2025-09-26 17:00:00'),
(50, 2, 2025, 9, 199, '2025-09-19 17:00:00'),
(51, 3, 2025, 9, 55, '2025-09-09 17:00:00'),
(52, 4, 2025, 9, 164, '2025-09-09 17:00:00'),
(53, 5, 2025, 9, 157, '2025-09-15 17:00:00'),
(54, 6, 2025, 9, 86, '2025-09-06 17:00:00'),
(55, 1, 2025, 10, 79, '2025-10-21 17:00:00'),
(56, 2, 2025, 10, 200, '2025-10-11 17:00:00'),
(57, 3, 2025, 10, 178, '2025-10-02 17:00:00'),
(58, 4, 2025, 10, 177, '2025-10-12 17:00:00'),
(59, 5, 2025, 10, 193, '2025-10-07 17:00:00'),
(60, 6, 2025, 10, 102, '2025-10-15 17:00:00'),
(61, 1, 2025, 11, 108, '2025-11-27 17:00:00'),
(62, 2, 2025, 11, 160, '2025-11-24 17:00:00'),
(63, 3, 2025, 11, 23, '2025-11-12 17:00:00'),
(64, 4, 2025, 11, 118, '2025-11-25 17:00:00'),
(65, 5, 2025, 11, 29, '2025-11-21 17:00:00'),
(66, 6, 2025, 11, 132, '2025-11-16 17:00:00'),
(67, 1, 2025, 12, 154, '2025-12-25 17:00:00'),
(68, 2, 2025, 12, 145, '2025-12-18 17:00:00'),
(69, 3, 2025, 12, 99, '2025-12-10 17:00:00'),
(70, 4, 2025, 12, 62, '2025-11-30 17:00:00'),
(71, 5, 2025, 12, 55, '2025-12-16 17:00:00'),
(72, 6, 2025, 12, 100, '2025-12-24 17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('user','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `created_at`, `role`) VALUES
(1, 'admin@atelien.com', '$2a$10$7gEOpRuo6JQys3qmSrNnouLJ0DHs3OxBDNer72xy4QgzWdmUuvSWe', '2025-06-21 14:51:23', 'admin'),
(2, 'hellotiktokhelloyoutube@hotmail.com', '$2a$10$zKCpNSmQCzNBk75Jo6c1Dusqz2cuboowdJrcAmFCsZR9StJh5uTfe', '2025-06-21 15:16:01', 'user'),
(9, 'testkub@gmail.com', '$2a$10$1bwqznDS8qU44J/0cXZgyeKRzBTR.6A2juaN9PLBu2oErQj.c75eS', '2025-06-22 21:38:07', 'user'),
(10, 'hi@test.com', '$2a$10$2S5OSjnbxejH/w7gHGLpyuAh242m6MP.10ugZpglef0t99ILq1oNO', '2025-06-23 06:53:23', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `discount_coupons`
--
ALTER TABLE `discount_coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `monthly_stats`
--
ALTER TABLE `monthly_stats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `product_sales_history`
--
ALTER TABLE `product_sales_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `discount_coupons`
--
ALTER TABLE `discount_coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `monthly_stats`
--
ALTER TABLE `monthly_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=567;

--
-- AUTO_INCREMENT for table `product_sales_history`
--
ALTER TABLE `product_sales_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `product_sales_history`
--
ALTER TABLE `product_sales_history`
  ADD CONSTRAINT `product_sales_history_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
