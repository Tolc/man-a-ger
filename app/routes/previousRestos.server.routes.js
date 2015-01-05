'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var previousRestos = require('../../app/controllers/previousRestos.server.controller');

	// PreviousRestos Routes
	app.route('/previousRestos')
		.get(previousRestos.list)
		.post(users.hasAuthorization(['admin']), previousRestos.create);

	app.route('/previousRestos/:previousRestoId')
		.get(previousRestos.read)
		.put(users.hasAuthorization(['admin']), previousRestos.hasAuthorization, previousRestos.update)
		.delete(users.hasAuthorization(['admin']), previousRestos.hasAuthorization, previousRestos.delete);

	// Finish by binding the PreviousResto middleware
	app.param('previousRestoId', previousRestos.previousRestoByID);
};
