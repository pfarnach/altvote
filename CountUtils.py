from __future__ import division
from copy import deepcopy

class Vote:
	def __init__(self, x):
		self.candidates = x

class Election:
	def __init__(self, votes):
		self.votes = votes
		self.voting_round = 0

	def getResults(self, results_by_round = []):
		self.voting_round = self.voting_round + 1
		print "\n************\nVoting Round: " + str(self.voting_round) + "\n"

		# count votes
		(count, total_votes_for_round) = self.__countVotes(self.votes)

		print "\nVotes for this round: "
		for v in self.votes:
			for candidate, rank in v.candidates.iteritems():
				print candidate, rank
			print "---"

		# remove candidates with zero votes
		(self.votes, count) = self.__eliminateZeroVotes(self.votes, count)

		# calc ballot percentage and check if > 50%
		(result, perc_vote_by_candidate) = self.__findWinner(count, total_votes_for_round)

		# keep track of results by round
		results_by_round.append(perc_vote_by_candidate)

		print "\nVote percentages for round: " + str(perc_vote_by_candidate)

		if len(result.winners) > 1:
			print "\nTie!: " + str(perc_vote_by_candidate)
			return results_by_round
		elif len(result.winners) == 1:
			print "\nWinner!: " + str(perc_vote_by_candidate)
			return results_by_round

		elimatedCandidates = self.__findEliminatedCandidates(self.votes, perc_vote_by_candidate)
		print "\nCandidates to be removed after this round: " + str(elimatedCandidates) + "\n"

		self.votes = self.__eliminateCandidateFromVotes(self.votes, elimatedCandidates)	
		self.votes = self.__shiftCandidateRankings(self.votes)

		return self.getResults(results_by_round)

	def __countVotes(self, votes):
		count = {}
		total_votes_for_round = 0

		for v in self.votes:
			for candidate, rank in v.candidates.iteritems():
				# create default dict value if doesn't already exist
				if not count.has_key(candidate):
					count[candidate] = 0

				# adds votes to corresponding candidate
				if rank == 1:
					count[candidate] = count[candidate] + 1
					total_votes_for_round = total_votes_for_round + 1

		return (count, total_votes_for_round)

	def __eliminateZeroVotes(self, votes, count):
		votes_iter = deepcopy(votes)
		candidates_to_delete = []

		# If candidate has no first round votes, then it can be eliminated altogether
		for i, v in enumerate(votes_iter):
			for candidate, rank in v.candidates.iteritems():
				if count.get(candidate) == 0 and v.candidates.has_key(candidate):
					print "\nCandidate with 0 1st round votes to be deleted: " + str(candidate)
					candidates_to_delete.append(candidate)
					del count[candidate]

		return (self.__eliminateCandidateFromVotes(votes, list(set(candidates_to_delete))), count)

	def __findWinner(self, count, total_votes_for_round):
		perc_vote_by_candidate = {}
		winners = {}

		# See if one candidate has majority
		for candidate, votes in count.iteritems():
			perc_vote_by_candidate[candidate] = votes / total_votes_for_round
			if perc_vote_by_candidate[candidate] > 0.5:
				winners[candidate] = perc_vote_by_candidate[candidate]

		# Check for tie between all remaining candidates
		if len(set(perc_vote_by_candidate.values()))==1:
			winners = perc_vote_by_candidate

		return (ElectionResult(winners), perc_vote_by_candidate)

	def __findEliminatedCandidates(self, votes, perc_vote_by_candidate):
		# Find and return list of last place candidates
		min_perc = min(perc_vote_by_candidate.itervalues())
		eliminated = filter((lambda (c,perc): perc == min_perc), perc_vote_by_candidate.iteritems())

		# convert tuple from filter to array
		return [x[0] for x in eliminated]

	def __eliminateCandidateFromVotes(self, votes, eliminatedCandidates):
		votes_iter = deepcopy(votes)

		# Remove candidate from each ballot if they have been eliminated
		for i, v in enumerate(votes_iter):
			for candidate, rank in v.candidates.iteritems():
				if candidate in eliminatedCandidates:
					print "Deleting candidate: " + str(candidate) + " from vote: " + str(i + 1) 
					del votes[i].candidates[candidate]

		# Return only list of votes that still have remaining ranked candidates
		return [x for x in votes if x.candidates]

	def __shiftCandidateRankings(self, votes):
		votes_iter = deepcopy(votes)

		# If the vote no longer has a 1st choice, all next choices shift "down"
		for i, v in enumerate(votes_iter):
			# print [x for x in v.candidates.itervalues()]
			minRanking = min(v.candidates.itervalues())

			if minRanking > 1:
				for candidate, rank in v.candidates.iteritems():
					votes[i].candidates[candidate] = votes[i].candidates[candidate] - (minRanking - 1)

		return votes

class ElectionResult:
	def __init__(self, winners):
		self.winners = winners
