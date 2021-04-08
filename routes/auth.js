const express = require("express");
const passport = require("passport");
const router = express.Router();

// @desc Auth with google
// @route GET /auth/google

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc goole auth call back
// @route GET /auth/gogole/callback

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc logginout user
// @route get /auth/logout
router.get("/logout", (req, res) => {
  req.logout(); // weh nthe loggin by passport,k you have a logout method in req
   res.redirect("/");
});

module.exports = router;
