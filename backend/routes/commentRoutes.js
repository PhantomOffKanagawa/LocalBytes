const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// POST create a new comment
router.post('/', commentController.createComment);

// GET comments for a specific restaurant by place_id
router.get('/place/:placeId', commentController.getCommentsByPlaceId);

// PUT update a comment
router.put('/:commentId', commentController.updateComment);

// DELETE delete a comment
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;
