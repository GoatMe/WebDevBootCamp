var express = require("express");
var	router = express.Router();
var passport =require("passport");
var User = require("../model/user");

//root route
router.get('/', function(request, response){
	response.render("landing");
});

//show register form
router.get("/r", function(req, res){
	res.render("register");
});

//handle sign up logic
router.post("/r", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			console.log(err);
			return res.render("register");
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/l", function(req, res){
	res.render("login");
});

//handling login logic
router.post("/l",
		passport.authenticate("local",
		{
			successRedirect: "/campgrounds",
			failureRedirect: "/l"
		})
		, function(req, res){
});

//logout route
router.get("/logout", function(request, response){
	request.logout();
	response.redirect("/campgrounds");
});

//middleware to check if logged in
function isLoggedIn(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	response.redirect("/l");
};

module.exports = router;