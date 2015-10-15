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
	choices = db.Column('choices', JSON, nullable=False)

	@property
	def serialize(self):
		"""Return object data in easily serializeable format"""
		return {
			'id': 						self.id,
			'uuid':						self.uuid,
			'status':					self.status,
			'creation_date':  self.creation_date,
			'name': 					self.name,
			'description':    self.description,
			'choices':				self.choices
		}

class JsonTest(db.Model):
	__tablename__ = "jsontest"
	id = db.Column('id', db.Integer, primary_key=True)
	jblob = db.Column('jblob', JSON)

	@property
	def serialize(self):
		"""Return object data in easily serializeable format"""
		return {
			'id': 	 self.id,
			'jblob': self.jblob
		}

db.create_all()
db.session.commit()
