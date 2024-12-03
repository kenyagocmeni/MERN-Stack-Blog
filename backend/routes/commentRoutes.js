const express = require("express");
const {
  addComment,
  deleteComment,
  replyToComment,
} = require("../controllers/commentController");
const { checkAuth } = require("../middlewares/checkAuth");

const router = express.Router();

// Blog gönderisine yorum ekleme
router.post("/:postId", checkAuth, addComment); // Hangi blogpost'a yorum ekleneceği postId ile belirlenir

// Yorumu silme
router.delete("/:id", checkAuth, deleteComment); // Silinecek yorumun ID'si belirtilir

// Yoruma yanıt verme
router.post("/reply/:commentId", checkAuth, replyToComment); // Hangi yoruma yanıt verileceği commentId ile belirlenir

module.exports = router;
