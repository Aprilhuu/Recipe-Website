from app import module_api
from .review_api import Review, Dislike, Like

# create the recipe namespace
review_ns = module_api.namespace(name='review_api', path='/v1/reviews')

# add recipe related api
review_ns.add_resource(Review, '/<rid>')
review_ns.add_resource(Dislike, '/dislike/<rid>')
review_ns.add_resource(Like, '/like/<rid>')
