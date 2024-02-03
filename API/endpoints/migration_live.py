import time
import json

from flask import Blueprint, Response
from resources.generate_migrations import get_live_migrations

migrations_live = Blueprint('migrations_live', __name__)


@migrations_live.route("/live/", methods=["GET"])
def sse():
    def sse_events():

        while True:
            yield "data: {}\n\n".format(json.dumps(get_live_migrations()))

            time.sleep(7)

    return Response(sse_events(), mimetype="text/event-stream")
