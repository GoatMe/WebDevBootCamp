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
			console.log(err.message);
			return res.render("register", {error: err.message});
		} 
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
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
	request.flash("success", "Successfully logged out...");
	response.redirect("/campgrounds");
});

module.exports = router;