'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PreviousResto = mongoose.model('PreviousResto'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, previousResto;

/**
 * PreviousResto routes tests
 */
describe('PreviousResto CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new PreviousResto
		user.save(function() {
			previousResto = {
				name: 'PreviousResto Name'
			};

			done();
		});
	});

	it('should be able to save PreviousResto instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new PreviousResto
				agent.post('/previousRestos')
					.send(previousResto)
					.expect(200)
					.end(function(previousRestoSaveErr, previousRestoSaveRes) {
						// Handle PreviousResto save error
						if (previousRestoSaveErr) done(previousRestoSaveErr);

						// Get a list of PreviousRestos
						agent.get('/previousRestos')
							.end(function(previousRestosGetErr, previousRestosGetRes) {
								// Handle PreviousResto save error
								if (previousRestosGetErr) done(previousRestosGetErr);

								// Get PreviousRestos list
								var previousRestos = previousRestosGetRes.body;

								// Set assertions
								(previousRestos[0].user._id).should.equal(userId);
								(previousRestos[0].name).should.match('PreviousResto Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save PreviousResto instance if not logged in', function(done) {
		agent.post('/previousRestos')
			.send(previousResto)
			.expect(401)
			.end(function(previousRestoSaveErr, previousRestoSaveRes) {
				// Call the assertion callback
				done(previousRestoSaveErr);
			});
	});

	it('should not be able to save PreviousResto instance if no name is provided', function(done) {
		// Invalidate name field
		previousResto.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new PreviousResto
				agent.post('/previousRestos')
					.send(previousResto)
					.expect(400)
					.end(function(previousRestoSaveErr, previousRestoSaveRes) {
						// Set message assertion
						(previousRestoSaveRes.body.message).should.match('Please fill PreviousResto name');
						
						// Handle PreviousResto save error
						done(previousRestoSaveErr);
					});
			});
	});

	it('should be able to update PreviousResto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new PreviousResto
				agent.post('/previousRestos')
					.send(previousResto)
					.expect(200)
					.end(function(previousRestoSaveErr, previousRestoSaveRes) {
						// Handle PreviousResto save error
						if (previousRestoSaveErr) done(previousRestoSaveErr);

						// Update PreviousResto name
						previousResto.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing PreviousResto
						agent.put('/previousRestos/' + previousRestoSaveRes.body._id)
							.send(previousResto)
							.expect(200)
							.end(function(previousRestoUpdateErr, previousRestoUpdateRes) {
								// Handle PreviousResto update error
								if (previousRestoUpdateErr) done(previousRestoUpdateErr);

								// Set assertions
								(previousRestoUpdateRes.body._id).should.equal(previousRestoSaveRes.body._id);
								(previousRestoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of PreviousRestos if not signed in', function(done) {
		// Create new PreviousResto model instance
		var previousRestoObj = new PreviousResto(previousResto);

		// Save the PreviousResto
		previousRestoObj.save(function() {
			// Request PreviousRestos
			request(app).get('/previousRestos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single PreviousResto if not signed in', function(done) {
		// Create new PreviousResto model instance
		var previousRestoObj = new PreviousResto(previousResto);

		// Save the PreviousResto
		previousRestoObj.save(function() {
			request(app).get('/previousRestos/' + previousRestoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', previousResto.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete PreviousResto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new PreviousResto
				agent.post('/previousRestos')
					.send(previousResto)
					.expect(200)
					.end(function(previousRestoSaveErr, previousRestoSaveRes) {
						// Handle PreviousResto save error
						if (previousRestoSaveErr) done(previousRestoSaveErr);

						// Delete existing PreviousResto
						agent.delete('/previousRestos/' + previousRestoSaveRes.body._id)
							.send(previousResto)
							.expect(200)
							.end(function(previousRestoDeleteErr, previousRestoDeleteRes) {
								// Handle PreviousResto error error
								if (previousRestoDeleteErr) done(previousRestoDeleteErr);

								// Set assertions
								(previousRestoDeleteRes.body._id).should.equal(previousRestoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete PreviousResto instance if not signed in', function(done) {
		// Set PreviousResto user
		previousResto.user = user;

		// Create new PreviousResto model instance
		var previousRestoObj = new PreviousResto(previousResto);

		// Save the PreviousResto
		previousRestoObj.save(function() {
			// Try deleting PreviousResto
			request(app).delete('/previousRestos/' + previousRestoObj._id)
			.expect(401)
			.end(function(previousRestoDeleteErr, previousRestoDeleteRes) {
				// Set message assertion
				(previousRestoDeleteRes.body.message).should.match('User is not logged in');

				// Handle PreviousResto error error
				done(previousRestoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PreviousResto.remove().exec();
		done();
	});
});
