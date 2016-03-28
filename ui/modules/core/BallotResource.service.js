function BallotResource($http) {
	
	return {
		createBallot,
		getBallot,
		getBallotAdmin,
		getAllBallots,
		updateBallot,
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

	function updateBallot(uuid, options) {
		return $http.put(sprintf(endpoints.ballot.updateBallot, uuid), { options })
			.then((resp) => resp.data);
	}

	function getAllBallots() {
		return $http.get(endpoints.ballot.getAll)
			.then((resp) => resp.data.ballots);
	}

	function castVote(ballot_id, ranked_options) {
		return $http.post(endpoints.ballot.castVote,
			{
				ballot_id,
				ranked_options
			})
			.then((resp) => resp.data);
	}

	function getResults(ballot_uuid) {
		return $http.get(sprintf(endpoints.ballot.getResults, ballot_uuid))
			.then((resp) => resp.data);
	}

};

export default BallotResource;