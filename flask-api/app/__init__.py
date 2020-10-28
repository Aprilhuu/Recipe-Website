from flask import Flask, request
from flask_cors import CORS
from config import ConfigClass
import json

from flask_jwt import JWT,  JWTError



def create_app(extra_config_settings={}):
    # initialize app and config app
    app = Flask(__name__)
    app.config.from_object(__name__+'.ConfigClass')
    CORS(
        app,
        origins="*",
        allow_headers=["Content-Type", "Authorization",
                       "Access-Control-Allow-Credentials"],
        supports_credentials=True,
        intercept_exceptions=False)

    # enable JWT
    jwt = JWT(app)

    return app