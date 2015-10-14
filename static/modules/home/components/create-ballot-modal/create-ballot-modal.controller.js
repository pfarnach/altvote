'use strict';

angular.module('alt-vote-home')
	.controller('CreateBallotController', function($scope, $modalInstance, BallotResource) {

		$scope.ballot = {};
		$scope.ballot_options = [];

		$scope.addBallotOption = function(option) {
			$scope.ballot_options.push(option);
			$scope.options.currentOption = '';
		};

		// create ballot
		$scope.createBallot = function() {
			$scope.ballot.ballot_options = $scope.ballot_options.join(',');
			BallotResource.createBallot($scope.ballot)
				.then(function(resp) {
					$modalInstance.close(resp);
				});
		};

	});