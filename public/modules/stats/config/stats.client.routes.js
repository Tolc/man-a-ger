'use strict';

//Setting up route
angular.module('stats').config(['$stateProvider',
	function($stateProvider) {
		// Stats state routing
		$stateProvider.
		state('listStats', {
			url: '/stats',
			templateUrl: 'modules/stats/views/list-stats.client.view.html'
		}).
		state('createStat', {
			url: '/stats/create',
			templateUrl: 'modules/stats/views/create-stat.client.view.html'
		}).
		state('viewStat', {
			url: '/stats/:statId',
			templateUrl: 'modules/stats/views/view-stat.client.view.html'
		}).
		state('editStat', {
			url: '/stats/:statId/edit',
			templateUrl: 'modules/stats/views/edit-stat.client.view.html'
		});
	}
]);