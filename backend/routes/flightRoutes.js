// backend/routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const auth = require('../middleware/authMiddleware');

// 搜尋航班不需要登入，但你也可以加上 auth 保護
router.get('/search-flights', flightController.searchFlights);
// 新增一個路由來獲取所有機場列表
// router.get('/airports', flightController.getAirports);

module.exports = router;