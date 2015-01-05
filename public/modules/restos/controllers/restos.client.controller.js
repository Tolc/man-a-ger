'use strict';

// Restos controller
angular.module('restos').controller('RestosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Restos', 'TodayResto',
	function($scope, $stateParams, $location, Authentication, Restos, TodayResto) {
		$scope.authentication = Authentication;
		$scope.todayResto = TodayResto.today();
		$scope.restos = [];

		// Create new Resto
		$scope.create = function() {
			// Create new Resto object
			var resto = new Restos ({
				name: this.name,
				proximity: this.proximity,
				healthiness: this.healthiness,
				price: this.price,
				image: this.image,
				description: this.description
			});

			// Redirect after save
			resto.$save(function(response) {
				$location.path('restos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Resto
		$scope.remove = function(resto) {
			if ( resto ) { 
				resto.$remove();

				for (var i in $scope.restos) {
					if ($scope.restos [i] === resto) {
						$scope.restos.splice(i, 1);
					}
				}
			} else {
				$scope.resto.$remove(function() {
					$location.path('restos');
				});
			}
		};

		// Update existing Resto
		$scope.update = function() {
			var resto = $scope.resto;

			resto.$update(function() {
				$location.path('restos/' + resto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Restos
		$scope.find = function() {
			$scope.restos = Restos.query();
		};

		// Find existing Resto
		$scope.findOne = function() {
			$scope.resto = Restos.get({ 
				restoId: $stateParams.restoId
			});
		};
	}
]);
