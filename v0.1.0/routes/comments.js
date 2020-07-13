var express = require("express");
var	router = express.Router({mergeParams: true});
var	Campground = require("../model/campground"),
	Comment = require("../model/comment");

//comments new
router.get("/new", isLoggedIn, function(request, response){
	Campground.findById(request.params.id, function(err, campground){
	if (err) {
		console.log(err);
	} else {
		response.render("comments/new", {cg: campground});
	}	
	});
});

//comments create
router.post("/", isLoggedIn, function(request, response){
	//Lookup Campground using id
	Campground.findById(request.params.id, function(err, campground){
		if (err) {
			console.log(err);
			console.log("CG error");
		} else {
			Comment.create(request.body.comment,function(err, comment){
				if (err) {
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = request.user._id;
					comment.author.username = request.user.username;
					comment.save();
					//save comment
					campground.comments.push(comment);
					campground.save();
					response.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//middleware to check if logged in
function isLoggedIn(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	response.redirect("/l");
};

module.exports = router;