// Import necessary modules
const path = require("path"); // File path utility
const express = require("express"); // Express.js framework
const shopController = require("../controllers/shop"); // Controller functions
const isAuth = require("../middlewares/is-auth"); // Authentication middleware

// Create an Express Router
const router = express.Router();

// Define Routes

// Route for the homepage
router.get("/", shopController.getIndex);

// Route for listing products
router.get("/products", shopController.getProducts);

// Route for viewing individual product details
router.get("/products/:productId", shopController.getProduct);

// Route for viewing the user's wishlist (requires authentication)
router.get("/wishlist", isAuth, shopController.getWishlist);

// Route for adding an item to the wishlist (requires authentication)
router.post("/wishlist", isAuth, shopController.postWishlist);

// Route for removing an item from the wishlist (requires authentication)
router.post(
  "/wishlist-remove-item",
  isAuth,
  shopController.postWishlistRemoveProduct
);

// Export the Router for use in other parts of the application
module.exports = router;
