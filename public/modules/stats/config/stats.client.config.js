'use strict';

//Configuring the Stats module
angular.module('stats').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'My Stats', 'stats', 'dropdown', '/stats', false, ['user']);
		//Menus.addSubMenuItem('topbar', 'stats', 'List Stats', 'stats');
		//Menus.addSubMenuItem('topbar', 'stats', 'New Stat', 'stats/create');
	}
]);
