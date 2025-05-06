const Restaurant = require('../models/Restaurant');
const { fetchAllRestaurants } = require('../services/googlePlacesService');
const config = require('../utils/config');

// Get all restaurants
const getRestaurants = async (req, res) => {
  try {
    // Try to fetch all restaurants from the database
    const restaurants = await Restaurant.find({});
    // If found return them as JSON
    res.json(restaurants);
  } catch (err) {
    // If an error occurs, log it and return a 500 status with the error message
    console.error("Error fetching restaurants:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Fetch restaurants from Google Places API and save to database
const fetchAndSaveRestaurants = async (req, res) => {
  const { lat = 38.951561, lng = -92.328636, radius = 8000, query = 'restaurant' } = req.query;
  const apiKey = config.GMAPS_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ error: 'Google Maps API key is required' });
  }

  try {
    const results = await fetchAllRestaurants(query, lat, lng, radius, apiKey);

    const entries = results.map(p => ({
      name: p.name,
      address: p.formatted_address || p.vicinity,
      location: {
        lat: p.geometry.location.lat,
        lng: p.geometry.location.lng,
      },
      icon: p.icon,
      icon_background_color: p.icon_background_color,
      icon_mask_base_uri: p.icon_mask_base_uri,
      opening_hours: {
        open_now: p.opening_hours?.open_now || false,
      },
      photos: p.photos?.[0] ? {
        height: p.photos[0].height,
        width: p.photos[0].width,
        attributions: p.photos[0].html_attributions,
        reference: p.photos[0].photo_reference,
      } : null,
      rating: p.rating || null,
      price_level: p.price_level || null,
      place_id: p.place_id,
      user_ratings_total: p.user_ratings_total || 0,
      types: p.types || [],
      google_maps_url: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`
    }));

    const added = [];
    for (const entry of entries) {
      try {
        const exists = await Restaurant.findOne({ place_id: entry.place_id });

        if (!exists) {
          const newDoc = await Restaurant.create(entry);
          added.push(newDoc);
          console.log("Added:", entry.name);
        } else {
          console.log("Skipped (duplicate):", entry.name);
        }
      } catch (err) {
        console.error(`Error processing ${entry.name}:`, err.message);
      }
    }

    res.json(added);
  } catch (err) {
    console.error("Error fetching restaurants from Google Places API:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRestaurants,
  fetchAndSaveRestaurants,
};
