// Define a route handler for handling 404 errors
exports.get404 = (req, res, next) => {
  // Set the HTTP response status code to 404 (Page Not Found)
  res.status(404).render("404", {
    // Render the '404' template with the following data
    pageTitle: "Page Not Found",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};
