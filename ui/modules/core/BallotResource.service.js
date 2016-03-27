function BallotResource($http) {
	
	return {
		createBallot,
		getBallot,
		getBallotAdmin,
		getAllBallots,
		castVote,
		getResults
	};

	function createBallot(ballot) {
		return $http.post(endpoints.ballot.createBallot, 
			{		
				name: ballot.name,
				description: ballot.description,
				options: ballot.options,
				email: ballot.email
			})
			.then((resp) => resp.data);
	}

	function getBallot(uuid) {
		return $http.get(sprintf(endpoints.ballot.getBallot, uuid))
			.then((resp) => resp.data);
	}

	function getBallotAdmin(uuid, adminId) {
		return $http.get(sprintf(endpoints.ballot.getBallotAdmin, uuid, adminId))
			.then((resp) => resp.data);
	}

	function getAllBallots() {
		return $http.get(endpoints.ballot.getAll)
			.then((resp) => resp.data.ballots);
	}

	function castVote(ranked_options) {
		return $http.post(endpoints.ballot.castVote, { ranked_options: ranked_options })
			.then((resp) => resp.data);
	}

	function getResults(ballot_uuid) {
		return $http.get(sprintf(endpoints.ballot.getResults, ballot_uuid))
			.then((resp) => resp.data);
	}

};

export default BallotResource;