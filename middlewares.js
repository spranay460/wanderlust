const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressErr = require("./utils/ExpressErr.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isSignedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in");
        return res.redirect("/signin");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressErr(400, error);
    }
    else{
        next();
    }
}

module.exports.isOwner = async (req, res, next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are now owner");
        return res.redirect(`/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressErr(400, error);
    }
    else{
        next();
    }
}

module.exports.isAuthor = async (req, res, next) =>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not author");
        return res.redirect(`/${id}`);
    }
    next();
}