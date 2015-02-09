'use strict';

// Stats controller
angular.module('stats').controller('StatsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stats',
	function($scope, $stateParams, $location, Authentication, Stats) {
		$scope.authentication = Authentication;

	}
]);
