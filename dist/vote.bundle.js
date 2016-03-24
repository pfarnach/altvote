/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _voteController = __webpack_require__(6);

	var _voteController2 = _interopRequireDefault(_voteController);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	angular.module('alt-vote-vote', []).controller('VoteController', _voteController2.default);

/***/ },

/***/ 6:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function VoteController($scope, ballot, BallotResource, BallotUtils, $cookies, $mdToast) {

	  $scope.ballot = ballot.ballot;
	  $scope.options = ballot.options;
	  $scope.alreadyVoted = false;
	  $scope.readOnly = false;
	  $scope.form = {
	    valid: false,
	    submitted: false
	  };

	  // rank values to choose from
	  $scope.availableRanks = _.range(1, $scope.options.length + 1);
	  $scope.availableRanks.unshift('');

	  // make default unselected
	  $scope.selected = _.map($scope.options, function (option, i) {
	    return {
	      rank: null,
	      ballot_id: option.ballot_id,
	      id: option.id
	    };
	  });

	  $scope.validateAnswer = function () {
	    $scope.form.submitted = true;
	    $scope.form.valid = true;

	    var selected = _($scope.selected).filter(function (option) {
	      return option.rank;
	    }).map(function (option) {
	      return {
	        rank: _.parseInt(option.rank),
	        ballot_id: option.ballot_id,
	        id: option.id
	      };
	    }).value();

	    var raw_answers = _(selected).map('rank').sort().value();

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
	      BallotResource.castVote(selected);
	      // Temporary solution: set cookie to see if they've done poll already
	      $cookies.put($scope.ballot.uuid, 'answered');
	      checkCookie();
	    }
	  };

	  // checks if next value is 1 more than last value (in rank order)
	  function _checkNextVal(raw_answers, currentIdx) {
	    if (!raw_answers[currentIdx + 1]) {
	      return;
	    } else if (raw_answers[currentIdx] + 1 === raw_answers[currentIdx + 1]) {
	      _checkNextVal(raw_answers, ++currentIdx);
	    } else if (raw_answers[currentIdx] === raw_answers[currentIdx + 1]) {
	      $scope.form.message = "You can't have two of the same ranks";
	      $scope.form.valid = false;
	    } else {
	      $scope.form.message = "You can't skip ranks";
	      $scope.form.valid = false;
	    }
	  }

	  $scope.getResults = function () {
	    getResults();
	    $scope.readOnly = true;
	  };

	  $scope.hideResults = function () {
	    console.log('got here');
	    console.log('$scope.readOnly', $scope.readOnly);
	    $scope.readOnly = false;
	  };

	  // Fetch results of ballot
	  function getResults() {
	    BallotResource.getResults($scope.ballot.uuid).then(function (resp) {
	      $scope.resultsByRound = BallotUtils.removePrevElimCands(resp.results_by_round);
	      $scope.totalBallotsCast = resp.total_ballots_cast;

	      // Success
	      // $mdToast.show(
	      //   $mdToast.simple()
	      //     .textContent('Vote successfully cast!')
	      //     .position('top right')
	      //     .hideDelay(3000)
	      // );
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

	exports.default = VoteController;

/***/ }

/******/ });