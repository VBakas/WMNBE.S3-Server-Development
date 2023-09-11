// Import required modules and initialize necessary dependencies

require("dotenv").config(); // Load environment variables

const User = require("../models/user"); // Import the User model
const bcrypt = require("bcryptjs"); // For password hashing
const mailgun = require("mailgun-js")({
  // For sending emails
  apiKey: process.env.MG_APIKEY, // Mailgun API Key
  domain: process.env.DOMAIN, // Mailgun domain
});
const crypto = require("crypto"); // For generating random tokens

// Render the login page
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

// Render the signup page
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

// Handle user login
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find the user with the provided email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login"); // User not found, redirect to login
      }

      // Compare the provided password with the hashed password stored in the database
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          // Passwords match, create a session for the user
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        res.redirect("/login"); // Passwords do not match, redirect to login
      });
    })
    .catch((err) => console.log(err));
};

// Handle user registration
exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // Check if a user with the provided email already exists
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.redirect("/signup"); // User already exists, redirect to signup
      }

      // Hash the provided password
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          // Create a new User record in the database
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: "user",
            wishlist: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login"); // Redirect to login after successful registration

          // Send a welcome email to the newly registered user
          var data = {
            from: "Backend-NodeJS-User <13-13496@saeinstitute.edu>",
            to: email,
            subject: "Welcome to our site!",
            html: "<h1>You successfully signed up! Welcome to our site!</h1>",
          };
          return mailgun.messages().send(data, function (error, body) {
            console.log(body);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Handle user logout
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

// Render the password reset page
exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    isAuthenticated: false,
  });
};

// Handle password reset request
exports.postReset = (req, res, next) => {
  const email = req.body.email;

  // Generate a random token
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");

    // Find the user with the provided email
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          console.log("No user found!");
          return res.redirect("/reset");
        }
        // Store the token and its expiration date in the user record
        user.resetToken = token;
        user.resetTokenExpiration = new Date();
        user.save();
      })
      .then((result) => {
        // Send a password reset email with a link containing the token
        var data = {
          from: "Backend-NodeJS-User <13-13496@saeinstitute.edu>",
          to: email,
          subject: "Password Reset!",
          html: `
          <p>Your requested for a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
          `,
        };
        return mailgun.messages().send(data, function (error, body) {
          console.log(body);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
