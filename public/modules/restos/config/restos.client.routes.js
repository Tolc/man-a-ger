'use strict';

//Setting up route
angular.module('restos').config(['$stateProvider',
	function($stateProvider) {
		// Restos state routing
		$stateProvider.
		state('listRestos', {
			url: '/restos',
			templateUrl: 'modules/restos/views/list-restos.client.view.html'
		}).
		state('createResto', {
			url: '/restos/create',
			templateUrl: 'modules/restos/views/create-resto.client.view.html'
		}).
		state('viewResto', {
			url: '/restos/:restoId',
			templateUrl: 'modules/restos/views/view-resto.client.view.html'
		}).
		state('editResto', {
			url: '/restos/:restoId/edit',
			templateUrl: 'modules/restos/views/edit-resto.client.view.html'
		});
	}
]);