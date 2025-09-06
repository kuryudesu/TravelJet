// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// 設置儲存引擎
const storage = multer.diskStorage({
    destination: './public/avatars/', // 指定檔案儲存的路徑
    filename: function(req, file, cb){
        // 自訂檔案名：'avatar-' + 用戶ID + '-' + 當前時間戳 + 原檔案擴展名
        // req.user.id 是由 authMiddleware 提供的
        const filename = 'avatar-' + req.user.id + '-' + Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

// 初始化上傳
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000}, // 限制檔案大小為 1MB
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('avatar'); // .single('avatar') 表示我們期望一個名為 'avatar' 的檔案欄位

// 檢查檔案類型函式
function checkFileType(file, cb){
    // 允許的擴展名
    const filetypes = /jpeg|jpg|png|gif/;
    // 檢查擴展名
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // 檢查 MIME 類型
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Images Only! (jpeg,jpg,png,gif)');
    }
}

module.exports = upload;