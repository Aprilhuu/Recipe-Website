from flask_restx import Resource
from flask import request
from bson.objectid import ObjectId
from fractions import Fraction
from flask_jwt import jwt_required, current_identity
import datetime


from app import db_connection

class Meal_Plan(Resource):
    @jwt_required()
    def get(self):
        '''
        get saved meal plan schedule by user name
        '''
        user_col = db_connection['users']
        
        # get the logined username
        username = current_identity.get('username')
        u = user_col.find_one({'username': username})
        # get meal plan
        mp = u.get('meal_plan', {})

        #we also refresh per week
        last_time = u.get('last_meal_plan_time')
        last_datetime = datetime.datetime.strptime(last_time, '%Y-%m-%d %H:%M:%S')
        # compare with the this week
        start_weekday = datetime.datetime.today() - datetime.timedelta(days=datetime.datetime.today().isoweekday() % 7)
        start_weekday = start_weekday.replace(hour=0, minute=0, second=0, microsecond=0)

        empty_plan = [
          {
             "key":1,
             "meals":"Breakfast",
             "monday":{},
             "tuesday":{},
             "wednesday":{},
             "thursday":{},
             "friday":{},
             "saturday":{},
             "sunday":{}
          },
          {
             "key":2,
             "meals":"Lunch",
             "monday":{},
             "tuesday":{},
             "wednesday":{},
             "thursday":{},
             "friday":{},
             "saturday":{},
             "sunday":{}
          },
          {
             "key":3,
             "meals":"Dinner",
             "monday":{},
             "tuesday":{},
             "wednesday":{},
             "thursday":{},
             "friday":{},
             "saturday":{},
             "sunday":{}
          }
        ]
        print(last_datetime)
        print(start_weekday)
        # give the empty plan if we got next week
        if start_weekday > last_datetime:
            # also set back to database
            u = user_col.update(
                {'username': username},
                { '$set':{'meal_plan': empty_plan}}
            )
            return {'result': empty_plan}, 200


        return {'result': mp}, 200

    @jwt_required()
    def post(self):
        '''
        update the meal plan by user name
        '''

        post_data = request.get_json()
        new_plan = post_data.get('new_plan', None)
        if not new_plan:
            return {'result': 'Error please enter new plan'}, 403

        user_col = db_connection['users']

        # get the logined username
        username = current_identity.get('username')
        u = user_col.update(
            {'username': username},
            { '$set':{'meal_plan': new_plan}}
        )
        # get meal plan
        # mp = u.get('meal_plan', {})

        return {'result': 'success'}, 200
