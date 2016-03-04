from __future__ import division

from flask import Flask, jsonify, make_response, send_from_directory, request, abort
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine

from copy import deepcopy
import uuid
import os
import keys
import CountUtils
from VoteUtils import VoteUtils

base_dir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, static_url_path='/')
app.secret_key = keys.secret_key
app.config.from_pyfile('config.py')

db = SQLAlchemy(app)

import models

DEBUG = True
PORT = 8000
HOST = '0.0.0.0'

# routing for basic pages (pass routing onto the Angular app)
@app.route('/')
def index(**kwargs):
  return make_response(open('index.html').read())

# static path info: https://stackoverflow.com/questions/24099818/angularjs-not-running-in-flask-application
# static path info: https://stackoverflow.com/questions/20646822/how-to-serve-static-files-in-flask
@app.route('/<path:path>')
def serve_js(path):
  return send_from_directory('', path)

@app.route('/api/create_ballot', methods=['POST'])
def create_ballot():
	if request.is_xhr:
		data = request.json
		options = data['options']
		new_options = [];

		# make ballot and save
		ballot = models.Ballot(name=data['name'], description=data.get('description', ''))
		addAndCommit(ballot)

		# make options and save
		for option in options:
			option_to_add = models.BallotOption(name=option['name'], ballot_id=ballot.id)
			new_options.append(option_to_add)
			db.session.add(option_to_add)

		# TODO: is this necessary?
		db.session.commit()

		return jsonify(ballot=ballot.serialize, options=[c.serialize for c in new_options])

@app.route('/api/get_ballot/<uuid>', methods=['GET'])
def get_ballot(uuid):
	ballot = db.session.query(models.Ballot).filter(models.Ballot.uuid == uuid).first()
	options = db.session.query(models.BallotOption).filter(models.BallotOption.ballot_id == ballot.id).all()

	if ballot:
		return jsonify(ballot=ballot.serialize, options=[c.serialize for c in options])
	else:
		return "No entry found for uuid %s" % uuid

@app.route('/api/get_all_ballots', methods=['GET'])
def get_all_ballot():
	ballots = jsonify(ballots=[i.serialize for i in models.Ballot.query.all()])
	return ballots

@app.route('/api/cast_vote', methods=['POST'])
def cast_vote():
	if request.is_xhr:
		vote_id = uuid.uuid4()
		ranked_options = request.json['ranked_options']

		# Check if vote ranks are sequential with no gaps and start at 1
		if (VoteUtils.validateRankOrder(ranked_options)):
			for rc in ranked_options:
				if rc['rank']:
					cast_vote = models.BallotVote(vote_id=vote_id, ballot_id=rc['ballot_id'], ballot_option_id=rc['id'], rank=rc['rank'])
					db.session.add(cast_vote)
			db.session.commit()
			return 'Vote successfully cast'
		else:
			abort(400)
	else:
		return errorResponse()

@app.route('/api/get_results/<uuid>', methods=['GET'])
def get_results(uuid):
	# Fetch ballot and all votes cast for the ballot
	ballot = db.session.query(models.Ballot).filter(models.Ballot.uuid == uuid).first()
	ballot_votes = (db.session
								.query(models.BallotVote)
              	.filter(models.BallotVote.ballot_id == ballot.id)
              	.all())

	# Parry down list to get unique ballots cast
	unique_ballots = {v.vote_id:v for v in ballot_votes}.values()
	total_ballots_cast = len(unique_ballots)

	# Get votes into right structure then do vote counting
	votes = _getVotesList(ballot_votes)
	election = CountUtils.Election(votes)

	# Take results and marry candidate IDs back to candidate (option) info
	results_by_round = election.getResults([])
	results_by_round = _getResultsWithOptions(results_by_round, ballot.id)

	return jsonify(ballot=ballot.serialize, results_by_round=results_by_round, total_ballots_cast=total_ballots_cast)

# Put votes into [{"candidate1": rank, "candidate2": rank}, {...}] format for CountUtils
def _getVotesList(raw_votes):
	votes = {}

	for v in raw_votes:
		if v.vote_id not in votes:
			votes[v.vote_id] = {}

		votes[v.vote_id][v.ballot_option_id] = v.rank

	return [CountUtils.Vote(x) for x in votes.itervalues()]

def _getResultsWithOptions(results, ballot_id):
	# Find what winning percentage was
	final_round_results = results[-1]
	winning_perc = max(final_round_results.values())

	# Get all relevants options
	options_unserialized = db.session.query(models.BallotOption).filter(models.BallotOption.ballot_id == ballot_id)
	options_serialized = [x.serialize for x in options_unserialized]

	results_by_round = []

	# Basically appending percentages to each option for each round
	for i, r in enumerate(results):
		options = deepcopy(options_serialized)

		for candidate_id, perc_vote in r.iteritems():
			for option in options:
				if option['id'] == candidate_id:
					option['percent_vote'] = perc_vote

					# Will only have winner in last round
					if (perc_vote == winning_perc) and (i == len(results) - 1):
						option['isWinner'] = True
					else:
						option['isWinner'] = False

				elif not 'percent_vote' in option:
					option['percent_vote'] = 0
					option['isWinner'] = False

		results_by_round.append(options)

	return results_by_round

# View Utils
def addAndCommit(toAdd):
	db.session.add(toAdd)
	db.session.commit()

# Response Utils
def errorResponse(message = 'Invalid request', status_code = 400):
	response = jsonify({'message': message})
	response.status_code = status_code
	return response

# To get the show on the road
if __name__ == '__main__':
	app.run(debug=DEBUG, port=PORT, host=HOST)
