from app import module_api
from .user_api import User, UserLogout, UserRegister
from .shopping_list_api import Meal_Plan_2_Shopping_List, ShoppingList
from .meal_plan_api import Meal_Plan
from .nutrition_target import Nutrition_Target


# create the recipe namespace
user_ns = module_api.namespace(name='user_api', path='/v1/users')

# add recipe related api
user_ns.add_resource(User, '/login')
user_ns.add_resource(UserLogout, '/logout')
user_ns.add_resource(UserRegister, '/register')
user_ns.add_resource(Meal_Plan_2_Shopping_List, '/meal_plan/shopping_list')
user_ns.add_resource(Meal_Plan, '/meal_plan')

user_ns.add_resource(ShoppingList, '/shopping_list')

user_ns.add_resource(Nutrition_Target, '/nutrition_target')

