const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const app = express();

let campgrounds = [
  {name: 'Bear Bones Creek', image: 'http://source.unsplash.com/4aKmjx7xYHA'},
  {name: 'Cherry Springs', image: 'http://source.unsplash.com/DgSnapS1itA'},
  {name: 'Dripping Springs', image: 'http://source.unsplash.com/gcCcIy6Fc_M'},
  {name: 'Bear Bones Creek', image: 'http://source.unsplash.com/4aKmjx7xYHA'},
  {name: 'Cherry Springs', image: 'http://source.unsplash.com/DgSnapS1itA'},
  {name: 'Dripping Springs', image: 'http://source.unsplash.com/gcCcIy6Fc_M'},
];


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
  res.render('landing')

});

app.get('/campgrounds', function(req,res){
  res.render('campgrounds', {campgrounds: campgrounds})

});

app.get('/campgrounds/new', function(req, res){
  res.render('new')
})

app.post('/campgrounds', function(req,res){
  //get data from form and add to campgrounds[]
  //redir to campgrounds
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = {name: name, image: image};
  campgrounds.push(newCampground)
  res.redirect('/campgrounds')
});

app.listen(3000, '127.0.0.1', function(){
  console.log('Initializing YelpCamp server...')

});
