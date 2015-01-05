'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Resto = mongoose.model('Resto'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, resto;

/**
 * Resto routes tests
 */
describe('Resto CRUD tests', function() {
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

		// Save a user to the test db and create new Resto
		user.save(function() {
			resto = {
				name: 'Resto Name'
			};

			done();
		});
	});

	it('should be able to save Resto instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Resto
				agent.post('/restos')
					.send(resto)
					.expect(200)
					.end(function(restoSaveErr, restoSaveRes) {
						// Handle Resto save error
						if (restoSaveErr) done(restoSaveErr);

						// Get a list of Restos
						agent.get('/restos')
							.end(function(restosGetErr, restosGetRes) {
								// Handle Resto save error
								if (restosGetErr) done(restosGetErr);

								// Get Restos list
								var restos = restosGetRes.body;

								// Set assertions
								(restos[0].user._id).should.equal(userId);
								(restos[0].name).should.match('Resto Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Resto instance if not logged in', function(done) {
		agent.post('/restos')
			.send(resto)
			.expect(401)
			.end(function(restoSaveErr, restoSaveRes) {
				// Call the assertion callback
				done(restoSaveErr);
			});
	});

	it('should not be able to save Resto instance if no name is provided', function(done) {
		// Invalidate name field
		resto.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Resto
				agent.post('/restos')
					.send(resto)
					.expect(400)
					.end(function(restoSaveErr, restoSaveRes) {
						// Set message assertion
						(restoSaveRes.body.message).should.match('Please fill Resto name');
						
						// Handle Resto save error
						done(restoSaveErr);
					});
			});
	});

	it('should be able to update Resto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Resto
				agent.post('/restos')
					.send(resto)
					.expect(200)
					.end(function(restoSaveErr, restoSaveRes) {
						// Handle Resto save error
						if (restoSaveErr) done(restoSaveErr);

						// Update Resto name
						resto.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Resto
						agent.put('/restos/' + restoSaveRes.body._id)
							.send(resto)
							.expect(200)
							.end(function(restoUpdateErr, restoUpdateRes) {
								// Handle Resto update error
								if (restoUpdateErr) done(restoUpdateErr);

								// Set assertions
								(restoUpdateRes.body._id).should.equal(restoSaveRes.body._id);
								(restoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Restos if not signed in', function(done) {
		// Create new Resto model instance
		var restoObj = new Resto(resto);

		// Save the Resto
		restoObj.save(function() {
			// Request Restos
			request(app).get('/restos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Resto if not signed in', function(done) {
		// Create new Resto model instance
		var restoObj = new Resto(resto);

		// Save the Resto
		restoObj.save(function() {
			request(app).get('/restos/' + restoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', resto.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Resto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Resto
				agent.post('/restos')
					.send(resto)
					.expect(200)
					.end(function(restoSaveErr, restoSaveRes) {
						// Handle Resto save error
						if (restoSaveErr) done(restoSaveErr);

						// Delete existing Resto
						agent.delete('/restos/' + restoSaveRes.body._id)
							.send(resto)
							.expect(200)
							.end(function(restoDeleteErr, restoDeleteRes) {
								// Handle Resto error error
								if (restoDeleteErr) done(restoDeleteErr);

								// Set assertions
								(restoDeleteRes.body._id).should.equal(restoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Resto instance if not signed in', function(done) {
		// Set Resto user 
		resto.user = user;

		// Create new Resto model instance
		var restoObj = new Resto(resto);

		// Save the Resto
		restoObj.save(function() {
			// Try deleting Resto
			request(app).delete('/restos/' + restoObj._id)
			.expect(401)
			.end(function(restoDeleteErr, restoDeleteRes) {
				// Set message assertion
				(restoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Resto error error
				done(restoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Resto.remove().exec();
		done();
	});
});