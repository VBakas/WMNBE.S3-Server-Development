// Export a middleware function that takes three parameters: req (request), res (response), and next (a callback function).
module.exports = (req, res, next) => {
  // Check if the req.session.isLoggedIn property is falsy, indicating that the user is not logged in.
  if (!req.session.isLoggedIn) {
    // If the user is not logged in, redirect them to the '/login' route.
    return res.redirect("/login");
  }

  // If the user is logged in (req.session.isLoggedIn is truthy), allow them to proceed to the next middleware or route handler.
  next();
};
