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

    # @jwt.jwt_error_handler
    # def error_handler(e):
    #     print("###### Error Handler")
    #     # Either not Authorized or Expired
    #     return {'result': 'jwt ' + str(e)}, 401

    # # load jwt token from request's header
    # @jwt.request_handler
    # def load_token():
    #     print("###### Load Token")
    #     token = request.headers.get('Authorization')

    #     if not token:
    #         return token

    #     return token.split()[-1]

    # # function is to parse out the infomation in the JWT
    # @jwt.jwt_decode_handler
    # def decode_auth_token(token):
    #     print("###### decode_auth_token by syncope")
    #     try:
    #         decoded = pyjwt.decode(token, verify=False)
    #         return decoded
    #     except Exception as e:
    #         raise JWTError(description='Error', error=e)

    # # finally we pass the infomation to here to identify the user
    # @jwt.identity_handler
    # def identify(payload):
    #     print("###### identify")
    #     username = payload.get('preferred_username', None)

    #     # check if preferred_username is encoded in token
    #     if(not username):
    #         raise Exception("preferred_username is required in jwt token.")

    #     try:
    #         # check if user is existed in neo4j
    #         url = ConfigClass.NEO4J_SERVICE + "nodes/User/query"
    #         res = requests.post(
    #             url=url,
    #             json={"name": username}
    #         )
    #         if(res.status_code != 200):
    #             raise Exception("Neo4j service: " + json.loads(res.text))
    #         users = json.loads(res.text)
    #         if(len(users) == 0):
    #             raise Exception(
    #                 "Neo4j service: User %s does not exist." % username)
    #         user_id = users[0]['id']
    #         email = users[0]['email']
    #         first_name = users[0]['first_name']
    #         last_name = users[0]['last_name']
    #         role = users[0]['role']

    #     except Exception as e:
    #         raise JWTError(description='Error', error=e)

    #     return {"user_id": user_id, "username": username, "role": role, "email": email, "first_name": first_name, "last_name": last_name}


    # hook the flask_restx api
    module_api.init_app(app)

    return app