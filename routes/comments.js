let express = require('express');
let router = express.Router({mergeParams: true});
const passport = require('passport');
let Campground = require('../models/campground');
let Comment = require('../models/comment');
let User = require('../models/user');
let middleware = require('../middleware')

//==============================
//    Comments Routes
//==============================
//comments new
router.get('/new', middleware.isLoggedIn, function(req, res){
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
router.post('/', middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err){
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if (err){
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      })
    }
  })
})

//edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if (err){
      res.redirect('back');
    } else{
      res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
    }
  })

})

//update route
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if (err){
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/'+ req.params.id);
    }
  })
})

//destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err){
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  })
})


module.exports = router;
