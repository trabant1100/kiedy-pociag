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
    '''for val in line:
        val = val.replace('\\xc2\\xa0', '')
        val = val.replace('\\u00a0', '')'''
    lineslen.append(len(line))

assert all(l == lineslen[0] for l in lineslen)

jd = {}
jd['trains'] = []

def fixTrain(train):
    comms = re.search(r'\([A-Z]\)', train['num'])
    if(comms):
        train['comments'] += comms.group(0)
        train['num'] = re.sub(r'\([A-Z]\)', '', train['num'])
        train['num'] = train['num'].strip()


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
        fixTrain(train)
        for x, val in enumerate(line):
            if x < 4:
                continue
            val = val.strip()
            if val != '' and not re.match(r'\d\d:\d\d', val):
                val = '|'
            name = part[0][x]
            prevstation = train['stations'][-1] if len(train['stations']) > 0 else {'name': '', 'time': ''}
            if prevstation['name'] == name and prevstation['time'] != val:
                if re.match(r'\d\d:\d\d', prevstation['time']):
                    prevstation['time2'] = val
            else:
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