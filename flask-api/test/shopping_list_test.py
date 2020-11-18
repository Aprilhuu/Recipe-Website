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


def test_get_shopping_list(client):
    # case 1 dont have nutrition target key
    res = client.get(
        "/v1/users/shopping_list",
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.get_json() == {'result':[]}

def test_update_shopping_list(client):
    # case 1 dont have nutrition target key
    res = client.post(
        "/v1/users/shopping_list",
        json={"shopping_list":{"test":"test"}},
        follow_redirects=True,
        headers={'Authorization': pytest.token},
    )
    assert res.get_json() == {'result':'success'}