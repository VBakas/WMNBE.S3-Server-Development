// Import necessary modules
const mongoose = require("mongoose"); // MongoDB library
const Subscription = require("./models/subscription"); // Subscription model
require("dotenv").config(); // Load environment variables from .env file

// Define an array of subscription data
const subscriptionsData = [
  {
    title: "Silver Subscription",
    price: 20,
  },
  {
    title: "Gold Subscription",
    price: 30,
  },
  {
    title: "Platinum Subscription",
    price: 100,
  },
];

// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGODB_URI, {
    // Use the MONGODB_URI from the .env file
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Connection successful
    console.log("Connected to MongoDB");

    // Insert subscription data into the database
    return Subscription.insertMany(subscriptionsData);
  })
  .then((subscriptions) => {
    // Successfully inserted subscriptions
    console.log("Subscriptions added:", subscriptions);
  })
  .catch((error) => {
    // Handle any errors that occur during the connection or insertion
    console.error(error);
  })
  .finally(() => {
    // Close the MongoDB connection, whether successful or not
    mongoose.connection.close();
  });
