import csv

filename = "../resources_csv/FULL_DIOC_SEX_AGE_02012024221634595.csv"

with open(filename, 'r') as file:
    csv_reader = csv.DictReader(file)
    csv_contents = [row for row in csv_reader]

header = ['COUB', 'Country of birth', 'Age', 'Sex', 'COU', 'Country of residence', 'Year', 'Value']

years = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']
years_pe = [0.05, 0.07, 0.03, 0.15, 0.10, 0.10, 0.15, 0.5, 0.6, 0.4, 0.20]

with open('../resources_csv/final_migration.csv', 'w', encoding='UTF8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)

    for row in csv_contents:
        if row['FBORN'] == 'ALL_FBORN' and row['EDU'] == 'ALL_EDU':
            for index, year in enumerate(years):
                writer.writerow([row['ï»¿"COUB"'], row['Country of birth'], row['Age'], row['Sex'], row['COU'],
                                 row['Country of residence'], year, str(int(years_pe[index] * int(row['Value'])))])
