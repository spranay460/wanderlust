const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup = async (req, res)=>{
    try{
        let {email, username, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "you are logged in");
            return res.redirect("/");
        })
    }
    catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}
module.exports.renderSigninForm = (req, res)=>{
    res.render("users/signin.ejs");
}
module.exports.signin = async (req, res)=>{
    req.flash("success", "Welcome back to Wanderlust");
    if(res.locals.redirectUrl){
        return res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/");
}
module.exports.signout = (req, res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/");
    })
}