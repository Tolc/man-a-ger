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
