// backend/src/server.js
require('dotenv').config({ path: '../.env' }); // 確保能讀取到 server/.env
const express = require('express');
const path = require('path');
const cors = require('cors');
require('../config/db'); // 確保資料庫連接啟動並打印成功信息

const userRoutes = require('../routes/userRoutes');
const flightRoutes = require('../routes/flightRoutes');
const bookingRoutes = require('../routes/bookingRoutes');

const app = express();
//Public Pic Url
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
// Middleware
app.use(cors()); // 允許跨域請求
app.use(express.json()); // 解析 JSON body

// Routes
app.get('/', (req, res) => {
    res.send('Travel Booking API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});