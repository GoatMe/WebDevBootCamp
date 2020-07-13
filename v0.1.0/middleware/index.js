var Campground = require("../model/campground");
var Comment = require("../model/comment");

//all the middleware goes here

var middlewareObj = {};

middlewareObj.CampgroundOwnerCheck = function (request, response, next){
		if (request.isAuthenticated()) {
		//verify post-user ownership 
		Campground.findById(request.params.id, function(err, foundCamp){
			if (err || !foundCamp) {
				request.flash("error", "Campground not found...");
				response.redirect("back");
			} else if (foundCamp.author.id.equals(request.user._id) || request.user.isAdmin) { 
				//check if user own the post
				//using mongoose "equal" methos to check if equal
				request.campground = foundCamp;
				next();
				} else	{
					request.flash("error", "You don't have permission to do that...");
					response.redirect("/campgrounds" + request.params.id);
				}
		});
	}else{
		request.flash("error", "You need to be logged in!");
		response.redirect("back"); //sends user one page back
	}
}

middlewareObj.CommentOwnerCheck = function (request, response, next){
	if (request.isAuthenticated) {
		Comment.findById(request.params.comment_id, function(err, foundComment){
			if (err || !foundComment) {
				request.flash("error", "ERROR: Comment not found...");	
				response.redirect("/campgrounds");
			} else {
				//is user owner of comment check
				if (foundComment.author.id.equals(request.user._id) || request.user.isAdmin) {
					request.comment = foundComment;
					next();
				} else{
					request.flash("error", "You don't have permission to do that...");
					response.redirect("/campgrounds/" + request.params.id);
				}
			}
		});	
	} else {
		request.flash("error", "You need to be logged in!");
		response.redirect("back");
	}
}

//middleware to check if logged in
middlewareObj.isLoggedIn = function (request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	request.flash("error", "You need to be logged in!");
	response.redirect("/l");
};

module.exports = middlewareObj;