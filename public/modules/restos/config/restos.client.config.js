'use strict';

// Configuring the Articles module
angular.module('restos')
    .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
        GoogleMapApi.configure({
//    key: 'your api key',
//            libraries: 'weather,geometry,visualization',
            v: '3.17'
        });
    }])
    .run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Restos', 'restos', 'dropdown', '/restos(/create)?');
		Menus.addSubMenuItem('topbar', 'restos', 'List Restos', 'restos');
		Menus.addSubMenuItem('topbar', 'restos', 'New Resto', 'restos/create', null, false, ['admin']);
	}
]);
