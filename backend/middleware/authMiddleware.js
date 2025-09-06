// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 從 header 取得 token
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // 將解碼後的使用者資訊附加到 request 物件上
        next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            // 當 token 過期時，回傳 401 並帶上特定訊息
            return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }
        // 對於其他 token 錯誤 (例如簽名無效)，也回傳 401
        res.status(401).json({ message: 'Token is not valid.' });
    }
};