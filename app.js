const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const app = express();
let Campground = require('./models/campground')
let Comment = require('./models/comment')
let User = require('./models/user')
let seedDB = require('./seeds')

//passport configurations
app.use(require('express-session')({
  secret: 'Parker is the name of my son',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

//configurations
mongoose.connect('mongodb://localhost/yelp_camp')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
})
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
        res.render('campgrounds/index', {campgrounds: campgrounds, currentUser: req.user})
    }
  });
});

app.get('/campgrounds/new', isLoggedIn, function(req, res){
  res.render('campgrounds/new');
})

//SHOW route
app.get('/campgrounds/:id', function(req, res){
  //find campground id and render show page
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if (err){
      console.log(err)
    } else {
      res.render('campgrounds/show', {campground: foundCampground})
    }
  })
})

app.post('/campgrounds', isLoggedIn, function(req,res){
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

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err){
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      res.render('comments/new', {campground: campground});
    }
  })
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
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

//=============================
// Authentication Routes
//=============================

//show register form
app.get('/register', function(req, res){
  res.render('register')
})

//signup logic
app.post('/register', function(req, res){
  let newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, function(err, user){
    if (err){
      console.log(err)
      return res.render('/register')
    }
    passport.authenticate('local')(req,res,function(){
      res.redirect('/campgrounds')
    })
  })
})

//show login form
app.get('/login', function(req, res){
    res.render('login')
})

//handle login logic
app.post('/login', passport.authenticate('local',
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }), function(req,res){
})

//logout route
app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/campgrounds')
})

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

app.listen(3000, '127.0.0.1', function(){
  console.log('Initializing YelpCamp server...');
});
