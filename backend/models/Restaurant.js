const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    location: {
      lat: Number,
      lng: Number,
    },
    icon: String,
    icon_background_color: String,
    icon_mask_base_uri: String,
    opening_hours: {
      open_now: Boolean,
    },
    photos: String,
    rating: Number,
    price_level: Number,
    place_id: { type: String, unique: true },
    user_ratings_total: Number,
    types: [String],
    google_maps_url: String,
  },
  {
    collection: "restaurants",
    // Add createdAt and updatedAt timestamps
    timestamps: true,
  },
);

restaurantSchema.index({ name: 1 }, { unique: true });

module.exports =
  mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);
