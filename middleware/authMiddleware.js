const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists and is verified
  if (token) {
    jwt.verify(token, "madness secret", async (err, decodedToken) => {
      if (err) {
        res.redirect("/signin");
      } else {
        let user = await User.findById(decodedToken.id);
        if (user.subscribed) {
          next();
        } else {
          res.redirect("/payment");
        }
      }
    });
  } else {
    res.redirect("/signin");
  }
};



const checkAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists and is verified
  if (token) {
    jwt.verify(token, "madness secret", async (err, decodedToken) => {
      if (err) {
        res.redirect("/signin");
      } else {
        let user = await User.findById(decodedToken.id);
        if (user.subscribed) {
          res.redirect("/dashboard");
        } else {
          res.redirect("/payment");
        }
      }
    });
  } else {
    res.redirect("/signin");
  }
};

module.exports = { requireAuth, checkAuth };
