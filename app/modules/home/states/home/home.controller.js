'use strict';

angular.module('alt-vote-home')
	.controller('HomeController', function($scope, $modal, $state, BallotResource) {

    BallotResource.getAllBallots()
      .then(function(resp) {
        $scope.ballots = resp;
      });

		$scope.openCreateModal = function() {
    	
        var modalInstance = $modal.open({
          backdrop: 'static',
          controller: 'CreateBallotController',
          templateUrl: 'app/modules/home/components/create-ballot-modal/create-ballot-modal.html'
        });

      modalInstance.result
        .then(function(resp) {
          $state.go('vote', { uuid: resp.ballot.uuid });
        });
		};

	});