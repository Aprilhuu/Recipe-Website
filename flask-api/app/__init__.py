from flask import Flask, request
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
from users import user_ns

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

    @jwt.jwt_error_handler
    def error_handler(e):
        print("###### Error Handler")
        # Either not Authorized or Expired
        return {'result': 'jwt ' + str(e)}, 401

    # load jwt token from request's header
    @jwt.request_handler
    def load_token():
        print("###### Load Token")
        # currently is just username
        token = request.cookies.get('Authorization')

        if not token:
            return token

        return token

    # function is to parse out the infomation in the JWT
    @jwt.jwt_decode_handler
    def decode_auth_token(token):
        print("###### decode_auth_token by syncope")
        # try:
        #     decoded = pyjwt.decode(token, verify=False)
        #     return decoded
        # except Exception as e:
        #     raise JWTError(description='Error', error=e)

        # currently just username
        return token

    # finally we pass the infomation to here to identify the user
    @jwt.identity_handler
    def identify(payload):
        print("###### identify")
        print(payload)
        return {"username": payload}

    # hook the flask_restx api
    module_api.init_app(app)

    return app