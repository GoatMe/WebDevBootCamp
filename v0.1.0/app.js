var express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	Campground = require("./modules/campground"),
	seedDB = require("./seeds")/*,
	User = require("user")*/;


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true,
   useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

seedDB(); /*For deleting and repopulating the DB on each Server start*/

/*====================ROUTES===========================*/
app.get('/', function(request, response){
	response.render("landing");

});

//INDEX ROUTE - show all campgrounds
app.get('/campgrounds', function(request, response){

	Campground.find({}, function(err, allCamps){
		if (err) {
			console.log(err);
		}else{
			response.render("index", {cg: allCamps});
		}
	});
});

app.post('/campgrounds', function(request, response){
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
app.get('/campgrounds/new', function(request, response){
	response.render("new.ejs");
});

// SHOW ROUTE - shows more info about one campground
app.get('/campgrounds/:id', function (request, response) {
	//finding comments by id -> populating comments -> with .exec executing the function
	Campground.findById(request.params.id).populate("comments").exec(function(err, findCamp){
		if (err) {
			console.log(err);
		}else{
			response.render("show", {cg: findCamp});
			// console.log(findCamp);
		}
	});
});

/*===================CONNECTION============================*/
app.listen(3000, function () {
	console.log("YelpCamp Started!");
});