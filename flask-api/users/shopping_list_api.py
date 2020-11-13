from flask_restx import Resource
from flask import request
from bson.objectid import ObjectId
from fractions import Fraction
from flask_jwt import jwt_required, current_identity

from app import db_connection

# this api instance is to handle the meal plan 
# into shopping list
class Meal_Plan_2_Shopping_List(Resource):
    
    # @jwt_required()
    def get(self):
        '''
        aggregate the recipe ingradients in meal planer
        and return to shopping list
        '''

        # example curl localhost:5000/v1/recipes/
        try:
            # for now tempory user is group3
            username = 'group3'

            user_col = db_connection['users']
            # find the exist key for that user
            u = user_col.find_one({'username':username})
            mp = u.get('meal_plan', {})

            # then get all recipe id with count
            recipe_ids = {}
            DAYS = ['friday', 'monday', 'saturday', 'sunday', 'thursday', 'tuesday', 'wednesday']
            for meals in mp:
                for days in DAYS:
                    # if we have the plan on that day
                    recipe_per_day = meals[days].get('recipe_id', None)
                    if recipe_per_day:
                        # check if we store the id before
                        if recipe_ids.get(recipe_per_day, None):
                            recipe_ids[recipe_per_day] += 1
                        else:
                            recipe_ids.update({recipe_per_day:1})
            print(recipe_ids)

            # then get the recipe by id
            # TODO add to util function <-----------------------------------------------------
            recipes = []
            r_collection = db_connection['recipe']
            for rid in recipe_ids:
                recipe = r_collection.find_one({'_id':ObjectId(rid)})
                # print(recipe)
                recipes.append(recipe)

            print(recipes)

            ##############################################
            # temporary return all
            # r_collection = db_connection['group3_collection']
            ret_json = {}
            # recipe = r_collection.find()
            for x in recipes:
                for ingredient in x['ingredients']:
                    print(ingredient)

                #     # Note -1 means the ingredient has no quantity restriction
                    quantity = ingredient.get('quantity', '-1 ')
                #     # split into quantity and unit
                #     # I assume the format will be 'quantity unit'

                #     t = quantity.split(' ')
                #     quantity, unit = (Fraction(t[0]), t[1]) if len(t) == 2 else (Fraction(t[0]), None)
                #     # only add the unit when the recipe provides
                    unit = ''
                    q_str = str(quantity)

                    type_ = ingredient['type']
                    name = ingredient['name']

                #     # now start to parse into return value
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


class ShoppingList(Resource):
    @jwt_required()
    def post(self):
        '''
        update the meal plan by user name
        '''

        post_data = request.get_json()
        print(post_data)
        new_plan = post_data.get('shopping_list', None)
        print(new_plan)
        if not new_plan:
            return {'result': 'Error please enter shopping list'}, 403

        user_col = db_connection['users']

        # get the logined username
        username = current_identity.get('username')
        u = user_col.update(
            {'username': username},
            { '$set':{'shopping_list': new_plan}}
        )
        # get meal plan
        # mp = u.get('meal_plan', {})

        return {'result': 'success'}, 200

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
        shopping_list = u.get('shopping_list', {})

        return {'result': shopping_list}, 200
