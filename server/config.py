# Setup here from https://realpython.com/blog/python/python-web-applications-with-flask-part-iii/

import keys

class BaseConfiguration:
	DEBUG = False
	TESTING = False
	SECRET_KEY = keys.SECRET_KEY
	SQLALCHEMY_DATABASE_URI = keys.DB_URI

class TestConfiguration(BaseConfiguration):
	TESTING = True

	# Overwrite DB location so we don't kill our real data
	SQLALCHEMY_DATABASE_URI = keys.DB_URI

class DebugConfiguration(BaseConfiguration):
	DEBUG = True