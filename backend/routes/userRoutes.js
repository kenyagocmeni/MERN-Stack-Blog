const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUserBlogPosts,
  updateUserProfile,
  deleteUserAccount,
} = require("../controllers/userController");
const { checkAuth } = require("../middlewares/checkAuth");
const upload = require("../config/multer");

const router = express.Router();

// Kullanıcı kaydı
router.post("/register", registerUser);

// Kullanıcı girişi
router.post("/login", loginUser);

// Kullanıcı profili görüntüleme
router.get("/:id",getUserProfile);


// Kullanıcının blog yazılarını alma
router.get("/:id/blogposts", getUserBlogPosts);

// Kullanıcı silme (admin)
router.delete("/:id?", checkAuth, deleteUserAccount);

// Kullanıcı profili güncelleme
router.put("/:id", checkAuth, upload.single("profileImage"), updateUserProfile);


module.exports = router;