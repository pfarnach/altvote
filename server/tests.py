from flask.ext.testing import TestCase
import unittest

from app import app, db

class MyTest(TestCase):

  def create_app(self):
    # pass in test configuration
    app.config.from_object('config.TestConfiguration')
    return app(self)

  def setUp(self):
    db.create_all()

  def tearDown(self):
    db.session.remove()
    db.drop_all()

if __name__ == '__main__':
  unittest.main()