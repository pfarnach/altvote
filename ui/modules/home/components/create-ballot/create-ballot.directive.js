function createBallot(BallotResource, $state) {

	return {
		restrict: 'E',
		templateUrl: 'ui/modules/home/components/create-ballot/create-ballot.partial.html',
		link: link
	};

	function link(scope) {

		scope.submitted = false;

		scope.ballot = {
			options: []
		};

		// For calendar date picker
		// Max date set: http://stackoverflow.com/questions/563406/add-days-to-datetime
		const today = new Date();

		scope.dateConfig = {
			min: new Date(),
			max: new Date(today.setDate(today.getDate() + 60))
		};

		scope.error = {
			show: false,
			msg: ''
		};

		scope.updateTime = (date) => {
			scope.ballot.endTimestamp = date.getTime()/1000 + 86399;
		};

		scope.addBallotOption = (choice) => {
			scope.ballot.options.push({name: choice});
			scope.options.currentOption = '';
		};

		// create ballot
		scope.createBallot = (ballot) => {
			scope.error.show = false;

			// form validation for name and options (description is optional)
			if (!ballot.name) {
				scope.error.msg = 'You have to enter a name';
				scope.error.show = true;
				return;
			} else if (ballot.options.length < 2 || !ballot.options.length) {
				scope.error.msg = 'You have to enter at least two ballot options';
				scope.error.show = true;
				return;
			}

			scope.submitted = true;

			BallotResource.createBallot(ballot)
				.then((resp) => $state.go('vote.main', { uuid: resp.ballot.uuid }))
				.catch((err) => console.error(err));
		};

	}
	
}

export default createBallot;