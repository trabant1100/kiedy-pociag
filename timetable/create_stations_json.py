# coding=utf-8
import argparse
import csv
import re
import io
import json

parser = argparse.ArgumentParser(description='Creates JSON stations from stations csv')
parser.add_argument('srcname', metavar='srcname', type=str, help='CSV input file name')
parser.add_argument('dstname', metavar='dstname', type=str, help='JSON output file name')

args = parser.parse_args()
srcname = args.srcname
dstname = args.dstname

print 'From CSV file {} creating JSON file {}'.format(srcname, dstname)

data = list(csv.reader(open(srcname), delimiter=';'))

jd = {}
jd['stations'] = []

for line in data:
    station = {
        'name': line[0],
        'lat': line[1],
        'long': line[2]
    }
    jd['stations'].append(station)

with open(dstname, 'w') as dstfile:
    json.dump(jd, dstfile, indent=3)


print 'Saved file {}'.format(dstname)