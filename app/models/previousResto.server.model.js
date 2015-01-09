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
	},
	views : {
		type: Number,
		default: 0
	}
});

mongoose.model('PreviousResto', PreviousRestoSchema);
