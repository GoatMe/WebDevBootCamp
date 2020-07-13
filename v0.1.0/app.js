var express = require("express");
var app = express();

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

/*===============================================*/
	var campgrounds = 
	[
		{name: "Salmon Flake" , img: "https://images.unsplash.com/photo-1502993194517-7734018a0d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1191&q=80"},
		{name: "Eye Openner" , img: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
		{name: "Stay Lost" , img: "https://images.unsplash.com/photo-1562413255-9d8f3188f197?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"},
		{name: "Fill Me" , img: "https://images.unsplash.com/photo-1573145893063-13ae8d51e195?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60"},
		{name: "Too High" , img: "https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80"}
	];

app.get('/', function(request, response){
	response.render("landing");

});

app.get('/campgrounds', function(request, response){

	response.render("campgrounds", {cg: campgrounds});
});

app.post('/campgrounds', function(request, response){
	//Get data from form and add to campgrounds array
	var name = request.body.name;
	var img = request.body.img;
	var newCg = {name: name, img: img};
	campgrounds.push(newCg);
	response.redirect("/campgrounds");
});

app.get('/campgrounds/new', function(request, response){
	response.render("new.ejs");
});

/*===============================================*/
app.listen(3000, function () {
	console.log("YelpCamp Started!");
});