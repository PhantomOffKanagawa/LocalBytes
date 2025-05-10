const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

// Helper function to get user uuid from token
const getUserUuidFromToken = (token) => {
  // Check if token is provided and is a string
  if (!token || typeof token !== "string") {
    console.error("Token is missing or invalid");
    return null;
  }

  try {
    // Decode the token using the JWT secret
    const decoded = jwt.verify(token, JWT_SECRET);
    // Return the uuid from the decoded token
    return decoded.uuid;
  } catch (err) {
    console.error("Error decoding token:", err.message);
    return null;
  }
};

const fs = require("fs");
const axios = require("axios");

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );

module.exports = {
    getUserUuidFromToken,
    download_image,
};