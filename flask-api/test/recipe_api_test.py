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


def get_recipe_by_id(client, id):
    return client.get(
        "/v1/recipes/" + id,
        json={'id': id},
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
