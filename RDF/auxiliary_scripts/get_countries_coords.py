import csv

from SPARQLWrapper import SPARQLWrapper, JSON, XML, N3, RDF, CSV, TSV

BRACKET_OPEN = "{"
BRACKET_CLOSED = "}"

sparql = SPARQLWrapper("http://localhost:3030/Migrations/sparql")


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


def generate_query(type):
    return f'''
        PREFIX schema: <https://schema.org/>
        SELECT DISTINCT ?country
        WHERE {BRACKET_OPEN}
          ?sub schema:{type} ?country .
        {BRACKET_CLOSED}
        ORDER BY ASC(?country)
        '''


destCountries = [entry['country']["value"] for entry in __query_sparql(generate_query("Country"))]
originCountries = [entry['country']["value"] for entry in __query_sparql(generate_query("tripOrigin"))]

allcountries = destCountries + list(set(originCountries) - set(destCountries))

print(allcountries)
with open("../resources_csv/world_country_and_usa_states_latitude_and_longitude_values.csv", 'r') as file:
    csv_reader = csv.DictReader(file)
    csv_contents = [row for row in csv_reader]

dict_countries = {}
for row in csv_contents:
    dict_countries[row["country"]] = {"latitude": row["latitude"], "longitude": row["longitude"]}

header = ["dbLink", "Latitude", "Longitude", "CountryName"]
with open('../resources_csv/country_longitude_latitude.csv', 'w', encoding='UTF8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    for country in allcountries:
        country_name = " ".join(country.split("/")[-1].split("_"))
        if country_name in dict_countries:
            writer.writerow([country, dict_countries[country_name]['latitude'],
                             dict_countries[country_name]['longitude'], country_name])
        else:
            writer.writerow([country])

