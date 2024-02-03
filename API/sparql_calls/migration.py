from SPARQLWrapper import SPARQLWrapper, JSON

DEFAULT_AGE = "\"All ages\""
DEFAULT_YEAR = "\"All years\""
DEFAULT_GENDER = "\"Men and women\""
DEFAULT_COUNTRY = "\"Romania\""
BRACKET_OPEN = "{"
BRACKET_CLOSED = "}"

sparql = SPARQLWrapper("http://localhost:3030/MiRMigrations/sparql")


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
    output["fromName"]["fromLatitude"] = item["fromLatitude"]
    output["fromName"]["fromLongitude"] = item["fromLongitude"]
    output["fromName"]["fromLatitudeType"] = item["fromLatitudeType"]
    output["fromName"]["fromLongitudeType"] = item["fromLongitudeType"]
    output["fromName"]["fromNameType"] = item["fromNameType"]
    output["destName"]["destType"] = item["destType"]
    output["destName"]["destResource"] = item["destResource"]
    output["destName"]["destLatitude"] = item["destLatitude"]
    output["destName"]["destLongitude"] = item["destLongitude"]
    output["destName"]["destLatitudeType"] = item["destLatitudeType"]
    output["destName"]["destLongitudeType"] = item["destLongitudeType"]
    output["destName"]["destNameType"] = item["destNameType"]

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
    country = DEFAULT_COUNTRY if country is None else "\"" + country + "\""

    query_string = f'''
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX schema: <https://schema.org/>
    PREFIX dbr: <https://dbpedia.org/resource/>
    SELECT *
    WHERE {BRACKET_OPEN}
      ?uri foaf:age ?age;
           foaf:gender ?gender;
           schema:DateTime ?year;
           schema:tripOrigin ?fromResource;
           schema:Country ?destResource;
           schema:Event ?migration;
           schema:Number ?value .
      ?uri ?ageType ?age;
           ?genderType ?gender;
           ?yearType ?year;
           ?fromType ?fromResource;
           ?destType ?destResource;
           ?migrationType ?migration;
           ?valueType ?value .
      ?destResource foaf:name ?destName .
      ?destResource schema:latitude ?destLatitude .
      ?destResource schema:longitude ?destLongitude .
      ?destResource ?destNameType ?destName .
      ?destResource ?destLatitudeType ?destLatitude .
      ?destResource ?destLongitudeType ?destLongitude .
      ?fromResource foaf:name ?fromName .
      ?fromResource schema:latitude ?fromLatitude .
      ?fromResource schema:longitude ?fromLongitude .
      ?fromResource ?fromNameType ?fromName .
      ?fromResource ?fromLatitudeType ?fromLatitude .
      ?fromResource ?fromLongitudeType ?fromLongitude .
      FILTER(?age = {age}@en)
      FILTER(?gender = {gender}@en)
      FILTER(?value != 0)
      FILTER(?fromResource != ?destResource)
      FILTER(?destName = {country} || ?fromName = {country})
    {BRACKET_CLOSED}
    ORDER BY DESC(?value)
    '''

    return [format_output(item) for item in __query_sparql(query_string)]


def __get_migration_single_filter(filter_name):
    if filter_name == "age":
        filter_type = "foaf:age"
    elif filter_name == "gender":
        filter_type = "foaf:gender"
    elif filter_name == "year":
        filter_type = "schema:DateTime"
    elif filter_name == "country":
        filter_type = "foaf:name"
    else:
        return False

    query_string = f'''
                PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                PREFIX schema: <https://schema.org/>
                SELECT DISTINCT ?{filter_name} 
                WHERE {BRACKET_OPEN}
                  ?uri {filter_type} ?{filter_name} .
                {BRACKET_CLOSED}
                ORDER BY ASC(?{filter_name})
                '''

    return [entry[filter_name]["value"] for entry in __query_sparql(query_string)]


def __get_migrations_filters_value(filter_name):
    if filter_name is not None:
        if filter_name == "age":
            filter_type = "foaf:age"
        elif filter_name == "gender":
            filter_type = "foaf:gender"
        elif filter_name == "year":
            filter_type = "schema:DateTime"
        elif filter_name == "country":
            filter_type = "foaf:name"
        else:
            return False

        query_string = f'''
                    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                    PREFIX schema: <https://schema.org/>
                    SELECT DISTINCT ?{filter_name} 
                    WHERE {BRACKET_OPEN}
                      ?uri {filter_type} ?{filter_name} .
                    {BRACKET_CLOSED}
                    ORDER BY ASC(?{filter_name})
                    '''

        return [entry[filter_name]["value"] for entry in __query_sparql(query_string)]

    else:
        filters = {
            "age": __get_migrations_filters_value("age"),
            "gender": __get_migrations_filters_value("gender"),
            "year": __get_migrations_filters_value("year"),
            "country": __get_migrations_filters_value("country")
        }

        return filters
# print(__get_migrations())
