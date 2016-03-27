var endpoints = {
	ballot: {
		createBallot: server + 'api/create_ballot',
		getBallot: server + 'api/get_ballot/%s',
		getBallotAdmin: server + 'api/get_ballot_admin/%s/%s',
		getAll: server + 'api/get_all_ballots',
		castVote: server + 'api/cast_vote',
		getResults: server + 'api/get_results/%s'
	}
};