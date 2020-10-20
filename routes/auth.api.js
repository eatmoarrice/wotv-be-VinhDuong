const authController = require("../controllers/authController");
const express = require("express");
const passport = require("passport");
const router = express.Router();
require("../helpers/passport");
router.post("/", authController.login);
router.post("/facebook", passport.authenticate("facebook-token"), authController.loginWithFacebookOrGoogle);
router.post("/google", passport.authenticate("google-token"), authController.loginWithFacebookOrGoogle);

module.exports = router;
