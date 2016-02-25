from __future__ import division

from flask import Flask, jsonify, make_response, send_from_directory, request
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine

import count_utils

import uuid
import models
import keys
import os

base_dir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, static_url_path='/static')
app.secret_key = keys.secret_key
app.config.from_pyfile('config.py')

db = SQLAlchemy(app)

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
  return send_from_directory('static', path)

@app.route('/api/create_ballot', methods=['POST'])
def create_ballot():
	if request.is_xhr:
		data = request.json
		options = data['options']
		new_options = [];

		# make ballot and save
		ballot = models.Ballot(name=data['name'], description=data['description'])
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

@app.route('/cast_vote', methods=['POST'])
def cast_vote():
	if request.is_xhr:
		vote_id = uuid.uuid4()
		ranked_options = request.json['ranked_options']
		for rc in ranked_options:
			if rc['rank']:
				cast_vote = models.BallotVote(vote_id=vote_id, ballot_id=rc['ballot_id'], ballot_option_id=rc['id'], rank=rc['rank'])
				db.session.add(cast_vote)
		db.session.commit()
	return 'Vote cast successfully'

@app.route('/api/get_results/<uuid>', methods=['GET'])
def get_results(uuid):
	ballot = db.session.query(models.Ballot).filter(models.Ballot.uuid == uuid).first()
	all_ballot_votes = (db.session
								.query(models.BallotVote)
              	.filter(models.BallotOption.ballot_id == ballot.id)
              	.all())

	votes = _getVotesList(all_ballot_votes)
	election = count_utils.Election(votes)
	results = election.getResults()
	results_with_options = _getResultsWithOptions(results)

	return jsonify(ballot=ballot.serialize, result=results_with_options)

# Put votes into [{"candidate1": rank, "candidate2": rank}, {...}] format for count_utils
def _getVotesList(raw_votes):
	votes = {}

	for v in raw_votes:
		if v.vote_id not in votes:
			votes[v.vote_id] = {}

		votes[v.vote_id][v.ballot_option_id] = v.rank

	return [count_utils.Vote(x) for x in votes.itervalues()]

def _getResultsWithOptions(results):
	winning_perc = max(results.values())
	options = db.session.query(models.BallotOption).filter(models.BallotOption.ballot_id.in_(results.iterkeys()))
	options_serialized = [x.serialize for x in options]

	for option in options_serialized:
		for candidate_id, perc_vote in results.iteritems():
			if option['id'] == candidate_id:
				option['percent_vote'] = perc_vote
				if perc_vote == winning_perc:
					option['isWinner'] = True
				else:
					option['isWinner'] = False
			elif not 'percent_vote' in option:
				option['percent_vote'] = 0
				option['isWinner'] = False

	return options_serialized

# View Utils
def addAndCommit(toAdd):
	db.session.add(toAdd)
	db.session.commit()

# To get the show on the road
if __name__ == '__main__':
	app.run(debug=DEBUG, port=PORT, host=HOST)
