// server.js

// BASE SETUP
// ==================================================================

// call the packages we need
var express = require('express');	// call express
var app = express();	// define the app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var User = require('./app/models/users');

// connecting to database
mongoose.connect('mongodb://salehk:salehrocks@ds051750.mongolab.com:51750/apitesting');

// configure app to use bodyParser()
// this will let the app get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR THE API
// ===================================================================
var router = express.Router();	// get an instance of the express Router

// middleware to use for all requests 
router.use(function(req, res, next) {
	// do logging 
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

// more routes will be placed here

// routes that end in /users
// ------------------------------------------------------------------
router.route('/users')
	
	//create a user (accessed at POST http://localhost:8080/api/users)
	.post(function(req, res) {
		var user = new User();
		user.name = req.body.name,
		user.email = req.body.email,
		user.password = req.body.password;

		// save the user and check for errors
		user.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'User created!' });
		});
	})

	// get all the users (accessed at GET http://localhost:8080/api/users)
	.get(function(req, res) {
		User.find(function(err, users) {
			if(err)
				res.send(err);

			res.json(users);
		});
	});

// routes that end in /users/:user_id
// ------------------------------------------------------------------------
router.route('/users/:user_id')

	// get the user with a specific id (accessed at GET http://localhost:8080/api/users/:user_id)
	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if(err)
				res.send(err);
			
			res.json(user);
		});
	})

	// update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
	.put(function(req, res) {

		// user our user model to find the user we want
		User.findById(req.params.user_id, function(err, user) {
			if(err)
				res.send(err)

			user.name = req.body.name,
			user.email = req.body.email,
			user.password = req.body.password

			// save the user
			user.save(function(err) {
				if(err)
					res.send(err)

				res.json({ message: 'User Updated!' });
			});
		});
	})

	.delete(function(req, res) {
		User.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if(err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// REGISTER OUR ROUTES ----------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER 
// ===================================================================
app.listen(port);
console.log('Magic happens on port ' + port);