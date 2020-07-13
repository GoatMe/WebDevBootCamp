var express = require("express");
var	router = express.Router({mergeParams: true});
var	Campground = require("../model/campground"),
	Comment = require("../model/comment"),
	middleware = require("../middleware");

//NEW ROUTE COMMENT
router.get("/new", middleware.isLoggedIn, function(request, response){
	Campground.findById(request.params.id, function(err, campground){
	if (err) {
		console.log(err);
	} else {
		response.render("comments/new", {cg: campground});
	}	
	});
});

//CREATE ROUTE COMMENT
router.post("/", middleware.isLoggedIn, function(request, response){
	//Lookup Campground using id
	Campground.findById(request.params.id, function(err, campground){
		if (err) {
			request.flash("error", "ERROR: Something went wrong.");
			console.log(err);
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
					request.flash("success", "Comment Added!");
					response.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//EDIT ROUTE COMMENT
router.get("/:comment_id/edit",  middleware.isLoggedIn, middleware.CommentOwnerCheck, function(request, response){
	Comment.findById(request.params.comment_id, function(err, foundComment){
		if (err) {
			console.log(err);
		} else {
			response.render("comments/edit", {cg_id: request.params.id, comment: foundComment});

		}
	});
});

//UPDATE ROUTE COMMENT
router.put("/:comment_id", middleware.CommentOwnerCheck, function(request, response){
	Comment.findByIdAndUpdate(request.params.comment_id, request.body.comment, function(err, updatedComment){
		if (err) {
			response.redirect("back");
		} else {
			response.redirect("/campgrounds/" + request.params.id);
		}
	});
});

//DESTROY ROUTE COMMENT
router.delete("/:comment_id", middleware.CommentOwnerCheck, function(request, response){
	Comment.findByIdAndRemove(request.params.comment_id, function(err){
		if (err) {
			request.flash("error", "ERROR: Something went wrong...");
			response.redirect("back");
		} else {
			request.flash("success", "Successfuly deleted comment");
			response.redirect("/campgrounds/"+ request.params.id);
		}
	});
});

module.exports = router;