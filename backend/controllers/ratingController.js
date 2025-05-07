const Rating = require("../models/Rating");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

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

// Get ratings for a specific restaurant
const getRatingsByPlaceId = async (req, res) => {
  try {
    // Extract placeId from the request parameters
    const { placeId } = req.params;

    // Validate placeId
    if (!placeId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find ratings by place_id
    const ratings = await Rating.find({ place_id: placeId })
      .select("-__v -uuid")
      .sort({ datetime: -1 });

    // Check if ratings exist
    if (!ratings || ratings.length === 0) {
      return res.status(404).json({ error: "No ratings found" });
    }

    res.status(200).json(ratings);
  } catch (err) {
    console.error("Error fetching ratings:", err.message);
    res.status(500).json({ error: err.message });
  }
}

// Create a new rating
const createRating = async (req, res) => {
  try {
    console.log("Creating rating:", req.body);
    const { rating, place_id, token } = req.body;

    if (!rating || !place_id || !token) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const uuid = getUserUuidFromToken(token);

    // Check if the token is valid and contains a uuid
    if (!uuid) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const newRating = new Rating({
      rating,
      place_id,
      uuid,
      datetime: new Date(),
    });

    const savedRating = await newRating.save();
    res.status(201).json(savedRating);
  } catch (err) {
    console.error("Error creating rating:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update a rating
const updateRating = async (req, res) => {
  throw new Error("Not implemented yet");
};

// Delete a rating
const deleteRating = async (req, res) => {
  throw new Error("Not implemented yet");
};

module.exports = {
  getRatingsByPlaceId,
  createRating,
  updateRating,
  deleteRating,
};
