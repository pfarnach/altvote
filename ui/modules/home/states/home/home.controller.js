function HomeController(
	$scope,
	$state,
	BallotResource,
	$anchorScroll,
	$location
	) {

  $scope.showCreateBallot = false;

  BallotResource.getAllBallots()
    .then((resp) => {
      $scope.ballots = resp;
    });

  $scope.goToCreate = () => {
    $location.hash('ballot-create');
    $anchorScroll();
  };

}

export default HomeController;