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

	# get total count to calculate percentage of votes won by each choice
	total_votes_cast = len((db.session
													.query(models.BallotVote)
		                    	.filter(models.BallotOption.ballot_id == ballot.id, models.BallotVote.rank == 1)
		                    	.all()))

	# for each ballot option, find how many 1st round votes it got (will make this recursive later)
	for option in options_with_count:
		votes_per_option = (db.session
												.query(models.BallotVote)
		                    .filter(models.BallotVote.ballot_option_id == option['id'], models.BallotVote.rank == 1)
		                    .all())
		option['round_1_votes'] = len(votes_per_option)

	if ballot:
		return jsonify(ballot=ballot.serialize,
									 options=options_with_count,
									 meta={'count': total_votes_cast} )
	else:
		return "No entry found for uuid %s" % uuid

# View Utils
def addAndCommit(toAdd):
	db.session.add(toAdd)
	db.session.commit()

# To get the show on the road
if __name__ == '__main__':
	app.run(debug=DEBUG, port=PORT, host=HOST)

# print sys.exc_info()[0]
