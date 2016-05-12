# Setup here from https://realpython.com/blog/python/python-web-applications-with-flask-part-iii/

import keys

email = {
	'username': 'altvote.noreply',
	'password': keys.EMAIL['password'],
	'full_email': 'altvote.noreply@gmail.com'
}

class BaseConfiguration:
	DEBUG = False
	TESTING = False
	SECRET_KEY = keys.SECRET_KEY
	SQLALCHEMY_DATABASE_URI = keys.DB_URI
	MAIL_SERVER = 'smtp.googlemail.com'
	MAIL_PORT = 465
	MAIL_USE_TLS = False
	MAIL_USE_SSL = True
	MAIL_USERNAME = email['full_email']
	MAIL_PASSWORD = email['password']
	CACHE_TYPE = 'simple'

class TestConfiguration(BaseConfiguration):
	TESTING = True

	# Overwrite DB location so we don't kill our real data
	SQLALCHEMY_DATABASE_URI = keys.DB_URI

class DebugConfiguration(BaseConfiguration):
	DEBUG = True

class ProdConfiguration(BaseConfiguration):
	DEBUG = False
	SQLALCHEMY_DATABASE_URI = keys.DB_URI_PROD