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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	var _BallotResourceService = __webpack_require__(2);

	var _BallotResourceService2 = _interopRequireDefault(_BallotResourceService);

	var _BallotUtilsService = __webpack_require__(3);

	var _BallotUtilsService2 = _interopRequireDefault(_BallotUtilsService);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_angular2.default.module('alt-vote-core', []).service('BallotResource', _BallotResourceService2.default).service('BallotUtils', _BallotUtilsService2.default);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = angular;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function BallotResource($http) {

		return {
			createBallot: createBallot,
			getBallot: getBallot,
			getAllBallots: getAllBallots,
			castVote: castVote,
			getResults: getResults
		};

		function createBallot(ballot) {
			return $http.post(endpoints.ballot.createBallot, {
				name: ballot.name,
				description: ballot.description,
				options: ballot.options,
				email: ballot.email
			}).then(function (resp) {
				return resp.data;
			});
		}

		function getBallot(uuid) {
			return $http.get(sprintf(endpoints.ballot.getByUUID, uuid)).then(function (resp) {
				return resp.data;
			});
		}

		function getAllBallots() {
			return $http.get(endpoints.ballot.getAll).then(function (resp) {
				return resp.data.ballots;
			});
		}

		function castVote(ranked_options) {
			return $http.post(endpoints.ballot.castVote, { ranked_options: ranked_options }).then(function (resp) {
				return resp.data;
			});
		}

		function getResults(ballot_uuid) {
			return $http.get(sprintf(endpoints.ballot.getResults, ballot_uuid)).then(function (resp) {
				return resp.data;
			});
		}
	};

	exports.default = BallotResource;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function BallotUtils($http) {

	  return {
	    removePrevElimCands: removePrevElimCands
	  };

	  // If a candidate is marked as eliminated, eliminate them from all future rounds
	  function removePrevElimCands(resultsByRound) {
	    return _.reduce(resultsByRound, function (acc, result, i) {

	      // Find all candidate marked as "eliminated" in all previous rounds
	      var idsToRemove = _(acc).chain().slice(0, i + 1).flatten().filter(function (res) {
	        return res.isEliminated;
	      }).map('id').value();

	      // Filter out candidates eliminated in previous rounds
	      var filteredResult = _.reject(result, function (res) {
	        return _.includes(idsToRemove, res.id);
	      });

	      acc.push(filteredResult);
	      return acc;
	    }, []);
	  }
	}

	exports.default = BallotUtils;

/***/ }
/******/ ]);