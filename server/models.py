import uuid
from datetime import datetime

from server.utils.keywords import kw
from app import db


class Ballot(db.Model):
	__tablename__ = "ballot"
	id = db.Column('id', db.Integer, primary_key=True)
	uuid = db.Column('uuid', db.String, default=uuid.uuid4)
	admin_id = db.Column('admin_id', db.Integer, nullable=False)
	status = db.Column('status', db.String, default=kw['ballot_status']['active'])
	creation_date = db.Column('creation_date', db.Integer, default=int(datetime.utcnow().strftime('%s')))
	end_timestamp = db.Column('end_timestamp', db.Integer)
	name = db.Column('name', db.String, nullable=False)
	description = db.Column('description', db.String)
	type = db.Column('type', db.String, nullable=False)
	ballot_options = db.relationship("BallotOption", cascade="all, delete-orphan")

	@property
	def serialize(self):
		"""Return object data in easily serializeable format"""
		return {
			'id': 						self.id,
			'uuid':						self.uuid,
			'status':					self.status,
			'creation_date':  self.creation_date,
			'end_timestamp':	self.end_timestamp,
			'name': 					self.name,
			'type':						self.type,
			'description':    self.description
		}

class BallotOption(db.Model):
	__tablename__ = "ballot_option"
	id = db.Column('id', db.Integer, primary_key=True)
	status = db.Column('status', db.String, default=kw['ballot_status']['active'])
	ballot_id = db.Column('ballot_id', db.Integer, db.ForeignKey('ballot.id', ondelete='cascade'))
	name = db.Column('name', db.String, nullable=False)
	is_write_in = db.Column('is_write_in', db.Boolean, default=False)
	ballot_votes = db.relationship("BallotVote", cascade="all, delete-orphan")

	@property
	def serialize(self):
		"""Return object data in easily serializeable format"""
		return {
			'id': 					self.id,
			'ballot_id':		self.ballot_id,
			'name': 				self.name,
			'is_write_in':	self.is_write_in
		}

class BallotVote(db.Model):
	__tablename__ = 'ballot_vote'
	id = db.Column('id', db.Integer, primary_key=True)
	ballot_id = db.Column('ballot_id', db.Integer, nullable=False)
	vote_id = db.Column('uuid', db.String, nullable=False)
	ballot_option_id = db.Column('ballot_option', db.Integer, db.ForeignKey('ballot_option.id', ondelete='cascade'), nullable=False)
	creation_date = db.Column('creation_date', db.Integer, default=int(datetime.utcnow().strftime('%s')))
	rank = db.Column('rank', db.Integer, nullable=False)
	db.UniqueConstraint('ballot_option_id', 'id')

	@property
	def serialize(self):
		"""Return object data in easily serializeable format"""
		return {
			'id': 							self.id,
			'ballot_id':				self.ballot_id,
			'vote_id':					self.vote_id,
			'ballot_option_id':	self.ballot_option_id,
			'rank':							self.rank
		}

db.create_all()
db.session.commit()
