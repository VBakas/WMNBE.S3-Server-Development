// Import required Node.js modules and external modules
const path = require("path");
const express = require("express");
const adminController = require("../controllers/admin"); // Import the admin controller
const isAuth = require("../middlewares/is-auth"); // Import the authentication middleware

// Create an Express Router
const router = express.Router();

// Define and handle routes

// Display the form to add a new product (GET request)
router.get("/add-product", isAuth, adminController.getAddProduct);

// Display a list of products (GET request)
router.get("/products", isAuth, adminController.getProducts);

// Handle the submission of the new product form (POST request)
router.post("/add-product", isAuth, adminController.postAddProduct);

// Display the form to edit a specific product (GET request with a dynamic parameter)
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// Handle the submission of the edited product form (POST request)
router.post("/edit-product", isAuth, adminController.postEditProduct);

// Handle the deletion of a product (POST request)
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

// Export the router for use in other parts of the application
module.exports = router;
