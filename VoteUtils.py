class VoteUtils:
	@staticmethod
	def validateRankOrder(vote_options):
		vote_options_with_ranks = [x for x in vote_options if isinstance(x['rank'], int)]
		ordered_by_rank = sorted(vote_options_with_ranks, key=lambda k: k['rank'])
		ranks = [x['rank'] for x in ordered_by_rank]

		# First choice must be ranked 1
		if ranks[0] != 1:
			return False

		# Check to make sure range of lowest to high equals actual selected ranks (no gaps allowed)
		return ranks == range(ranks[0], ranks[-1] + 1)
