function HomeController($scope, $state, BallotResource) {

  $scope.showCreateBallot = false;

  BallotResource.getAllBallots()
    .then((resp) => {
      $scope.ballots = resp;
    });

}

export default HomeController;