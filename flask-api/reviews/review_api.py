from flask_restx import Resource
from flask import request
from bson.objectid import ObjectId

from app import db_connection


class Review(Resource):
    """
    This api instance deal with fetching or creating review and ratings for
    specific recipe. The recipe is specified by rid
    """
    def get(self, rid):
        """
        Retrieve a recipe review by id
        """

        # Example: curl localhost:5000/v1/reviews/5f8c67b8708d83b9867302b6

        try:
            collection = db_connection["recipe_review"]
            recipe_review = collection.find_one({"recipe_id": ObjectId(rid)})
            if not recipe_review:
                return None, 200

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

        # Example 1: curl -v -XPOST -H "Content-type: application/json" -d '{"comment":{"author":...}}'
        # 'localhost:5000/v1/reviews/5f8c67b8708d83b9867302b6'

        # Example 2: curl -v -XPOST -H "Content-type: application/json" -d '{"rating":3.5}'
        # 'localhost:5000/v1/reviews/5f8c67b8708d83b9867302b6'

        try:
            # first get the title from the payload
            post_data = request.get_json()
            new_comment = post_data.get('comment', None)
            new_rating = post_data.get('rating', None)
            if (not new_comment and new_rating is None) or (new_rating and new_comment):
                return {'result': 'This request should either come with a new comment or a new rating.'}, 403

            collection = db_connection["recipe_review"]
            review_data = collection.find_one({"recipe_id": ObjectId(rid)})

            if review_data:
                if new_comment:
                    collection.update({'recipe_id': ObjectId(rid)}, {"$push": {"comments": new_comment}})
                else:
                    collection.update({'recipe_id': ObjectId(rid)},
                                      {"$set": {"rating": new_rating, "rating_count": review_data["rating_count"] + 1}})
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

        return {'result': "successful"}, 200


class Dislike(Resource):
    """
    This api instance deal with updating dislike number of a specific comment by comment index and recipe id
    """
    def post(self, rid):
        """
        Update number of dislikes of a comment
        """
        # Example: curl -v -XPOST -H "Content-type: application/json" -d '{"comment_index": 0, "dislike_num": 3}'
        # 'localhost:5000/v1/reviews/dislike/5f8c67b8708d83b9867302b6'

        try:
            # first get the comment index from the payload
            post_data = request.get_json()
            comment_index = post_data.get('comment_index', None)
            dislike_num = post_data.get('dislike_num', None)
            if comment_index is None or dislike_num is None:
                return {'result': 'This request should come with a comment index and updated dislike number.'}, 403

            collection = db_connection["recipe_review"]
            collection.update({'recipe_id': ObjectId(rid)},
                              {"$set": {"comments." + str(comment_index) + ".dislike": dislike_num}})
        except Exception as e:
            return {'result': str(e)}, 400

        return {'result': "successful"}, 200


class Like(Resource):
    """
    This api instance deal with updating like number of a specific comment by comment index and recipe id
    """
    def post(self, rid):
        """
        Update like number of a comment
        """
        # Example: curl -v -XPOST -H "Content-type: application/json" -d '{"comment_index": 0, "like_num": 3}'
        # 'localhost:5000/v1/reviews/like/5f8c67b8708d83b9867302b6'

        try:
            # first get the comment index from the payload
            post_data = request.get_json()
            comment_index = post_data.get('comment_index', None)
            like_num = post_data.get('like_num', None)
            if comment_index is None or like_num is None:
                return {'result': 'This request should come with a comment index and updated like number.'}, 403

            collection = db_connection["recipe_review"]
            collection.update({'recipe_id': ObjectId(rid)},
                              {"$set": {"comments." + str(comment_index) + ".like": like_num}})
        except Exception as e:
            return {'result': str(e)}, 400

        return {'result': "successful"}, 200
