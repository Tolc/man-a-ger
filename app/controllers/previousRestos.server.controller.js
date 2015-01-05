'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	PreviousResto = mongoose.model('PreviousResto'),
	_ = require('lodash');

/**
 * Create a PreviousResto
 */
exports.create = function(req, res) {
	var previousResto = new PreviousResto(req.body);
	//previousResto.user = req.user;

	previousResto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(previousResto);
		}
	});
};

/**
 * Show the current PreviousResto
 */
exports.read = function(req, res) {
	res.jsonp(req.previousResto);
};

/**
 * Update a PreviousResto
 */
exports.update = function(req, res) {
	var previousResto = req.previousResto ;

	previousResto = _.extend(previousResto , req.body);

	previousResto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(previousResto);
		}
	});
};

/**
 * Delete an PreviousResto
 */
exports.delete = function(req, res) {
	var previousResto = req.previousResto ;

	previousResto.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(previousResto);
		}
	});
};

/**
 * List of PreviousRestos
 */
exports.list = function(req, res) { 
	PreviousResto.find().sort('-created').populate('resto', 'name').exec(function(err, previousRestos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(previousRestos);
		}
	});
};

/**
 * PreviousResto middleware
 */
exports.previousRestoByID = function(req, res, next, id) {
	PreviousResto.findById(id).populate('resto', 'name').exec(function(err, previousResto) {
		if (err) return next(err);
		if (! previousResto) return next(new Error('Failed to load PreviousResto ' + id));
		req.previousResto = previousResto ;
		next();
	});
};

/**
 * PreviousResto authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.previousResto.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
