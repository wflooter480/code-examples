var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//       name: "Granite Hill", 
//       image: "https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg",
//       description: "This is a huge hill made of granite. There are no bathrooms and no running water."

//   }, function(err, campground){
//     if(err){
//       console.log(err);
//     } else {
//       console.log("NEWLY CREATED CAMPGROUND: ");
//       console.log(campground);
//     }
//   });


app.get("/", function(req, res){
  res.render("landing");
});

//INDEX show all campgrounds
app.get("/campgrounds", function(req, res){
  //Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("index",{campgrounds:allCampgrounds});
    }
  });
});

//CREATE - allow user to add new campground
app.post("/campgrounds", function(req, res){
  //get data from form and add to campgrounds array
  let name = req.body.name;
  let image = req.body.image;  
  let desc = req.body.description;
  let newCampground = {name: name, image: image, description: desc}
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      //redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

//show the form for the send data to the post route
app.get("/campgrounds/new", function(req, res){
  res.render("new.ejs");
});


//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
  //find the campground with provided ID
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
        console.log(err);
    } else {
        //render show template with that campground
        res.render("show", {campground: foundCampground}); 
    }
  }); 
});

app.listen(3000, function(){
  console.log("Yelp Camp Server is listening....");
});