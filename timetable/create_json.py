# coding=utf-8
import argparse
import csv
import re
import io
import json

parser = argparse.ArgumentParser(description='Creates JSON from csv')
parser.add_argument('srcname', metavar='srcname', type=str, help='CSV input file name')
parser.add_argument('dstname', metavar='dstname', type=str, help='JSON output file name')

args = parser.parse_args()
srcname = args.srcname
dstname = args.dstname

print 'From CSV file {} creating JSON file {}'.format(srcname, dstname)

#with io.open(srcname, 'r', encoding='cp1250') as srcfile:
    #data = list(csv.reader(srcfile, delimiter=';'))

data = list(csv.reader(open(srcname), delimiter=';'))

partitioned = []
lineslen = []
for y, line in enumerate(data):
    if line[0] == '__BEGIN__':
       part = []
       partitioned.append(part)
    part.append(line)
    lineslen.append(len(line))

assert all(l == lineslen[0] for l in lineslen)

jd = {}
jd['trains'] = []

def parsepart(part):
    part = zip(*part)
    trains = []
    for y, line in enumerate(part):
        if y < 2:
            continue
        train = {
            'line': line[0],
            'num': line[1],
            'comments': line[2],
            'from': line[3],
            'stations': []
        }
        for x, val in enumerate(line):
            if x < 4:
                continue
            station = {
                'name': part[0][x],
                'time': val
            }
            train['stations'].append(station)
        trains.append(train)
    return trains

for part in partitioned:
    trains = parsepart(part)
    jd['trains'] += trains

with open(dstname, 'w') as dstfile:
    json.dump(jd, dstfile, indent=3)


print 'Saved file {}'.format(dstname)