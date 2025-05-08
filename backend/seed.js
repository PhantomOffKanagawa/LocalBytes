require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const { fetchAndSaveRestaurants } = require("./controllers/restaurantController");

(async () => {
  const query = process.argv[2];

  // Check if query argument is provided
  if (!query) {
    console.error("Error: Please provide a query as an argument (e.g., npm run seed 'restaurant')");
    process.exit(1); // Exit the script with a non-zero code
  }

  // MongoDB connection logic
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    // Fake req/res objects
    const req = {
      query: {
        query,
      },
    };
    const res = {
      json: console.log,
      status: (code) => ({
        json: (msg) => console.error(`Error ${code}:`, msg),
      }),
    };

    // Fetch and save restaurants
    await fetchAndSaveRestaurants(req, res);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  } finally {
    // Close MongoDB connection after the operation is complete
    mongoose.connection.close();
  }
})();
