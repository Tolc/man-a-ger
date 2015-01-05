'use strict';

//Votes service used to communicate Votes REST endpoints
angular.module('votes').factory('Votes', ['$resource',
	function($resource) {
		return $resource('votes/:voteId', { voteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Votes service used to communicate Restos REST endpoints
angular.module('votes').factory('TodayVotes', ['$resource',
	function($resource) {
		return $resource(
			'votestoday',
			{},
			{
				todayVotes: {
					method: 'POST',
					isArray: true
				}
			}
		);
	}
]);
