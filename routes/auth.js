var express = require("express");
var router = express.Router();
var passport = require("../passport/passport.js");

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/google/callback", passport.authenticate("google"), authSuccess);

function authSuccess(req, res) {
  res.redirect("/");
}

module.exports = router;
