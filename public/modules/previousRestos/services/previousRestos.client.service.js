'use strict';

//PreviousRestos service used to communicate PreviousRestos REST endpoints
angular.module('previousRestos').factory('PreviousRestos', ['$resource',
	function($resource) {
		return $resource('previousRestos/:previousRestoId', { previousRestoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//IncrementToday service used to communicate with IncrementToday REST endpoint
angular.module('previousRestos').factory('IncrementToday', ['$resource',
	function($resource) {
		return $resource(
			'incrementToday',
			{},
			{
				increment: {
					method: 'POST'
				}
			}
		);
	}
]);
