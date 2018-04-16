let Campground = require('../models/campground')
let Comment = require('../models/comment')
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  if (req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if (err){
        res.redirect('back');
      } else {
          if(foundCampground.author.id.equals(req.user._id)){
            next();
          } else{
          res.redirect('back')
          }
      }
    });
  }
    else {
      req.flash('error', 'You can only do that with campgrounds you have created.')
      res.redirect('back')
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
  if (req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if (err){
        res.redirect('back');
      } else {
          if(foundComment.author.id.equals(req.user._id)){
            next();
          } else{
          res.redirect('back');
          }
      }
    });
  }
    else {
      req.flash('error', 'You can only do that with comments you have created.')
      res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'You need to be logged in to do that.')
  res.redirect('/login');
}
module.exports = middlewareObj;
