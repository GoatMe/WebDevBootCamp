var express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground = require("./model/campground"),
	seedDB = require("./seeds"),
	Comment = require("./model/comment"),
	User = require("./model/user");

//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true,
   useUnifiedTopology: true });

app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));

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

//MIDDLEWARE to inlcude user details to check if they are logged in
//it will be exectured before all routes
app.use(function(request, response, next){
	response.locals.currentUser=  request.user;
	response.locals.error = request.flash("error");
	response.locals.success = request.flash("success");
	next();
});

/*====================ROUTES===========================*/

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

/*===================CONNECTION============================*/
app.listen(3000, function () {
	console.log("YelpCamp Started!");
});