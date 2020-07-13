var express = require("express"),
	router = express.Router(),
	Campground = require("../model/campground"),
	Comment = require("../model/comment"),
	middleware = require("../middleware");


//INDEX ROUTE - show all campgrounds
router.get('/', function(request, response){
	Campground.find({}, function(err, allCamps){
		if (err) {
			console.log(err);
		}else{
			response.render("campgrounds/index", {cg: allCamps, currentUser: request.user});
		}
	});
});

//CREATE Route - add new campground to DB
router.post('/', middleware.isLoggedIn, function(request, response){
	//Get data from form and add to campgrounds array
	var name = request.body.name;
	var img = request.body.img;
	var desc = request.body.desc;
	var price = request.body.price;
	var author = {
					id: request.user._id,
					username: request.user.username
				}
	var newCg = {name: name, img: img, desc: desc, author: author};
	//Crate a new Camp data and save to DB
	Campground.create(newCg, function(err, newCamp){
		if (err) {
			console.log("Ooopsy!!!", err);
		} else {
			//redirect back to campgrounds page
			response.redirect('/campgrounds');
		}
	});
});

//NEW ROUTE - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(request, response){
	response.render("campgrounds/new");
});

//SHOW ROUTE - shows more info about one campground
router.get('/:id', function (request, response) {
	//finding comments by id -> populating comments -> with .exec executing the function
	Campground.findById(request.params.id).populate("comments").exec(function(err, findCamp){
		if (err || !findCamp) {
			console.log(err);
			request.flash('error', 'Sorry, that campground does not exist!');
			return response.redirect('/campgrounds');
		}
			response.render("campgrounds/show", {cg: findCamp});
			// console.log(findCamp);
	});
});

//EDIT Campground ROUTE
router.get("/:id/edit", middleware.isLoggedIn, middleware.CampgroundOwnerCheck , function(request, response){
	Campground.findById(request.params.id, function(err, foundCamp){
		if (err) {
			console.log(err);
			request.flash("error", "ERROR: Can't Edit Campground.");
			response.redirect("/campgrounds");
		} else {
				response.render("campgrounds/edit", {cg: foundCamp});
		}
	});
});

//UPDATE campground ROUTE
router.put("/:id", middleware.CampgroundOwnerCheck, function(request, response){
	//find and update the correct campground
	Campground.findByIdAndUpdate(request.params.id, request.body.campground, function(err, UpdatedCamp){
		if (err) {
			request.flash("error", "ERROR: Can't Update campground");
			console.log(err);
		} else {
			response.redirect("/campgrounds/" + request.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/:id", middleware.CampgroundOwnerCheck,function(request, response){
	Campground.findByIdAndRemove(request.params.id, function(err){
		if (err) {
			console.logged(err);
			equest.flash("error", "ERROR: Something went wrong...");
			response.redirect("/campgrounds");
		} else {
			request.flash("success", "Successfuly deleted comment");
			response.redirect("/campgrounds");
		}
	})
});

module.exports = router;