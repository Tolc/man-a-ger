'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	//Stat = mongoose.model('Stat'),
	_ = require('lodash');



/**
 * Stat authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.stat.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
