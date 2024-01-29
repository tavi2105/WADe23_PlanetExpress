import json
from SPARQLWrapper import SPARQLWrapper, JSON

DEFAULT_AGE = "\"All ages\""
DEFAULT_YEAR = "\"All years\""
DEFAULT_GENDER = "\"Men and women\""
DEFAULT_COUNTRY = "Romania"
BRACKET_OPEN = "{"
BRACKET_CLOSED = "}"


def __get_migrations(age=DEFAULT_AGE, year=DEFAULT_YEAR, gender=DEFAULT_GENDER, country=DEFAULT_COUNTRY):
    age = DEFAULT_AGE if age is None else "\"" + age + "\""
    year = DEFAULT_YEAR if year is None else "\"" + year + "\""
    gender = DEFAULT_GENDER if gender is None else "\"" + gender + "\""
    country = DEFAULT_COUNTRY if country is None else country

    query_string = f'''
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX schema: <https://schema.org/>
    PREFIX dbr: <https://dbpedia.org/resource/>
    SELECT ?destName ?fromName ?value ?age
    WHERE {BRACKET_OPEN}
      ?uri foaf:age ?age;
           foaf:gender ?gender;
           schema:DateTime ?year;
           schema:tripOrigin ?from;
           schema:Country ?dest;
           schema:Event ?migration;
           schema:Number ?value .
      ?dest foaf:name ?destName .
      ?from foaf:name ?fromName .
      FILTER(?age = {age}@en)
      FILTER(?gender = {gender}@en)
      FILTER(?year = {year}@en)
      FILTER(?value != 0)
      FILTER(?from != ?dest)
      FILTER(?from = dbr:{country} || ?dest = dbr:{country})
    {BRACKET_CLOSED}
    ORDER BY DESC(?value)
    '''

    try:
        sparql = SPARQLWrapper("http://localhost:3030/Migrations/sparql")
        sparql.setQuery(query_string)
        sparql.setReturnFormat(JSON)
        response = sparql.query().convert()
        results = response['results']['bindings']
        if results:
            return results
        else:
            return False

    except Exception as err:
        print(err)


# print(__get_migrations())
