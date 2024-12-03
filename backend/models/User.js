const mongoose = require("mongoose");

//Kullanıcı şeması:
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercas: true,
    },
    password: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: null, //İlk etapta profil fotoğrafı yok.
    },
    isVerified: {
      type: Boolean,
      default: false, //E-posta doğrulama varsayılan olarak false
    },
    role: {
      type: String,
      enum: ["user","admin"], //Kullanıcı veya admin olunabilir.
      default: "user", //
    },
  },
  {
    timestamps: true, //createdAt ve updatedAt otomatik olarak eklenir.
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;