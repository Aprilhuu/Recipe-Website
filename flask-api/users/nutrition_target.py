from flask_restx import Resource
from flask import request
from bson.objectid import ObjectId
from fractions import Fraction
from flask_jwt import jwt_required, current_identity
import datetime


from app import db_connection

class Nutrition_Target(Resource):
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
        nt = u.get('nutrition_target', {'calories':0, 'carbon':0, 'fiber':0})

        return {'result': nt}, 200

    @jwt_required()
    def post(self):
        '''
        update the meal plan by user name
        '''

        post_data = request.get_json()
        nutrition_target = post_data.get('nutrition_target', None)
        if not nutrition_target:
            return {'result': 'Error please enter nutrition target'}, 403

        # only allow ['calories', 'carbon', 'fiber']
        if len(nutrition_target) != 3:
            return {'result': 'invalid input'}, 403

        # add checker for int
        try:
            for x in nutrition_target:
                # check value is number
                temp = int(nutrition_target[x])

                # also set limit
                if x == 'calories' and not (temp<=1000 and temp>=0):
                    raise Exception("invalid range")
                elif x == 'carbon' and not (temp<=200 and temp>=0):
                    raise Exception("invalid range")
                elif x == 'fiber' and not (temp<=50 and temp>=0):
                    raise Exception("invalid range")

                # check key is in the list
                if x not in ['calories', 'carbon', 'fiber']:
                    raise Exception("key %s is not in list"%x)
        except Exception as e:
            print(e)
            return {'result': str(e)}, 403

        user_col = db_connection['users']
        # get the logined username
        username = current_identity.get('username')

        u = user_col.update(
            {'username': username},
            { '$set':{'nutrition_target': nutrition_target}}
        )


        return {'result': nutrition_target}, 200
