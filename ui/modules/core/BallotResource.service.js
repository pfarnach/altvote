function BallotResource($http) {
	
	return {
		createBallot: createBallot,
		getBallot: getBallot,
		getAllBallots: getAllBallots,
		castVote: castVote,
		getResults: getResults
	}

	function createBallot(ballot) {
		return $http.post(endpoints.ballot.createBallot, 
			{		
				name: ballot.name,
				description: ballot.description,
				options: ballot.options,
				email: ballot.email
			})
			.then(function(resp) {
				return resp.data;
			});
	}

	function getBallot(uuid) {
		return $http.get(sprintf(endpoints.ballot.getByUUID, uuid))
			.then(function(resp){
				return resp.data;
			});
	}

	function getAllBallots() {
		return $http.get(endpoints.ballot.getAll)
			.then(function(resp){
				return resp.data.ballots;
			});
	}

	function castVote(ranked_options) {
		return $http.post(endpoints.ballot.castVote, { ranked_options: ranked_options })
			.then(function(resp) {
				return resp.data;
			});
	}

	function getResults(ballot_uuid) {
		return $http.get(sprintf(endpoints.ballot.getResults, ballot_uuid))
			.then(function(resp) {
				return resp.data;
			});
	}

};

export default BallotResource;