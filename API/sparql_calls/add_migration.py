from datetime import datetime
import time

from SPARQLWrapper import SPARQLWrapper

sparql = SPARQLWrapper("http://localhost:3030/MiR/update")


def __query_add_sparql(sparql_query_string):
    try:
        sparql.setQuery(sparql_query_string)
        sparql.method = 'POST'
        results = sparql.query()
        # print(results)
        if results:
            return results
        else:
            return False

    except Exception as err:
        print(err)


def create_query(dest, origin, age, gender, year, value):

    event = dest + '-' + origin + '-' + gender + '-' + age + '-' + str(int(time.mktime(datetime.now().timetuple())))
    event = event.replace(" ", "_")
    dest = str(dest).replace(" ", "_")
    dest = str(dest).replace(".", "")
    origin = str(origin).replace(" ", "_")
    origin = str(origin).replace(".", "")
    event_name = dest + '-' + origin

    print(event)
    query_string = f'''
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX schema: <https://schema.org/>
        PREFIX dbr: <https://dbpedia.org/resource/>
        PREFIX int: <http://www.w3.org/2001/XMLSchema#int>
        INSERT {{ <urn:{event}> schema:TravelAction "{event_name}" . }} WHERE {{}};
        INSERT {{ <urn:{event}> foaf:age "{age}"@en . }} WHERE {{}};
        INSERT {{ <urn:{event}> foaf:gender "{gender}"@en . }} WHERE {{}};
        INSERT {{ <urn:{event}> schema:DateTime "{year}"@en . }} WHERE {{}};
        INSERT {{ <urn:{event}> schema:Number "{value}"^^int: . }} WHERE {{}};
        INSERT {{ <urn:{event}> schema:fromLocation dbr:{origin} . }} WHERE {{}};
        INSERT {{ <urn:{event}> schema:toLocation dbr:{dest} . }} WHERE {{}};
        '''

    return query_string


def add_entry_sparql(entry):
    # print(entry)
    response = __query_add_sparql(create_query(entry["destination"],
                                               entry["origin"],
                                               entry["age"],
                                               entry["gender"],
                                               str(datetime.strptime(entry["startTime"], "%Y-%m-%d %H:%M").year),
                                               entry["numberOfPeople"]))
    print("Response", response.response.getcode() if response else 500)
