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

################################################ Help Function ######################################

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

################################################ TEST FUnction ######################################
# made by zhiren
def test_login(client):
    # login ok
    res = login_function(client, 'group3', 'group3')
    assert res.status_code == 200

    # miss username or password
    res = login_function(client, 'group3', None)
    assert res.get_json() == {'result':'Please enter your username and password'}
    res = login_function(client, None, 'group3')
    assert res.get_json() == {'result':'Please enter your username and password'}

    # wrong password
    res = login_function(client, 'group3', 'wrong')
    assert res.get_json() == {'result':'Invalide Credentials'}

    # not exist user
    res = login_function(client, 'wrong', 'group3')
    assert res.get_json() == {'result':'Invalide Credentials'}

# test on create new user
def test_register(client):
    username = 'test_user_' + str(uuid.uuid4())
    password = 'group3'

    # register for first time
    res = register_function(client, pytest.username, pytest.password)
    assert res.get_json() == {'result':{'username': pytest.username}}

    # duplicate register
    # register for first time
    res = register_function(client, pytest.username, pytest.password)
    assert res.get_json() == {'result':'username already exist'}

# login again to see if user exist
def test_login_again(client):
    res = login_function(client, pytest.username, pytest.password)
    assert res.status_code == 200