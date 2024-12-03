const Blogpost = require("../models/BlogPost");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require('path');
const Comment = require("../models/Comment");
const User = require("../models/User");

// Blog gönderisi ekleme
const addBlogPost = async (req, res) => {
  try {
    const { title, category, tags, contentBlocks } = req.body;

    // contentBlocks'u JSON formatında çözümle
    const parsedContentBlocks = JSON.parse(contentBlocks || "[]");

    // Görselleri sıraya koyarak işleme
    let imageFiles = req.files; // Tüm görselleri buradan alacağız

    const processedBlocks = parsedContentBlocks.map((block) => {
      if (block.type === "image") {
        const file = imageFiles.shift(); // Sıradaki görseli al
        if (file) {
          return {
            type: "image",
            content: `/uploads/${file.filename}`, // Görselin kaydedildiği URL
          };
        } else {
          throw new Error("Görsel dosyası eksik.");
        }
      }
      return block; // Metin bloklarını olduğu gibi ekle
    });

    // Yeni blog gönderisini oluştur
    const newBlogPost = new Blogpost({
      title,
      category,
      tags: tags.split(","),
      contentBlocks: processedBlocks,
      author: req.user.id,
    });

    const savedBlogPost = await newBlogPost.save();

    res.status(201).json({
      message: "Blog gönderisi başarıyla oluşturuldu.",
      blogpost: savedBlogPost,
    });
  } catch (error) {
    console.error("Sunucu Hatası:", error.message);
    res.status(500).json({ message: "Sunucu hatası.", error: error.message });
  }
};

// Tüm blogpostları getirme
const fetchBlogList = async (req, res) => {
  try {
    const blogPosts = await Blogpost.find()
      .select("_id title category createdAt contentBlocks")
      .sort({ createdAt: -1 }); // Yeni gönderileri önce getirmek için sıralama

    res.status(200).json({
      message: "Tüm blog gönderileri başarıyla alındı.",
      blogPosts,
    });
  } catch (error) {
    console.error("Tüm blog gönderileri alınırken hata:", error.message);
    res.status(500).json({
      message: "Sunucu hatası. Blog gönderileri alınamadı.",
      error: error.message,
    });
  }
};

// Blog gönderisi güncelleme-1
// const updateBlogPost = async (req, res) => {
//   try {
//       const { id } = req.params;

//       // Blogpost'u bulun
//       const blogPost = await Blogpost.findById(id);
//       if (!blogPost) {
//           return res.status(404).json({ message: 'Blog gönderisi bulunamadı.' });
//       }

//       // Gelen ContentBlocks'u işleyin
//       const parsedContentBlocks = JSON.parse(req.body.contentBlocks);
//       const updatedContentBlocks = [];

//       // Yeni yüklenen resimleri kontrol edin
//       if (req.files && req.files['images']) {
//           const uploadedImages = req.files['images'];

//           // ContentBlocks içindeki image türündeki blokları işle
//           parsedContentBlocks.forEach((block) => {
//               if (block.type === 'image') {
//                   const oldImagePath = path.join(__dirname, '..', '..', block.content);

//                   // Eski görseli sil
//                   if (fs.existsSync(oldImagePath)) {
//                       try {
//                           fs.unlinkSync(oldImagePath);
//                           console.log(`Eski resim silindi: ${oldImagePath}`);
//                       } catch (err) {
//                           console.error(`Eski resmi silerken hata: ${err.message}`);
//                       }
//                   }

//                   // Yeni görseli ekle
//                   const newImage = uploadedImages.shift(); // Sıradaki yüklenen görseli al
//                   updatedContentBlocks.push({
//                       type: 'image',
//                       content: `/uploads/${newImage.filename}`,
//                   });
//               } else {
//                   // Text blokları olduğu gibi ekle
//                   updatedContentBlocks.push(block);
//               }
//           });
//       } else {
//           // Eğer görsel yüklenmemişse, text blokları olduğu gibi ekle
//           parsedContentBlocks.forEach((block) => {
//               updatedContentBlocks.push(block);
//           });
//       }

//       // Blogpost'u güncelle
//       blogPost.title = req.body.title || blogPost.title;
//       blogPost.category = req.body.category || blogPost.category;
//       blogPost.tags = req.body.tags ? req.body.tags.split(',') : blogPost.tags;
//       blogPost.contentBlocks = updatedContentBlocks;

//       await blogPost.save();

//       return res.status(200).json({
//           message: 'Blog gönderisi başarıyla güncellendi.',
//           blogPost,
//       });
//   } catch (error) {
//       console.error('Blog güncelleme hatası:', error);
//       res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
//   }
// };

