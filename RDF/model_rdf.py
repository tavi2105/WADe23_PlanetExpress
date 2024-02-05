import csv
from rdflib import Graph, Dataset, URIRef, Literal, Namespace, RDF, RDFS, OWL, XSD
from iribaker import to_iri
from rdflib.namespace import FOAF, RDF

filename = "resources_csv/final_migration.csv"

with open(filename, 'r') as file:
    csv_reader = csv.DictReader(file)
    csv_contents = [row for row in csv_reader]

print(csv_contents[0].keys())
graph = Graph()

schema = Namespace('https://schema.org/')
dbpedia_page = Namespace('https://dbpedia.org/resource/')

for row in csv_contents:
    migration = URIRef("urn:" + (row['Country of birth'] + "-" + row['Country of residence'] + "-" + row['Sex']
                                 + "-" + row['Age'] + "-" + row['Year']).replace(" ", "_"))
    name = Literal(row['Country of birth'] + "-" + row['Country of residence'], datatype=XSD['string'])
    country = URIRef(to_iri(dbpedia_page + row['Country of birth']))
    country_name = Literal(row['Country of birth'], lang='en')
    country_name_code = Literal(row['COUB'], lang='en')
    country_dest = URIRef(to_iri(dbpedia_page + row['Country of residence']))
    country_dest_name = Literal(row['Country of residence'], lang='en')
    country_dest_name_code = Literal(row['COU'], lang='en')
    age = Literal(row['Age'], lang='en')
    value = Literal(int(row['Value']), datatype=XSD['int'])
    sex = Literal(row['Sex'], lang='en')
    year = Literal(row['Year'], lang='en')

    graph.add((migration, URIRef(schema + "TravelAction"), name))
    graph.add((migration, FOAF.age, age))
    graph.add((migration, FOAF.gender, sex))
    graph.add((migration, URIRef(schema + "DateTime"), year))
    graph.add((migration, URIRef(schema + "Number"), value))

    graph.add((migration, URIRef(schema + "fromLocation"), country))
    # graph.add((country, FOAF.name, country_name))
    # graph.add((country, URIRef(schema + "addressCountry"), country_name_code))

    graph.add((migration, URIRef(schema + "toLocation"), country_dest))
    # graph.add((country_dest, FOAF.name, country_dest_name))
    # graph.add((country_dest, URIRef(schema + "addressCountry"), country_dest_name_code))

# print(graph.serialize(format='trig'))

graph.serialize(destination='result/result.rdf', format='xml')
