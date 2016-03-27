from app import app, db
from server.views import base_view


app.register_blueprint(base_view)

# To get the show on the road
if __name__ == '__main__':
	app.run(port=8000, host='0.0.0.0', threaded=True)