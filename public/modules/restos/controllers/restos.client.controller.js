'use strict';

// Restos controller
angular.module('restos').controller('RestosController', ['$scope', '$stateParams', '$location', '$cookies', 'Authentication', 'Restos', 'TodayResto', 'IncrementToday', '$upload', '$timeout',
	function($scope, $stateParams, $location, $cookies, Authentication, Restos, TodayResto, IncrementToday, $upload, $timeout) {
		$scope.authentication = Authentication;
		$scope.previousTodayResto = TodayResto.today();
		$scope.todayResto = {};
		$scope.previousTodayResto.$promise.then(function(data) {
			$scope.todayResto = $scope.previousTodayResto.resto;
			var now = new Date();
			var todayCookieName = 'manger-seen-today';
			var todayCookieValue = $scope.todayResto.name + '-' + now.getYear() + '-' + now.getMonth() + '-' + now.getDate();
			if($cookies[todayCookieName] !== todayCookieValue) {
				IncrementToday.increment();
				$cookies[todayCookieName] = todayCookieValue;
				$scope.previousTodayResto.views++;
			}
		});
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

        $scope.upload = function($files) {
            //console.log($files);
            $upload.upload({
                url: 'restos/upload-pic/' + $scope.resto._id,
                method: 'POST',
                //data: {
                //    resto: $scope.resto
                //}, // Any data needed to be submitted along with the files
                file: $files
            }).progress(function(evt) {
                console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file.name);
            }).success(function(data, status, headers, config) {
                //console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
                console.log(data);
                $scope.resto = data;
                $location.path('restos/' + $scope.resto._id + '/edit');
            }).error(function(err) {
                console.log('error');
            });
        };

        $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
        $scope.generateThumb = function(file) {
            if (file != null) {
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                file.dataUrl = e.target.result;
                            });
                        }
                    });
                }
            }
        }
	}
]);
