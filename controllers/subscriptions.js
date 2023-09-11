// Import necessary modules and libraries
const Subscription = require("../models/subscription"); // Import the Subscription model
const stripe = require("stripe")(process.env.STRIPE_SK); // Initialize Stripe with the secret key
require("dotenv").config(); // Load environment variables from a .env file

// Controller function to get a list of subscriptions and render them in a view
exports.getSubscriptions = (req, res, next) => {
  Subscription.find() // Find all subscriptions in the database
    .then((subscriptions) => {
      console.log(subscriptions); // Log the retrieved subscriptions
      const role = req.session?.user?.role;
      res.render("shop/subscriptions", {
        // Render a view with subscription data
        subs: subscriptions, // Subscription data
        pageTitle: "All Subscriptions", // Page title
        path: "/subscriptions", // Path for navigation
        isAuthenticated: req.session.isLoggedIn, // Check if the user is authenticated
        role: role ? role : "guest",
      });
    })
    .catch((err) => {
      console.log(err); // Handle any errors
    });
};

// Controller function to handle the checkout process
exports.getCheckout = (req, res, next) => {
  const subscriptionType = req.params.subscriptionType; // Get the subscription type from the request parameters
  const subId = req.params.subscriptionId; // Get the subscription ID from the request parameters
  let total = 0; // Initialize the total cost variable

  Subscription.findById(subId) // Find the subscription by ID in the database
    .then((subscription) => {
      total = subscription.price; // Set the total cost based on the subscription's price
      return stripe.checkout.sessions.create({
        // Create a Stripe checkout session
        payment_method_types: ["card"], // Payment method (credit card)
        mode: "payment", // Payment mode
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              product_data: {
                name: `Subscription`,
              },
              unit_amount: total * 100,
            },
          },
        ],
        customer_email: req.user.email, // Customer's email
        success_url:
          req.protocol + "://" + req.get("host") + "/checkout/success", // Success URL
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel", // Cancel URL
      });
    })
    .then((session) => {
      const role = req.session?.user?.role;
      res.render("shop/checkout", {
        // Render the checkout view
        path: "/checkout", // Path for navigation
        pageTitle: "Checkout", // Page title
        totalSum: total, // Total cost
        sessionId: session.id, // Stripe session ID
        isAuthenticated: req.session.isLoggedIn, // Check if the user is authenticated
        subscriptionType: subscriptionType, // Subscription type
        subscriptionPrice: total, // Subscription price
        role: role ? role : "guest",
      });
    })
    .catch((err) => {
      console.log(err); // Handle any errors
    });
};
