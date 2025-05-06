const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// GET all restaurants
router.get('/', restaurantController.getRestaurants);

// GET fetch restaurants from Google Places API
router.get('/fetch', restaurantController.fetchAndSaveRestaurants);

module.exports = router;
