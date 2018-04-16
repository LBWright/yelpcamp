let express = require('express');
const passport = require('passport')
let router = express.Router();
let Campground = require('../models/campground')
let Comment = require('../models/comment')
let User = require('../models/user')
let middleware = require('../middleware')

router.get('/', function(req, res){
  Campground.find({}, function(err, campgrounds){
    if (err){
      console.log(err)
    } else {
        res.render('campgrounds/index', {campgrounds: campgrounds, currentUser: req.user})
    }
  });
});

router.get('/new', middleware.isLoggedIn, function(req, res){
  res.render('campgrounds/new');
})

//SHOW route
router.get('/:id', function(req, res){
  //find campground id and render show page
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if (err){
      console.log(err)
    } else {
      res.render('campgrounds/show', {campground: foundCampground})
    }
  })
})

router.post('/', middleware.isLoggedIn, function(req, res){
  //get data from form and add to campgrounds[]
  //redir to campgrounds
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let author =
  {
    id: req.user._id,
    username: req.user.username
  }
  let newCampground = {name: name, image: image, description: desc, author: author};
  Campground.create(newCampground, function(err, newlyCreated){
    if (err){
      console.log(err);
    } else {
        res.redirect('/campgrounds');
    }
  })
});

//edit campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
  })
})

//update campground route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if (err){
        console.log(err)
        res.redirect('/campgrounds')
      } else {
        req.flash('success', 'Successfully updated campground')
        res.redirect('/campgrounds/'+req.params.id)
      }
  })
})

//destroy campground route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if (err){
      console.log(err);
      res.redirect('/campgrounds')
    }
    req.flash('success', 'Campground successfully deleted.')
    res.redirect('/campgrounds')
  })
})

module.exports = router;
