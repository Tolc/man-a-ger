'use strict';

// Configuring the Votes module
angular.module('votes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Votes', 'votes', 'dropdown', '/votes(/create)?', false, ['admin']);
		Menus.addSubMenuItem('topbar', 'votes', 'List Votes', 'votes');
		Menus.addSubMenuItem('topbar', 'votes', 'New Vote', 'votes/create');
	}
]);
