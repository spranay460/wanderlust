if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressErr = require("./utils/ExpressErr.js");
const listingRoute = require("./routes/listings.js");
const reviewRoute = require("./routes/reviews.js");
const userRoute = require("./routes/users.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(()=>{
    console.log("connected to wanderlust db");
}).catch((err)=>{
    console.log("not connected to wanderlust db");
    console.log(err);
})


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const sessionOptions = {
       
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie:{
            expires: Date.now()+7*24*60*60*1000,
            maxAge:7*24*60*60*1000,
            httpOnly: true,
        }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/", userRoute);
app.use("/", listingRoute);
app.use("/:id/reviews", reviewRoute);


app.all("*", (req, res, next)=>{
    next(new ExpressErr(404, "page not found"));
})
app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    console.log(err);
})
app.listen(port, ()=>{
    console.log(`app is listening at port ${port}`);
})