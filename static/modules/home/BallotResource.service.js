'use strict';

angular.module('alt-vote-home')
	.service('BallotResource', function($http) {
		
		return {
			createBallot: createBallot,
			getBallot: getBallot,
			getAllBallots: getAllBallots,
		}

		function createBallot(ballot) {
			return $http.post('/create_ballot', 
				{		
					name: ballot.name,
					description: ballot.description,
					choices: ballot.choices
				})
				.then(function(resp){
					return resp.data;
				});
		}

		function getBallot(uuid) {
			return $http.get('/get_ballot/' + uuid)
				.then(function(resp){
					return resp.data.ballot;
				});
		}

		function getAllBallots() {
			return $http.get('/get_all_ballots')
				.then(function(resp){
					return resp.data.ballots;
				});
		}

	});