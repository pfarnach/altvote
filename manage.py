from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand

from app import app
from server.models import db  # b/c we need the db after tables are created

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
	manager.run()