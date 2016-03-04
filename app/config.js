var endpoints = {
	ballot: {
		createBallot: server + 'api/create_ballot',
		getByUUID: server + 'api/get_ballot/%s',
		getAll: server + 'api/get_all_ballots',
		castVote: server + 'api/cast_vote',
		getResults: server + 'api/get_results/%s'
	}
};