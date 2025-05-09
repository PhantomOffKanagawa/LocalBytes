const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

/**
 * @api {get} /api/restaurants Get all restaurants
 * @apiName GetRestaurants
 * @apiGroup Restaurant
 * 
 * @apiHeader {String} [Authorization] Optional Bearer token ("Bearer <token>")
 *
 * @apiHeaderExample {json} Header-Example:
 *   {
 *    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * 
 * @apiSuccess {Object[]} restaurants List of restaurant objects
 * @apiSuccess {Float\|undefined} restaurants.rating Rating of the restaurant (if available and token passed)
 *
 * @apiSuccessExample {json} Success-Response:
 * [
 *   {
 *     "location": {
 *       "lat": 38.9976371,
 *       "lng": -92.2793135
 *     },
 *     "opening_hours": {
 *       "open_now": false
 *     },
 *     "_id": "681cdf207b8f3cc8ec9d62c0",
 *     "name": "Como Smoke and Fire",
 *     "address": "4600 Paris Rd #102, Columbia, MO 65202, United States",
 *     "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
 *     "icon_background_color": "#FF9E67",
 *     "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet",
 *     "photos": "None",
 *     "rating": 0,
 *     "price_level": 2,
 *     "place_id": "ChIJFR7vaLfH3IcRUXM5F0POQ_0",
 *     "user_ratings_total": 0,
 *     "types": [
 *       "restaurant",
 *       "food",
 *       "point_of_interest",
 *       "establishment"
 *     ],
 *     "google_maps_url": "https://www.google.com/maps/place/?q=place_id:ChIJFR7vaLfH3IcRUXM5F0POQ_0",
 *     "createdAt": "2025-05-08T16:43:12.978Z",
 *     "updatedAt": "2025-05-09T05:05:32.774Z",
 *     "__v": 0,
 *     "local_image_url": "public/Como_Smoke_and_Fire.jpg"
 *   },
 * ]
 */
router.get("/", restaurantController.getRestaurants);

/**
 * @api {get} /api/restaurants/fetch Fetch restaurants from Google Places API
 * @apiName FetchRestaurants
 * @apiGroup Restaurant
 *
 * @apiParam {Number} [lat=38.951561] Latitude coordinate
 * @apiParam {Number} [lng=-92.328636] Longitude coordinate
 * @apiParam {Number} [radius=8000] Search radius in meters
 * @apiParam {String} [query=restaurant] Search query
 *
 * @apiSuccess {Object[]} restaurants Newly added restaurants
 *
 * @apiSuccessExample {json} Success-Response:
 *     [
 *       {
 *         "location": {
 *             "lat": 38.9529486,
 *             "lng": -92.3276463
 *         },
 *         "opening_hours": {
 *             "open_now": true
 *         },
 *         "photos": {
 *             "height": 2268,
 *             "width": 4032,
 *             "attributions": [
 *                 "<a href=\"https://maps.google.com/maps/contrib/113787450722551411590\">Stephen McBee</a>"
 *             ],
 *             "reference": "AeeoHcIbL9a08SoJzCEFUmCiyUYFHmwKBQHqnUg-RvHSRykOJZSPXSjgxdFv6usg3qObOFSzWdLt9eF1XFDsqeyqFKP4p35XNY_51U8n1nmyk7t_BQdgg6NgOLYz4JeW-Z1mpX46otsfGiHUHM9u14ZCLlHauiSKjlw0zW2sVUp8cVBamzdTip2qz4SsCz85xcq1TytNbzhKd015irE_jIL5q93j3SMX3nYFo6zsCWPmHuu11tC8EDcexUrvy6D2j06fZcQjK3OgwNHJs_KP3q3yAoVWsrOaGGXVAi63Z302W4TZgQOmRBI"
 *         },
 *         "_id": "6817dbc8c7ed20dc97601132",
 *         "name": "Endwell Taverna",
 *         "address": "107 N 9th St, Columbia, MO 65201, United States",
 *         "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
 *         "icon_background_color": "#FF9E67",
 *         "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet",
 *         "rating": 4.7,
 *         "price_level": null,
 *         "place_id": "ChIJ6aBmh5y33IcRxEkvNZCW_gQ",
 *         "user_ratings_total": 129,
 *         "types": [
 *             "restaurant",
 *             "point_of_interest",
 *             "food",
 *             "establishment"
 *         ],
 *         "google_maps_url": "https://www.google.com/maps/place/?q=place_id:ChIJ6aBmh5y33IcRxEkvNZCW_gQ",
 *         "__v": 0,
 *         "local_image_url": "public/Como_Smoke_and_Fire.jpg"
 *       }
 *     ]
 */
router.get("/fetch", restaurantController.fetchAndSaveRestaurants);

/**
 * @api {get} /api/restaurants/refreshImages Refresh restaurant images
 * @apiName RefreshImages
 * @apiGroup Restaurant
 *  
 * @apiSuccess {String} message Success message
 * 
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "message": "Images regenerated successfully"
 *  }
 */
router.get("/refreshImages", restaurantController.regenerateImages);

module.exports = router;
