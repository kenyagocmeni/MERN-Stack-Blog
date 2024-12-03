const express = require('express');
const router = express.Router();
const { checkAuth, roleAuth } = require('../middlewares/checkAuth');
const { searchUsers, searchBlogPosts } = require("../controllers/adminController");

// Kullanıcı arama endpoint'i
router.get('/users', checkAuth, roleAuth(['admin']), searchUsers);

// Blog gönderisi arama endpoint'i
router.get('/blogposts', checkAuth, roleAuth(['admin']), searchBlogPosts);

module.exports = router;