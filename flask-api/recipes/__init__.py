from app import module_api
from .recipe_api import Recipes, Recipe, RecipeQuery


# create the recipe namespace
recipe_ns = module_api.namespace(name='recipe_api', path='/v1/recipes')

# add recipe related api
recipe_ns.add_resource(Recipes, '/')
recipe_ns.add_resource(Recipe, '/<rid>')
recipe_ns.add_resource(RecipeQuery, '/query')
