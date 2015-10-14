import datetime
from app import db
from sqlalchemy.dialects.postgresql import JSON

class Ballot(db.Model):
	__tablename__ = "ballot"
	id = db.Column('id', db.Integer, primary_key=True)
	creation_date = db.Column('creation_date', db.Integer, default=int(datetime.datetime.utcnow().strftime('%s')))
	ballot_name = db.Column('ballot_name', db.String)
	ballot_description = db.Column('ballot_description', db.String)

	@property
	def serialize(self):
		"""Return object data in easily serializeable format"""
		return {
			'id': 								self.id,
			'creation_date': 			self.creation_date,
			'ballot_name': 				self.ballot_name,
			'ballot_description': self.ballot_description
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

# db.create_all()
# ballot = Ballot(ballot_name="test name!", ballot_description="test description!")
# db.session.add(ballot)

# try:
# 	db.session.commit()
# except Exception as e:
# 	db.session.rollback()
# 	print str(e)