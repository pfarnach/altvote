'use strict';

angular.module('alt-vote-home')
	.controller('HomeController', function($scope, $modal, $state, BallotResource) {

    $scope.showCreateBallot = false;

    BallotResource.getAllBallots()
      .then(function(resp) {
        $scope.ballots = resp;
      });

	});