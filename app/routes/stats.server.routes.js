'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stats = require('../../app/controllers/stats.server.controller');

	// Stats Routes
	app.route('/stats/last-year-votes')
		.get(stats.getLastYearVotes);
    //
	//app.route('/stats/:statId')
	//	.get(stats.read)
	//	.put(users.requiresLogin, stats.hasAuthorization, stats.update)
	//	.delete(users.requiresLogin, stats.hasAuthorization, stats.delete);
    //
	//// Finish by binding the Stat middleware
	//app.param('statId', stats.statByID);
};
