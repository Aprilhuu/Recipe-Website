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

def login_function(client, username, password):
    return client.post(
        "/v1/users/login",
        json={'username':username, 'password':password},
        follow_redirects=True,
    )

################################################ TEST FUnction ######################################

def test_login(client):
    # login ok
    res = login_function(client, 'group3', 'group3')
    assert res.get_json() == {'result':{'username': 'group3'}}

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

