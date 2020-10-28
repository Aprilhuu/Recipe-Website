# from flask import Flask
# from flask_cors import CORS
# from databaseinterface import fetch_recipe

# app = Flask(__name__)
# CORS(app)

# @app.route('/get_recipe/<recipe_id>')
# def get_recipe(recipe_id):
#     recipe_data = fetch_recipe(recipe_id)
#     return recipe_data

from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
