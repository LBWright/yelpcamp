const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express();
let Campground = require('./models/campground')
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
        res.render('index', {campgrounds: campgrounds})
    }
  });

});

app.get('/campgrounds/new', function(req, res){
  res.render('new');
})

//SHOW route
app.get('/campgrounds/:id', function(req, res){
  //find campground id and render show page
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if (err){
      console.log(error)
    } else {
      console.log(foundCampground)
      res.render('show', {campground: foundCampground})
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
      console.log(err)
    }else {
        res.redirect('/campgrounds')
    }
  })
});

app.listen(3000, '127.0.0.1', function(){
  console.log('Initializing YelpCamp server...')

});
