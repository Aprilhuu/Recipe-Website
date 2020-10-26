import json

def fetch_recipe(recipe_id):
    # Hacking for fetching dummy recipes right now
    num_id = recipe_id[-1]
    f = open("recipes/recipe" + num_id + ".json", "r")
    recipe_data = json.loads(f.read())
    f.close()
    return recipe_data
