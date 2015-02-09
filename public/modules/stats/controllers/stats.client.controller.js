'use strict';

// Stats controller
angular.module('stats').controller('StatsController', ['$scope', '$stateParams', '$location', 'Authentication', 'LastYearVotes',
	function($scope, $stateParams, $location, Authentication, LastYearVotes) {
		$scope.authentication = Authentication;

        $scope.lastYearVotes = LastYearVotes.getVotes();

        var doughnutData = [
            {
                value: 21,
                color:"#E64C65"
            },
            {
                value : 48,
                color : "#11A8AB"
            },
            {
                value : 32,
                color : "#4FC4F6"
            },
            {
                value : 9,
                color : "#FCB150"
            },

        ];
        var myDoughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(doughnutData);
	}
]);
