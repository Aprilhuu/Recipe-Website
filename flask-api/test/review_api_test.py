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
def get_review_by_recipe_id(client, recipe_id):
    return client.get(
        "/v1/reviews/" + recipe_id,
        follow_redirects=True,
    )

def update_rating_by_recipe_id(client, recipe_id, new_rating):
    return client.post(
        "/v1/reviews/" + recipe_id,
        json={'rating': new_rating},
        follow_redirects=True,
    )

def update_comment_by_recipe_id(client, recipe_id, new_comment):
    return client.post(
        "/v1/reviews/" + recipe_id,
        json={'comment': new_comment},
        follow_redirects=True,
    )

################################################ TEST FUnction ######################################
def test_get_review_by_recipe_id(client):
    res = get_review_by_recipe_id(client, '5f8c67b7708d83b9867302af')
    recipe_res = res.get_json()['result']
    recipe_title_id = {
        'id': recipe_res['_id'], 'recipe_id': recipe_res['recipe_id']}
    assert recipe_title_id == {
        'id': '5fa57d1bc870e434a4d8458a', 'recipe_id': "5f8c67b7708d83b9867302af"}


# def test_update_rating_by_recipe_id(client):
#     res = update_rating_by_recipe_id(client, '5f8c67b7708d83b9867302af', 3)
#     recipe_res = res.get_json()
#     assert recipe_res is None
#
#
# def test_update_comments_by_recipe_id(client):
#     new_comment = {
#      "author": 'Color',
#      "content": "We supply a series of design principles, practical patterns and high quality design " +
#      "resources (Sketch and Axure), to help people create their product prototypes beautifully and " +
#      "efficiently.",
#      "datetime": "2020-11-01 13:40:45",
#      "like": 3,
#      "dislike": 0}
#
#     res = update_comment_by_recipe_id(client, '5f8c67b7708d83b9867302af', new_comment)
#     recipe_res = res.get_json()
#     assert recipe_res is None
