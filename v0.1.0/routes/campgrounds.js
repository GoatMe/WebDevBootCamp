var express = require("express"),
	router = express.Router(),
	Campground = require("../model/campground"),
	Comment = require("../model/comment");


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
router.post('/', function(request, response){
	//Get data from form and add to campgrounds array
	var name = request.body.name;
	var img = request.body.img;
	var desc = request.body.desc;
	var newCg = {name: name, img: img, desc: desc};
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
router.get('/new', function(request, response){
	response.render("campgrounds/new");
});

//SHOW ROUTE - shows more info about one campground
router.get('/:id', function (request, response) {
	//finding comments by id -> populating comments -> with .exec executing the function
	Campground.findById(request.params.id).populate("comments").exec(function(err, findCamp){
		if (err) {
			console.log(err);
		}else{
			response.render("campgrounds/show", {cg: findCamp});
			// console.log(findCamp);
		}
	});
});

module.exports = router;