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

################################################ TEST FUnction ######################################
# made by justin
def test_get_recipe_by_id(client):

    # check if Tofu Breakfast Burrito recipe title and id is returned
    res = get_recipe_by_id(client, '5f8c67b8708d83b9867302b6')
    recipe_res = res.get_json()['result']
    recipe_title_id = {
        'id': str(recipe_res['_id']), 'title': recipe_res['title']}
    assert recipe_title_id == {
        'id': '5f8c67b8708d83b9867302b6', 'title': "Tofu Breakfast Burrito"}


# made by ZIAN HU
def test_get_recipe_by_title(client):
    # check if we can find recipe "Tofu Breakfast Burrito"
    res = get_recipe_by_title(client, "Tofu Breakfast Burrito")
    recipe_res = res.get_json()['result']
    recipe_title_id = {
        'id': str(recipe_res['_id']), 'title': recipe_res['title']}
    assert recipe_title_id == {
        'id': '5f8c67b8708d83b9867302b6', 'title': "Tofu Breakfast Burrito"}

    # check if we can find recipe "Creamy Sweet Chili Shrimp"
    res = get_recipe_by_title(client, "Creamy Sweet Chili Shrimp")
    recipe_res = res.get_json()['result']
    recipe_title_id = {
        'id': str(recipe_res['_id']), 'title': recipe_res['title']}
    assert recipe_title_id == {
        'id': '5f8c67b7708d83b9867302af', 'title': "Creamy Sweet Chili Shrimp"}

