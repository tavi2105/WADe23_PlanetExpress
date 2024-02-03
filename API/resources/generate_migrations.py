import random
import csv
import datetime

from sparql_calls.add_migration import add_entry_sparql

age_list = ["15-24 years", "25-64 years", "65+ years", "All ages", "Unknown age"]
gender_list = ["Men", "Men and women", "Women"]
country_list = []

countries_coordinate = {}

with open("resources/country_coordinates.csv", 'r') as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        country_list.append(row["CountryName"])
        countries_coordinate[row["CountryName"]] = {
            "latitude": row["Latitude"],
            "longitude": row["Longitude"]
        }

NR_OF_LIVE_MIGRATIONS = 50

empty = [i for i in range(0, NR_OF_LIVE_MIGRATIONS)]

all_migrations_in_progress = {}


def get_coordinate(dest, origin, progress):
    return {
        "latitude": float(countries_coordinate[origin]["latitude"]) +
                    (float(countries_coordinate[dest]["latitude"]) - float(
                        countries_coordinate[origin]["latitude"])) * progress / 100,
        "longitude": float(countries_coordinate[origin]["longitude"]) +
                     (float(countries_coordinate[dest]["longitude"]) - float(
                         countries_coordinate[origin]["longitude"])) * progress / 100
    }


def fill_empty_migrations():
    for value in empty:
        number_of_people = random.randint(10, 99 + int(value / 10))
        destination = random.randint(0, (number_of_people % len(country_list)))
        origin = random.randint(0, (number_of_people % len(country_list)))
        if destination == origin:
            origin += 1
        progress = random.randint(0, 5 + value % 10)
        migration = {
            "destination": country_list[destination],
            "origin": country_list[origin],
            "numberOfPeople": number_of_people,
            "age": age_list[random.randint(0, (number_of_people % len(age_list)))],
            "gender": gender_list[random.randint(0, (number_of_people % len(gender_list)))],
            "startTime": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
            "progress": progress,
            "coordinate": get_coordinate(country_list[destination], country_list[origin], progress)
        }

        all_migrations_in_progress[value] = migration

    empty.clear()


def update_live_migrations():
    if len(empty) != NR_OF_LIVE_MIGRATIONS:
        for index in range(0, NR_OF_LIVE_MIGRATIONS):
            if index in all_migrations_in_progress and "progress" in all_migrations_in_progress[index]:
                actual_progress = all_migrations_in_progress[index]["progress"]
                if actual_progress == 100:
                    add_entry_sparql(all_migrations_in_progress[index])
                    empty.append(index)
                else:
                    all_migrations_in_progress[index]["progress"] = (
                        min(actual_progress + random.randint(0, 5 + actual_progress % 15), 100))
                    all_migrations_in_progress[index]["coordinate"] = (
                        get_coordinate(all_migrations_in_progress[index]["destination"],
                                       all_migrations_in_progress[index]["origin"],
                                       all_migrations_in_progress[index]["progress"]))


def get_live_migrations():
    print("get_live_migrations: new wave")
    update_live_migrations()
    fill_empty_migrations()

    return list(all_migrations_in_progress.values())
