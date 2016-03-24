
angular.module('altVote', [
	'alt-vote-home',
	'alt-vote-vote',
	'alt-vote-core',
	'ui.router',
	'ui.bootstrap',
	'ngCookies',
	'ngMaterial'
	])

	.config(function($stateProvider, $httpProvider, $urlRouterProvider) {

		$httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

		$stateProvider
	    .state('home1', {
	      url: '',
	      templateUrl: 'ui/modules/home/states/home/home.html',
	      controller: 'HomeController'
	    })
	    .state('home2', {
	      url: '/',
	      templateUrl: 'ui/modules/home/states/home/home.html',
	      controller: 'HomeController'
	    })
	    .state('vote', {
	    	url: '/ballot/:uuid',
	    	templateUrl: 'ui/modules/vote/states/vote.html',
	    	controller: 'VoteController',
	    	resolve: {
	    		ballot: function($stateParams, BallotResource) {
	    			return BallotResource.getBallot($stateParams.uuid)
	    				.then(function(resp) {
	    					return resp;
	    				});
	    		}
	    	}
	    });

    $urlRouterProvider.otherwise('/');
	});