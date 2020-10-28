from flask import Flask
from flask_restx import Api
from flask_cors import CORS
import json
from flask_jwt import JWT,  JWTError
import pymongo

from config import ConfigClass

# create mongodb connection here
client = pymongo.MongoClient("mongodb+srv://group3:group3@cluster0.hgfwg.mongodb.net/Cluster0?retryWrites=true&w=majority")
db_connection = client["group3"]

# API object
module_api = Api()
# then we can import since order mattered
from recipes import recipe_ns

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

    # hook the flask_restx api
    module_api.init_app(app)

    return app