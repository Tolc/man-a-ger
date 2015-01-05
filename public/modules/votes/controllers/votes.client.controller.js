'use strict';

// Votes controller
angular.module('votes').controller('VotesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Votes', 'Restos', 'TodayVotes',
	function($scope, $stateParams, $location, Authentication, Votes, Restos, TodayVotes) {
		$scope.authentication = Authentication;
		$scope.voteEnabled = false;
		$scope.restos = [];
		$scope.search = '';
		$scope.alreadyVoted = false;
		$scope.todayVotes = TodayVotes.todayVotes(function() {
			for(var i = 0; !$scope.alreadyVoted && (i < $scope.todayVotes.length); i++) {
				var todayVote = $scope.todayVotes[i];
				for(var j = 0; !$scope.alreadyVoted && (j < todayVote.users.length); j++) {
					if (todayVote.users[j]._id === $scope.authentication.user._id) {
						$scope.alreadyVoted = true;
					}
				}
			}
		});


		// Create new Vote
		$scope.create = function(resto) {
			// Create new Vote object
			var vote = new Votes ({
				resto: resto._id
			});

			// Redirect after save
			vote.$save(function(response) {
				//$location.path('votes/' + response._id);
				$scope.success = 'Votre vote pour ' + resto.name + ' a été pris en compte.';
				$scope.alreadyVoted = true;

				// Clear form fields
				//$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Vote
		$scope.remove = function(vote) {
			if ( vote ) { 
				vote.$remove();

				for (var i in $scope.votes) {
					if ($scope.votes [i] === vote) {
						$scope.votes.splice(i, 1);
					}
				}
			} else {
				$scope.vote.$remove(function() {
					$location.path('votes');
				});
			}
		};

		// Update existing Vote
		$scope.update = function() {
			var vote = $scope.vote;

			vote.$update(function() {
				$location.path('votes/' + vote._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Votes
		$scope.find = function() {
			$scope.votes = Votes.query();
		};

		// Find existing Vote
		$scope.findOne = function() {
			$scope.vote = Votes.get({ 
				voteId: $stateParams.voteId
			});
		};

		$scope.enableVote = function() {
			$scope.voteEnabled = true;
			if ($scope.restos.length <= 0) {
				$scope.restos = Restos.query();
			}
		};
	}
]);
