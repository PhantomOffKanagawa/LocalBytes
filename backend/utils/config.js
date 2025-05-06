module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  GMAPS_API_KEY: process.env.GMAPS_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:4200',
};
