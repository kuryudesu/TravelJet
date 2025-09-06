// backend/controllers/flightController.js
const axios = require('axios');

// 新增的函式
// exports.getAirports = async (req, res) => {
//     const params = {
//         access_key: process.env.AVIATIONSTACK_API_KEY
//     };

//     try {
//         const response = await axios.get('http://api.aviationstack.com/v1/airports', { params });

//         if (response.data.error) {
//            return res.status(400).json({ message: response.data.error.info });
//         }

//         res.json(response.data);

//     } catch (error) {
//         console.error('Aviationstack API Error (Airports):', error.response ? error.response.data : error.message);
//         res.status(500).json({ message: 'Error fetching airports data' });
//     }
// };

exports.searchFlights = async (req, res) => {
    // 假設前端會傳來 `departure_iata`, `arrival_iata`, `flight_date`
    const { departure_iata, arrival_iata, flight_date } = req.query;

    if (!departure_iata || !arrival_iata || !flight_date) {
        return res.status(400).json({ message: 'Missing required search parameters.' });
    }

    const params = {
        access_key: process.env.AVIATIONSTACK_API_KEY,
        dep_iata: departure_iata,
        arr_iata: arrival_iata,
        // flight_date: flight_date,
        limit: 30 // 限制回傳結果數量
    };

    try {
        // aviationstack API 的免費版可能沒有 flight_date 這個參數，或者功能受限。
        // 請根據您的 API 方案調整 URL 和參數。
        // 這裡是 flights 端點的範例
        const response = await axios.get('http://api.aviationstack.com/v1/flights', { params });
        
        if (response.data.error) {
           return res.status(400).json({ message: response.data.error.info });
        }
        
        res.json(response.data);

    } catch (error) {
        console.error('Aviationstack API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error fetching flight data' });
    }
};