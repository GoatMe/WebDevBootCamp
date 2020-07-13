var express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true,
   useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

/*====================SCHEMA===========================*/
var campgroundSchema = new mongoose.Schema({
	name: String,
	img: String,
	desc: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
/*====================ROUTES===========================*/
app.get('/', function(request, response){
	response.render("landing");

});

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

app.get('/campgrounds/new', function(request, response){
	response.render("new.ejs");
});

app.get('/campgrounds/:id', function (request, response) {
	Campground.findById(request.params.id, function(err, findCamp){
		if (err) {

		}else{
			response.render("show", {cg: findCamp});
		}
	});
});

/*===================CONNECTION============================*/
app.listen(3000, function () {
	console.log("YelpCamp Started!");
});