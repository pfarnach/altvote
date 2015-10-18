'use strict';

angular.module('alt-vote-vote')
	.controller('VoteController', function($scope, $cookies, ballot, BallotResource) {
    
    $scope.ballot = ballot.ballot;
    $scope.choices = ballot.choices;
    $scope.readOnly = false;
    $scope.selected = {};
    $scope.form = {
    	valid: false,
    	submitted: false
    };

    // rank values to choose from
    $scope.availableRanks = _.range(1, $scope.choices.length + 1);
    $scope.availableRanks.unshift('');
    
    // make default unselected
    _.each($scope.choices, function(choice, i) {
    	$scope.selected[i+1] = {
    		value: '',
    		ballot_id: choice.ballot_id,
    		id: choice.id
    	}
    });

    $scope.validateAnswer = function() {
    	var raw_answers;

    	$scope.form.submitted = true;
    	$scope.form.valid = true;

    	raw_answers = _($scope.selected)
    							.map(function(choice) { return choice.value; })
    							.compact()
						    	.value()
						    	.sort();

    	if (!raw_answers.length) {
				$scope.form.message = "You have to rank at least one choice";
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
    	if ($cookies.get(ballot.uuid)) {
    		console.log($cookies.get(ballot.uuid));
				$scope.readOnly = true;
    	}
    }

    checkCookie();
	});