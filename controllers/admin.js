// Import the Product model
const Product = require("../models/product");

// Render the form for adding a new product
exports.getAddProduct = (req, res, next) => {
  const role = req.session?.user?.role;
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    role: role ? role : "admin",
  });
};

// Handle the submission of a new product
exports.postAddProduct = (req, res, next) => {
  // Extract product data from the request body
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // Create a new Product instance with the extracted data
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });

  // Save the product to the database
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

// Render the form for editing an existing product
exports.getEditProduct = (req, res, next) => {
  // Check if edit mode is enabled

  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  // Extract the product ID from the request parameters
  const prodId = req.params.productId;

  // Find the product by ID in the database
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      // Render the edit product form with product data
      const role = req.session?.user?.role;
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
        role: role ? role : "admin",
      });
    })
    .catch((err) => console.log(err));
};

// Handle the submission of an edited product
exports.postEditProduct = (req, res, next) => {
  // Extract product data from the request body
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  // Find the product by ID in the database
  Product.findById(prodId)
    .then((product) => {
      // Update the product's properties with the new data
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;

      // Save the updated product to the database
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

// Retrieve a list of all products and render the products page
exports.getProducts = (req, res, next) => {
  // Fetch all products from the database
  Product.find()
    .then((products) => {
      console.log(products);

      // Render the products page with the retrieved products
      const role = req.session?.user?.role;
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
        role: role ? role : "admin",
      });
    })
    .catch((err) => console.log(err));
};

// Handle the deletion of a product
exports.postDeleteProduct = (req, res, next) => {
  // Extract the product ID from the request body
  const prodId = req.body.productId;

  // Find and remove the product by ID from the database
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
