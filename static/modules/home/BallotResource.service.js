'use strict';

angular.module('alt-vote-home')
	.service('BallotResource', function($http) {
		
		return {
			createBallot: createBallot,
			getBallot: getBallot,
			getAllBallots: getAllBallots,
			makeJson: makeJson
		}

		function makeJson() {
			return $http.post('/make_json', 
				{		
					choices: [
						{
							name: "Choice1",
							description: "Choice1 description"
						},
						{
							name: "Choice2",
							description: "Choice2 description"
						}
					],
					description: "Here's a description of all the choices"
				})
				.then(function(resp) {
					return resp.data;
				});
		}

		function createBallot(ballot) {
			return $http.post('/create_ballot', 
				{		
					name: ballot.name,
					description: ballot.description,
					ballot_options: ballot.ballot_options
				})
				.then(function(resp){
					return resp.data;
				});
		}

		function getBallot(uuid) {
			return $http.get('/get_ballot', 
				{ 
					params: {
						uuid: uuid
					}
				})
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

	});