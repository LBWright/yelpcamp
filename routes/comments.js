let express = require('express');
let router = express.Router({mergeParams: true});
const passport = require('passport')
let Campground = require('../models/campground')
let Comment = require('../models/comment')
let User = require('../models/user')
//==============================
//    Comments Routes
//==============================
//comments new
router.get('/new', isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err){
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      res.render('comments/new', {campground: campground});
    }
  })
});

//comments create
router.post('/', isLoggedIn, function(req, res){
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
//middleware

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
