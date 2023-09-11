// Import the Product model
const Product = require("../models/product");

// Get a list of all products and render the product list view
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      const role = req.session?.user?.role;
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
        role: role ? role : "guest",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get details of a specific product by ID and render the product detail view
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      const role = req.session?.user?.role;
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
        role: role ? role : "guest",
      });
    })
    .catch((err) => console.log(err));
};

// Get a list of all products and render the main shop page
exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      const role = req.session?.user?.role;
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
        role: role ? role : "guest",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get the user's wishlist and render the wishlist view
exports.getWishlist = (req, res, next) => {
  req.user
    .populate("wishlist.items.productId")
    .then((user) => {
      const products = user.wishlist.items;
      const role = req.session?.user?.role;
      res.render("shop/wishlist", {
        path: "/wishlist",
        pageTitle: "Your wishlist",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
        role: role ? role : "guest",
      });
    })
    .catch((err) => console.log(err));
};

// Add a product to the user's wishlist and redirect to the wishlist page
exports.postWishlist = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToWishlist(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/wishlist");
    });
};

// Remove a product from the user's wishlist and redirect to the wishlist page
exports.postWishlistRemoveProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromWishlist(prodId)
    .then((result) => {
      res.redirect("/wishlist");
    })
    .catch((err) => console.log(err));
};
