from flask import Flask, jsonify, make_response, send_from_directory, request
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
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

### JSON TEST
@app.route('/make_json', methods=['POST'])
def make_json():
	if 'application/json' in request.environ['CONTENT_TYPE']:
		test = models.JsonTest(jblob=request.json)
		# test = models.Ballot(ballot_name="Yolo1", ballot_description="Yolo1 description")
		db.session.add(test)
		try:
			db.session.commit()
		except Exception as e:
			db.session.rollback()
			print str(e)
		print
		print request.json
		print
	return request.json

### JSON TEST
@app.route('/update_json', methods=['PUT'])
def update_json():
	tests = db.session.query(models.JsonTest).filter(models.JsonTest.id == 1).first()
	tests.jblob['description'] = "Look! An updated description"
	db.session.query(models.JsonTest).filter(models.JsonTest.id == 1).update({'jblob': tests.jblob })
	db.session.commit()
	print 'updated'

@app.route('/create_ballot', methods=['POST'])
def create_ballot():
	if 'application/json' in request.environ['CONTENT_TYPE']:
		data = request.json
		choices = data['choices']

		# set id and default vote count for each choice
		for i, choice in enumerate(choices):
			choice['id'] = i + 1
			choice['vote_count'] = 0

		# make ballot and save
		ballot = models.Ballot(name=data['name'], description=data['description'], choices=data['choices'])
		addAndCommit(ballot)
		return jsonify(ballot=ballot.serialize)

@app.route('/get_ballot/<uuid>', methods=['GET'])
def get_ballot(uuid):
	ballot = db.session.query(models.Ballot).filter(models.Ballot.uuid == uuid).first()
	if ballot:
		return jsonify(ballot=ballot.serialize)
	else:
		return "No entry found for uuid %s" % uuid

@app.route('/get_all_ballots', methods=['GET'])
def get_all_ballot():
	ballots = jsonify(ballots=[i.serialize for i in models.Ballot.query.all()])
	return ballots

# View Utils
def addAndCommit(toAdd):
	db.session.add(toAdd)
	db.session.commit()

# To get the show on the road
if __name__ == '__main__':
	app.run(debug=DEBUG, port=PORT, host=HOST)

# print sys.exc_info()[0]
