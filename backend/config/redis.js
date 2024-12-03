const Redis = require("ioredis")

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1", // Redis sunucu adresi (varsayılan: localhost)
  port: process.env.REDIS_PORT || 6379,       // Redis portu (varsayılan: 6379)
  password: process.env.REDIS_PASSWORD || null, // Eğer Redis şifresi varsa buraya ekleyin
  db: 0, // Kullanılacak Redis veritabanı (varsayılan: 0)
});

// Redis bağlantı hatalarını dinleyin
redisClient.on("error", (err) => {
  console.error("Redis bağlantı hatası:", err.message);
});

// Redis bağlantı kurulumunun başarılı olduğunu gösterir
redisClient.on("connect", () => {
  console.log("Redis sunucusuna bağlandı.");
});

module.exports = redisClient;
