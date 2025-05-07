const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    // Rating value between 0 and 5
    rating: { type: Number, required: true, min: 0, max: 5 },
    datetime: { type: Date, default: Date.now },
    place_id: { type: String, required: true },
    // Set select to false as by default we don't want to expose the uuid token
    uuid: { type: String, required: true, select: false },
  },
  {
    collection: "ratings",
    // Add createdAt and updatedAt timestamps
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Rating || mongoose.model("Rating", ratingSchema);
