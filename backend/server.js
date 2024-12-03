const app = require('./app'); // app.js'ten uygulama nesnesini al

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
