const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
module.exports.createReview = async(req, res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","review added");
    res.redirect(`/${id}`);
}
module.exports.destoryReview = async(req, res)=>{
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull : { reviews : reviewId}});
    req.flash("success","review deleted");
    res.redirect(`/${id}`)
}