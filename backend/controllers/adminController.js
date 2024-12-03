const User = require('../models/User');
const Blogpost = require('../models/BlogPost');

const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Kullanıcı adı gerekli.' });
    }

    const user = await User.findOne({ nickname: username.trim() });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Kullanıcı arama hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};

const searchBlogPosts = async (req, res) => {
  try {
    const { author, category, title } = req.query;

    let query = {};

    // Yazar
    if (author && author.trim() !== '') {
      const user = await User.findOne({ nickname: author.trim() });
      if (!user) {
        return res.status(404).json({ message: 'Belirtilen yazar bulunamadı.' });
      }
      query.author = user._id;
    }

    // Kategori
    if (category && category.trim() !== '') {
      query.category = category.trim();
    }

    // Başlık
    if (title && title.trim() !== '') {
      query.title = { $regex: title.trim(), $options: 'i' }; // Büyük/küçük harf duyarsız arama
    }

    const blogposts = await Blogpost.find(query).populate('author', 'nickname');

    if (blogposts.length === 0) {
      return res.status(404).json({ message: 'Blog gönderileri bulunamadı.' });
    }

    res.json(blogposts);
  } catch (error) {
    console.error('Blog gönderisi arama hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};

module.exports = {searchBlogPosts, searchUsers};