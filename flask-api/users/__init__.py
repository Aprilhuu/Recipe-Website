from app import module_api
from .user_api import User
from .shopping_list_api import Meal_Plan_2_Shopping_List


# create the recipe namespace
user_ns = module_api.namespace(name='user_api', path='/v1/users')

# add recipe related api
user_ns.add_resource(User, '/login')
user_ns.add_resource(Meal_Plan_2_Shopping_List, '/meal_plan/shopping_list')
# recipe_ns.add_resource(RecipeQuery, '/query')