import json
from SPARQLWrapper import SPARQLWrapper, JSON

DEFAULT_AGE = "\"All ages\""
DEFAULT_YEAR = "\"All years\""
DEFAULT_GENDER = "\"Men and women\""
DEFAULT_COUNTRY = "Romania"
BRACKET_OPEN = "{"
BRACKET_CLOSED = "}"

sparql = SPARQLWrapper("http://localhost:3030/Migrations/sparql")


def format_output(item):
    output = {
        "uri": item["uri"],
        "age": item["age"],
        "gender": item["gender"],
        "year": item["year"],
        "migration": item["migration"],
        "fromName": item["fromName"],
        "destName": item["destName"],
        "value": item["value"]
    }
    output["age"]["ageType"] = item["ageType"]
    output["gender"]["genderType"] = item["genderType"]
    output["year"]["yearType"] = item["yearType"]
    output["migration"]["migrationType"] = item["migrationType"]
    output["value"]["valueType"] = item["valueType"]
    output["fromName"]["fromType"] = item["fromType"]
    output["fromName"]["fromResource"] = item["fromResource"]
    output["destName"]["destType"] = item["destType"]
    output["destName"]["destResource"] = item["destResource"]

    return output


def __query_sparql(sparql_query_string):
    try:
        sparql.setQuery(sparql_query_string)
        sparql.setReturnFormat(JSON)
        response = sparql.query().convert()
        results = response['results']['bindings']
        if results:
            return results
        else:
            return False

    except Exception as err:
        print(err)


def __get_migrations(age=DEFAULT_AGE, year=DEFAULT_YEAR, gender=DEFAULT_GENDER, country=DEFAULT_COUNTRY):
    age = DEFAULT_AGE if age is None else "\"" + age + "\""
    year = DEFAULT_YEAR if year is None else "\"" + year + "\""
    gender = DEFAULT_GENDER if gender is None else "\"" + gender + "\""
    country = DEFAULT_COUNTRY if country is None else country

    query_string = f'''
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX schema: <https://schema.org/>
    PREFIX dbr: <https://dbpedia.org/resource/>
    SELECT *
    WHERE {BRACKET_OPEN}
      ?uri ?ageType ?age;
           ?genderType ?gender;
           ?yearType ?year;
           ?fromType ?fromResource;
           ?destType ?destResource;
           ?migrationType ?migration;
           ?valueType ?value .
      ?destResource foaf:name ?destName .
      ?fromResource foaf:name ?fromName .
      FILTER(?ageType = foaf:age)
      FILTER(?genderType = foaf:gender)
      FILTER(?yearType = schema:DateTime)
      FILTER(?migrationType = schema:Event)
      FILTER(?valueType = schema:Number)
      FILTER(?destType = schema:Country)
      FILTER(?fromType = schema:tripOrigin)
      FILTER(?age = {age}@en)
      FILTER(?gender = {gender}@en)
      FILTER(?year = {year}@en)
      FILTER(?value != 0)
      FILTER(?fromResource != ?destResource)
      FILTER(?fromResource = dbr:{country} || ?destResource = dbr:{country})
    {BRACKET_CLOSED}
    ORDER BY DESC(?value)
    '''

    return [format_output(item) for item in __query_sparql(query_string)]


def __get_migrations_filters_value(filter_name):
    filter_select = "?" + filter_name
    filter_aux = ""
    if filter_name == "age":
        filter_type = "foaf:age"
    elif filter_name == "gender":
        filter_type = "foaf:gender"
    elif filter_name == "year":
        filter_type = "schema:DateTime"
    elif filter_name == "destination":
        filter_type = "schema:Country"
        filter_aux = "?destination foaf:name ?destinationName"
        filter_name = "destinationName"
    elif filter_name == "origin":
        filter_type = "schema:tripOrigin"
        filter_aux = "?origin foaf:name ?originName"
        filter_name = "originName"
    else:
        return False

    query_string = f'''
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX schema: <https://schema.org/>
        SELECT DISTINCT ?{filter_name} 
        WHERE {BRACKET_OPEN}
          ?sub {filter_type} {filter_select} .
          {filter_aux}
        {BRACKET_CLOSED}
        '''

    return [entry[filter_name]["value"] for entry in __query_sparql(query_string)]

# print(__get_migrations())
