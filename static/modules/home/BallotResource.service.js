'use strict';

angular.module('alt-vote-home')
	.service('BallotResource', function($http) {
		
		return {
			createBallot: createBallot,
			getBallot: getBallot,
			getAllBallots: getAllBallots,
			castVote: castVote,
			getResults: getResults
		}

		function createBallot(ballot) {
			return $http.post('/create_ballot', 
				{		
					name: ballot.name,
					description: ballot.description,
					options: ballot.options
				})
				.then(function(resp) {
					return resp.data;
				});
		}

		function getBallot(uuid) {
			return $http.get('/get_ballot/' + uuid)
				.then(function(resp){
					return resp.data;
				});
		}

		function getAllBallots() {
			return $http.get('/get_all_ballots')
				.then(function(resp){
					return resp.data.ballots;
				});
		}

		function castVote(raw_ranked_options) {
			var ranked_options = _.map(raw_ranked_options, function(val) { return val; });
			return $http.post('/cast_vote',
				{
					ranked_options: ranked_options
				})
				.then(function(resp) {
					return resp.data;
				});
		}

		function getResults(ballot_uuid) {
			return $http.get('/get_results/' + ballot_uuid)
				.then(function(resp){
					return resp.data;
				});
		}

	});