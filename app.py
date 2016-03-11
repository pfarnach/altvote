from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path='/')
app.config.from_object('server.config.DebugConfiguration')

db = SQLAlchemy(app)
