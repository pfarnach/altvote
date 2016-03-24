import angular from 'angular';
import BallotResource from './BallotResource.service.js';
import BallotUtils from './BallotUtils.service.js';

angular.module('alt-vote-core', [])
	.service('BallotResource', BallotResource)
	.service('BallotUtils', BallotUtils);