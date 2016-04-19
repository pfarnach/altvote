function VoteController($scope, ballot, BallotResource, BallotUtils, $cookies, $mdToast) {

  $scope.ballot = ballot.ballot;
  $scope.options = ballot.options;

  $scope.form = {
    valid: false,
    submitted: false
  };

  $scope.writeIn = {};
  $scope.writeInForm = {
    msg: 'Name already exists!',
    show: false
  };

  $scope.alreadyVoted = false;
  $scope.votingClosed = false;
  $scope.submittedVote = false;

  if ($scope.ballot.status === 'DISABLED') {
    getResults();
  } else if ($scope.ballot.status === 'COMPLETED') {
    $scope.votingClosed = true;
    getResults();
  } else {
    $scope.readOnly = false;
  }

  // rank values to choose from
  $scope.availableRanks = _.range(1, $scope.options.length + 1);
  $scope.availableRanks.unshift('');
  
  // make default unselected
  $scope.selected = _.map($scope.options, (option, i) => {
  	return {
  		rank: null,
  		ballot_id: option.ballot_id,
  		id: option.id
  	};
  });

  $scope.validateAnswer = () => {
  	$scope.form.submitted = true;
  	$scope.form.valid = true;

    // Only get options that were ranked
    const selected = _($scope.selected)
      .filter((option) => option.rank)
      .map((option) => {
        return {
          rank: _.parseInt(option.rank),
          ballot_id: option.ballot_id,
          name: option.name,
          id: option.id,
          isWriteIn: option.isWriteIn
        };
      })
      .value();

  	const raw_answers = _(selected)
			.map('rank')
      .sort()
	    .value();

  	if (!raw_answers.length) {
			$scope.form.message = 'You have to rank at least one option';
			$scope.form.valid = false;
  	} else if (_.isNumber(raw_answers[0]) && raw_answers[0] === 1) {
  		_checkNextVal(raw_answers, 0);
  	} else {
  		$scope.form.message = 'Ranking must start at 1';
  		$scope.form.valid = false;
  	}

  	if ($scope.form.valid) {
  		BallotResource.castVote($scope.ballot.uuid, selected)
        .then(() => {
          // Temporary solution: set cookie to see if they've done poll already
          $cookies.put($scope.ballot.uuid, 'answered');
          checkCookie();

          // Success
          $mdToast.show(
            $mdToast.simple()
              .textContent('Vote successfully cast!')
              .position('top right')
              .hideDelay(3000)
          );
        });
  	} else {
      $scope.form.submitted = false;
    }
  };

  // checks if next value is 1 more than last value (in rank order)
  function _checkNextVal(raw_answers, currentIdx) {
  	if (!raw_answers[currentIdx + 1]) {
  		return;
  	} else if (raw_answers[currentIdx] + 1 === raw_answers[currentIdx + 1]) {
  		_checkNextVal(raw_answers, ++currentIdx);
  	} else if (raw_answers[currentIdx] === raw_answers[currentIdx + 1]){
  		$scope.form.message = 'You can\'t have two of the same ranks';
  		$scope.form.valid = false;
  	} else {
  		$scope.form.message = 'You can\'t skip ranks';
  		$scope.form.valid = false;
  	}
  }

  // When user tries to create a write-in option
  $scope.addWriteIn = (writeIn) => {    
    const existingNames = _.map($scope.options, 'name');
    $scope.writeInForm.show = false;

    if (_.includes(existingNames, writeIn.name)) {
      $scope.writeInForm.show = true;
    } else if (writeIn.name) {
      const newWriteIn = { name: _.clone(writeIn.name), isWriteIn: true};
      $scope.options.push(newWriteIn);
      $scope.selected.push(newWriteIn);
      $scope.availableRanks = _.range(1, $scope.options.length + 1);
      $scope.availableRanks.unshift('');   
      writeIn.name = '';
    }
  };

  $scope.seeResults = () => {
    getResults();
  };

  $scope.hideResults = () => {
    $scope.readOnly = false;
  };

  // Fetch results of ballot
  function getResults() {
    $scope.readOnly = true;

    BallotResource.getResults($scope.ballot.uuid)
      .then((resp) => {
        $scope.resultsByRound = BallotUtils.removePrevElimCands(resp.results_by_round);
        $scope.totalBallotsCast = resp.total_ballots_cast;
      });
  };

  function checkCookie() {
  	if ($cookies.get($scope.ballot.uuid)) {
			$scope.alreadyVoted = true;
      getResults();
  	}
  }

  // On load, check if question is already answered
  checkCookie();
}

export default VoteController;