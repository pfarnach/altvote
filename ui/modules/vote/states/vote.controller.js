'use strict';

angular.module('alt-vote-vote')
	.controller('VoteController', function($scope, ballot, BallotResource, BallotUtils) {
    
    $scope.ballot = ballot.ballot;
    $scope.options = ballot.options;
    $scope.readOnly = false;
    $scope.form = {
    	valid: false,
    	submitted: false
    };

    // rank values to choose from
    $scope.availableRanks = _.range(1, $scope.options.length + 1);
    $scope.availableRanks.unshift('');
    
    // make default unselected
    $scope.selected = _.map($scope.options, function(option, i) {
    	return {
    		rank: null,
    		ballot_id: option.ballot_id,
    		id: option.id
    	};
    });

    $scope.validateAnswer = function() {
    	$scope.form.submitted = true;
    	$scope.form.valid = true;

    	var raw_answers = _($scope.selected)
				.map('rank')
				.compact()
        .sort()
		    .value();

    	if (!raw_answers.length) {
				$scope.form.message = "You have to rank at least one option";
				$scope.form.valid = false;
    	} else if (_.isNumber(raw_answers[0]) && raw_answers[0] === 1) {
    		_checkNextVal(raw_answers, 0);
    	} else {
    		$scope.form.message = "Ranking must start at 1";
    		$scope.form.valid = false;
    	}

    	if ($scope.form.valid) {
    		BallotResource.castVote(_removeNonRanks($scope.selected));
	    	// Temporary solution: set cookie to see if they've done poll already
		    // $cookies.put(ballot.uuid, 'answered');
		    // checkCookie();
    	}
    };

    // checks if next value is 1 more than last value (in rank order)
    function _checkNextVal(raw_answers, currentIdx) {
    	if (!raw_answers[currentIdx + 1]) {
    		return;
    	} else if (raw_answers[currentIdx] + 1 === raw_answers[currentIdx + 1]) {
    		_checkNextVal(raw_answers, ++currentIdx);
    	} else if (raw_answers[currentIdx] === raw_answers[currentIdx + 1]){
    		$scope.form.message = "You can't have two of the same ranks";
    		$scope.form.valid = false;
    	} else {
    		$scope.form.message = "You can't skip ranks";
    		$scope.form.valid = false;
    	}
    }

    function _removeNonRanks(options) {
      return _.filter(options, function(option) {
        return option.rank;
      });
    }

    // Fetch results of ballot
    $scope.getResults = function() {
      BallotResource.getResults($scope.ballot.uuid)
        .then(function(resp) {
          $scope.resultsByRound = BallotUtils.removePrevElimCands(resp.results_by_round);
          $scope.totalBallotsCast = resp.total_ballots_cast;
        });
    };

    function checkCookie() {
    // 	if ($cookies.get(ballot.uuid)) {
				// $scope.readOnly = true;
    // 	}
    }

    checkCookie();
	});