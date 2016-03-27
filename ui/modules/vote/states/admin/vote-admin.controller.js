function VoteAdminController($scope, $state, $stateParams, ballot, BallotResource) {

	$scope.ballot = ballot.ballot;
	$scope.admin = {};
	$scope.admin.checked = false;

	BallotResource.getBallotAdmin($stateParams.uuid, $stateParams.adminId)
		.then((resp) => {
			$scope.admin.checked = true;

			if (resp.verified) {
				$scope.admin.verified = true;
			} else {
				$state.go('vote.main', { uuid: ballot.ballot.uuid });
			}
		});

}

export default VoteAdminController;