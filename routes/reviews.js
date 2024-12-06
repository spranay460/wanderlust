const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isSignedIn, isAuthor} = require("../middlewares.js");
const reviewController = require("../controllers/reviews.js");

router.post("/", isSignedIn, validateReview, wrapAsync(reviewController.createReview ))
router.delete("/:reviewId", isSignedIn, isAuthor, wrapAsync(reviewController.destoryReview ))

module.exports = router;