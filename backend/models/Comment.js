const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment_id: { type: String, unique: true, default: () => new mongoose.Types.ObjectId().toString() },
    body: { type: String, required: true },
    place_id: { type: String, required: true },
    // Set select to false as by default we don't want to expose the uuid token
    uuid: { type: String, required: true, select: false },
  },
  {
    collection: "comments",
    // Add createdAt and updatedAt timestamps
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
