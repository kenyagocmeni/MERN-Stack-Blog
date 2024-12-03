const express = require("express");
const {
  addBlogPost,
  updateBlogPost,
  getBlogPostById,
  deleteBlogPost,
  fetchBlogList,
  toggleCommentLike,
  toggleBlogPostLike,
  discoverBlogPosts,
} = require("../controllers/blogPostController");
const {
  addComment,
  replyToComment,
  editComment,
  deleteComment,
} = require("../controllers/commentController");
const { checkAuth, roleAuth } = require("../middlewares/checkAuth");
const upload = require("../config/multer");

const router = express.Router();

// Blog gönderilerini keşfetme
router.get("/discover", discoverBlogPosts);

// Tüm blog gönderilerini alma
router.get("/", fetchBlogList);

// Blog gönderisi ekleme
router.post(
  "/",
  checkAuth,
  roleAuth(["user", "admin"]),
  upload.array("images", 10),
  addBlogPost
);

// Blog gönderisine yorum ekleme
router.post("/:postId/comments", checkAuth, addComment);

// Yoruma yanıt verme
router.post("/:postId/comments/:commentId/reply", checkAuth, replyToComment);

// Yorum düzenleme
router.put("/:postId/comments/:commentId", checkAuth, editComment);

// Yorum silme
router.delete("/:postId/comments/:commentId", checkAuth, deleteComment);

// Yorum beğenme
router.put("/:postId/comments/:commentId/like", checkAuth, toggleCommentLike);

// Tek bir blog gönderisini getirme
router.get("/:id", getBlogPostById);

// Blog gönderisini beğenme
router.put("/:id/like", checkAuth, toggleBlogPostLike);

// Blog gönderisini güncelleme
router.put(
  "/:id",
  checkAuth,
  roleAuth(["user", "admin"]),
  upload.array("images"),
  updateBlogPost
);

// Blog gönderisini silme
router.delete(
  "/:id",
  checkAuth,
  roleAuth(["user", "admin"]),
  deleteBlogPost
);

module.exports = router;