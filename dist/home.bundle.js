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

	var _homeController = __webpack_require__(4);

	var _homeController2 = _interopRequireDefault(_homeController);

	var _createBallotDirective = __webpack_require__(5);

	var _createBallotDirective2 = _interopRequireDefault(_createBallotDirective);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	angular.module('alt-vote-home', []).controller('HomeController', _homeController2.default).directive('createBallot', _createBallotDirective2.default);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function HomeController($scope, $modal, $state, BallotResource) {

	  $scope.showCreateBallot = false;

	  BallotResource.getAllBallots().then(function (resp) {
	    $scope.ballots = resp;
	  });
	}

	exports.default = HomeController;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function createBallot(BallotResource, $state) {

		return {
			restrict: 'E',
			templateUrl: 'ui/modules/home/components/create-ballot/create-ballot.partial.html',
			link: link
		};

		function link(scope) {

			scope.submitted = false;

			scope.ballot = {
				options: []
			};

			scope.error = {
				show: false,
				msg: ''
			};

			scope.addBallotOption = function (choice) {
				scope.ballot.options.push({ name: choice });
				scope.options.currentOption = '';
			};

			// create ballot
			scope.createBallot = function (ballot) {
				scope.error.show = false;

				// form validation for name and options (description is optional)
				if (!ballot.name) {
					scope.error.msg = 'You have to enter a name';
					scope.error.show = true;
					return;
				} else if (ballot.options.length < 2 || !ballot.options.length) {
					scope.error.msg = 'You have to enter at least two ballot options';
					scope.error.show = true;
					return;
				}

				scope.submitted = true;

				BallotResource.createBallot(ballot).then(function (resp) {
					$state.go('vote', { uuid: resp.ballot.uuid });
				}).catch(function (err) {
					console.error(err);
				});
			};
		}
	}

	exports.default = createBallot;

/***/ }
/******/ ]);