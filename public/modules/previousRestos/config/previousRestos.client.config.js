'use strict';

// Configuring the Articles module
angular.module('previousRestos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'PreviousRestos', 'previousRestos', 'dropdown', '/previousRestos(/create)?', false, ['admin']);
		Menus.addSubMenuItem('topbar', 'previousRestos', 'List PreviousRestos', 'previousRestos');
		Menus.addSubMenuItem('topbar', 'previousRestos', 'New PreviousResto', 'previousRestos/create');
	}
]);
