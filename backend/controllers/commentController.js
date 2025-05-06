const Comment = require('../models/Comment');

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { body, place_id, uuid } = req.body;

  if (!body || !place_id || !uuid) {
    return res.status(400).json({ error: "Missing required fields" });
  }
    
    // TODO: Use actual UUID generation instead of Math.random()
    const comment_id = Math.floor(Math.random() * 1_000_000); // Simple unique ID for now
    
    const newComment = new Comment({
      body,
      place_id,
      uuid,
      comment_id,
      datetime: new Date()
    });
    
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    console.error("Error creating comment:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get comments for a specific restaurant
const getCommentsByPlaceId = async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({ error: "Missing placeId" });
    }

    const comments = await Comment.find({ place_id: placeId }).sort({ datetime: -1 });
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
    throw new Error("Not implemented yet");
};

// Delete a comment
const deleteComment = async (req, res) => {
    throw new Error("Not implemented yet");
};

module.exports = {
  createComment,
  getCommentsByPlaceId,
  updateComment,
  deleteComment
};
