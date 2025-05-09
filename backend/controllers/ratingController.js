const Rating = require("../models/Rating");
const Restaurant = require("../models/Restaurant");
const { getUserUuidFromToken } = require("../utils/helpers");

// Helper function to update restaurant rating
const updateRestaurantRating = async (place_id) => {
  try {
    // Get all ratings for this restaurant
    const ratings = await Rating.find({ place_id });
    
    // Calculate average rating
    const totalRating = ratings.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = ratings.length > 0 ? (totalRating / ratings.length) : 0;
    
    // Update restaurant with new rating and total number of ratings
    await Restaurant.findOneAndUpdate(
      { place_id },
      { 
        rating: Number(averageRating.toFixed(1)),
        user_ratings_total: ratings.length
      }
    );

    console.log(`Updated restaurant ${place_id} rating to ${averageRating.toFixed(1)}`);

    return { average_rating: averageRating.toFixed(1), total_ratings: ratings.length };
  } catch (err) {
    console.error("Error updating restaurant rating:", err.message);
    return { error: err.message };
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
    });    

    // Update the restaurant's overall rating
    const newRestaurantRating = await updateRestaurantRating(place_id);

    const savedRating = await newRating.save();
    res.status(201).json({ ...savedRating.toObject(), ...newRestaurantRating });
  } catch (err) {
    console.error("Error creating rating:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update a rating
const updateRating = async (req, res) => {
  try {
    console.log("Updating rating:", req.body);
    const { rating, place_id, token } = req.body;

    if (!rating || !place_id || !token) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const uuid = getUserUuidFromToken(token);

    // Check if the token is valid and contains a uuid
    if (!uuid) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Either update the existing rating or create a new one if it doesn't exist
    // The unique index on place_id and uuid ensures that only one rating per user per place exists
    const updatedRating = await Rating.findOneAndUpdate(
      { place_id, uuid },
      { 
        rating,
      },
      { 
        // Is new necessary?
        new: true,
        upsert: true
      }
    );    

    // Update the restaurant's overall rating
    const newRestaurantRating = await updateRestaurantRating(place_id);

    res.status(200).json({ ...updatedRating.toObject(), ...newRestaurantRating });
  } catch (err) {
    console.error("Error updating rating:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRatingsByPlaceId,
  createRating,
  updateRating,
};
