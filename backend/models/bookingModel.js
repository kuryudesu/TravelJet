// backend/models/bookingModel.js
const pool = require('../config/db');

const Booking = {
    async create(userId, flightDetails) {
        // flightDetails 是物件，儲存為 JSON 字串
        const flightDetailsJson = JSON.stringify(flightDetails);
        const [result] = await pool.execute(
            'INSERT INTO bookings (user_id, flight_details) VALUES (?, ?)',
            [userId, flightDetailsJson]
        );
        return { id: result.insertId };
    },

    async findByUserId(userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC',
            [userId]
        );
        // 將 flight_details 字串解析回 JSON 物件
        return rows.map(row => ({
            ...row,
            flight_details: JSON.parse(row.flight_details)
        }));
    },

    async getSummaryByUserId(userId) {
        const [result] = await pool.execute(
             `
            SELECT COUNT(*) as totalBookings 
            FROM bookings 
            WHERE user_id = ? AND status = 'confirmed'`,
            [userId]
        );
        const totalBookings = result[0].totalBookings;
        return totalBookings;
    },

    async findByUserIdUpcoming(userId) {
        const [rows] = await pool.execute(
             `
            SELECT flight_details 
            FROM bookings 
            WHERE user_id = ? 
              AND status = 'confirmed' 
              AND JSON_UNQUOTE(JSON_EXTRACT(flight_details, '$.flight_date')) >= CURDATE()
            ORDER BY JSON_UNQUOTE(JSON_EXTRACT(flight_details, '$.flight_date')) ASC 
            LIMIT 1`,
            [userId]
        );
        // 將 flight_details 字串解析回 JSON 物件
        return rows.map(row => ({
            ...row,
            flight_details: JSON.parse(row.flight_details)
        }));
    },



    async updateStatusById(bookingId, userId, newStatus) {
        const [result] = await pool.execute(
            // 我們加入 `user_id = ?` 的條件來確保使用者不能取消不屬於他們的訂單
            'UPDATE bookings SET status = ? WHERE id = ? AND user_id = ?',
            [newStatus, bookingId, userId]
        );
        
        // result.affectedRows 會告訴我們是否有資料列被更新。
        // 如果為 0，表示訂單不存在或不屬於該使用者。
        return result.affectedRows; 
    },
    
    async removeById(bookingId, userId) {
        const [result] = await pool.execute(
            'DELETE FROM bookings WHERE id = ? AND user_id = ?',
            [bookingId, userId]
        );
        return result.affectedRows;
    },

    async countByUserIdAndStatus(userId, status) {
        try {
            const [rows] = await pool.execute('SELECT COUNT(*) as count FROM bookings WHERE user_id = ? AND status = ?',
                [userId, status]);
            return rows[0].count;
        } catch (error) {
            console.error('Error counting bookings by user and status:', error);
            throw error;
        }
    },

    async deleteByUserIdAndStatus(userId, status) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM bookings WHERE user_id = ? AND status = ?',
                [userId, status]);
            return result.affectedRows;
        } catch (error) {
            console.error('Error deleting bookings by user and status:', error);
            throw error;
        }
    }

};

module.exports = Booking;