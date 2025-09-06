// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');


// 保護 booking 路由，必須登入才能存取
router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getUserBookings);
router.get('/details', auth, bookingController.getUserUpcoming);
router.get('/summary', auth, bookingController.getBookingSummary);

// 使用 PATCH /api/bookings/:id/cancel 這樣的語義化路由，或者直接用動詞
router.patch('/:id/cancel', auth, bookingController.cancelBooking);

module.exports = router;