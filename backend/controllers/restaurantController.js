const Restaurant = require("../models/Restaurant");
const { fetchAllRestaurants } = require("../services/googlePlacesService");
const config = require("../utils/config");
const axios = require("axios");
const { getUserUuidFromToken, download_image } = require("../utils/helpers");
const Rating = require("../models/Rating");
const fs = require("fs");

// Get all restaurants
const getRestaurants = async (req, res) => {
  try {
    // Check if request included an authorization header
    // Extract the token from the request headers
    // The token is expected to be in the format "Bearer <token>"
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];

    // Decode the token to get the user UUID
    const uuid = getUserUuidFromToken(token);

    if (uuid) {
      // If token is provided, fetch restaurants and include rating by user
      // First get all restaurants
      const restaurants = await Restaurant.find({}).lean();

      // Get all ratings for this user
      const ratings = await Rating.find({ uuid }).select("+uuid");

      // Create a map of place_id to rating for faster lookup
      const ratingsByPlaceId = Object.fromEntries(
        ratings.map((r) => [r.place_id, r.rating])
      );

      // console.log("Ratings by place_id:", ratingsByPlaceId);
      // console.log("Restaurants:", restaurants[0]);

      // Combine restaurants with user ratings
      const restaurantsWithRatings = restaurants.map((restaurant) => ({
        ...restaurant,
        user_rating: ratingsByPlaceId[restaurant.place_id] || null,
      }));

      return res.json(restaurantsWithRatings);
    } else {
      // If token is not provided, fetch all restaurants
      const restaurants = await Restaurant.find({});
      // If found return them as JSON
      return res.json(restaurants);
    }
  } catch (err) {
    // If an error occurs, log it and return a 500 status with the error message
    console.error("Error fetching restaurants:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Fetch restaurants from Google Places API and save to database
const fetchAndSaveRestaurants = async (req, res) => {
  const {
    lat = 38.951561,
    lng = -92.328636,
    radius = 8000,
    query = "restaurant",
  } = req.query;

  const apiKey = config.GMAPS_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ error: "Google Maps API key is required" });
  }

  try {
    const results = await fetchAllRestaurants(query, lat, lng, radius, apiKey);

    const entries = [];

    for (const p of results) {
      let photo_url = "";

      if (p.photos?.[0]?.photo_reference) {
        // Fallback to Place Details API
        try {
          const details = await axios.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            {
              params: {
                place_id: p.place_id,
                fields: "photos",
                key: apiKey,
              },
            }
          );

          const photoRef = details.data.result?.photos?.[0]?.photo_reference;
          if (photoRef) {
            const photoResp = await axios.get(
              "https://maps.googleapis.com/maps/api/place/photo",
              {
                maxRedirects: 0,
                validateStatus: (status) => status === 302,
                params: {
                  maxwidth: 400,
                  photo_reference: photoRef,
                  key: apiKey,
                },
              }
            );
            console.log("Photo fallback headers:", photoResp.headers);
            console.log("Photo fallback status:", photoResp.status);
            photo_url = photoResp.headers.location;

            // Download the photo to public directory
            const photoName = `${p.name.replace(/\s+/g, "_")}.jpg`;
            const photoPath = `public/${photoName}`;

            const download_state = await download_image(photo_url, photoPath);

            console.log("Photo download state:", download_state);

            // Save the photo URL to the database
            p.local_image_url = photoPath;

            if (download_state) {
              console.log(`Photo saved to ${photoPath}`);
            }
          } else {
            console.error(`No photo reference found for ${p.name}`);
          }
        } catch (err) {
          console.error(
            `Fallback photo fetch failed for ${p.name}:`,
            err.message
          );
        }

        //  await new Promise((r) => setTimeout(r, 500));
      } else {
        console.error(`No photo reference found for ${p.name}`);
      }
      console.log("Photo URL:", photo_url);

      entries.push({
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
        photos: photo_url || "None",
        local_image_url: p.local_image_url || "None",
        rating: 0 || 0, // Previously p.rating
        price_level: typeof p.price_level === "number" ? p.price_level : -1,
        place_id: p.place_id,
        user_ratings_total: 0 || 0, // Previously p.user_ratings_total
        types: p.types || [],
        google_maps_url: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
      });
    }

    const added = [];
    for (const entry of entries) {
      try {
        const exists = await Restaurant.findOne({ place_id: entry.place_id });

        if (!exists) {
          const newDoc = await Restaurant.create(entry);
          added.push(newDoc);
          console.log("Added:", entry.name);
        } else {
          // console.log("Skipped (duplicate):", entry.name);
          // Update the existing document if needed
          const updatedDoc = await Restaurant.findByIdAndUpdate(
            exists._id,
            {
              $set: {
                ...entry,
              },
            },
            { new: true }
          );
        }
      } catch (err) {
        console.error(`Error processing ${entry.name}:`, err.message);
        if (
          err.name === "ValidationError" ||
          err.message.includes("Document failed validation")
        ) {
          console.error("Invalid document:", JSON.stringify(entry, null, 2));
        }
      }
    }

    res.json(added);
  } catch (err) {
    console.error(
      "Error fetching restaurants from Google Places API:",
      err.message
    );
    res.status(500).json({ error: err.message });
  }
};

// Regenerate images for all restaurants
const regenerateImages = async (req, res) => {
  const apiKey = config.GMAPS_API_KEY;

  if (apiKey == "") {
    return res.status(400).json({ error: "Google Maps API key is required" });
  }
  
  try {
    const restaurants = await Restaurant.find({});

    for (const restaurant of restaurants) {
      try {
        // Check if the restaurant has a local image URL and local image URL is not empty
        if (
          !restaurant.local_image_url ||
          !fs.existsSync(restaurant.local_image_url)
        ) {
          // If the local image URL is empty or the file does not exist, download the image again
          const photoName = `${restaurant.name.replace(/\s+/g, "_")}.jpg`;
          const photoPath = `public/${photoName}`;

          const details = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
            params: {
              place_id: restaurant.place_id,
              fields: "photos",
              key: apiKey,
            },
          });

          const photoRef = details.data.result?.photos?.[0]?.photo_reference;
          if (photoRef) {
            const photoResp = await axios.get(
              "https://maps.googleapis.com/maps/api/place/photo",
              {
                maxRedirects: 0,
                validateStatus: (status) => status === 302,
                params: {
                  maxwidth: 400,
                  photo_reference: photoRef,
                  key: apiKey,
                },
              }
            );

            // Download the photo to public directory
            await download_image(
              photoResp.headers.location,
              photoPath
            );

            // Save the photo URL to the database
            restaurant.local_image_url = photoPath;
            await restaurant.save();
            console.log(`Photo saved to ${photoPath}`);

            // Pause a second to avoid hitting the rate limit
            await new Promise((r) => setTimeout(r, 250));
          } else {
            console.error(`No photo reference found for ${restaurant.name}`);
          }
        } else if (
          !restaurant.local_image_url &&
          fs.existsSync(restaurant.local_image_url)
        ) {
          const photoName = `${restaurant.name.replace(/\s+/g, "_")}.jpg`;
          const photoPath = `public/${photoName}`;

            // Save the photo URL to the database
            restaurant.local_image_url = photoPath;
            await restaurant.save();
            console.log(`Photo saved to ${photoPath}`);
          }
      } catch (err) {
        console.error(
          `Error regenerating image for ${restaurant.name}:`,
          err.message
        );
      }
    }

    res.json({ message: "Images regenerated successfully" });
  } catch (err) {
    console.error("Error regenerating images:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRestaurants,
  fetchAndSaveRestaurants,
  regenerateImages,
};
