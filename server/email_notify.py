from flask.ext.mail import Message

from server.decorators import async
from app import app, mail
from config import email

@async
def send_async_email(app, msg):
	with app.app_context():
		mail.send(msg)

def send_email(subject, recipients, text_body, html_body):
	msg = Message(subject, sender=email['full_email'], recipients=recipients)
	msg.body = text_body
	msg.html = html_body
	send_async_email(app, msg)