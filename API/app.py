from flask import Flask
from endpoints.migrations import migrations
from endpoints.migration_live import migrations_live
from endpoints.add_migration import add_migrations
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r'/*': {
        "origins": '*'
    }
})


app.register_blueprint(migrations)
app.register_blueprint(migrations_live)
app.register_blueprint(add_migrations)
