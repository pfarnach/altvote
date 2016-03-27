function BallotUtils($http) {
	
	return {
		removePrevElimCands: removePrevElimCands
	};

	// If a candidate is marked as eliminated, eliminate them from all future rounds
  function removePrevElimCands(resultsByRound) {
    return _.reduce(resultsByRound, function(acc, result, i) {

      // Find all candidate marked as "eliminated" in all previous rounds
      const idsToRemove = _(acc)
        .chain()
        .slice(0, i + 1)
        .flatten()
        .filter(function(res) { return res.isEliminated; })
        .map('id')
        .value();

      // Filter out candidates eliminated in previous rounds
      const filteredResult = _.reject(result, function(res) {
        return _.includes(idsToRemove, res.id);
      });

      acc.push(filteredResult);
      return acc;
    }, []);
  }

}

export default BallotUtils;