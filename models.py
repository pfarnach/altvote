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
	ballot_options = db.relationship("BallotOption")

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

class BallotOption(db.Model):
	__tablename__ = "ballot_option"
	id = db.Column('id', db.Integer, primary_key=True)
	ballot_id = db.Column('ballot_id', db.Integer, db.ForeignKey('ballot.id'))
	name = db.Column('name', db.String, nullable=False)
	ballot_votes = db.relationship("BallotVote")

	@property
	def serialize(self):
		"""Return object data in easily serializeable format"""
		return {
			'id': 				self.id,
			'ballot_id':	self.ballot_id,
			'name': 			self.name
		}

class BallotVote(db.Model):
	__tablename__ = 'ballot_vote'
	id = db.Column('id', db.Integer, primary_key=True)
	vote_id = db.Column('uuid', db.String, nullable=False)
	ballot_option_id = db.Column('ballot_option', db.Integer, db.ForeignKey('ballot_option.id'), nullable=False)
	creation_date = db.Column('creation_date', db.Integer, default=int(datetime.datetime.utcnow().strftime('%s')))
	rank = db.Column('rank', db.Integer, nullable=False)
	db.UniqueConstraint('ballot_option_id', 'id')

	@property
	def serialize(self):
		"""Return object data in easily serializeable format"""
		return {
			'id': 							self.id,
			'vote_id':					self.vote_id,
			'ballot_option_id':	self.ballot_option_id,
			'rank':							self.rank
		}

db.create_all()
db.session.commit()
