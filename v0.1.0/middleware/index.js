var Campground = require("../model/campground");
var Comment = require("../model/comment");

//all the middleware goes here

var middlewareObj = {};

middlewareObj.CampgroundOwnerCheck = function (request, response, next){
		if (request.isAuthenticated()) {
		//verify post-user ownership 
		Campground.findById(request.params.id, function(err, foundCamp){
			if (err) {
				console.log(err);
				response.redirect("back");
			} else {
				//check if user own the post
				//using mongoose "equal" methos to check if equal
				if (foundCamp.author.id.equals(request.user._id)) {
					next();
				} else	{
					response.redirect("back");
				}
			}
		});
	}else{
		response.redirect("back"); //sends user one page back
	}
}

middlewareObj.CommentOwnerCheck = function (request, response, next){
	if (request.isAuthenticated) {
		Comment.findById(request.params.comment_id, function(err, foundComment){
			if (err) {
				response.redirect("back");
			} else {
				//is user owner of comment check
				if (foundComment.author.id.equals(request.user._id)) {
					next();
				} else{
					response.redirect("back");
				}
			}
		});	
	} else {
		response.redirect("back");
	}
}

//middleware to check if logged in
middlewareObj.isLoggedIn = function (request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	response.redirect("/l");
};

module.exports = middlewareObj;