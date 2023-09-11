// Import required Node.js modules
const path = require("path");
const express = require("express");

// Import custom modules for route handling and authentication
const subController = require("../controllers/subscriptions");
const isAuth = require("../middlewares/is-auth");

// Create an instance of an Express Router
const router = express.Router();

// Define a route to get a list of subscriptions
router.get("/subscriptions", isAuth, subController.getSubscriptions);

// Define a route for handling the checkout process with a dynamic subscriptionId parameter
router.get("/checkout/:subscriptionId", isAuth, subController.getCheckout);

// router.get("/checkout/success", isAuth, subController.getCheckout);

// Define a route for canceling the checkout process
router.get("/checkout/cancel", isAuth, subController.getCheckout);

// Export the router module to be used by the main Express application
module.exports = router;
