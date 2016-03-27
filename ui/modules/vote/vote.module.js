import voteConfig from './vote.config.js';
import VoteController from './states/vote/vote.controller.js';
import VoteAdminController from './states/admin/vote-admin.controller.js';

angular.module('alt-vote-vote', ['ui.router'])
	.config(voteConfig)
	.controller('VoteController', VoteController)
	.controller('VoteAdminController', VoteAdminController);