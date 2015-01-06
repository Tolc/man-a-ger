'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Vote = mongoose.model('Vote'),
	_ = require('lodash');

/**
 * Create a Vote
 */
exports.create = function(req, res) {
	var vote = new Vote(req.body);
	//vote.user = req.user;


	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
	var almostTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
	Vote.findOne({'created': {'$gte': today, '$lte': almostTomorrow}, 'resto': vote.resto}).exec(function (err, exVote) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if(exVote) {
				var alreadyVoted = false;
				for (var i = 0; i < exVote.users.length; i++) {
					if(exVote.users[i]._id === req.user._id) {
						alreadyVoted = true;
						break;
					}
				}
				if(alreadyVoted) {
					return res.status(400).send({
						message: 'User already voted today'
					});
				} else {
					exVote.users.push(req.user);
					exVote.save(function(err) {
						if (err) {
							console.log(err);
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							res.jsonp(exVote);
						}
					});
				}
			} else {
				vote.users = [req.user];
				vote.save(function(err) {
					if (err) {
						console.log(err);
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(vote);
					}
				});
			}
		}
	});
};

/**
 * Show the current Vote
 */
exports.read = function(req, res) {
	res.jsonp(req.vote);
};

/**
 * Update a Vote
 */
exports.update = function(req, res) {
	var vote = req.vote ;

	vote = _.extend(vote , req.body);

	vote.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vote);
		}
	});
};

/**
 * Delete a Vote
 */
exports.delete = function(req, res) {
	var vote = req.vote ;

	vote.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vote);
		}
	});
};

/**
 * List of Votes
 */
exports.list = function(req, res) { 
	Vote.find().sort('-created').populate('users', 'displayName').populate('resto', 'name').exec(function(err, votes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(votes);
		}
	});
};

/**
 * Vote middleware
 */
exports.voteByID = function(req, res, next, id) { 
	Vote.findById(id).populate('users', 'displayName').populate('resto', 'name').exec(function(err, vote) {
		if (err) return next(err);
		if (! vote) return next(new Error('Failed to load Vote ' + id));
		req.vote = vote ;
		next();
	});
};

/**
 * Vote authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.vote.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


/**
 * Get todays Votes
 */
exports.todayVotes = function(req, res) {
	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
	var almostTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
	Vote.find({'created': {'$gte': today, '$lte': almostTomorrow}}).populate('users').populate('resto').exec(function (err, todayVotes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(todayVotes);
			res.jsonp(todayVotes);
		}
	});
};
