'use strict';

// Stats controller
angular.module('stats').controller('StatsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stats',
	function($scope, $stateParams, $location, Authentication, Stats) {
		$scope.authentication = Authentication;

		// Create new Stat
		$scope.create = function() {
			// Create new Stat object
			var stat = new Stats ({
				name: this.name
			});

			// Redirect after save
			stat.$save(function(response) {
				$location.path('stats/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Stat
		$scope.remove = function(stat) {
			if ( stat ) { 
				stat.$remove();

				for (var i in $scope.stats) {
					if ($scope.stats [i] === stat) {
						$scope.stats.splice(i, 1);
					}
				}
			} else {
				$scope.stat.$remove(function() {
					$location.path('stats');
				});
			}
		};

		// Update existing Stat
		$scope.update = function() {
			var stat = $scope.stat;

			stat.$update(function() {
				$location.path('stats/' + stat._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Stats
		$scope.find = function() {
			$scope.stats = Stats.query();
		};

		// Find existing Stat
		$scope.findOne = function() {
			$scope.stat = Stats.get({ 
				statId: $stateParams.statId
			});
		};
	}
]);