from flask import Blueprint, Response, request
from sparql_calls.migration import __get_migrations, __get_migrations_filters_value

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


@migrations.route('/migrations/filters/', methods=['GET'])
def get_migrations_filter():
    filter_name = request.args.get('filter', default=None, type=str)

    migrators = json.dumps(__get_migrations_filters_value(filter_name), indent=4)
    return Response(migrators, mimetype="application/json", status=200)
