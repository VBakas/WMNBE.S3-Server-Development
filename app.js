// Import necessary Node.js modules and packages
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Import error controller and user model
const errorController = require("./controllers/error");
const User = require("./models/user");

// Load environment variables from a .env file
require("dotenv").config();

// Create an Express application
const app = express();

// Configure a MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI, // MongoDB connection URI
  collection: "sessions", // Collection to store sessions
});

// Set the view engine to EJS and specify the views directory
app.set("view engine", "ejs");
app.set("views", "views");

// Import route handlers
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const subRoutes = require("./routes/subscriptions");

// Middleware for parsing request bodies and serving static files
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Configure session handling
app.use(
  session({
    secret: "my secret", // Session secret (should be a secure, random string)
    resave: false,
    saveUninitialized: false,
    store: store, // Store session data in MongoDB
  })
);

// Middleware to check if a user is logged in
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  // If a user is logged in, retrieve their user information from the database
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Route handling
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(subRoutes);

// Error handling for 404 (Not Found) pages
app.use(errorController.get404);

// Connect to MongoDB and start the Express application
mongoose
  .connect(process.env.MONGODB_URI) // Connect to MongoDB using the URI from the environment variables
  .then((result) => {
    app.listen(3000); // Start the Express application and listen on port 3000
  })
  .catch((err) => {
    console.log(err);
  });
