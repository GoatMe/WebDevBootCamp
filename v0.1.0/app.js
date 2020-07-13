var express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	Campground = require("./model/campground"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	seedDB = require("./seeds"),
	Comment = require("./model/comment"),
	User = require("./model/user");


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true,
   useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+ "/public"));

app.set("view engine", "ejs");

// seedDB(); /*For deleting and repopulating the DB on each Server start*/


//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Secret authentication message goes here",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to inlcude user details to check if they are logged in
//it will be exectured before all routes
app.use(function(request, response, next){
	response.locals.currentUser=  request.user;
	next()
});
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
			response.render("campgrounds/index", {cg: allCamps, currentUser: request.user});
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
	response.render("campgrounds/new");
});

// SHOW ROUTE - shows more info about one campground
app.get('/campgrounds/:id', function (request, response) {
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
/*===================COMMENT_ROUTES============================*/
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(request, response){
	Campground.findById(request.params.id, function(err, campground){
	if (err) {
		console.log(err);
	} else {
		response.render("comments/new", {cg: campground});
	}	
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(request, response){
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
					campground.comments.push(comment);
					campground.save();
					response.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

/*====================AUTHENTICATION ROUTES===========================*/

app.get("/r", function(req, res){
	res.render("register");
});

//handle sign up logic
app.post("/r", function(req, res){
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
app.get("/", function(req, res){
	
});

/*====================LOGIN ROUTES===========================*/
//login form
app.get("/l", function(req, res){
	res.render("login");
});

//handling login logic
app.post("/l",
		passport.authenticate("local",
		{
			successRedirect: "/campgrounds",
			failureRedirect: "/l"
		})
		, function(req, res){
});

//logout
app.get("/logout", function(request, response){
	response.logout();
	response.redirect("/campgrounds");
});

//middleware to check if logged in
function isLoggedIn(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	response.redirect("/l");
};

/*===================CONNECTION============================*/
app.listen(3000, function () {
	console.log("YelpCamp Started!");
});