import pytest
import os
from pathlib import Path
import json

from app import create_app
import uuid

# user python -m pytest -s
# to print in console

# global varibale here
pytest.username = 'test_user_' + str(uuid.uuid4())
pytest.password = 'group3'
pytest.token = None

@pytest.fixture
def client():
    BASE_DIR = Path(__file__).resolve().parent.parent
    app = create_app()

    yield app.test_client()

########################################################################

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

###########################################################################
# login first
def test_init(client):
    register_function(client, pytest.username, pytest.password)
    res = login_function(client, pytest.username, pytest.password)
    assert res.status_code == 200
    pytest.token = res.get_json()['result']['username']
    

# first the nutrition target should be all 0
def test_get_nutrition(client):
    # print(pytest.token)
    res = client.get(
        "/v1/users/nutrition_target",
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.get_json() == {'result': {'calories': 0, 'carbon': 0, 'fiber': 0}}


# first the nutrition target should be all 0
def test_set_nutrition_invalide(client):
    # case 1 dont have nutrition target key
    res = client.post(
        "/v1/users/nutrition_target",
        json={},
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.get_json() == {'result': 'Error please enter nutrition target'}

    # case 2 wrong length in nutrition target
    res = client.post(
        "/v1/users/nutrition_target",
        json={'nutrition_target':{'carbon': 0, 'fiber': 0}},
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.get_json() == {'result': 'invalid input'}

    # case 3 wrong key in nutrition target
    res = client.post(
        "/v1/users/nutrition_target",
        json={'nutrition_target':{'wrong': 0, 'carbon': 0, 'fiber': 0}},
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.get_json() == {'result': 'key wrong is not in list'}

    # case 4 invalid value in nutrition target
    res = client.post(
        "/v1/users/nutrition_target",
        json={'nutrition_target':{'calories': 'wrong', 'carbon': 'wrong', 'fiber': 'wrong'}},
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.status_code == 403

    # case 5 invalide range in nutrition target
    res = client.post(
        "/v1/users/nutrition_target",
        json={'nutrition_target':{'calories': -10, 'carbon': 0, 'fiber': 0}},
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.get_json() == {'result': 'invalid range'}

    res = client.post(
        "/v1/users/nutrition_target",
        json={'nutrition_target':{'calories': 10, 'carbon': 100000, 'fiber': 0}},
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.get_json() == {'result': 'invalid range'}

# now we just set the nutrition target correctly
def test_set_nutrition(client):
    res = client.post(
        "/v1/users/nutrition_target",
        json={'nutrition_target':{'calories': 50, 'carbon': 10, 'fiber': 1}},
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.get_json() == {'result': {'calories': 50, 'carbon': 10, 'fiber': 1}}

# finally to get it again see if it save correctly
def test_get_nutrition_ag(client):
    res = client.get(
        "/v1/users/nutrition_target",
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.get_json() == {'result': {'calories': 50, 'carbon': 10, 'fiber': 1}}
