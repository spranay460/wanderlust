const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isSignedIn, validateListing, isOwner} = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync( listingController.index))
.post(isSignedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing))

router.route("/search")
.get(wrapAsync( listingController.search))

router.get("/new", isSignedIn, listingController.renderNewForm)

router.route("/:id")
.get(wrapAsync(listingController.showListing ))
.put(isSignedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing ))
.delete(isSignedIn,isOwner,wrapAsync(listingController.destroyListing ))

router.get("/:id/edit",isSignedIn,isOwner,wrapAsync(listingController.renderEditForm ))


module.exports = router;