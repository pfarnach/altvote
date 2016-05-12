from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.mail import Mail
from flask.ext.compress import Compress

app = Flask(__name__, static_url_path='/')
app.config.from_object('server.config.DebugConfiguration')

mail = Mail(app)

db = SQLAlchemy(app)

Compress(app)
