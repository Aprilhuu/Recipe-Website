from flask_restx import Resource
from flask import request
from bson.objectid import ObjectId
from fractions import Fraction

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
            # username = 'group3'



            # mp_collection = db_connection['meal_plan']
            # # find the exist key for that user
            # record = mp_collection.find_one({username:{'$exists': True}})

            # # then get all recipe id with count
            # recipe_ids = {}
            # DAYS = ['friday', 'monday', 'saturday', 'sunday', 'thursday', 'tuesday', 'wednesday']
            # for meals in record[username]:
            #     for days in DAYS:
            #         # if we have the plan on that day
            #         recipe_per_day = meals[days].get('recipe_title', None)
            #         if recipe_per_day:
            #             # check if we store the id before
            #             if recipe_ids.get(recipe_per_day, None):
            #                 recipe_ids[recipe_per_day] += 1
            #             else:
            #                 recipe_ids.update({recipe_per_day:1})
            # print(recipe_ids)

            # # then get the recipe by id
            # # TODO add to util function <-----------------------------------------------------
            # r_collection = db_connection['group3_collection']
            # for rid in recipe_ids:
            #     # ingredient x number
            #     multiplier = recipe_ids[rid]

            #     # get the recipe detail
            #     # tempory use the title here <--------------------------------------------------
            #     recipe = r_collection.find_one({'title':rid})
            #     print(recipe)

            ##############################################
            # temporary return all
            r_collection = db_connection['group3_collection']
            ret_json = {}
            recipe = r_collection.find()
            for x in recipe[:3]:
                for ingredient in x['ingredients']:
                    # print(ingredient)

                    # Note -1 means the ingredient has no quantity restriction
                    quantity = ingredient.get('quantity', '-1 ')
                    # split into quantity and unit
                    # I assume the format will be 'quantity unit'

                    t = quantity.split(' ')
                    quantity, unit = (Fraction(t[0]), t[1]) if len(t) == 2 else (Fraction(t[0]), None)
                    # only add the unit when the recipe provides
                    q_str = '%s %s'%(str(quantity), unit) if unit else '%s'%(str(quantity))

                    type_ = ingredient['type']
                    name = ingredient['name']

                    # now start to parse into return value
                    has_ = ret_json.get(name, None)
                    # if the ingredient already in the return update it
                    if has_:
                        ret_json[name]['detail'].append({
                            'recipe_id': str(x['_id']),
                            'recipe_title': x['title'],
                            'quantity': q_str
                        })

                        # add up the quantity is not -1
                        ret_json[name]['total_q'] += quantity
                    else:
                        ret_json.update({
                            name:{
                                'type':type_,
                                'total_q': quantity,
                                'unit': unit,
                                'detail':[
                                    {
                                        'recipe_id': str(x['_id']),
                                        'recipe_title': x['title'],
                                        'quantity': q_str
                                    }
                                ]
                            }
                        })
                print()

            # now loop over again to parse the total quantity into string
            for x in ret_json:
                total_q = ret_json[x].pop('total_q')
                unit = ret_json[x].pop('unit')
                q_str = '%s %s'%(str(total_q), unit) if unit else '%s'%(str(total_q))
                ret_json[x].update({'quantity': q_str})


            print(ret_json)

        except Exception as e:
            return {'result': str(e)}, 400

        return {'result':ret_json}, 200
