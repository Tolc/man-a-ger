'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Resto Schema
 */
var RestoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please enter a name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	proximity: {
		type: Number,
		default: 5,
		min: 0,
		max: 10,
		required: 'Please enter a proximity value'
	},
	healthiness: {
		type: Number,
		default: 5,
		min: 0,
		max: 10,
		required: 'Please enter a healthiness value'
	},
	price: {
		type: Number,
		default: 7,
		min: 0,
		required: 'Please enter a price in €'
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	image: {
		type: String,
		default: '',
		trim: true
	}
});

mongoose.model('Resto', RestoSchema);
