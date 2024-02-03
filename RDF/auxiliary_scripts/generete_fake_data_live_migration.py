# from datetime import datetime, timedelta
# import csv
# import random
#
# d1 = datetime.strptime('1/2/2024 21:00', '%d/%m/%Y %H:%M')
# d2 = datetime.strptime('1/2/2024 22:00', '%d/%m/%Y %H:%M')
# delta = d2 - d1
#
#
# filename = "../resources_csv/FULL_DIOC_SEX_AGE_02012024221634595.csv"
#
# with open(filename, 'r') as file:
#     csv_reader = csv.DictReader(file)
#     csv_contents = [row for row in csv_reader]
#
# header = ['COUB', 'Country of birth', 'Age', 'Sex', 'COU', 'Country of residence', 'Datetime', 'Value', 'Progress']
#
# with open('../resources_csv/final_migration_live.csv', 'w', encoding='UTF8', newline='') as f:
#     writer = csv.writer(f)
#     writer.writerow(header)
#
#     for row in csv_contents:
#         if row['FBORN'] == 'ALL_FBORN' and row['EDU'] == 'ALL_EDU':
#             for i in range(0, int(delta.total_seconds()) + 1, 3700):
#                 value = random.randint(0, 97 + i % 10)
#                 if value < 51:
#                     for progress in range(0, 10):
#                         writer.writerow([row['ï»¿"COUB"'], row['Country of birth'], row['Age'], row['Sex'], row['COU'],
#                                          row['Country of residence'], d1 + timedelta(seconds=i+progress*360),
#                                          value, random.randint(progress*10, (progress+1)*10)])
#                 else:
#                     for progress in range(0, 5):
#                         writer.writerow([row['ï»¿"COUB"'], row['Country of birth'], row['Age'], row['Sex'], row['COU'],
#                                          row['Country of residence'], d1 + timedelta(seconds=i + progress * 720),
#                                          value, random.randint(progress * 20, (progress + 1) * 20)])
#
#                 writer.writerow([row['ï»¿"COUB"'], row['Country of birth'], row['Age'], row['Sex'], row['COU'],
#                                  row['Country of residence'], d1 + timedelta(seconds=i + 3600), value, 100])
