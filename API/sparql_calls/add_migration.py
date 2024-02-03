from datetime import datetime

from SPARQLWrapper import SPARQLWrapper

sparql = SPARQLWrapper("http://localhost:3030/MiRMigrations/update")


def __query_add_sparql(sparql_query_string):
    try:
        sparql.setQuery(sparql_query_string)
        sparql.method = 'POST'
        results = sparql.query()
        if results:
            return results
        else:
            return False

    except Exception as err:
        print(err)


def create_query(dest, origin, age, gender, year, value):
    event = dest + '-' + origin + '-' + gender + '-' + age + '-' + year
    event = event.replace(" ", "_")
    dest = str(dest).replace(" ", "_")
    dest = str(dest).replace(".", "")
    origin = str(origin).replace(" ", "_")
    origin = str(origin).replace(".", "")

    print(event)
    query_string = f'''
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX schema: <https://schema.org/>
        PREFIX dbr: <https://dbpedia.org/resource/>
        PREFIX int: <http://www.w3.org/2001/XMLSchema#int>
        INSERT {{ <urn:{event}> schema:TravelAction "{event}" . }} WHERE {{}};
        INSERT {{ <urn:{event}> foaf:age "{age}"@en . }} WHERE {{}};
        INSERT {{ <urn:{event}> foaf:gender "{gender}"@en . }} WHERE {{}};
        INSERT {{ <urn:{event}> schema:DateTime "{year}"@en . }} WHERE {{}};
        INSERT {{ <urn:{event}> schema:Number "{value}"^^int: . }} WHERE {{}};
        INSERT {{ <urn:{event}> schema:fromLocation dbr:{dest} . }} WHERE {{}};
        INSERT {{ <urn:{event}> schema:toLocation dbr:{origin} . }} WHERE {{}};
        '''

    return query_string


def add_entry_sparql(entry):
    # print(entry)
    pass
