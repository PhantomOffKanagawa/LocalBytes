const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    body: { type: String, required: true },
    datetime: { type: Date, default: Date.now },
    place_id: { type: String, required: true },
    uuid: { type: String, required: true },
    comment_id: { type: Number, unique: true },
  },
  {
    collection: "comments",
    // Add createdAt and updatedAt timestamps
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