//Blog gönderisi güncelleme-2
const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, tags, contentBlocks } = req.body;

    // Güncellenecek blogpost'u bulun
    const blogPost = await Blogpost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog gönderisi bulunamadı." });
    }

    // Eski blogpost'u sil
    await Blogpost.deleteOne({ _id: id });

    // contentBlocks'u JSON formatında çözümle
    const parsedContentBlocks = JSON.parse(contentBlocks || "[]");

    // Görselleri sıraya koyarak işleme
    let imageFiles = req.files || []; // Yüklenen tüm görseller
    const processedBlocks = parsedContentBlocks.map((block) => {
      if (block.type === "image") {
        const file = imageFiles.shift(); // Sıradaki görseli al
        if (file) {
          return {
            type: "image",
            content: `/uploads/${file.filename}`, // Yeni görselin yolu
          };
        } else {
          throw new Error("Görsel dosyası eksik.");
        }
      }
      return block; // Metin bloklarını olduğu gibi ekle
    });

    // Yeni içerikle blogpost'u oluştur
    const updatedBlogPost = new Blogpost({
      _id: id, // Eski id'yi koruyoruz
      title: title || blogPost.title,
      category: category || blogPost.category,
      tags: tags ? tags.split(",") : blogPost.tags,
      contentBlocks: processedBlocks,
      author: blogPost.author, // Orijinal yazar bilgisi korunuyor
    });

    const savedBlogPost = await updatedBlogPost.save();

    res.status(200).json({
      message: "Blog gönderisi başarıyla güncellendi.",
      blogPost: savedBlogPost,
    });
  } catch (error) {
    console.error("Blog güncelleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası.", error: error.message });
  }
};


// Blog gönderisini sil
const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Blog gönderisini bul
    const blogPost = await Blogpost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog gönderisi bulunamadı." });
    }

    // Kullanıcının yetkisi var mı kontrol et
    if (
      blogPost.author.toString() !== req.user.id &&
      !req.user.roles.includes("admin")
    ) {
      return res.status(403).json({ message: "Bu işlemi yapmaya yetkiniz yok." });
    }

    // Blog gönderisine bağlı yorumları sil
    await Comment.deleteMany({ post: id });

    // Blog gönderisini sil
    await blogPost.remove();

    res.status(200).json({ message: "Blog gönderisi başarıyla silindi." });
  } catch (error) {
    console.error("Blog gönderisi silinirken hata:", error.message);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Blog gönderisi silinemedi.", error: error.message });
  }
};

// Blog gönderilerini filtreleme

const discoverBlogPosts = async (req, res) => {
  try {
    const { nickname, category, tags } = req.query;

    let query = {};

    // 1. Yazarın Nickname'ine Göre Filtreleme
    if (nickname && nickname.trim() !== '') {
      const user = await User.findOne({ nickname: nickname.trim() });
      if (!user) {
        return res.status(404).json({ message: 'Belirtilen yazar bulunamadı.' });
      }
      query.author = user._id;
    }

    // 2. Kategoriye Göre Filtreleme
    if (category && category.trim() !== '') {
      // category bir string olduğundan doğrudan sorguya ekleyebiliriz
      query.category = category.trim();
    }

    // 3. Etiketlere Göre Filtreleme
    if (tags && tags.trim() !== '') {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      if (tagsArray.length > 0) {
        // tags bir string dizisi olduğundan $in operatörü ile sorgulayabiliriz
        query.tags = { $in: tagsArray };
      }
    }

    // Sorguyu Kontrol Etmek İçin Loglama
    console.log('Query:', query);

    // 4. Blogpost'ları Sorgulama
    const blogposts = await Blogpost.find(query)
      .populate('author', 'nickname');

    res.json(blogposts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getBlogPostById = async(req, res)=>{
  try {
    console.log("Blog ID:", req.params.id);
  
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    console.log("ID Geçerli mi?:", isValidId);
  
    if (!isValidId) {
      return res.status(400).json({ message: "Geçersiz ID formatı." });
    }
  
    const blogPost = await Blogpost.findById(req.params.id).populate({
      path: "comments",
      populate: {
        path: "author",
        select: "nickname email", // Gerekli alanlar
      },
    })
    .populate("author", "nickname email");
    console.log("Veritabanı Sorgusu Tamamlandı:", blogPost);
  
    if (!blogPost) {
      return res.status(404).json({ message: "Blog gönderisi bulunamadı." });
    }
  
    res.status(200).json(blogPost);
  } catch (error) {
    console.error("Blog detayı hatası:", error.message);
    res.status(500).json({ message: "Sunucu hatası.", error: error.message });
  }
};

const toggleCommentLike = async (req, res) => {
  try {
    const { postId, commentId } = req.params; // Blogpost ve yorum ID'leri
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı." });
    }

    // Kullanıcı daha önce beğendiyse, beğeniyi kaldır
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((like) => like.toString() !== userId.toString());
    } else {
      // Beğeniyi ekle
      comment.likes.push(userId);
    }

    await comment.save();
    res.status(200).json({ message: "Yorum beğenisi güncellendi.", likes: comment.likes });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası.", error: error.message });
  }
};

const toggleBlogPostLike = async (req, res) => {
  try {
    const { id } = req.params; // Blogpost ID
    const userId = req.user._id; // Oturum açan kullanıcı ID'si

    const blogpost = await Blogpost.findById(id);
    if (!blogpost) {
      return res.status(404).json({ message: "Blog gönderisi bulunamadı." });
    }

    // Kullanıcı daha önce beğendiyse, beğeniyi kaldır
    if (blogpost.likes.includes(userId)) {
      blogpost.likes = blogpost.likes.filter((like) => like.toString() !== userId.toString());
    } else {
      // Beğeniyi ekle
      blogpost.likes.push(userId);
    }

    await blogpost.save();
    res.status(200).json({ message: "Beğeni güncellendi.", likes: blogpost.likes });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası.", error: error.message });
  }
};


module.exports = {
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById,
  fetchBlogList,
  toggleCommentLike,
  toggleBlogPostLike,
  discoverBlogPosts
};