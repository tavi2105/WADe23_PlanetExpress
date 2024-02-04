from flask import Blueprint, Response, request
from sparql_calls.add_migration import __query_add_sparql, create_query
import json

add_migrations = Blueprint('add_migrations', __name__)


@add_migrations.route('/migrations/add/', methods=['POST'])
def get_migrations():
    body = request.get_json()

    age = body["age"] if body["age"] is not None else "Unknown age"
    gender = body["gender"] if body["gender"] is not None else "Men and women"

    status = __query_add_sparql(create_query(body["destination"],
                                             body["origin"],
                                             age,
                                             gender,
                                             body["year"],
                                             body["value"])).response.getcode()
    return Response("Response", mimetype="application/json", status=status)
