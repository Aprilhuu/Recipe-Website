from flask_restx import Resource
from flask import request
from bson.objectid import ObjectId

from app import db_connection

# this api instance is to handle the meal plan 
# into shopping list
class Meal_Plan_2_Shopping_List(Resource):
    
    def get(self):
        '''
        aggregate the recipe ingradients in meal planer
        and return to shopping list
        '''

        # example curl localhost:5000/v1/recipes/
        try:
            # for now tempory user is group3
            username = 'group3'



            mp_collection = db_connection['meal_plan']
            # find the exist key for that user
            record = mp_collection.find_one({username:{'$exists': True}})

            # then get all recipe id with count
            recipe_ids = {}
            DAYS = ['friday', 'monday', 'saturday', 'sunday', 'thursday', 'tuesday', 'wednesday']
            for meals in record[username]:
                for days in DAYS:
                    # if we have the plan on that day
                    recipe_per_day = meals[days].get('recipe_title', None)
                    if recipe_per_day:
                        # check if we store the id before
                        if recipe_ids.get(recipe_per_day, None):
                            recipe_ids[recipe_per_day] += 1
                        else:
                            recipe_ids.update({recipe_per_day:1})
            print(recipe_ids)

            # then get the recipe by id
            # TODO add to util function <-----------------------------------------------------
            r_collection = db_connection['group3_collection']
            for rid in recipe_ids:
                # ingredient x number
                multiplier = recipe_ids[rid]

                # get the recipe detail
                # tempory use the title here <--------------------------------------------------
                recipe = r_collection.find_one({'title':rid})
                print(recipe)

            ##############################################
            # here need futher discuss

            shopping_list = {
                'apple': {
                    'quantity': 2,
                    'unit': None
                },
                'beef': {
                    'quantity': 2,
                    'unit': 'pound'
                }
            }


        except Exception as e:
            return {'result': str(e)}, 400

        return {'result':shopping_list}, 200
