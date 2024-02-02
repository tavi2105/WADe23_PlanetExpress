import csv
from rdflib import Graph, URIRef, Literal, Namespace, XSD
from iribaker import to_iri
from rdflib.namespace import FOAF


with open("resources_csv/country_longitude_latitude.csv", 'r') as file:
    csv_reader = csv.DictReader(file)
    csv_contents = [row for row in csv_reader]


graph = Graph()

schema = Namespace('https://schema.org/')
for countryRow in csv_contents:
    dbLink = URIRef(to_iri(countryRow['dbLink']))
    name = Literal(countryRow['CountryName'], datatype=XSD['string'])

    latitude = Literal(countryRow['Latitude'])
    longitude = Literal(countryRow['Longitude'])

    graph.add((dbLink, FOAF.name, name))
    graph.add((dbLink, URIRef(schema + "latitude"), latitude))
    graph.add((dbLink, URIRef(schema + "longitude"), longitude))

graph.serialize(destination='result/result_countries.rdf', format='xml')

