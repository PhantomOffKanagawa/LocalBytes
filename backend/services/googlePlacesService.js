const axios = require("axios");

/**
 * Fetch all restaurants from Google Places API (text search)
 * @param {string} query - The search query
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<Array>} - Array of places
 */
const fetchAllRestaurants = async (query, lat, lng, radius, apiKey) => {
  let allResults = [];
  let nextPageToken = null;
  let page = 1;

  do {
    if (nextPageToken) await new Promise((r) => setTimeout(r, 2000));

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query,
          location: `${lat},${lng}`,
          radius,
          key: apiKey,
          pagetoken: nextPageToken,
        },
      },
    );

    if (response.data.status == "REQUEST_DENIED") {
      throw new Error("Failed to fetch data from Google Places API");
    }

    const data = response.data;
    console.log(`Page ${page++}:`, data.results.length);

    allResults.push(...(data.results || []));
    nextPageToken = data.next_page_token || null;

    if (nextPageToken) await new Promise((r) => setTimeout(r, 2000));
  } while (nextPageToken);

  return allResults;
};

module.exports = {
  fetchAllRestaurants,
};
