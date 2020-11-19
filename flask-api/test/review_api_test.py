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

def update_dislike_by_recipe_id(client, recipe_id, comment_index, dislike_num):
    return client.post(
        "/v1/reviews/dislike/" + recipe_id,
        json={'dislike_num': dislike_num, "comment_index": comment_index},
        follow_redirects=True,
    )

def update_like_by_recipe_id(client, recipe_id, comment_index, like_num):
    return client.post(
        "/v1/reviews/like/" + recipe_id,
        json={'like_num': like_num, "comment_index": comment_index},
        follow_redirects=True,
    )

################################################ TEST FUnction ######################################
def test_get_review_by_recipe_id(client):
    res = get_review_by_recipe_id(client, '5f8c67b8708d83b9867302b1')
    recipe_res = res.get_json()['result']
    recipe_title_id = {
        'id': recipe_res['_id'], 'recipe_id': recipe_res['recipe_id']}
    assert recipe_title_id == {
        'id': '5fb59868fc5ed52594d73442', 'recipe_id': "5f8c67b8708d83b9867302b1"}

# Commenting out tests as they will update database constantly which we want to avoid
# def test_update_rating_by_recipe_id(client):
#     res = update_rating_by_recipe_id(client, '5f8c67b8708d83b9867302b1', 3)
#     recipe_res = res.get_json()['result']
#     assert recipe_res == "successful"
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
#     res = update_comment_by_recipe_id(client, '5f8c67b8708d83b9867302b1', new_comment)
#     recipe_res = res.get_json()['result']
#     assert recipe_res == "successful"
#
#
# def test_update_dislike_by_recipe_id(client):
#     res = update_dislike_by_recipe_id(client, recipe_id='5f8c67b8708d83b9867302b1', comment_index=0, dislike_num=5)
#     recipe_res = res.get_json()['result']
#     assert recipe_res == "successful"
#
#
# def test_update_like_by_recipe_id(client):
#     res = update_like_by_recipe_id(client, recipe_id='5f8c67b8708d83b9867302b1', comment_index=2, like_num=3)
#     recipe_res = res.get_json()['result']
#     assert recipe_res == "successful"
