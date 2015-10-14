from flask import Flask, jsonify, g, make_response, send_from_directory, request
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
import models
import keys
import os
import uuid
import json

base_dir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, static_url_path='/static')
app.secret_key = keys.secret_key
app.config.from_pyfile('config.py')

db = SQLAlchemy(app)

DEBUG = True
PORT = 8000
HOST = '0.0.0.0'

@app.before_request
def before_request():
	"""Connect to the Database before each request"""
	# g.db = models.DATABASE
	# g.db.connect()

@app.after_request
def after_request(response):
	"""Close db connection after each request"""
	# g.db.close()
	return response

# routing for basic pages (pass routing onto the Angular app)
@app.route('/')
def index(**kwargs):
    return make_response(open('index.html').read())

# static path info: https://stackoverflow.com/questions/24099818/angularjs-not-running-in-flask-application
# static path info: https://stackoverflow.com/questions/20646822/how-to-serve-static-files-in-flask
@app.route('/<path:path>')
def serve_js(path):
    return send_from_directory('static', path)

def get_ballot_json(ballot):
	return json.dumps(model_to_dict(ballot, recurse=True, backrefs=True, exclude=[models.Ballot.created]))  # ignore created date for now b/c serializer can't handle datetime.datetime

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
		ballot_uuid = uuid.uuid4()
		models.Ballot.create(uuid=ballot_uuid, name=data['name'], description=data['description'], ballot_options=data['ballot_options'])
		ballot = models.Ballot.get(models.Ballot.uuid == ballot_uuid)
		return get_ballot_json(ballot)

@app.route('/get_ballot', methods=['GET'])
def get_ballot():
	ballot_uuid = request.args.get('uuid')
	try:
		ballot = models.Ballot.get(models.Ballot.uuid == ballot_uuid)
		return get_ballot_json(ballot)
	except models.BallotDoesNotExist:
		return jsonify({'extryExists': False})

@app.route('/get_all_ballots', methods=['GET'])
def get_all_ballot():
	ballots = jsonify(ballots=[i.serialize for i in models.Ballot.query.all()])
	# for ballot in raw_ballots:
	# 	ballots.append(model_to_dict(ballot, exclude=[models.Ballot.created]))
	return ballots

if __name__ == '__main__':
	app.run(debug=DEBUG, port=PORT, host=HOST)
