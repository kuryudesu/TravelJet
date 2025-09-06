// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/me', auth, userController.getCurrentUser);
router.put('/me/update', auth, userController.updateCurrentUser);
router.post('/me/avatar', auth, upload, userController.uploadAvatar);

module.exports = router;