const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express();
let Campground = require('./models/campground')
let Comment = require('./models/comment')
let seedDB = require('./seeds')

//configurations
mongoose.connect('mongodb://localhost/yelp_camp')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
//populate with dummy data
seedDB();

app.get('/', function(req, res){
  res.render('landing')
});

app.get('/campgrounds', function(req,res){
  Campground.find({}, function(err, campgrounds){
    if (err){
      console.log(err)
    } else {
        res.render('campgrounds/index', {campgrounds: campgrounds})
    }
  });
});

app.get('/campgrounds/new', function(req, res){
  res.render('campgrounds/new');
})

//SHOW route
app.get('/campgrounds/:id', function(req, res){
  //find campground id and render show page
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if (err){
      console.log(err)
    } else {
      console.log(foundCampground)
      res.render('campgrounds/show', {campground: foundCampground})
    }
  })
})

app.post('/campgrounds', function(req,res){
  //get data from form and add to campgrounds[]
  //redir to campgrounds
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newCampground = {name: name, image: image, description: desc};
  Campground.create(newCampground, function(err, newlyCreated){
    if (err){
      console.log(err);
    } else {
        res.redirect('/campgrounds');
    }
  })
});

//==============================
//    Comments Routes
//==============================

app.get('/campgrounds/:id/comments/new', function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err){
      console.log(err);;
      res.redirect('/campgrounds');
    } else {
      res.render('comments/new', {campground: campground});
    }
  })
});

app.post('/campgrounds/:id/comments', function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err){
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if (err){
          console.log(err)
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id)
        }
      })
    }
  })
})

app.listen(3000, '127.0.0.1', function(){
  console.log('Initializing YelpCamp server...');
});
