'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Vote Schema
 */
var VoteSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	users: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	resto: {
		type: Schema.ObjectId,
		ref: 'Resto'
	}
});

mongoose.model('Vote', VoteSchema);
