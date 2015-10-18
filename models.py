import datetime
import uuid
from sqlalchemy.dialects.postgresql import JSON

from app import db

class Ballot(db.Model):
	__tablename__ = "ballot"
	id = db.Column('id', db.Integer, primary_key=True)
	uuid = db.Column('uuid', db.String, default=uuid.uuid4)
	status = db.Column('status', db.String, default='ACTIVE')
	creation_date = db.Column('creation_date', db.Integer, default=int(datetime.datetime.utcnow().strftime('%s')))
	name = db.Column('name', db.String, nullable=False)
	description = db.Column('description', db.String)
	ballot_choices = db.relationship("BallotChoice")

	@property
	def serialize(self):
		"""Return object data in easily serializeable format"""
		return {
			'id': 						self.id,
			'uuid':						self.uuid,
			'status':					self.status,
			'creation_date':  self.creation_date,
			'name': 					self.name,
			'description':    self.description
		}

class BallotChoice(db.Model):
	__tablename__ = "ballot_choice"
	id = db.Column('id', db.Integer, primary_key=True)
	ballot_id = db.Column('ballot_id', db.Integer, db.ForeignKey('ballot.id'))
	name = db.Column('name', db.String, nullable=False)
	ballot_votes = db.relationship("BallotVote")

	@property
	def serialize(self):
		"""Return object data in easily serializeable format"""
		return {
			'id': 						self.id,
			'ballot_id':			self.ballot_id,
			'name': 					self.name
		}

class BallotVote(db.Model):
	__tablename__ = 'ballot_vote'
	id = db.Column('id', db.Integer, primary_key=True)
	ballot_choices = db.Column('ballot_choices', db.Integer, db.ForeignKey('ballot_choice.id'))
	ballot_vote_ranks = db.relationship("BallotVoteRank")

	@property
	def serialize(self):
		"""Return object data in easily serializeable format"""
		return {
			'id': 						self.id,
			'ballot_choice':	self.ballot_choice
		}

class BallotVoteRank(db.Model):
	__tablename__ = 'ballot_vote_rank'
	id = db.Column('id', db.Integer, primary_key=True)
	ballot_vote = db.Column('vote_vote', db.Integer, db.ForeignKey('ballot_vote.id'))
	ranking = db.Column('ranking', db.Integer, nullable=False)

	@property
	def serialize(self):
		"""Return object data in easily serializeable format"""
		return {
			'id': 						self.id,
			'ballot_vote':		self.ballot_vote,
			'ranking':				self.ranking
		}

db.create_all()
db.session.commit()
