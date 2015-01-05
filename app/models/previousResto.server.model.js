'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * PreviousResto Schema
 */
var PreviousRestoSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	resto: {
		type: Schema.ObjectId,
		ref: 'Resto'
	}
});

mongoose.model('PreviousResto', PreviousRestoSchema);
