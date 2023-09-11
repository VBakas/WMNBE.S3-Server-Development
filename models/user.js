// Import the Mongoose library for MongoDB interaction.
const mongoose = require("mongoose");

// Import the Schema class from Mongoose.
const Schema = mongoose.Schema;

// Define a Mongoose schema for user documents.
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // role: {
  //   type: String,
  //   required: true,
  // },
  resetToken: String,
  resetTokenExpiration: Date,
  subscription: {
    type: String,
    default: "free",
  },
  wishlist: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

// Method to add a product to the user's wishlist.
userSchema.methods.addToWishlist = function (product) {
  // Check if the wishlist is already full (has reached the maximum number of items).
  if (this.wishlist.items.length >= 10) {
    throw new Error("Wishlist is full. You can only have 10 items.");
  }

  // Find the index of the product in the wishlist.
  const wishlistProductIndex = this.wishlist.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });

  // Initialize quantity and create an updated wishlist.
  let newQuantity = 1;
  const updatedWishlistItems = [...this.wishlist.items];

  // If the product already exists in the wishlist, increment its quantity; otherwise, add it as a new item.
  if (wishlistProductIndex >= 0) {
    newQuantity = this.wishlist.items[wishlistProductIndex].quantity + 1;
    updatedWishlistItems[wishlistProductIndex].quantity = newQuantity;
  } else {
    updatedWishlistItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  // Update the user's wishlist and save changes to the database.
  const updatedWishlist = {
    items: updatedWishlistItems,
  };
  this.wishlist = updatedWishlist;
  return this.save();
};

// Method to remove a product from the user's wishlist.
userSchema.methods.removeFromWishlist = function (productId) {
  // Filter out the item with the specified productId from the wishlist.
  const updatedWishlistItems = this.wishlist.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });

  // Update the user's wishlist and save changes to the database.
  this.wishlist.items = updatedWishlistItems;
  return this.save();
};

// Export the Mongoose model named "User" based on the userSchema.
module.exports = mongoose.model("User", userSchema);
