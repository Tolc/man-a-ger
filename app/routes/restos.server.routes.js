'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var restos = require('../../app/controllers/restos.server.controller');

    // Upload
    var multiparty = require('connect-multiparty');
    var multipartyMiddleware = multiparty();
    app.route('/restos/upload-pic/:restoId')
        .post(users.hasAuthorization(['admin']), multipartyMiddleware, restos.uploadPic);

	// Restos Routes
	app.route('/restos')
		.get(restos.list)
		.post(users.hasAuthorization(['admin']), restos.create);

	app.route('/restoday')
		.post(restos.today);

	app.route('/restos/:restoId')
		.get(restos.read)
		.put(users.hasAuthorization(['admin']), restos.hasAuthorization, restos.update)
		.delete(users.hasAuthorization(['admin']), restos.hasAuthorization, restos.delete);

	// Finish by binding the Resto middleware
	app.param('restoId', restos.restoByID);
};
