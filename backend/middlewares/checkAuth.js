const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token gerekli." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı veritabanından bul
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    req.user = user; // Kullanıcı bilgilerini req'e ekle
    next();
  } catch (error) {
    res.status(401).json({ message: "Geçersiz token.", error: error.message });
  }
};

// Rol kontrolü için ayrı bir middleware
const roleAuth = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Bu işlem için yetkiniz yok." });
    }
    next();
  };
};

module.exports = { checkAuth, roleAuth };
