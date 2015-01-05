'use strict';

// Configuring the Articles module
angular.module('restos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Restos', 'restos', 'dropdown', '/restos(/create)?');
		Menus.addSubMenuItem('topbar', 'restos', 'List Restos', 'restos');
		Menus.addSubMenuItem('topbar', 'restos', 'New Resto', 'restos/create', null, false, ['admin']);
	}
]);
