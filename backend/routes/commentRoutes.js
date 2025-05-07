const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

/**
 * @api {post} /api/comments Create a new comment
 * @apiName CreateComment
 * @apiGroup Comment
 *
 * @apiBody {String} body Content of the comment
 * @apiBody {String} place_id Google Place ID of the restaurant
 * @apiBody {String} token User token
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "body": "This restaurant is amazing!",
 *       "place_id": "ChIJ6aBmh5y33IcRxEkvNZCW_gQ",
 *       "token": "user123_uuid"
 *     }
 *
 * @apiSuccess {Object} comment Created comment
 * @apiSuccess {String} comment._id MongoDB id of the comment
 * @apiSuccess {String} comment.body Content of the comment
 * @apiSuccess {String} comment.place_id Google Place ID of the restaurant
 * @apiSuccess {Date} comment.created_at Creation timestamp
 *
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "body": "This restaurant is amazing!",
 *      "datetime": "2025-05-06T23:32:13.958Z",
 *      "place_id": "ChIJ6aBmh5y33IcRxEkvNZCW_gQ",
 *      "comment_id": 598664,
 *      "_id": "681a9bfd54e9712a49f38e30",
 *      "createdAt": "2025-05-06T23:32:13.965Z",
 *      "updatedAt": "2025-05-06T23:32:13.965Z",
 *      "__v": 0
 *    }
 */
router.post("/", commentController.createComment);

/**
 * @api {get} /api/comments/place/:placeId Get comments for a specific restaurant by place_id
 * @apiDescription Get all comments for a specific restaurant using its Google Place ID. Includes owner to determine if the user is the owner of the comment if authorization header is provided.
 * @apiName GetCommentsByPlaceId
 * @apiGroup Comment
 *
 * @apiParam {String} placeId Google Place ID of the restaurant
 * @apiHeader {String} [Authorization] Optional Bearer token ("Bearer <token>")
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "placeId": "ChIJ6aBmh5y33IcRxEkvNZCW_gQ"
 *     }
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     }
 *
 * @apiSuccess {Object[]} comments List of comments for the restaurant
 * @apiSuccess {String} comments._id MongoDB id of the comment
 * @apiSuccess {String} comments.body Content of the comment
 * @apiSuccess {String} comments.place_id Google Place ID of the restaurant
 * @apiSuccess {Date} comments.created_at Creation timestamp
 * @apiSuccess {Boolean\|undefined} comments.owner Indicates if the user is the owner of the comment (if token is provided)
 *
 * @apiSuccessExample {json} Success-Response:
 *    [
 *      {
 *        "body": "This restaurant is amazing!",
 *        "datetime": "2025-05-06T23:32:13.958Z",
 *        "place_id": "ChIJ6aBmh5y33IcRxEkvNZCW_gQ",
 *        "comment_id": 598664,
 *        "_id": "681a9bfd54e9712a49f38e30",
 *        "createdAt": "2025-05-06T23:32:13.965Z",
 *        "updatedAt": "2025-05-06T23:32:13.965Z",
 *        "__v": 0
 *      }
 *    ]
 */
router.get("/place/:placeId", commentController.getCommentsByPlaceId);

// PUT update a comment
router.put("/:commentId", commentController.updateComment);

// DELETE delete a comment
router.delete("/:commentId", commentController.deleteComment);

module.exports = router;
