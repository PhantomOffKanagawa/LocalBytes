const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");

/**
 * @api {get} /api/ratings/place/:placeId Get ratings for a specific restaurant by place_id
 * @apiDescription Get all ratings for a specific restaurant using its Google Place ID. Includes owner to determine if the user is the owner of the rating if authorization header is provided.
 * @apiName GetRatingsByPlaceId
 * @apiGroup Rating
 *
 * @apiParam {String} placeId Google Place ID of the restaurant
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "placeId": "ChIJ6aBmh5y33IcRxEkvNZCW_gQ"
 *     }
 *   }
 * @apiSuccess {Object[]} ratings List of ratings for the restaurant
 * @apiSuccess {String} ratings._id MongoDB id of the rating
 * @apiSuccess {Number} ratings.rating Rating of the restaurant
 * @apiSuccess {String} ratings.place_id Google Place ID of the restaurant
 * @apiSuccess {Date} ratings.created_at Creation timestamp
 *
 * @apiSuccessExample {json} Success-Response:
 *    [
 *      {
 *        "rating": 5.0,
 *        "datetime": "2025-05-06T23:32:13.958Z",
 *        "place_id": "ChIJ6aBmh5y33IcRxEkvNZCW_gQ",
 *        "_id": "681a9bfd54e9712a49f38e30",
 *        "createdAt": "2025-05-06T23:32:13.965Z",
 *        "updatedAt": "2025-05-06T23:32:13.965Z",
 *        "__v": 0
 *      }
 *    ]
 */
router.get("/place/:placeId", ratingController.getRatingsByPlaceId);

/**
 * @api {post} /api/ratings Create a new rating
 * @apiName CreateRating
 * @apiGroup Rating
 *
 * @apiBody {Float} rating Rating of the restaurant
 * @apiBody {String} place_id Google Place ID of the restaurant
 * @apiBody {String} token User token
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "rating": 5.0,
 *       "place_id": "ChIJ6aBmh5y33IcRxEkvNZCW_gQ",
 *       "token": "user123_uuid"
 *     }
 *
 * @apiSuccess {Object} review Created review
 * @apiSuccess {String} review._id MongoDB id of the review
 * @apiSuccess {Float} review.rating Rating of the review
 * @apiSuccess {String} review.place_id Google Place ID of the restaurant
 * @apiSuccess {Date} review.created_at Creation timestamp
 *
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "rating": 5.0,
 *      "datetime": "2025-05-06T23:32:13.958Z",
 *      "place_id": "ChIJ6aBmh5y33IcRxEkvNZCW_gQ",
 *      "_id": "681a9bfd54e9712a49f38e30",
 *      "createdAt": "2025-05-06T23:32:13.965Z",
 *      "updatedAt": "2025-05-06T23:32:13.965Z",
 *      "__v": 0
 *    }
 */
router.post("/", ratingController.createRating);

// PUT update a rating
router.put("/", ratingController.updateRating);

// DELETE delete a rating
router.delete("/", ratingController.deleteRating);

module.exports = router;
