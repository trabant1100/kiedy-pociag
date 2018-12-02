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

for y, line in enumerate(data):
    for x, val in enumerate(line):
        if val == 'Warszawa Zachodnia Warszawa Ochota':
            print 'FIX #1 row {}\tcolumn\t{}\t{}'.format(y, x, val)
            line[x] = 'Warszawa Zachodnia'
            data[y+1][x] = 'Warszawa Ochota'
        elif val == 'Warszawa Powiśle Warszawa Stadion':
            print 'FIX #1 row {}\tcolumn\t{}\t{}'.format(y, x, val)
            line[x] = 'Warszawa Powiśle'
            data[y+1][x] = 'Warszawa Stadion'
        elif val == 'Halinów Cisie':
            print 'FIX #1 row {}\tcolumn\t{}\t{}'.format(y, x, val)
            line[x] = 'Halinów'
            data[y+1][x] = 'Cisie'
        elif val == 'Mińsk Maz. Anielina Barcząca':
            print 'FIX #1 row {}\tcolumn\t{}\t{}'.format(y, x, val)
            line[x] = 'Mińsk Maz. Anielina'
            data[y+1][x] = 'Barcząca'
        elif val == 'Mienia Cegłów':
            print 'FIX #1 row {}\tcolumn\t{}\t{}'.format(y, x, val)
            line[x] = 'Mienia'
            data[y+1][x] = 'Cegłów'
        elif val == 'Sosnowe Koszewnica':
            print 'FIX #1 row {}\tcolumn\t{}\t{}'.format(y, x, val)
            line[x] = 'Sosnowe'
            data[y+1][x] = 'Koszewnica'
        elif val == 'Kotuń Sabinka':
            print 'FIX #1 row {}\tcolumn\t{}\t{}'.format(y, x, val)
            line[x] = 'Kotuń'
            data[y+1][x] = 'Sabinka'
        elif val == 'Dziewule Radomyśl':
            print 'FIX #1 row {}\tcolumn\t{}\t{}'.format(y, x, val)
            line[x] = 'Dziewule'
            data[y+1][x] = 'Radomyśl'
        elif re.match(r'\d\d:\d\d\s<', val):
            print 'FIX #2 row {}\tcolumn\t{}\t{}'.format(y, x, val)
            line[x] = val[:5]
            data[y+1][x] = val[5:]
        
wr = csv.writer(open(dstname, 'wb'), delimiter=';')
wr.writerows(data)
print 'Saved file {}'.format(dstname)