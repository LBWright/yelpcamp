const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const LocalStrategy = require('passport-local')
const methodOverride = require('method-override')

//requiring models
const app = express();
let Campground = require('./models/campground')
let Comment = require('./models/comment')
let User = require('./models/user')

//requiring routes
let campgroundRoutes = require('./routes/campground')
let commentRoutes = require('./routes/comments')
let indexRoutes = require('./routes/index')
let seedDB = require('./seeds')
//configs
app.use(flash());
app.use(methodOverride('_method'))
mongoose.connect('mongodb://localhost/yelp_camp')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))

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
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
})
//populate with dummy data
//seedDB();

app.use('/campgrounds',campgroundRoutes);
app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || '127.0.0.1';
app.listen(PORT, IP, function(){
  console.log('Initializing YelpCamp server...');
});
