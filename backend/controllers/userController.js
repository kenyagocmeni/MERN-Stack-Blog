const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Blogpost = require("../models/BlogPost");
const fs = require("fs");
const { default: mongoose } = require("mongoose");


// Kullanıcı kaydı
const registerUser = async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password || !nickname) {
      return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bu e-posta ile zaten kayıt olunmuş." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      nickname,
    });

    await newUser.save();

    res.status(201).json({
      message: "Kullanıcı başarıyla kaydedildi.",
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası.", error: error.message });
  }
};

// Kullanıcı girişi
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Lütfen e-posta ve şifre girin." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Yanlış şifre." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Giriş başarılı.",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası.", error: error.message });
  }
};

//Kullanıcı çıkışı:


// Kullanıcı profili görüntüleme
// const getUserProfile = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findById(id).select("nickname profileImage");
//     if (!user) {
//       return res.status(404).json({ message: "Kullanıcı bulunamadı." });
//     }

//     const userBlogposts = await Blogpost.find({ author: id }).select(
//       "title content createdAt tags category"
//     );

//     res.status(200).json({
//       message: "Kullanıcı bilgileri:",
//       user: {
//         nickname: user.nickname,
//         email: user.email,
//         profileImage: user.profileImage || null,
//         blogposts: userBlogposts,
//       },
//     });
//   } catch (error) {
//     console.log("oooo")
//     res.status(500).json({ message: "Sunucu hatası.", error: error.message });
//   }
// };

// Kullanıcı profili güncelleme
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { nickname, email } = req.body;
    let updateData = { nickname, email };

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`; // Dosya yolu
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({ message: "Profil başarıyla güncellendi.", user });
  } catch (error) {
    console.error("Profil güncellenirken hata:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Kullanıcı profili görüntüleme
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Backend'e gelen ID:", id); // Gelen ID'yi kontrol edin

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Geçersiz veya eksik ID." });
    }

    const user = await User.findById(id).select("nickname email createdAt profileImage");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({
      message: "Kullanıcı bilgileri alındı.",
      user,
    });
  } catch (error) {
    console.error("Kullanıcı profili alınırken hata:", error.message);
    res.status(500).json({
      message: "Sunucu hatası. Kullanıcı bilgileri alınamadı.",
      error: error.message,
    });
  }
};

// Admin tarafından kullanıcı silme
const deleteUserAccount = async (req, res) => {
    try {
      const { id } = req.params; // Hedef kullanıcı ID'si
      const userId = req.user.id; // Giriş yapan kullanıcının ID'si
  
      // Yetki kontrolü: Kullanıcı kendi hesabını mı siliyor, yoksa admin mi?
      if (req.user.role !== "admin" && req.user.id !== id) {
        return res.status(403).json({
          message: "Bu işlem için yetkiniz yok.",
        });
      }
  
      // Hedef kullanıcıyı bul
      const targetUser = await User.findById(id || userId);
      if (!targetUser) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı." });
      }
  
      // Hedef kullanıcıyı sil
      await User.findByIdAndDelete(id || userId);
  
      res.status(200).json({
        message: id ? "Hedef kullanıcı başarıyla silindi." : "Hesap başarıyla silindi.",
      });
    } catch (error) {
      res.status(500).json({ message: "Sunucu hatası.", error: error.message });
    }
  };

// Kullanıcının blog yazılarını getirme
const getUserBlogPosts = async (req, res) => {
  try {
    const { id } = req.params;

    // ID'nin geçerliliğini kontrol et
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Geçersiz ID formatı." });
    }

    // Kullanıcıyı kontrol et
    const user = await User.findById(id).select("_id");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // Kullanıcının blog yazılarını al
    const userBlogPosts = await Blogpost.find({ author: id }).select(
      "_id title category createdAt contentBlocks" // contentBlocks alanını dahil ettik
    );

    res.status(200).json({
      message: "Kullanıcının blog yazıları alındı.",
      blogPosts: userBlogPosts,
    });
  } catch (error) {
    console.error("Kullanıcı blog yazıları alınırken hata:", error.message);
    res.status(500).json({
      message: "Sunucu hatası. Blog yazıları alınamadı.",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUserBlogPosts,
  deleteUserAccount,
  updateUserProfile,
};