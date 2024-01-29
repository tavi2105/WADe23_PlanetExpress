from flask import Blueprint, Response, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sparql_calls.migration import __get_migrations

import json

migrations = Blueprint('migrations', __name__)


@migrations.route('/migrations/', methods=['GET'])
def get_migrations():
    age = request.args.get('age', default=None, type=str)
    gender = request.args.get('gender', default=None, type=str)
    country = request.args.get('country', default=None, type=str)
    year = request.args.get('year', default=None, type=str)

    migrators = json.dumps(__get_migrations(age=age, gender=gender, country=country, year=year), indent=4)
    return Response(migrators, mimetype="application/json", status=200)

