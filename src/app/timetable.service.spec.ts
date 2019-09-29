import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as _ from 'lodash';

import { TimetableService } from './timetable.service';
import { Timetable, TrainEntity, StationEntity, DIRECTION } from './timetable';

import * as data from './../../timetable/out.json';
import * as specData from './../../timetable/out_spec.json';
import { TimetableDecorator } from './timetable-decorator';
import { doesNotThrow } from 'assert';

const NONWORKING_SUNDAY = [23, 9, 2019];
const WORKING_MONDAY = [22, 9, 2019];

describe('TimetableService', () => {
  let injector: TestBed;
  let service: TimetableService;
  let httpMock: HttpTestingController;

  let createDate = (day: number, month: number, year: number): Date => {
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }

  let isTrainInNums = (t: TrainEntity, nums: string[]): boolean => {
    return nums.includes(t.num);
  }

  let checkEndStation = (stationName: string, trains: TrainEntity[]) => {
    for (let train of trains) {
      expect(train.endStation.name == stationName).toBeTruthy(`End station of train ${train.num} should be ${stationName}`);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TimetableService]
    });

    injector = getTestBed();
    service = injector.get(TimetableService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('veryfing end stations to LUK', () => {
    service.getTimetable().toPromise().then((tt: Timetable) => {
      let specDataLuk = specData['end stations to LUK'];
      tt = new TimetableDecorator(tt).DecoratedTimetable;
      let trains = tt.trains.filter((t: TrainEntity) => t.direction == DIRECTION.LUK);

      let removed = [];
      // End stations check
      for(let stationName in specDataLuk) {
        removed = _.remove(trains, (t: TrainEntity) => {
          return isTrainInNums(t, specDataLuk[stationName]);
        });
        let expected = specDataLuk[stationName];
        let actual = new Set(removed.map((t: TrainEntity) => t.num));
        checkEndStation(stationName, removed);
        if(expected.length != actual.size) {
          fail(`Should be ${expected.length} trains with end station ${stationName}, but were ${actual.size}`);
          let missingTrains = _.xor(expected, Array.from(actual));
          console.log(actual);
          console.log(expected)
          fail(`${stationName}: ${missingTrains}`);
          for(let missingTrain of missingTrains) {
            if(expected.includes(missingTrain)) {
              fail(`Bogus train ${missingTrain} in out_spec.json`);
            } else {
              fail(`Bogus train ${missingTrain} in timetable`);
            }
          }
        }
      }

       // Stations with no specification in out_spec.json
      for (let t of trains) {
        fail(`Train [${t.line}] [${t.num}] with end station ${t.endStation.name} found, but not defined in out_spec.json`);
      }
    });

    const req = httpMock.expectOne(TimetableService.API_URL);
    req.flush({ 'trains': data.trains });
  });
/*
  it('veryfing end stations to WWA', () => {
    service.getTimetable().toPromise().then((tt: Timetable) => {
      tt = new TimetableDecorator(tt).DecoratedTimetable;
      let trains = tt.trains.filter((t: TrainEntity) => t.direction == DIRECTION.WWA);

      // End station Warszawa Zachodnia
      let removed = _.remove(trains, (t: TrainEntity) => {
        return isTrainInNums(t, ['91850/1', '93330/1', '91852', '91890', '93450/1', '12800/1', '91230/1', '91800/1', '19442/3', '91854/5', '93940/1',
          '91856/7', '91892', '93400/1', '93400/1', '91232/3 ŁUKOWIANKA', '91802/3', '93900/1', '91858', '93460/1', '12890/1', '93460/1', '91840/1',
          '91804/5', '93942/3', '91860/1', '91220/1', '91806/7', '93490/1', '91862', '91808/9', '91864', '91810/1', '91866/7', '91812/3', '91868',
          '91814/5', '91870/1', '91816/7', '12224/5', '91872', '93310/1', '93492/3', '91874', '12226/7', '93312/3', '91818/9', '91876', '93314/5',
          '91820/1', '93944/5', '91878', '19420/1', '91234', '93316/7', '91222', '91822/3', '93946/7', '91880', '91824', '91826', '91882', '91224/5',
          '91842/3', '91884', '91828/9', '91830/1', '91886', '91832/3', '91888', '91848/9'
        ]);
      });
      checkEndStation('Warszawa Zachodnia', removed);

      // End station Siedlce
      removed = _.remove(trains, (t: TrainEntity) => {
        return isTrainInNums(t, ['11852', '11822', '11854', '11826', '11856', '11858', '11860', '11828', '11862', '11864', '11866', '11868', '11870', '11850']);
      });
      checkEndStation('Siedlce', removed);

      // End station Warszawa Wschodnia
      removed = _.remove(trains, (t: TrainEntity) => {
        return isTrainInNums(t, ['91590/1', '91250 CZEREMSZAK']);
      });
      checkEndStation('Warszawa Wschodnia', removed);

      for (let t of trains) {
        fail(`Train [${t.line}] [${t.num}] with end station ${t.endStation.name}`);
      }
    });

    const req = httpMock.expectOne(TimetableService.API_URL);
    req.flush({ 'trains': data.trains });
  });*/
/*
  it('timetable veryfing', () => {
    let timetable: Timetable;

    let noTrain = (num: string, [day, month, year = 2019]: Array<number>, finder: (t: TrainEntity) => boolean = (t) => true) => {
      let t = service.getTimetableForDate(createDate(day, month, year), timetable);

      expect(t.trains.find((t: TrainEntity) => t.num == num && finder(t)) == null).toBeTruthy(`Train ${num} should not be present at ${day}.${month}.${year}`);
    }

    let oneTrain = (num: string, [day, month, year = 2019]: Array<number>, finder: (t: TrainEntity) => boolean = (t) => true) => {
      let t = service.getTimetableForDate(createDate(day, month, year), timetable);
      let found = t.trains.filter((t: TrainEntity) => t.num == num && finder(t));

      expect(found!.length == 1).toBeTruthy(`Train ${num} should be present only once at ${day}.${month}.${year}, but was ${found!.length} times`);

      expect(found[0] != null).toBeTruthy(`Train ${num} should be present at ${day}.${month}.${year}`)
    }

    let checkStationAtTime = (t: TrainEntity, stationName: string, stationTime: string): boolean => {
      return t.stations.find((station: StationEntity) => station.name == stationName && station.time == stationTime) != null;
    }

    let checkStationAtTime2 = (t: TrainEntity, stationName: string, stationTime2: string): boolean => {
      return t.stations.find((station: StationEntity) => station.name == stationName && station.time2 == stationTime2) != null;
    }

    let getTrainNumAndFilter = (train: string | [string, (t: TrainEntity) => boolean]): [string, (t: TrainEntity) => boolean]  => {
      let numAndFilter: [string, (t: TrainEntity) => boolean] = ['', (t: TrainEntity) => true];

      if (typeof train == 'string') {
        numAndFilter[0] = train;
      } else {
        numAndFilter = train;
      }
      return numAndFilter;
    }

    let testTrainsD = (trains: Array<string | [string, (t: TrainEntity) => boolean]>) => {
      for (let train of trains) {
        let [num, filter] = getTrainNumAndFilter(train);
        noTrain(num, [5, 1, 2019], filter);
        oneTrain(num, [4, 1, 2019], filter);
      }
    }

    let testTrainsC = (trains: Array<string | [string, (t: TrainEntity) => boolean]>) => {
      for (let train of trains) {
        let [num, filter] = getTrainNumAndFilter(train);
        noTrain(num, [2, 1, 2019], filter);
        oneTrain(num, [1, 1, 2019], filter);
      }
    }

    let testTrainsB = (nums: string[]) => {
      for (let num of nums) {
        noTrain(num, [5, 1, 2019]);
        oneTrain(num, [6, 1, 2019]);
      }
    }

    let testTrainsE = (trains: Array<string | [string, (t: TrainEntity) => boolean]>) => {
      for (let train of trains) {
        let [num, filter] = getTrainNumAndFilter(train);
        noTrain(num, [1, 1, 2019], filter);
        oneTrain(num, [5, 1, 2019], filter);
      }
    }

    let testTrainsSince = ([day, month, year]: Array<number>, trains: [string, (t: TrainEntity) => boolean][]) => {
      let emptyFinder = (t: TrainEntity) => true
      for (let train of trains) {
        noTrain(train[0], [day - 1, month, year], train[1] || emptyFinder);
        oneTrain(train[0], [day, month, year], train[1] || emptyFinder);
      }
    }

    let testTrainsUntil = ([day, month, year]: Array<number>, trains: [string, (t: TrainEntity) => boolean][]) => {
      let emptyFinder = (t: TrainEntity) => true
      for (let train of trains) {
        noTrain(train[0], [day + 1, month, year], train[1] || emptyFinder);
        oneTrain(train[0], [day, month, year], train[1] || emptyFinder);
      }
    }

    service.getTimetable().toPromise().then((tt: Timetable) => {
      timetable = tt;
      expect(tt.trains.length).toBeGreaterThan(0);

      // 1. page
      noTrain('19891', [25, 12]);
      oneTrain('19891', [27, 12]);

      noTrain('93851', [19, 12]);
      oneTrain('93851', [29, 12]);

      noTrain('19841', NONWORKING_SUNDAY, (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '05:05'));
      oneTrain('19841', WORKING_MONDAY, (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '05:05'));

      noTrain('19803', [6, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '05:20'));
      oneTrain('19803', NONWORKING_SUNDAY, (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '05:20'));

      noTrain('93220/1', WORKING_MONDAY);
      oneTrain('93220/1', NONWORKING_SUNDAY);

      noTrain('10453', [1, 1, 2019]);
      oneTrain('10453', [2, 1, 2019]);

      noTrain('93260/1', [1, 1, 2019]);
      oneTrain('93260/1', [2, 1, 2019]);

      // 2. page
      testTrainsD(['21840/1', '93262/3', '91670/1', '93802/3', '93240/1', '91444/5']);

      noTrain('93860/1 BOLIMEK', [16, 12, 2019]);
      oneTrain('93860/1 BOLIMEK', [18, 12, 2019]);

      noTrain('19803', [2, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '07:05'));
      oneTrain('19803', [1, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '07:05'));

      // 3. page
      testTrainsC(['19805']);

      testTrainsD(['93264/5', '93830/1', '91314/5', '93812/3']);

      // 4. page
      testTrainsD(['19806/7', '19809', '10461', '21626/7', '11221']);

      // 5. page
      testTrainsD(['11223', '93804/5', '19813', '93250/1']);

      noTrain('19591', [5, 1, 2019]);
      oneTrain('19591', [6, 1, 2019]);

      noTrain('19230/1 ŁUKOWIANKA', [5, 1, 2019]);
      oneTrain('19230/1 ŁUKOWIANKA', [6, 1, 2019]);

      // 6. page
      testTrainsD(['93816/7', '21826/7', '93266/7', '10467', '93230/1', '93732/3', '21842/3']);

      noTrain('93862/3', [17, 12, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '17:21'));
      oneTrain('93862/3', [18, 12, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '17:21'));

      noTrain('93862/3', [18, 12, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '17:29'));
      oneTrain('93862/3', [17, 12, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '17:29'));

      noTrain('19877', [20, 12, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Sosnowe', '19:03'));
      oneTrain('19877', [22, 12, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Sosnowe', '19:03'));

      noTrain('19877', [22, 12, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Sosnowe', '18:55'));
      oneTrain('19877', [17, 12, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Sosnowe', '18:55'));

      // 7. page
      testTrainsB(['19233', '19883', '19815']);

      testTrainsD(['21844/5']);

      // 8. page
      testTrainsD(['93330/1', '91890', '12800/1', '19442/3']);

      testTrainsC(['91852', '91854/5']);

      noTrain('93450/1', WORKING_MONDAY, (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '06:25'));
      oneTrain('93450/1', [16, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '06:25'));

      noTrain('93450/1', WORKING_MONDAY, (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '06:28'));
      oneTrain('93450/1', [9, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '06:28'));

      noTrain('91230/1', [6, 1, 2019]);
      oneTrain('91230/1', [5, 1, 2019]);

      noTrain('91800/1', [6, 1, 2019]);
      oneTrain('91800/1', [5, 1, 2019]);

      noTrain('91590/1', [6, 1, 2019]);
      oneTrain('91590/1', [5, 1, 2019]);

      // 9.page
      testTrainsD(['93940/1', '91856/7', '91856/7', '93900/1', '11850']);

      testTrainsC(['91892']);

      noTrain('93400/1', [16, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '07:32'));
      oneTrain('93400/1', WORKING_MONDAY, (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '07:32'));

      noTrain('93400/1', WORKING_MONDAY, (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '07:36'));
      oneTrain('93400/1', [10, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '07:36'));

      noTrain('91232/3 ŁUKOWIANKA', [13, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Halinów', '06:51'));
      oneTrain('91232/3 ŁUKOWIANKA', [2, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Halinów', '06:51'));

      noTrain('93460/1', NONWORKING_SUNDAY, (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '08:39'));
      oneTrain('93460/1', WORKING_MONDAY, (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '08:39'));

      noTrain('12890/1', [13, 1, 2019]);
      oneTrain('12890/1', [2, 1, 2019]);

      // 10. page
      testTrainsD(['91840/1', '91220/1', '93490/1']);

      testTrainsSince(NONWORKING_SUNDAY, [['93942/3', (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '08:59')]]);

      noTrain('11852', [2, 1, 2019]);
      oneTrain('11852', [13, 1, 2019]);

      testTrainsSince(WORKING_MONDAY, [['93942/3', (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '09:06')]]);

      // 11. page
      testTrainsD(['11854', '91810/1', '91812/3', '91814/5']);

      // 12. page
      testTrainsD(['91816/7', '12224/5', '93310/1', '93492/3', '12226/7', ['11828', (t: TrainEntity) => t.from == 'Terespol']]);

      testTrainsSince([18, 12, 2019], [['93312/3', () => true]]);

      testTrainsC(['91818/9']);
      oneTrain('91818/9', [10, 12, 2019]);
      oneTrain('91818/9', [14, 12, 2019]);
      oneTrain('91818/9', [17, 12, 2019]);

      // 13. page
      testTrainsD(['93314/5', '93944/5', '19420/1', '93316/7', '91222']);
      
      testTrainsC([['11828', (t: TrainEntity) => t.from != 'Terespol'], '91820/1', '91822/3']);

      testTrainsE(['11862']);
      oneTrain('11862', [23, 12, 2019]);
      oneTrain('11862', [25, 12, 2019]);
      oneTrain('11862', [30, 12, 2019]);
      
      noTrain('91234', [5, 1, 2019]);
      oneTrain('91234', [6, 1, 2019]);
      oneTrain('91234', [26, 12, 2019]);
      oneTrain('91234', [1, 1, 2019]);
      noTrain('91234', [23, 12, 2019]);
      noTrain('91234', [30, 12, 2019]);

      // 14. page
      testTrainsD(['93946/7', '91826', '11864', '91224/5', '91842/3', '91828/9', '91830/1']);

      testTrainsSince(NONWORKING_SUNDAY, [['91824', (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '19:33')]]);
      noTrain('91824', [26, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '19:33'));
      oneTrain('91824', [5, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '19:33'));
      
      testTrainsUntil(WORKING_MONDAY, [['91824', (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '19:36')]]);
      noTrain('91824', [1, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '19:36'));
      oneTrain('91824', [4, 1, 2019], (t: TrainEntity) => checkStationAtTime(t, 'Warszawa Zachodnia', '19:36'));

      // 15. page
      testTrainsD(['91832/3', '11868']);

      testTrainsUntil([8, 3, 2019], [['91848/9', (t: TrainEntity) => checkStationAtTime2(t, 'Warszawa Wschodnia', '00:11')]]);
      
      noTrain('91848/9', [8, 3, 2019], (t: TrainEntity) => checkStationAtTime2(t, 'Warszawa Wschodnia', '00:10'));
      oneTrain('91848/9', [9, 3, 2019], (t: TrainEntity) => checkStationAtTime2(t, 'Warszawa Wschodnia', '00:10'));
    });

    const req = httpMock.expectOne(TimetableService.API_URL);
    req.flush({ 'trains': data.trains });
  });
  */
});

