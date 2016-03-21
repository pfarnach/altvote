'use strict';

angular.module('alt-vote-home')
	.directive('createBallot', function createBallot(BallotResource, $state) {

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
			
			scope.error = {
				show: false,
				msg: ''
			};

			scope.addBallotOption = function(choice) {
				scope.ballot.options.push({name: choice});
				scope.options.currentOption = '';
			};

			// create ballot
			scope.createBallot = function(ballot) {
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
					.then(function(resp) {
						$state.go('vote', { uuid: resp.ballot.uuid });
					})
					.catch(function(err) {
						console.error(err);
					});
			};

		}
		
	});