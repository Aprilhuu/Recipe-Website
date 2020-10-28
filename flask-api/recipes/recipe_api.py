from flask_restx import Resource

class Recipes(Resource):
	def get(self):
		return 'aaaa', 2000