from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.mail import Mail
from flask.ext.cache import Cache 

app = Flask(__name__, static_url_path='/')
app.config.from_object('server.config.DebugConfiguration')
app.cache = Cache(app)

mail = Mail(app)

db = SQLAlchemy(app)
