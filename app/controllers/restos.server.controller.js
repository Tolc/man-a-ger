'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	uploadHandler = require('./upload.server.controller'),
	Resto = mongoose.model('Resto'),
	PreviousResto = mongoose.model('PreviousResto'),
	_ = require('lodash');

/**
 * Create a Resto
 */
exports.create = function(req, res) {
	var resto = new Resto(req.body);
	resto.user = req.user;

	resto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(resto);
		}
	});
};

/**
 * Show the current Resto
 */
exports.read = function(req, res) {
	console.log(req.resto);
	res.jsonp(req.resto);
};

/**
 * Update a Resto
 */
exports.update = function(req, res) {
	var resto = req.resto ;

	resto = _.extend(resto , req.body);

	resto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(resto);
		}
	});
};

/**
 * Delete a Resto
 */
exports.delete = function(req, res) {
	var resto = req.resto ;

	resto.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(resto);
		}
	});
};

/**
 * List of Restos
 */
exports.list = function(req, res) { 
	Resto.find().sort('-created').populate('user', 'displayName').exec(function(err, restos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(restos);
		}
	});
};

/**
 * Resto middleware
 */
exports.restoByID = function(req, res, next, id) { 
	Resto.findById(id).populate('user', 'displayName').exec(function(err, resto) {
		if (err) return next(err);
		if (! resto) return next(new Error('Failed to load Resto ' + id));
		req.resto = resto ;
		next();
	});
};

/**
 * Resto authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.resto.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};



//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}
/**
 * Get todays Resto
 * Here's where the magic happens
 */
exports.today = function(req, res) {
	var todayResto;
	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
	var almostTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
	PreviousResto.findOne({'created': {'$gte': today, '$lte': almostTomorrow}}).populate('resto').exec(function (err, previousResto) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if(previousResto) {
				res.jsonp(previousResto);
			} else {
				Resto.find().exec(function (err, restos) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						//Random strategy
						//todayResto = restos[Math.floor(Math.random() * restos.length)];

						//Score strategy
						var proximityWeight = 1;
						var healthinessWeight = 1.25;
						var probArray = [];
						for (var i=0; i < restos.length; i++) {
							var resto = restos[i];
							var score = Math.floor(resto.proximity * proximityWeight + resto.healthiness * healthinessWeight);
							for (var j=0; j < score; j++) {
								probArray.push(i);
							}
						}
						probArray = shuffle(probArray);
						todayResto = restos[probArray[Math.floor(Math.random() * probArray.length)]];
						//Save as previousResto
						var previousResto = new PreviousResto({
							resto: todayResto
						});
						previousResto.save(function (err) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								//res.jsonp(previousResto);
								//Recursive call to get resto populated
								exports.today(req, res);
							}
						});
						//End of score strategy
					}
				});
			}
		}
	});

};



exports.uploadPic = function(req, res) {
    var resto = req.resto;

    // We are able to access req.files.file thanks to
    // the multiparty middleware
    var file = req.files.file;
    //console.log(file.name);
    //console.log(file.type);
    //console.log(file.size);
    //console.log(file.path);


    uploadHandler.storeFile('restos', file, resto._id, function(uploadPath, err) {
        if (err) {
            return res.status(500).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            resto.image = uploadPath;
            resto.save(function(err) {
                if (err) {
                    return res.status(500).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(resto);
                }
            });
        }
    });
}
