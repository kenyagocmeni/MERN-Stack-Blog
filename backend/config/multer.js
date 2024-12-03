const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Uploads klasörünün varlığını kontrol et ve oluştur
const uploadDirectory = "uploads";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Disk Storage Konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Dosya yükleme klasörü
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Benzersiz ad
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Benzersiz dosya adı
  },
});

// MIME Türlerini Filtrele
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Sadece görüntü dosyalarını kabul et
  } else {
    cb(new Error("Unsupported file type. Only images are allowed."), false); // Desteklenmeyen dosya türü
  }
};

// Multer Yükleme Ayarları
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimum dosya boyutu: 5 MB
});

module.exports = upload;
