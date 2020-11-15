from flask import Flask, request, render_template
from flask_restx import Api
from flask_cors import CORS
import json
from flask_jwt import JWT,  JWTError
import jwt as pyjwt
import pymongo

from config import ConfigClass

# create mongodb connection here
client = pymongo.MongoClient("mongodb+srv://group3:group3@cluster0.hgfwg.mongodb.net/Cluster0?retryWrites=true&w=majority")
db_connection = client["group3"]

# API object
module_api = Api(doc='/v1/doc')
# then we can import since order mattered
from recipes import recipe_ns
from users import user_ns
from reviews import review_ns

def create_app(extra_config_settings={}):
    # initialize app and config app template_folder="dist", static_folder="dist", static_url_path=""
    app = Flask(__name__, static_folder="../dist", template_folder="../dist", static_url_path="")

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
        # Either not Authorized or Expired
        return {'result': 'jwt ' + str(e)}, 401

    # load jwt token from request's header
    @jwt.request_handler
    def load_token():
        try:
            token = request.headers.get('Authorization', None)
            if not token:
                raise Exception("Unauthorized")

            return token
        except Exception as e:
            raise JWTError(description='Error', error=e)

    # function is to parse out the infomation in the JWT
    @jwt.jwt_decode_handler
    def decode_auth_token(token):
        try:
            # decode the token by the secrete key
            decoded = pyjwt.decode(token, ConfigClass.SECRET_KEY, algorithms=['HS256'])
            return decoded
        except Exception as e:
            raise JWTError(description='Error', error=e)

        # currently just username
        return token

    # finally we pass the infomation to here to identify the user
    @jwt.identity_handler
    def identify(payload):

        # connect to user db see if user exist
        uc = db_connection['users']
        u = uc.find_one({'username':payload['username']})

        # if user not exist then return None
        # and jwt will also raise the 401 error
        if not u:
            return None

        return {"username": payload['username']}

    # hook the flask_restx api
    module_api.init_app(app)

    # set the default root for deployment
    @app.route('/')
    @app.route('/copilot')
    @app.route('/meal-planner')
    @app.route('/shopping-list')
    @app.route('/recipe-list')
    def no_arg_route():
        return render_template('./index.html'), 200

    # this is the special route for recipe detail page
    @app.route('/recipe/<recipe_id>')
    def recipe_arg_route(recipe_id):
        return render_template('./index.html'), 200

    return app
