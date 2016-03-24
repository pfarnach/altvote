import HomeController from './states/home/home.controller.js';
import createBallot from './components/create-ballot/create-ballot.directive.js';

angular.module('alt-vote-home', [])
	.controller('HomeController', HomeController)
	.directive('createBallot', createBallot);