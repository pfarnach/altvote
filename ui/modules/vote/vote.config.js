function voteConfig($stateProvider) {
	$stateProvider
		.state('vote', {
			abstract: true,
    	url: '/ballot/:uuid',
    	templateUrl: 'ui/modules/vote/states/abstract/vote-abstract.html',
    	resolve: {
    		ballot($stateParams, BallotResource) {
    			return BallotResource.getBallot($stateParams.uuid)
    				.then((resp) => resp);
    		}
    	}
    })
		.state('vote.main', {
    	url: '',
    	templateUrl: 'ui/modules/vote/states/vote/vote.html',
    	controller: 'VoteController'
    })
    .state('vote.admin', {
    	url: '/:adminId',
    	templateUrl: 'ui/modules/vote/states/admin/vote-admin.html',
    	controller: 'VoteAdminController'
    });
}

export default voteConfig;