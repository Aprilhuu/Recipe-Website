from flask_restx import Resource
from flask import request
from bson.objectid import ObjectId
from fractions import Fraction

from app import db_connection

class Meal_Plan(Resource):
	def get(self):
		'''
		get saved meal plan schedule by user name
		'''
		user_col = db_connection['users']

		# find user
		username = 'group3'
		u = user_col.find_one({'username': username})
		# get meal plan
		mp = u.get('meal_plan', {})

		return {'result': mp}, 200


	def post(self):
		'''
		update the meal plan by user name
		'''

		post_data = request.get_json()
		new_plan = post_data.get('new_plan', None)
		if not new_plan:
			return {'result': 'Error please enter new plan'}, 403

		user_col = db_connection['users']

		# find user
		username = 'test_user'
		u = user_col.update(
			{'username': username},
			{ '$set':{'meal_plan': new_plan}}
		)
		# get meal plan
		# mp = u.get('meal_plan', {})

		return {'result': 'success'}, 200
