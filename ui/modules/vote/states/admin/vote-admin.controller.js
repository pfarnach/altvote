function VoteAdminController(
		$scope,
		$state,
		$stateParams,
		ballot,
		BallotResource,
		$mdDialog
	) {

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

	$scope.showConfirmDelete = (evt) => {
    // Appending dialog to document.body to cover sidenav in docs app
    const confirm = $mdDialog.confirm()
      .title('Confirm')
      .textContent('Once you delete a ballot, it\'s gone for good! You won\'t be able to access it or see its results.')
      .ariaLabel('confirm delete ballot')
      .targetEvent(evt)
      .ok('Delete')
      .cancel('Cancel');

    $mdDialog.show(confirm)
    	.then(() => BallotResource.updateBallot(ballot.ballot.uuid, { status: 'DELETED' }))
	    .then(() => $state.go('home1'));
  };

	$scope.toggleActivation = (evt, currentStatus) => {
		const disableDialog = {
			msg: 'Users will still be able to view your ballot but won\'t be able to vote on it',
			btn: 'Disable!',
			updatedStatus: 'DISABLED'
		};

		const activateDialog = {
			msg: 'Users will now be able to vote on your ballot',
			btn: 'Activate!',
			updatedStatus: 'ACTIVE'
		};

		const dialogInfo = currentStatus === 'ACTIVE' ? disableDialog : activateDialog;

    // Appending dialog to document.body to cover sidenav in docs app
    const confirm = $mdDialog.confirm()
      .title('Confirm')
      .textContent(dialogInfo.msg)
      .ariaLabel('confirm ballot status update')
      .targetEvent(evt)
      .ok(dialogInfo.btn)
      .cancel('Cancel');

    $mdDialog.show(confirm)
    	.then(() => BallotResource.updateBallot(ballot.ballot.uuid, { status: dialogInfo.updatedStatus }))
	    .then(() => $scope.ballot.status = dialogInfo.updatedStatus);
  };

}

export default VoteAdminController;