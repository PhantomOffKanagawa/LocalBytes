require("dotenv").config({ path: "../.env" });
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./utils/db");
const config = require("./utils/config");
const { createServer } = require("./utils/serverUtils");

// Initialize Express and MongoDB connection
const app = express();
connectDB();

// Configure app middleware
// Add morgan for logging requests
app.use(
  morgan("dev", {
    skip: (req, res) => req.originalUrl.startsWith("/api-docs/") || req.originalUrl.startsWith("/api/public/"),
  }),
);

// Parse incoming requests with JSON payloads
app.use(express.json());
// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: false }));
// Use CORS to allow cross-origin requests from frontend
app.use(
  cors({
    origin: config.CLIENT_URL,
  }),
);

// Import routes
const restaurantRoutes = require("./routes/restaurantRoutes");
const commentRoutes = require("./routes/commentRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const authRoutes = require("./routes/authRoutes");

// Set Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/auth", authRoutes);

// Serve API documentation
app.use("/api-docs", express.static(path.join(__dirname, "docs")));

// Serve static files from the public directory
app.use("/api/public", express.static(path.join(__dirname, "public")));

// Serve root route
app.get("/", (req, res) => {
  res.send("LocalBytes API is running");
});

// Create and start server using the serverUtils
const server = createServer(app, config.PORT);
server.listen(config.PORT);
