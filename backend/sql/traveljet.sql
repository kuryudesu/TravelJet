CREATE DATABASE IF NOT EXISTS travel_booking_system;
USE travel_booking_system;

-- -- 使用者表格
-- CREATE TABLE users (
--     id INT AUTO_INCREMENT PRIMARY KEY, 
--     username VARCHAR(50) NOT NULL UNIQUE,
--     email VARCHAR(100) NOT NULL UNIQUE,
--     password_hash VARCHAR(255) NOT NULL,
-- 	   avatar_url VARCHAR(255) NULL DEFAULT NULL;

--     is_active BOOLEAN NOT NULL DEFAULT TRUE,
--     last_login TIMESTAMP NULL DEFAULT NULL,
--     
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 自動追蹤更新時間
-- );

-- CREATE INDEX idx_users_email ON users(email);

-- -- 訂單表格
-- CREATE TABLE bookings (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
-- 	   flight_details TEXT NOT NULL,  -- <-- 原有方式
--     

--     booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

--     status ENUM('confirmed', 'cancelled', 'pending', 'completed') NOT NULL DEFAULT 'confirmed',

--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
-- );

-- CREATE INDEX idx_bookings_user_date ON bookings(user_id, flight_date);


-- Add an index to the user_id and status columns in the bookings table
-- This will speed up queries that filter bookings by user and status
-- CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);

