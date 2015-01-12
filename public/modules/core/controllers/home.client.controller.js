'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var now = new Date();
		$scope.day = now.getDate();
		$scope.dayString = days[now.getDay()];
		$scope.month = months[now.getMonth()];
		$scope.time = now.getHours() + ':' + now.getMinutes();
	}
]);
