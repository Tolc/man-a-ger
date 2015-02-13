'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		var now = moment(new Date());
		$scope.day = now.date();
		$scope.dayString = now.format('dddd');
		$scope.month = now.format('MMMM');
		$scope.time = now.hour() + ':' + now.minute();
	}
]);
