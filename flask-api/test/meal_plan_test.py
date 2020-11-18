import pytest
import os
from pathlib import Path
import json

from app import create_app
import uuid

# user python -m pytest -s
# to print in console

pytest.username = 'test_user_' + str(uuid.uuid4())
pytest.password = 'group3'
pytest.token = None

@pytest.fixture
def client():
    BASE_DIR = Path(__file__).resolve().parent.parent
    app = create_app()

    yield app.test_client()

##########################################################


def login_function(client, username, password):
    return client.post(
        "/v1/users/login",
        json={'username':username, 'password':password},
        follow_redirects=True,
    )

def register_function(client, username, password):
    return client.post(
        "/v1/users/register",
        json={'username':username, 'password':password},
        follow_redirects=True,
    )

###########################################################
# login first
def test_init(client):
    register_function(client, pytest.username, pytest.password)
    res = login_function(client, pytest.username, pytest.password)
    assert res.status_code == 200
    pytest.token = res.get_json()['result']['username']

# first get empty plan
def test_get_plan_first(client):
    # case 1 dont have nutrition target key
    res = client.get(
        "/v1/users/meal_plan",
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.status_code == 200

# when nothing to update
def test_empty_plan(client):
    res = client.post(
        "/v1/users/meal_plan",
        json={},
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.get_json() == {'result': 'Error please enter new plan'}

# update meal_plan
def test_add_new_plan(client):
    new_plan = {
       "new_plan":[
          {
             "key":1,
             "meals":"Breakfast",
             "monday":{
                
             },
             "tuesday":{
                
             },
             "wednesday":{
                
             },
             "thursday":{
                
             },
             "friday":{
                
             },
             "saturday":{
                
             },
             "sunday":{
                "recipe_title":"Creamy Sweet Chili Shrimp",
                "description":"Preheat oven to 425°F.\nChop chives.\n ...",
                "recipe_id":"5faf25c93e997511aafc07c2",
                "image":"https://ww4.publix.com/-/media/aprons/images/2017/01/r0000816_600x440.jpg?as=1&w=417&h=306&hash=EA8D04E0A4DA377F63218433927C0A183241ED79",
                "meal_index":0,
                "day":"sunday"
             }
          },
          {
             "key":2,
             "meals":"Lunch",
             "monday":{
                
             },
             "tuesday":{
                
             },
             "wednesday":{
                
             },
             "thursday":{
                
             },
             "friday":{
                
             },
             "saturday":{
                
             },
             "sunday":{
                
             }
          },
          {
             "key":3,
             "meals":"Dinner",
             "monday":{
                
             },
             "tuesday":{
                
             },
             "wednesday":{
                
             },
             "thursday":{
                
             },
             "friday":{
                
             },
             "saturday":{
                
             },
             "sunday":{
                
             }
          },
          {
             "monday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             },
             "tuesday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             },
             "wednesday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             },
             "thursday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             },
             "friday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             },
             "saturday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             },
             "sunday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             }
          }
       ]
    }

    res = client.post(
        "/v1/users/meal_plan",
        json=new_plan,
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )

    # it return the nutrition as well
    assert len(res.get_json()['result']) == 4

    # see if nutrition is right
    nutritions = {
       "result":[
          {
             "key":1,
             "meals":"Breakfast",
             "monday":{
                
             },
             "tuesday":{
                
             },
             "wednesday":{
                
             },
             "thursday":{
                
             },
             "friday":{
                
             },
             "saturday":{
                
             },
             "sunday":{
                "recipe_title":"Creamy Sweet Chili Shrimp",
                "description":"Preheat oven to 425\u00b0F.\nChop chives.\n ...",
                "recipe_id":"5faf25c93e997511aafc07c2",
                "image":"https://ww4.publix.com/-/media/aprons/images/2017/01/r0000816_600x440.jpg?as=1&w=417&h=306&hash=EA8D04E0A4DA377F63218433927C0A183241ED79",
                "meal_index":0,
                "day":"sunday"
             }
          },
          {
             "key":2,
             "meals":"Lunch",
             "monday":{
                
             },
             "tuesday":{
                
             },
             "wednesday":{
                
             },
             "thursday":{
                
             },
             "friday":{
                
             },
             "saturday":{
                
             },
             "sunday":{
                
             }
          },
          {
             "key":3,
             "meals":"Dinner",
             "monday":{
                
             },
             "tuesday":{
                
             },
             "wednesday":{
                
             },
             "thursday":{
                
             },
             "friday":{
                
             },
             "saturday":{
                
             },
             "sunday":{
                
             }
          },
          {
             "monday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             },
             "tuesday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             },
             "wednesday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             },
             "thursday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             },
             "friday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             },
             "saturday":{
                "Calories":0,
                "Carbon":0,
                "Fiber":0
             },
             "sunday":{
                "Calories":376.0,
                "Carbon":23.0,
                "Fiber":15.0
             }
          }
       ]
    }

    assert res.get_json() == nutritions