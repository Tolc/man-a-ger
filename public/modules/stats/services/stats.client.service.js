'use strict';

//Stats service used to communicate Stats REST endpoints
//angular.module('stats').factory('Stats', ['$resource',
//	function($resource) {
//		return $resource('stats/:statId', { statId: '@_id'
//		}, {
//			update: {
//				method: 'PUT'
//			}
//		});
//	}
//]);

angular.module('stats').factory('LastYearVotes', ['$resource',
    function($resource) {
        return $resource(
            'stats/last-year-votes',
            {},
            {
                getVotes: {
                    method: 'GET',
                    isArray: true
                }
            }
        );
    }
]);
