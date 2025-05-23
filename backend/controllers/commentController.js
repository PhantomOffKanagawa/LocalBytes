const Comment = require("../models/Comment");
const { getUserUuidFromToken } = require("../utils/helpers");

// Create a new comment
const createComment = async (req, res) => {
  try {
    console.log("Creating comment:", req.body);
    const { body, place_id, token } = req.body;

    if (!body || !place_id || !token) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const uuid = getUserUuidFromToken(token);

    // Check if the token is valid and contains a uuid
    if (!uuid) {
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log("Creating comment with token:", token);
    console.log("Decoded UUID:", uuid);

    const newComment = new Comment({
      body,
      place_id,
      uuid,
    });

    const savedComment = await newComment.save();
    delete savedComment.uuid; // Remove uuid from the response
    console.log("Saved comment:", savedComment);
    res.status(201).json(savedComment);
  } catch (err) {
    console.error("Error creating comment:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get comments for a specific restaurant
const getCommentsByPlaceId = async (req, res) => {
  try {
    // Extract placeId from the request parameters
    const { placeId } = req.params;

    // Extract the token from the request headers
    // The token is expected to be in the format "Bearer <token>"
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];

    // Check if placeId is provided
    if (!placeId) {
      return res.status(400).json({ error: "Missing placeId" });
    }

    // Decode the token to get the user UUID
    const uuid = getUserUuidFromToken(token);

    // If token is not provided, fetch comments without uuid
    // If token is provided, fetch comments with uuid, determine if owner, and remove uuid
    let comments = [];

    if (uuid) {
      // If token is provided, fetch comments with uuid
      comments = await Comment.find({ place_id: placeId })
        .sort({
          datetime: -1,
        })
        .select("+uuid")
        .lean();

      // Map comments to include owner status
      comments = comments.map((comment) => {
        // Check if the comment belongs to the user
        const isOwner = comment.uuid === uuid;
        // Remove uuid from the comment object
        delete comment.uuid;
        // Return the comment with owner status
        return { ...comment, owner: isOwner };
      });
    } else {
      // If no token is provided, return comments without uuid
      comments = await Comment.find({ place_id: placeId }).sort({
        datetime: -1,
      });
    }

    // Return the comments
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    console.log("Updating comment:", req.body);
    const { id } = req.params;
    const { newBody, token } = req.body;

    if (!newBody || !token || !id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const uuid = getUserUuidFromToken(token);

    // Check if the token is valid and contains a uuid
    if (!uuid) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Either update the existing comment or create a new one if it doesn't exist
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: id },
      {
        body: newBody,
      }
    );

    res.status(200).json(updatedComment);
  } catch (err) {
    console.error("Error updating comment:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    console.log("Deleting comment:", req.body);
    const { id } = req.params;
    const { token } = req.body;

    if (!id || !token) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const uuid = getUserUuidFromToken(token);

    // Check if the token is valid and contains a uuid
    if (!uuid) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const deletedComment = await Comment.findOneAndDelete({ _id: id, uuid });

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(204).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createComment,
  getCommentsByPlaceId,
  updateComment,
  deleteComment,
};
