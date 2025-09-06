// backend/controllers/bookingController.js
const Booking = require('../models/bookingModel');

exports.createBooking = async (req, res) => {
    const userId = req.user.id; 
    const { flightDetails } = req.body;

    if (!flightDetails) {
        return res.status(400).json({ message: 'Flight details are required' });
    }
    
    try {
        const newBooking = await Booking.create(userId, flightDetails);
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    const userId = req.user.id;
    try {
        const bookings = await Booking.findByUserId(userId);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserUpcoming = async (req, res) => {
    const userId = req.user.id;
    try {
        const bookingDetails = await Booking.findByUserIdUpcoming(userId);
        res.json(bookingDetails);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getBookingSummary = async (req, res) => {
    const userId = req.user.id;
    try {
        const summary = await Booking.getSummaryByUserId(userId);
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.id; // 從 auth middleware 獲取

        const updatedRows = await Booking.updateStatusById(bookingId, userId, 'cancelled');

        if (updatedRows === 0) {
            // 如果沒有任何資料列被更新，可能是因為 bookingId 不存在，或該訂單不屬於此用戶
            return res.status(404).json({ message: 'Booking not found or you do not have permission to cancel it.' });
        }

        // 檢查使用者已取消的預訂數量
        const cancelledCount = await Booking.countByUserIdAndStatus(userId, 'cancelled');

        // 如果已取消的預訂達到或超過 2 筆，則清除所有已取消的預訂
        if (cancelledCount >= 2) {
            await Booking.deleteByUserIdAndStatus(userId, 'cancelled');
            return res.json({ message: 'Booking successfully cancelled and old cancelled bookings have been cleared.' });
        }

        res.json({ message: 'Booking successfully cancelled.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};