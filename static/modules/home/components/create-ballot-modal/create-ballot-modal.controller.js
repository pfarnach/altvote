'use strict';

angular.module('alt-vote-home')
	.controller('CreateBallotController', function($scope, $modalInstance, BallotResource) {

		$scope.ballot = {};
		$scope.ballot.choices = [];
		$scope.options = {};

		$scope.addBallotChoice = function(choice) {
			$scope.ballot.choices.push({name: choice});
			$scope.options.currentOption = '';
		};

		// create ballot
		$scope.createBallot = function() {
			BallotResource.createBallot($scope.ballot)
				.then(function(resp) {
					$modalInstance.close(resp);
				});
		};

	});