'use strict';

// PreviousRestos controller
angular.module('previousRestos').controller('PreviousRestosController', ['$scope', '$stateParams', '$location', 'Authentication', 'PreviousRestos',
	function($scope, $stateParams, $location, Authentication, PreviousRestos) {
		$scope.authentication = Authentication;

		// Create new PreviousResto
		$scope.create = function() {
			// Create new PreviousResto object
			var previousResto = new PreviousRestos ({
				name: this.name
			});

			// Redirect after save
			previousResto.$save(function(response) {
				$location.path('previousRestos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing PreviousResto
		$scope.remove = function(previousResto) {
			if ( previousResto ) {
				previousResto.$remove();

				for (var i in $scope.previousRestos) {
					if ($scope.previousRestos [i] === previousResto) {
						$scope.previousRestos.splice(i, 1);
					}
				}
			} else {
				$scope.previousResto.$remove(function() {
					$location.path('previousRestos');
				});
			}
		};

		// Update existing PreviousResto
		$scope.update = function() {
			var previousResto = $scope.previousResto;

			previousResto.$update(function() {
				$location.path('previousRestos/' + previousResto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of PreviousRestos
		$scope.find = function() {
			$scope.previousRestos = PreviousRestos.query();
		};

		// Find existing PreviousResto
		$scope.findOne = function() {
			$scope.previousResto = PreviousRestos.get({
				previousRestoId: $stateParams.previousRestoId
			});
		};
	}
]);
