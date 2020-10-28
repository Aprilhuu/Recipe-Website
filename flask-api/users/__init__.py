from app import module_api
from .user_api import User


# create the recipe namespace
user_ns = module_api.namespace(name='user_api', path='/v1/users')

# add recipe related api
user_ns.add_resource(User, '/login')
# recipe_ns.add_resource(Recipe, '/<rid>')
# recipe_ns.add_resource(RecipeQuery, '/query')