# coding=cp1250
import argparse
import csv
import re

parser = argparse.ArgumentParser(description='Fixes csv timetable')
parser.add_argument('srcname', metavar='srcname', type=str, help='CSV input file name')
parser.add_argument('dstname', metavar='dstname', type=str, help='CSV output file name')

args = parser.parse_args()
srcname = args.srcname
dstname = args.dstname

print 'Fixing file {} to output file {}'.format(srcname, dstname)

data = list(csv.reader(open(srcname), delimiter=';'))

namesplit = {
    'Warszawa Zachodnia Warszawa Ochota': ['Warszawa Zachodnia', 'Warszawa Ochota'],
    'Warszawa Powiśle Warszawa Stadion': ['Warszawa Powiśle', 'Warszawa Stadion'],
    'Halinów Cisie': ['Halinów', 'Cisie'],
    'Mińsk Maz. Anielina Barcząca': ['Mińsk Maz. Anielina', 'Barcząca'],
    'Mienia Cegłów': ['Mienia', 'Cegłów'],
    'Sosnowe Koszewnica': ['Sosnowe', 'Koszewnica'],
    'Kotuń Sabinka': ['Kotuń', 'Sabinka'],
    'Dziewule Radomyśl': ['Dziewule', 'Radomyśl'],
    'Radomyśl Dziewule': ['Radomyśl', 'Dziewule'],
    'Borki Kosy Kosiorki': ['Borki Kosy', 'Kosiorki'],
    'Koszewnica Sosnowe': ['Koszewnica', 'Sosnowe'],
    'Cegłów Mienia': ['Cegłów', 'Mienia'],
    'Sabinka Kotuń': ['Sabinka', 'Kotuń'],
    'Nowe Dębe Wielkie Dębe Wielkie': ['Nowe Dębe Wielkie', 'Dębe Wielkie'],
    'Sulejówek Miłosna Sulejówek': ['Sulejówek Miłosna', 'Sulejówek'],
    'W-wa Wola Grzybowska W-wa Wesoła': ['W-wa Wola Grzybowska', 'W-wa Wesoła'],
    'Warszawa Stadion Warszawa Powiśle': ['Warszawa Stadion', 'Warszawa Powiśle'],
    'Warszawa Zachodnia Warszawa Ochota': ['Warszawa Zachodnia', 'Warszawa Ochota'],
}

names = [
    'Warszawa Zachodnia',
'Warszawa Ochota',
'Warszawa Śródmieście',
'Warszawa Centralna',
'Warszawa Powiśle',
'Warszawa Stadion',
'Warszawa Wschodnia',
'Warszawa Rembertów',
'W-wa Wesoła',
'W-wa Wola Grzybowska',
'Sulejówek',
'Sulejówek Miłosna',
'Halinów',
'Cisie',
'Dębe Wielkie',
'Nowe Dębe Wielkie',
'Wrzosów',
'Mińsk Maz.',
'Mińsk Maz. Anielina',
'Barcząca',
'Mienia',
'Cegłów',
'Mrozy',
'Grodziszcze Maz.',
'Sosnowe',
'Koszewnica',
'Kotuń',
'Sabinka',
'Siedlce Zach.',
'Siedlce',
'Siedlce Wschodnie',
'Białki Siedleckie',
'Kosiorki',
'Borki Kosy',
'Dziewule',
'Radomyśl',
'Krynka Łukowska',
'Łuków',
]

# states
BLANK, LINE, NUMBER, FREQ, HOUR = range(0, 5)

state = BLANK
outdata = list()
for y, line in enumerate(data):
    if line[3] == 'R2':
        state = LINE
    elif state < HOUR and state != BLANK:
        state += 1
    else:
        state = BLANK
    for x, val in enumerate(line):
        if re.match(r'\d\d:\d\d', val):
            state = HOUR
            break
    for x, val in enumerate(line):
        if val in namesplit:
            print 'FIX #1 row {}\tcolumn\t{}\t{}'.format(y, x, val)
            line[x] = namesplit[val][0]
            data[y+1][x] = namesplit[val][1]
        elif re.match(r'\d\d:\d\d\s<', val):
            print 'FIX #2 row {}\tcolumn\t{}\t{}'.format(y, x, val)
            line[x] = val[:5]
            data[y+1][x] = val[5:]
        elif x == 1 and val not in names and val != '' and state == HOUR:
            raise ValueError('Unknown station {}\tcolumn\t{}\t{}\tstate\t{}'.format(y, x, val, state))
    if line[1] in names and data[y+1][1] == '' and data[y+1][3] != 'R2':
        data[y+1][1] = line[1]
    if state != BLANK:
        outdata.append(line[1:]) 

wr = csv.writer(open(dstname, 'wb'), delimiter=';')
wr.writerows(outdata)
print 'Saved file {}'.format(dstname)