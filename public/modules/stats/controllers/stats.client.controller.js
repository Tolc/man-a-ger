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
            updateAvgStats();
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
            var options = {
                percentageInnerCutout : 60,
                segmentShowStroke: false
            };
            var myDoughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(doughnutData, options);
        };

        $scope.setTimeWeek = function() {
            $scope.time = 'week';
            updateVotesStats();
            updateAvgStats();
        };
        $scope.setTimeMonth = function() {
            $scope.time = 'month';
            updateVotesStats();
            updateAvgStats();
        };
        $scope.setTimeYear = function() {
            $scope.time = 'year';
            updateVotesStats();
            updateAvgStats();
        };



        var updateAvgStats = function() {
            var currentTimeAvgs = [];
            var dateToCompare = new Date();
            if ($scope.time === 'month') {
                dateToCompare = new Date(dateToCompare.getFullYear(), dateToCompare.getMonth() - 1, dateToCompare.getDate(), 0, 0, 0, 0);
            } else if($scope.time === 'week') {
                dateToCompare = new Date(dateToCompare.getFullYear(), dateToCompare.getMonth(), dateToCompare.getDate() - 7, 0, 0, 0, 0);
            }
            for (var i = 0; i < $scope.lastYearVotes.length; i++) {
                var vote = $scope.lastYearVotes[i];
                var toCount = true;
                var voteDate = new Date(vote.created);
                if ($scope.time !== 'year') {
                    toCount = voteDate > dateToCompare;
                }
                if (toCount) {
                    if ($scope.time === 'year') {
                        var label = moment(voteDate).format('MMM YY');
                        if (currentTimeAvgs[label] === undefined) {
                            currentTimeAvgs[label] = {
                                totalVotes: 1,
                                health: vote.resto.healthiness,
                                price: vote.resto.price,
                                prox: vote.resto.proximity
                            };
                        } else {
                            currentTimeAvgs[label].health += vote.resto.healthiness;
                            currentTimeAvgs[label].price += vote.resto.price;
                            currentTimeAvgs[label].prox += vote.resto.proximity;
                            currentTimeAvgs[label].totalVotes += 1;
                        }
                    } else if ($scope.time === 'month') {

                    } else if ($scope.time === 'week') {

                    }

                }
            }
            var labels = [];
            var dataHealth = [];
            var dataPrice = [];
            var dataProx = [];
            Object.keys(currentTimeAvgs).forEach(function(key, index) {
                var totalVotes = currentTimeAvgs[key].totalVotes;
                currentTimeAvgs[key].health = Math.round(currentTimeAvgs[key].health / totalVotes);
                currentTimeAvgs[key].price = Math.round(currentTimeAvgs[key].price / totalVotes);
                currentTimeAvgs[key].prox = Math.round(currentTimeAvgs[key].prox / totalVotes);
                labels.push(key);
                dataHealth.push(currentTimeAvgs[key].health);
                dataPrice.push(currentTimeAvgs[key].price);
                dataProx.push(currentTimeAvgs[key].prox);
            });
            console.log(dataHealth);
            console.log(dataPrice);
            console.log(dataProx);

            var lineChartData = {
                labels : labels,
                datasets : [
                    {
                        label: "Healthiness",
                        fillColor : "rgba(255, 255, 255, 0)",
                        strokeColor : "#FFF",
                        pointColor : "#11a8ab",
                        pointStrokeColor : "#FFF",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data : dataHealth
                    },
                    {
                        label: "Price",
                        fillColor : "rgba(255, 255, 255, 0)",
                        strokeColor : "#666",
                        pointColor : "#666",
                        pointStrokeColor : "#666",
                        pointHighlightFill: "#666",
                        pointHighlightStroke: "#666",
                        data : dataPrice
                    },
                    {
                        label: "Proximity",
                        fillColor : "rgba(255, 255, 255, 0)",
                        strokeColor : "#FFF",
                        pointColor : "#11a8ab",
                        pointStrokeColor : "#FFF",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data : dataProx
                    }
                ]
            };
            var options = {
                scaleBeginAtZero: true,
                pointDotStrokeWidth : 2,
                scaleGridLineWidth : 2,
                scaleLineColor: "rgba(0,0,0,0)",
                scaleFontColor: "#fff"
            };
            var myLine = new Chart(document.getElementById("line-chart").getContext("2d")).Line(lineChartData, options);
            var legend = myLine.generateLegend();
            $('.legend').html(legend);

        };

	}
]);
