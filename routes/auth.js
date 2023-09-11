// Import the Express.js framework
const express = require("express");

// Import the authentication controller
const authController = require("../controllers/auth");

// Create a new instance of the Express Router
const router = express.Router();

// Define routes and associated controller functions

// Route for rendering the login page (GET request)
router.get("/login", authController.getLogin);

// Route for handling the login form submission (POST request)
router.post("/login", authController.postLogin);

// Route for handling user registration form submission (POST request)
router.post("/signup", authController.postSignup);

// Route for rendering the user registration page (GET request)
router.get("/signup", authController.getSignup);

// Route for handling user logout action (POST request)
router.post("/logout", authController.postLogout);

// Route for rendering the password reset page (GET request)
router.get("/reset", authController.getReset);

// Route for handling the password reset form submission (POST request)
router.post("/reset", authController.postReset);

// Export the router configuration for use in other parts of the application
module.exports = router;
