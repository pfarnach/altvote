from datetime import datetime
import math

class TimeUtils:
	@staticmethod
	def getSecondsNowInUTC():
		now = datetime.utcnow()
		start = datetime(1970,1,1)
		return math.floor((now - start).total_seconds())