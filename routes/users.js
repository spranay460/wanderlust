const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middlewares.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup ))

router.route("/signin")
.get(userController.renderSigninForm)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/signin", failureFlash:true}),
userController.signin
)

router.get("/signout", userController.signout)

module.exports = router;