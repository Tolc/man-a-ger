'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    Vote = mongoose.model('Vote'),
	_ = require('lodash');



exports.getLastYearVotes = function(req, res) {
    var now = new Date();
    var oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), 0, 0, 0, 0);
    Vote.find({'created': {'$gte': oneYearAgo}, 'users': req.user._id}).populate('resto').exec(function (err, lastYearVotes) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(lastYearVotes);
        }
    });
};

/**
 * Stat authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.stat.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
