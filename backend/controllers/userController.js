// backend/controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create(username, email, passwordHash);

        res.status(201).json({ 
            message: 'User registered successfully',
            user: { id: newUser.id, username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, avatar_url: user.avatar_url },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token 有效期為 1 天
        );

        res.json({
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 新增: 獲取當前用戶資訊
exports.getCurrentUser = async (req, res) => {
    try {
        // req.user.id 是由 auth middleware 提供的
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 新增: 更新用戶資訊
exports.updateCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, password } = req.body;

        // 構建要更新的欄位
        const fieldsToUpdate = {};
        if (username) fieldsToUpdate.username = username;
        if (email) fieldsToUpdate.email = email;
        if (password) {
            if(password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            const salt = await bcrypt.genSalt(10);
            fieldsToUpdate.password_hash = await bcrypt.hash(password, salt);
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ message: 'No fields to update provided.' });
        }

        // 呼叫 model 函式來更新 (我們需要在 model 中建立這個函式)
        const updatedUser = await User.updateById(userId, fieldsToUpdate);

        res.json({ message: 'Profile updated successfully.', user: updatedUser });
    } catch (error) {
        // 處理 email/username 已存在的錯誤
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email or username already in use.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 新增: 處理頭像上傳
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file selected.' });
        }
        
        // 檔案已經由 multer middleware 處理並儲存了
        // req.file.filename 是 multer 生成的唯一檔名
        // 我們需要構建一個可供前端訪問的完整 URL
        const avatarUrl = `/public/avatars/${req.file.filename}`;
        
        // 將這個 URL 儲存到數據庫
        await User.updateById(req.user.id, { avatar_url: avatarUrl });

        res.json({
            message: 'Avatar uploaded successfully.',
            avatarUrl: avatarUrl
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error during upload.', error: error.message });
    }
};