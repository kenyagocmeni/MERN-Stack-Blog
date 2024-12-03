const express = require('express');
const connectDB = require('./config/db'); // Veritabanı bağlantısı
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware'ler
app.use(express.json()); // JSON verilerini parse etmek için
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Frontend'in URL'sini belirtiyoruz
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // İzin verilen HTTP metodları
    credentials: true, // Cookie gönderimini desteklemek için
})); // CORS politikalarını yönetmek için
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Yüklenen dosyalar için statik erişim

// Veritabanı bağlantısını kur
connectDB();

const userRoutes = require('./routes/userRoutes');
const blogPostRoutes = require('./routes/blogPostRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
//const likeRoutes = require('./routes/likeRoutes');

app.use('/api/users', userRoutes);
app.use('/api/blogposts', blogPostRoutes);
app.use('/api/admin', adminRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;