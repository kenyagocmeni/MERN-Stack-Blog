const Comment = require("../models/Comment");
const Blogpost = require("../models/BlogPost");

// Blog gönderisine yorum ekleme
const addComment = async (req, res) => {
    try {
      const { postId } = req.params; // Blog gönderisi ID'si
      const { content, parentComment } = req.body;
  
      if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Yorum içeriği boş olamaz." });
      }
  
      const blogpost = await Blogpost.findById(postId);
      if (!blogpost) {
        return res.status(404).json({ message: "Blog gönderisi bulunamadı." });
      }
  
      let parent = null;
      if (parentComment) {
        parent = await Comment.findById(parentComment);
        if (!parent) {
          return res.status(404).json({ message: "Ana yorum bulunamadı." });
        }
      }
  
      const newComment = await Comment.create({
        content,
        author: req.user._id,
        post: postId,
        parentComment: parent ? parent._id : null,
      });
  
      if (parent) {
        parent.replies.push(newComment._id);
        await parent.save();
      }
  
      blogpost.comments.push(newComment._id);
      await blogpost.save();
  
      res.status(201).json({
        message: "Yorum başarıyla eklendi.",
        comment: newComment,
      });
    } catch (error) {
      console.error("Yorum eklenirken hata:", error.message);
      res.status(500).json({
        message: "Yorum eklenirken sunucu hatası.",
        error: error.message,
      });
    }
  };
  
  // Yoruma yanıt verme
  const replyToComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
  
      if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Yanıt içeriği boş olamaz." });
      }
  
      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Ana yorum bulunamadı." });
      }
  
      const blogpost = await Blogpost.findById(parentComment.post);
      if (!blogpost) {
        return res.status(404).json({ message: "Blog gönderisi bulunamadı." });
      }
  
      const replyComment = await Comment.create({
        content,
        author: req.user._id,
        post: parentComment.post,
        parentComment: parentComment._id,
      });
  
      parentComment.replies.push(replyComment._id);
      await parentComment.save();
  
      blogpost.comments.push(replyComment._id);
      await blogpost.save();
  
      res.status(201).json({
        message: "Yanıt başarıyla eklendi.",
        reply: replyComment,
      });
    } catch (error) {
      console.error("Yanıt eklenirken hata:", error.message);
      res.status(500).json({
        message: "Yanıt eklenirken sunucu hatası.",
        error: error.message,
      });
    }
  };
  
  // Yorum düzenleme
  const editComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
  
      if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Yorum içeriği boş olamaz." });
      }
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Yorum bulunamadı." });
      }
  
      if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Yorumu düzenleme yetkiniz yok." });
      }
  
      comment.content = content;
      await comment.save();
  
      res.status(200).json({
        message: "Yorum başarıyla düzenlendi.",
        comment,
      });
    } catch (error) {
      console.error("Yorum düzenlenirken hata:", error.message);
      res.status(500).json({
        message: "Yorum düzenlenirken sunucu hatası.",
        error: error.message,
      });
    }
  };
  
  // Yorum silme
  const deleteComment = async (req, res) => {
    try {
      const { commentId, postId } = req.params;
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Yorum bulunamadı." });
      }
  
      if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Yorumu silme yetkiniz yok." });
      }
  
      await Comment.findByIdAndDelete(commentId);
  
      // Blog gönderisinden yorumu kaldır
      await Blogpost.findByIdAndUpdate(postId, {
        $pull: { comments: commentId },
      });
  
      res.status(200).json({ message: "Yorum başarıyla silindi." });
    } catch (error) {
      console.error("Yorum silinirken hata:", error.message);
      res.status(500).json({
        message: "Yorum silinirken sunucu hatası.",
        error: error.message,
      });
    }
  };
  
  module.exports = {
    addComment,
    replyToComment,
    editComment,
    deleteComment,
  };