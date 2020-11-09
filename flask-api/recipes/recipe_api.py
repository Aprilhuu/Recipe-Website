from flask_restx import Resource
from flask import request
from bson.objectid import ObjectId

from app import db_connection

# this api instance is to handle with all the recipes
class Recipes(Resource):

    def get(self):
        '''
        Retrieve all the recipe id and title for list displaying
        '''

        # example curl localhost:5000/v1/recipes/
        try:
            collection = db_connection["recipe"]
            # for now just return the 8 recipe in total
            # to keep minimun only return the id and title of list
            cursor = collection.find().limit(20)
            recipes = [{'id': str(x['_id']), 'title': x['title']} for x in cursor]
        except Exception as e:
            return {'result': str(e)}, 400

        return {'result':recipes}, 200


# this api instance deal with the specific recipe
# the recipe is target by rid
class Recipe(Resource):

    def get(self, rid):
        '''
        Retrieve the recipe detail by id
        '''

        # example curl localhost:5000/v1/recipes/5f8c67b8708d83b9867302b6

        try:
            collection = db_connection["recipe"]
            # for now just return the 8 recipe in total
            # to keep minimun only return the id and title of list
            recipe = collection.find_one(ObjectId(rid))

            # change the id to string
            recipe['_id'] = str(recipe['_id'])
        except Exception as e:
            return {'result': str(e)}, 400

        return {'result':recipe}, 200



class RecipeQuery(Resource):

    def post(self):
        '''
        Retrieve the recipe detail by input attribute
        for now it is only query by title
        '''

        # example curl -v -XPOST -H "Content-type: application/json" -d '{"title":"Fruit and Nut Oat Bowl"}' 'localhost:5000/v1/recipes/query'

        try:
            # first get the title from the payload
            post_data = request.get_json()
            title = post_data.get('title', None)
            if not title:
                return {'result':'Please input the title'}, 403

            collection = db_connection["group3_collection"]
            # for now just return the 8 recipe in total
            # to keep minimum only return the id and title of list
            recipe = collection.find_one({'title': title})

            # change the id to string if we find it
            if recipe:
                recipe['_id'] = str(recipe['_id'])
        except Exception as e:
            return {'result': str(e)}, 400

        return {'result': recipe}, 200
