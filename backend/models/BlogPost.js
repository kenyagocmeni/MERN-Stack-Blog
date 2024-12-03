const mongoose = require("mongoose");

const blogpostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: null, // Eski içerik alanı, hala kullanılabilir ama artık opsiyonel
    },
    contentBlocks: [
      {
        type: {
          type: String,
          enum: ["text", "image"], // Metin veya görsel bloğu
          required: true,
        },
        content: {
          type: String, // Metin içeriği veya görselin URL'si
          required: true,
        },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Kültür",
        "Sanat",
        "Edebiyat",
        "Spor",
        "Film ve Dizi",
        "Gündem",
        "Teknoloji",
        "Girişimcilik",
        "Finans",
        "Kariyer",
        "Gezi ve Seyahat",
        "Sağlık",
        "Moda ve Stil",
        "Kişisel Gelişim",
        "Müzik",
        "Oyun",
        "Yemek",
        "El Sanatları",
        "Çevre ve Doğa",
        "Sosyal Sorumluluk",
        "Tarih",
        "Eğitim",
        "Bilim",
        "Teknik Bilgiler",
        "Mizah",
        "Günlük Yaşam",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Blogpost = mongoose.model("Blogpost", blogpostSchema);

module.exports = Blogpost;