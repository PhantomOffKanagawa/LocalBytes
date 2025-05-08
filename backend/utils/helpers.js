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

module.exports = {
    getUserUuidFromToken,
};