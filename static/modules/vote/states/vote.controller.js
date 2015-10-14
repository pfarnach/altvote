'use strict';

angular.module('alt-vote-vote')
	.controller('VoteController', function($scope, ballot) {
    $scope.ballot = ballot;
	});