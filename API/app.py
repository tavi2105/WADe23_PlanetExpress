from flask import Flask
from endpoints.migrations import migrations

# from flask_bcrypt import Bcrypt
# from flask_jwt_extended import JWTManager
# import config

app = Flask(__name__)
# app.config["SECRET_KEY"] = config.SECRET_KEY


# bcrypt = Bcrypt(app)
# jwt = JWTManager(app)

app.register_blueprint(migrations)
