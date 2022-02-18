//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
const bodyparser = require('body-parser');
const path = require('path');
const Employee = require('./server/model/employeeSchema');
require('dotenv').config()
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 8080

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI)

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('./public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project
//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form
//Added body-parser
app.use(bodyparser.urlencoded({extended: true}))
//Added set view engine as well
app.set('view engine', 'ejs')


//load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))


//___________________
// Routes
//___________________
//localhost:3000


app.get('/',(req, res) => {
  Employee.find({}, (error, data) => {
    res.render('index', {
    employees: data
    });
  })

});

app.get('/add_user',(req, res) => {
  res.render('./add_user.ejs');
});

app.get('/update_user/:id', (req, res) => {
  Employee.findById(req.params.id, (error, employee) => {
    res.render('update_user', {
      employee: employee
    });
  })
})

app.post('/add_user', (req, res)=> {
  Employee.create(req.body, (error, createdEmployee) => {
    console.log(createdEmployee);
    res.redirect('/')
  })
});

app.delete('/delete/:id', (req, res)=> {
  Employee.findByIdAndRemove(req.params.id, (error, employee) => {
    res.send(employee)
  });
});
//___________________
//Listener
//___________________
app.listen(3000, () => console.log( 'Listening on port:', 3000));
