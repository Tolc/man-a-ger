'use strict';

//Restos service used to communicate Restos REST endpoints
angular.module('restos').factory('Restos', ['$resource',
	function($resource) {
		return $resource(
			'restos/:restoId',
			{
				restoId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			}
		);
	}
]);

//TodayResto service used to communicate with TodayResto REST endpoint
angular.module('restos').factory('TodayResto', ['$resource',
	function($resource) {
		return $resource(
			'restoday',
			{},
			{
				today: {
					method: 'POST'
				}
			}
		);
	}
]);
