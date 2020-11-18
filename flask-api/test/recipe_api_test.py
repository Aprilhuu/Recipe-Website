import pytest
import os
from pathlib import Path
import json

from app import create_app

# user python -m pytest -s
# to print in console


@pytest.fixture
def client():
    BASE_DIR = Path(__file__).resolve().parent.parent
    app = create_app()

    yield app.test_client()

################################################ Help Function ######################################
# made by justin
def get_recipe_by_id(client, id):
    return client.get(
        "/v1/recipes/" + id,
        json={'id': id},
        follow_redirects=True,
    )

# made by ZIAN HU
def get_recipe_by_title(client, title):
    return client.post(
        "/v1/recipes/query",
        json={'title': title},
        follow_redirects=True,
    )

# made by ZIAN HU
def get_recipe_by_ingredients(client, ingredients):
    return client.post(
        "/v1/recipes/query",
        json={'ingredients': ingredients},
        follow_redirects=True,
    )

# made by ZIAN HU
def get_recipe_by_ingredients_and_title(client, ingredients, title):
    return client.post(
        "/v1/recipes/query",
        json={'ingredients': ingredients, 'title': title},
        follow_redirects=True,
    )

# made by ZIAN HU
def get_recipe_by_ingredients_and_filter(client, ingredients, calorie, time, exluding):
    return client.post(
        "/v1/recipes/query",
        json={'ingredients': ingredients, "filters": {'calorieLimit': calorie, 'timeLimit': time, 'exclude': exluding}},
        follow_redirects=True,
    )

################################################ TEST FUnction ######################################
# made by justin
def test_get_recipe_by_id(client):
    # check if Tofu Breakfast Burrito recipe title and id is returned
    res = get_recipe_by_id(client, '5f8c67b8708d83b9867302b1')
    recipe_res = res.get_json()['result']
    recipe_title_id = {
        'id': str(recipe_res['_id']), 'title': recipe_res['title']}
    assert recipe_title_id == {
        'id': '5f8c67b8708d83b9867302b1', 'title': "Baked Apples"}


# made by ZIAN HU
def test_get_recipe_by_title(client):
    # check if we can find recipe "Slow Cooker Beef Stew". Search should be
    # case insensitive
    res = get_recipe_by_title(client, "slow cooker Beef Stew")
    recipe_res = res.get_json()['result']
    recipe_title_id = {
        'id': str(recipe_res[0]['id']), 'title': recipe_res[0]['title']}
    assert recipe_title_id == {
        'id': '5f8c67b8708d83b9867302b0', 'title': "Slow Cooker Beef Stew"}
    assert 'instructions' not in recipe_res[0].keys()

    # check if we can find recipe "Creamy Sweet Chili Shrimp"
    res = get_recipe_by_title(client, "Creamy Shrimp")
    recipe_res = res.get_json()['result']
    assert len(recipe_res) >= 1
    recipe_title_id = {
        'id': str(recipe_res[0]['id']), 'title': recipe_res[0]['title']}
    assert recipe_title_id == {
        'id': '5faf25c93e997511aafc07c2', 'title': "Creamy Sweet Chili Shrimp"}
    assert 'ingredients' not in recipe_res[0].keys()


# made by ZIAN HU
def test_get_recipe_by_ingredients(client):
    # Test 1: Basic testing with two ingredients (singular form)
    # check if we can find recipe containing brown sugar and apple
    res = get_recipe_by_ingredients(client, ["brown sugar", "apple"])
    recipe_res = res.get_json()['result']
    recipe_title_id = {
        'id': str(recipe_res[0]['id']), 'title': recipe_res[0]['title']}
    assert recipe_title_id == {
        'id': '5f8c67b8708d83b9867302b1', 'title': "Baked Apples"}

    # Test 2: Basic testing with one ingredient (singular form) and multiple results
    # check if we can find recipe containing oat. The original recipes
    # specify quick cooking oats and steel cut oats. This should not
    # affect the result
    res = get_recipe_by_ingredients(client, ["oat"])
    recipe_res = res.get_json()['result']
    assert len(recipe_res) >= 2
    recipe_title_id = {
      'id': str(recipe_res[-1]['id']), 'title': recipe_res[-1]['title']}
    assert recipe_title_id == {
      'id': '5f8c67b8708d83b9867302b1', 'title': "Baked Apples"}

    # Test 3: Basic testing with no applicable recipe
    # check if we can find recipe containing "weird ingredient".
    # No recipe should contain this ingredient
    res = get_recipe_by_ingredients(client, ["weird ingredient"])
    recipe_res = res.get_json()['result']
    assert len(recipe_res) == 0

    # Test 4: Basic testing with different noun plural form
    # check if we can find recipe containing "berry".
    # Recipes with both "berries" and "berry" as ingredients should be returned
    res = get_recipe_by_ingredients(client, ["berry"])
    recipe_res = res.get_json()['result']
    assert len(recipe_res) >= 1
    recipe_title_id = {
      'id': str(recipe_res[4]['id']), 'title': recipe_res[4]['title']}
    assert recipe_title_id == {
      'id': '5faf27e93e997511aafc089d', 'title': "Fruit and Nut Oat Bowl"}


# made by ZIAN HU
def test_get_recipe_by_ingredients_and_title(client):
    # Test 1: Basic testing with two ingredients (singular form) and title
    # check if we can find recipe containing brown sugar and apple
    res = get_recipe_by_ingredients_and_title(client, ["brown sugar", "apple"], "Baked Apples")
    recipe_res = res.get_json()['result']
    recipe_title_id = {
        'id': str(recipe_res[0]['id']), 'title': recipe_res[0]['title']}
    assert recipe_title_id == {
        'id': '5f8c67b8708d83b9867302b1', 'title': "Baked Apples"}


# made by ZIAN HU
def test_get_recipe_by_ingredients_and_filter(client):
    # Test 1: Basic testing with two ingredients (singular form) and title
    # check if we can find recipe containing brown sugar and apple
    res = get_recipe_by_ingredients_and_filter(client, ["apple"], calorie=500, time=60, exluding=["brown sugar"])
    recipe_res = res.get_json()['result']
    assert len(recipe_res) > 0
