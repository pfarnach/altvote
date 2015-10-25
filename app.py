from __future__ import division

from flask import Flask, jsonify, make_response, send_from_directory, request
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine

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

@app.route('/create_ballot', methods=['POST'])
def create_ballot():
	if 'application/json' in request.environ['CONTENT_TYPE']:
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

		db.session.commit()

		return jsonify(ballot=ballot.serialize, options=[c.serialize for c in new_options])

@app.route('/get_ballot/<uuid>', methods=['GET'])
def get_ballot(uuid):
	ballot = db.session.query(models.Ballot).filter(models.Ballot.uuid == uuid).first()
	options = db.session.query(models.BallotOption).filter(models.BallotOption.ballot_id == ballot.id).all()

	if ballot:
		return jsonify(ballot=ballot.serialize, options=[c.serialize for c in options])
	else:
		return "No entry found for uuid %s" % uuid

@app.route('/get_all_ballots', methods=['GET'])
def get_all_ballot():
	ballots = jsonify(ballots=[i.serialize for i in models.Ballot.query.all()])
	return ballots

@app.route('/cast_vote', methods=['POST'])
def cast_vote():
	if 'application/json' in request.environ['CONTENT_TYPE']:
		vote_id = uuid.uuid4()	
		ranked_options = request.json['ranked_options']
		for rc in ranked_options:
			if rc['rank']:
				cast_vote = models.BallotVote(vote_id=vote_id, ballot_option_id=rc['id'], rank=rc['rank'])
				db.session.add(cast_vote)
		db.session.commit()
	return 'Vote cast successfully'

@app.route('/get_results/<uuid>', methods=['GET'])
def get_results(uuid):
	ballot = db.session.query(models.Ballot).filter(models.Ballot.uuid == uuid).first()
	options = db.session.query(models.BallotOption).filter(models.BallotOption.ballot_id == ballot.id).all()
	options_with_count=[c.serialize for c in options]

	for option in options_with_count:
		option['votes_by_round'] = {};

	# get total count to calculate percentage of votes won by each choice
	all_first_round_votes = (db.session
													.query(models.BallotVote)
		                    	.filter(models.BallotOption.ballot_id == ballot.id, models.BallotVote.rank == 1)
		                    	.all())

	# for each ballot option, find how many 1st round votes it got (will make this recursive later)
	options_final = fetchVotesPerOption(options_with_count, len(all_first_round_votes), 1, [v.serialize for v in all_first_round_votes])

	return jsonify(ballot=ballot.serialize,
								 options=options_final,
								 meta={'count': len(all_first_round_votes)} )

def fetchVotesPerOption(options, total_votes, current_round, all_current_round_votes):
	for option in options:
		try:
			# check to see if it was marked as eliminated
			if option['votes_by_round'][current_round] == 0:
				eliminated_votes_uuids = []
				
				for v in all_current_round_votes:
					if v['ballot_option_id'] == option['id']:
						eliminated_votes_uuids.append(v['vote_id'])

				next_round_votes = (db.session
														.query(models.BallotVote)
				                    .filter(models.BallotVote.vote_id.in_(eliminated_votes_uuids), models.BallotVote.rank == current_round)
				                    .all())
				options = redistributeVotes([v.serialize for v in next_round_votes], options, current_round)
				option['votes_by_round'][current_round] = 0
		except KeyError:
			votes_per_option = (db.session
													.query(models.BallotVote)
			                    .filter(models.BallotVote.ballot_option_id == option['id'], models.BallotVote.rank == current_round)
			                    .all())
			option['votes_by_round'][current_round] = len(votes_per_option)

	if checkIfMajority(options, total_votes, current_round):
		return options
	else:
		eliminateLastPlace(options, current_round)
	return fetchVotesPerOption(options, total_votes, current_round + 1, all_current_round_votes)

def checkIfMajority(options, total_votes, current_round):
	for option in options:
		if option['votes_by_round'].get(current_round) / total_votes > 0.5:
			return True
	return False

def eliminateLastPlace(options, current_round):
	# order in ascending order to eliminate lowest
	options.sort(key=lambda x: x['votes_by_round'].get(current_round))
	# set next round to False so it's removed from vote counting	
	options[0]['votes_by_round'][current_round + 1] = 0

def redistributeVotes(redib_votes, options, current_round):
	for option in options:
		# If option wasn't eliminated, set its next round count to what it already had
		option['votes_by_round'][current_round] = option['votes_by_round'][current_round-1]
		for vote in redib_votes:
			if vote['ballot_option_id'] == option['id']:
				option['votes_by_round'][current_round] += 1
	return options

# View Utils
def addAndCommit(toAdd):
	db.session.add(toAdd)
	db.session.commit()

# To get the show on the road
if __name__ == '__main__':
	app.run(debug=DEBUG, port=PORT, host=HOST)

# print sys.exc_info()[0]
