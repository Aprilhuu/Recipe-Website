from flask_restx import Resource
from flask import request
from bson.objectid import ObjectId

from app import db_connection


# this api instance deal with fetching or creating review and
# ratings for specific recipe. The recipe is specified by rid
class Review(Resource):

    def get(self, rid):
        '''
        Retrieve the recipe reviews by id
        '''

        # example curl localhost:5000/v1/reviews/5f8c67b8708d83b9867302b6

        try:
            collection = db_connection["recipe_review"]
            recipe_review = collection.find_one({"recipe_id": ObjectId(rid)})

            # change the id to string
            recipe_review['_id'] = str(recipe_review['_id'])
            recipe_review['recipe_id'] = str(recipe_review['recipe_id'])
        except Exception as e:
            return {'result': str(e)}, 400

        return {'result': recipe_review}, 200

    def post(self, rid):
        '''
        Add new reviews or update recipe ratings
        '''

        # example curl -v -XPOST -H "Content-type: application/json" -d '{"title":"Fruit and Nut Oat Bowl"}' 'localhost:5000/v1/reviews'

        try:
            # first get the title from the payload
            print("I'm here")
            post_data = request.get_json()
            new_comment = post_data.get('comment', None)
            new_rating = post_data.get('rating', None)
            if (not new_comment and not new_rating) or (new_rating and new_comment):
                return {'result': 'This request should either come with a new comment or a new rating.'}, 403

            collection = db_connection["recipe_review"]

            review_data = collection.find_one({"recipe_id": ObjectId(rid)})

            if review_data:
                if new_comment:
                    collection.update({'recipe_id': ObjectId(rid)}, {"$push": {"comments": new_comment}})
                else:
                    collection.update({'recipe_id': ObjectId(rid)}, {"$set": {"rating": new_rating,
                    "rating_count": review_data["rating_count"] + 1}})
            else:
                if new_comment:
                    comment_data = {"recipe_id": ObjectId(rid),
                                    "rating": 0,
                                    "rating_count":0,
                                    "comments": [new_comment]}
                else:
                    comment_data = {"recipe_id": ObjectId(rid),
                                    "rating": new_rating,
                                    "rating_count": 1,
                                    "comments": []}
                collection.insert_one(comment_data)

        except Exception as e:
            return {'result': str(e)}, 400

        return None, 200

