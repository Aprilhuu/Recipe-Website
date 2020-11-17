class ConfigClass(object):
    # costomize JWT login handler
    JWT_AUTH_URL_RULE = None

    # allow the double exception to propegate
    PROPAGATE_EXCEPTIONS = True

    # encrypt key for now left as test
    SECRET_KEY = 'test'
