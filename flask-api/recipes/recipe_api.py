from flask_restx import Resource
from flask import request
from bson.objectid import ObjectId
import inflect
import math

from app import db_connection

# this api instance is to handle with all the recipes
class Recipes(Resource):

    def get(self):
        '''
        Retrieve all the recipe id and title for list displaying
        '''
        page_size = request.args.get('page_size', 10)
        page = request.args.get('page', 0)

        # example curl localhost:5000/v1/recipes/
        try:
            # convert to int
            page_size = int(page_size)
            page = int(page)

            collection = db_connection["recipe"]
            # for now just return the 8 recipe in total
            # to keep minimun only return the id and title of list
            cursor = collection.find().skip(page_size*page).limit(page_size)
            recipes = []
            for x in cursor:
                # for displaying pick the first instruction
                description = x['instructions'][0]['description'] if len(x['instructions']) > 0 else ''
                # some of the instruction are over length so pick first 20 word if greater
                description = description[:50] if len(description) > 50 else description

                recipes.append({
                    'id': str(x['_id']),
                    'title': x['title'],
                    'description': description + ' ...',
                    'image': x.get('mediaURL').get('url',
                        "https://ww4.publix.com/-/media/aprons/default/no-image-recipe_600x440.jpg?as=1&w=417&h=306&hash=CA8F7C3BF0B0E87C217D95BF8798D74FA193959C"
                    )
                })

        except Exception as e:
            return {'result': str(e)}, 400

        return {'result': recipes}, 200


class RecipesTotal(Resource):

    def get(self):
        '''
        Retrieve number of page for the pagination
        '''
        # example curl localhost:5000/v1/recipes/
        try:
            collection = db_connection["recipe"]
            # for now just return the 8 recipe in total
            # to keep minimun only return the id and title of list
            cursor = collection.count()

        except Exception as e:
            return {'result': str(e)}, 400

        return {'result':cursor}, 200



# this api instance deal with the specific recipe
# the recipe is target by rid
class Recipe(Resource):

    def get(self, rid):
        '''
        Retrieve the recipe detail by id
        '''

        # example curl localhost:5000/v1/recipes/5f8c67b8708d83b9867302b6

        try:
            collection = db_connection["group3_collection"]
            # for now just return the 8 recipe in total
            # to keep minimum only return the id and title of list
            recipe = collection.find_one(ObjectId(rid))

            # change the id to string
            recipe['_id'] = str(recipe['_id'])
        except Exception as e:
            return {'result': str(e)}, 400

        return {'result': recipe}, 200


class RecipeQuery(Resource):

    def post(self):
        '''
        Retrieve the recipe detail by ingredient attributes and/or recipe title
        '''

        # Example:

        # curl -v -XPOST -H "Content-type: application/json" -d '{"title":"Fruit and Nut Oat Bowl",
        # "ingredients": ["beef", "apple"]}' 'localhost:5000/v1/recipes/query'

        try:
            # Step 1: Get user query input from the payload (i.e. ingredients or title)
            post_data = request.get_json()
            title = post_data.get('title', None)
            ingredients = post_data.get('ingredients', None)
            if not title and not ingredients:
                return {'result': 'Please input search title or search ingredients'}, 403

            # Step 2: Prepare MongoDB query filter object based on user input
            ingredient_filter_array = []
            if ingredients:
                p = inflect.engine()
                for ingredient in ingredients:
                    # We are considering both plural and singular form of ingredients here
                    if not ingredient.endswith('s'):
                        plural_form = p.plural_noun(ingredient)
                        singular_form = ingredient
                    else:
                        singular_form = p.singular_noun(ingredient)
                        plural_form = ingredient
                    # Using regex to perform contain as substring instead of exactly matching
                    ingredient_filter_array.append({'$or':
                                                      [{'ingredients.name': {'$regex': '.*' + singular_form + '.*'}},
                                                       {'ingredients.name': {'$regex': '.*' + plural_form + '.*'}}]})

            # Step 3: Query the database collection based on preprocessed filter
            collection = db_connection["group3_collection"]

            if title and ingredients:
                # Adding title as one filter as well to filter both by title and by ingredients
                ingredient_filter_array.append({'title': title})
                recipe = collection.find({'$and': ingredient_filter_array})
            elif ingredients:
                recipe = collection.find({'$and': ingredient_filter_array})
            else:
                # TODO: Right now only support search by exact title. Do we need to support more
                #  flexible search later?
                recipe = collection.find_one({'title': title})

            # Step 4: Process results returned from database before returning. We are
            # changing the id to string if we find it and remove unnecessary attributes.
            if not recipe:
                recipe = []

            if isinstance(recipe, dict):
                recipe['_id'] = str(recipe['_id'])
                del recipe['ingredients']
                del recipe['instructions']
                recipe = [recipe]
            else:
                recipe = list(recipe)
                for one_recipe in recipe:
                    one_recipe['_id'] = str(one_recipe['_id'])
                    del one_recipe['ingredients']
                    del one_recipe['instructions']

        except Exception as e:
            return {'result': str(e)}, 400

        return {'result':recipe}, 200


# this api instance is make random number of recipe for front page
class RecipesRadom(Resource):

    def get(self):
        '''
        Retrieve random number the recipe and title for list displaying
        '''
        # set the default random size as 3
        random_number = request.args.get('size', 3)

        # example curl localhost:5000/v1/recipes/
        try:
            collection = db_connection["group3_collection"]
            # for now just return the 8 recipe in total
            # to keep minimun only return the id and title of list
            cursor = collection.aggregate([{ '$sample': { 'size': random_number } }])
            recipes = []
            for x in cursor:
                # for displaying pick the first instruction
                description = x['instructions'][0]['description'] if len(x['instructions']) > 0 else ''
                # some of the instruction are over length so pick first 20 word if greater
                description = description[:50] if len(description) > 50 else description

                recipes.append({
                    'id': str(x['_id']),
                    'title': x['title'],
                    'description': description + ' ...',
                    'image': x.get('mediaURL').get('url', None)
                })

        except Exception as e:
            return {'result': str(e)}, 400

        return {'result':recipes}, 200
