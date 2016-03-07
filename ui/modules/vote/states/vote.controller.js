'use strict';

angular.module('alt-vote-vote')
	.controller('VoteController', function($scope, ballot, BallotResource) {
    
    $scope.ballot = ballot.ballot;
    $scope.options = ballot.options;
    $scope.readOnly = false;
    $scope.selected = {};
    $scope.form = {
    	valid: false,
    	submitted: false
    };

    // rank values to choose from
    $scope.availableRanks = _.range(1, $scope.options.length + 1);
    
    // make default unselected
    _.each($scope.options, function(option, i) {
    	$scope.selected[i] = {
    		rank: '',
    		ballot_id: option.ballot_id,
    		id: option.id
    	}
    });

    // Fetch results of ballot
    $scope.getResults = function() {
    	BallotResource.getResults($scope.ballot.uuid)
        .then(function(resp) {
          $scope.resultsByRound = resp.results_by_round;
          $scope.totalBallotsCast = resp.total_ballots_cast;
        });
    };

    $scope.validateAnswer = function() {
    	$scope.form.submitted = true;
    	$scope.form.valid = true;

    	var raw_answers = _($scope.selected)
				.map('rank')
				.compact()
		    .value()
		    .sort();

    	if (!raw_answers.length) {
				$scope.form.message = "You have to rank at least one option";
				$scope.form.valid = false;
    	} else if (_.isNumber(raw_answers[0]) && raw_answers[0] === 1) {
    		checkNextVal(raw_answers, 0);
    	} else {
    		$scope.form.message = "Ranking must start at 1";
    		$scope.form.valid = false;
    	}

    	if ($scope.form.valid) {
    		BallotResource.castVote($scope.selected);
	    	// Temporary solution: set cookie to see if they've done poll already
		    // $cookies.put(ballot.uuid, 'answered');
		    // checkCookie();
    	}
    };

    // checks if next value is 1 more than last value (in rank order)
    function checkNextVal(raw_answers, currentIdx) {
    	if (!raw_answers[currentIdx + 1]) {
    		return;
    	} else if (raw_answers[currentIdx] + 1 === raw_answers[currentIdx + 1]) {
    		checkNextVal(raw_answers, ++currentIdx);
    	} else if (raw_answers[currentIdx] === raw_answers[currentIdx + 1]){
    		$scope.form.message = "You can't have two of the same ranks";
    		$scope.form.valid = false;
    	} else {
    		$scope.form.message = "You can't skip ranks";
    		$scope.form.valid = false;
    	}
    }

    function checkCookie() {
    // 	if ($cookies.get(ballot.uuid)) {
				// $scope.readOnly = true;
    // 	}
    }

    checkCookie();
	});