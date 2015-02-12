'use strict';

// Stats controller
angular.module('stats').controller('StatsController', ['$scope', '$stateParams', '$location', 'Authentication', 'LastYearVotes',
	function($scope, $stateParams, $location, Authentication, LastYearVotes) {
		$scope.authentication = Authentication;
        $scope.lastYearVotes = LastYearVotes.getVotes();

        $scope.time = 'year';

        $scope.yearVotesStats = [];

        $scope.lastYearVotes.$promise.then(function(data) {
            updateVotesStats();
        });

        var updateVotesStats = function() {
            var currentTimeVotes = [];
            var restos = [];
            var dateToCompare = new Date();
            if ($scope.time === 'month') {
                dateToCompare = new Date(dateToCompare.getFullYear(), dateToCompare.getMonth() - 1, dateToCompare.getDate(), 0, 0, 0, 0);
            } else if($scope.time === 'week') {
                dateToCompare = new Date(dateToCompare.getFullYear(), dateToCompare.getMonth(), dateToCompare.getDate() - 7, 0, 0, 0, 0);
            }
            var currentTimeNb = 0;
            for (var i = 0; i < $scope.lastYearVotes.length; i++) {
                var vote = $scope.lastYearVotes[i];
                var toCount = true;
                if ($scope.time !== 'year') {
                    toCount = new Date(vote.created) > dateToCompare;
                }

                if (toCount) {
                    currentTimeNb++;
                    if (currentTimeVotes[vote.resto._id] === undefined) {
                        currentTimeVotes[vote.resto._id] = 1;
                        restos[vote.resto._id] = vote.resto;
                    } else {
                        currentTimeVotes[vote.resto._id] = currentTimeVotes[vote.resto._id] + 1;
                    }
                }
            }
            Object.keys(currentTimeVotes).forEach(function(key, index) {
                currentTimeVotes[key] = Math.round(currentTimeVotes[key] * 100 / currentTimeNb);
            });

            var yearVotesSortedStats = [];
            var classes = ['red', 'purple', 'yellow', 'blue'];
            for (var j = 0; j < 4 && j < Object.keys(currentTimeVotes).length ; j++) {
                var currentMax = 0;
                var currentMaxKey = 'id';
                if (j == 4 && Object.keys(currentTimeVotes).length > 4 ) {
                    var sum = 0;
                    Object.keys(yearVotesSortedStats).forEach(function (key, index) {
                        sum = yearVotesSortedStats[key];
                    });
                    yearVotesSortedStats['other'] = {
                        resto: {name: 'Other'},
                        perc: 100 - sum,
                        class: classes[j]
                    };
                } else {
                    Object.keys(currentTimeVotes).forEach(function (key, index) {
                        if (currentTimeVotes[key] >= currentMax && yearVotesSortedStats[key] === undefined) {
                            currentMax = currentTimeVotes[key];
                            currentMaxKey = key;
                        }
                    });
                    yearVotesSortedStats[currentMaxKey] = {
                        resto: restos[currentMaxKey],
                        perc: currentTimeVotes[currentMaxKey],
                        class: classes[j]
                    };
                }
            }

            //console.log($scope.yearVotesStats);

            $scope.yearVotesStats = [];
            var colors = ['#E64C65', '#11A8AB', '#FCB150', '#4FC4F6'];
            var doughnutData = [];
            Object.keys(yearVotesSortedStats).forEach(function(key, index) {
                doughnutData.push({
                    value: yearVotesSortedStats[key].perc,
                    color: colors[index]
                });
                $scope.yearVotesStats.push(yearVotesSortedStats[key]);
            });
            var myDoughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(doughnutData);
        };

        $scope.setTimeWeek = function() {
            $scope.time = 'week';
            updateVotesStats();
        };
        $scope.setTimeMonth = function() {
            $scope.time = 'month';
            updateVotesStats();
        };
        $scope.setTimeYear = function() {
            $scope.time = 'year';
            updateVotesStats();
        };

	}
]);