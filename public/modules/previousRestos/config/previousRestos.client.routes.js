'use strict';

//Setting up route
angular.module('previousRestos').config(['$stateProvider',
	function($stateProvider) {
		// PreviousRestos state routing
		$stateProvider.
		state('listPreviousRestos', {
			url: '/previousRestos',
			templateUrl: 'modules/previousRestos/views/list-previousRestos.client.view.html'
		}).
		state('createPreviousResto', {
			url: '/previousRestos/create',
			templateUrl: 'modules/previousRestos/views/create-previousResto.client.view.html'
		}).
		state('viewPreviousResto', {
			url: '/previousRestos/:previousRestoId',
			templateUrl: 'modules/previousRestos/views/view-previousResto.client.view.html'
		}).
		state('editPreviousResto', {
			url: '/previousRestos/:previousRestoId/edit',
			templateUrl: 'modules/previousRestos/views/edit-previousResto.client.view.html'
		});
	}
]);
