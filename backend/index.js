require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

// Schema + Unique name index
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  location: {
    lat: Number,
    lng: Number,
  },
  icon: String,
  icon_background_color: String,
  icon_mask_base_uri: String,
  opening_hours: {
    open_now: Boolean,
  },
  photos: {
    height: Number,
    width: Number,
    attributions: [String],
    reference: String,
  },
  rating: Number,
  price_level: Number,
  place_id: { type: String, unique: true },
  user_ratings_total: Number,
  types: [String],
  google_maps_url: String
}, { collection: 'restaurants' });

const commentSchema = new mongoose.Schema({
  body: String,
  datetime: Date,
  place_id: String,
  uuid: String,
  comment_id: { type: Number, unique: true }
}, { collection: 'comments' });

restaurantSchema.index({ name: 1 }, { unique: true });


const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

app.get('/', (req, res) => {
  res.send('API Running');
});

// Fetch all pages from Google Places API (nearbysearch)
const fetchAllRestaurants = async (lat, lng, radius, apiKey) => {
  let allResults = [];
  let nextPageToken = null;
  let page = 1;

  do {
    if (nextPageToken) await new Promise(r => setTimeout(r, 2000));

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: 'shakespeares pizza', // <-- Change this to your desired query and then hit the endpoint /api/fetch-restaurants
        location: `${lat},${lng}`,
        radius,
        key: apiKey,
        pagetoken: nextPageToken,
      },
    });

    const data = response.data;
    console.log(`Page ${page++}:`, data.results.length);

    allResults.push(...(data.results || []));
    nextPageToken = data.next_page_token || null;

    if (nextPageToken) await new Promise(r => setTimeout(r, 2000));
  } while (nextPageToken);

  return allResults;
};

// Fetch & save non-duplicate restaurants
app.get('/api/fetch-restaurants', async (req, res) => {
  const { lat = 38.951561, lng = -92.328636, radius = 8000 } = req.query;
  const apiKey = process.env.GMAPS_API_KEY;

  console.log("Route hit");

  try {
    const results = await fetchAllRestaurants(lat, lng, radius, apiKey);

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
      const exists = await Restaurant.findOne({ name: entry.name });

      if (!exists) {
        const newDoc = await Restaurant.create(entry);
        added.push(newDoc);
        console.log("Added:", entry.name);
      } else {
        console.log("Skipped (duplicate):", entry.name);
      }
    }

    res.json(added);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/comment/create', async (req, res) => {
});
app.get('/api/comment/read', async (req, res) => {
});
app.get('/api/comment/update', async (req, res) => {
});
app.get('/api/comment/delete', async (req, res) => {
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
