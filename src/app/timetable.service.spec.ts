import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as _ from 'lodash';
var since = require('jasmine2-custom-message');

import { TimetableService } from './timetable.service';
import { Timetable, TrainEntity, StationEntity, DIRECTION } from './timetable';

import * as data from './../../timetable/out.json';
import { TimetableDecorator } from './timetable-decorator';

describe('TimetableService', () => {
  let injector: TestBed;
  let service: TimetableService;
  let httpMock: HttpTestingController;

  let createDate = (day: number, month: number, year: number): Date => {
    return new Date(year, month - 1, day, 12, 0, 0, 0);
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

  // it('should be created', () => {

  //   expect(service).toBeTruthy();
  // });

  it('veryfing end stations', () => {
    service.getTimetable().then((tt: Timetable) => {
      tt = new TimetableDecorator(tt).DecoratedTimetable;
      let trains = tt.trains.filter((t: TrainEntity) => t.direction == DIRECTION.LUK);

      let isTrainInNums = (t: TrainEntity, nums: string[]): boolean => {
        return nums.includes(t.num);
      }

      let checkEndStation = (stationName: string, trains: TrainEntity[]) => {
        for (let train of trains) {
          since(`End station of train ${train.num} should be ${stationName}`);
          expect(train.endStation.name).toEqual(stationName);
        }
      }

      // End station Mińsk
      let removed = _.remove(trains, (t: TrainEntity) => {
        return isTrainInNums(t, ['19801', '19803', '93262/3', '93802/3', '19803', '91444/5', '19805', '93830/1', '93812/3',
          '19806/7', '19809', '21626/7', '99265', '21800/1', '93804/5', '19813', '21824/5', '93816/7', '21826/7', '21842/3',
          '19815']);
      });
      checkEndStation('Mińsk Maz.', removed);

      // End station Łuków
      removed = _.remove(trains, (t: TrainEntity) => {
        return isTrainInNums(t, ['19891', '10451', '10453', '10455', '11801', '10457', '11803', '10459', '10461', '10463', '11805',
          'ŁUKOWIANKA', '10465', '10467', '19233', '10469', '19893']);
      });
      checkEndStation('Łuków', removed);

      // End station Siedlce
      removed = _.remove(trains, (t: TrainEntity) => {
        return isTrainInNums(t, ['93851', '19851', '19853', 'BOLIMEK', '19855', '19857', '19859', '19861', '19863', 'CZEREMSZAK',
          '19865', '19867', '19869', '19871', '19221', '19873', '19875', '93862/3', '93862/3', '19877', '19877', '19879', '19881',
          '19883', '19885', '19887', '19889', '19251 CZEREMSZAK']);
      });
      checkEndStation('Siedlce', removed);

      // End station Mrozy
      removed = _.remove(trains, (t: TrainEntity) => {
        return isTrainInNums(t, ['19841', '21840/1', '21844/5', '93732/3']);
      });
      checkEndStation('Mrozy', removed);
      
      // End station Warszawa Rembertów
      removed = _.remove(trains, (t: TrainEntity) => {
        return isTrainInNums(t, ['93260/1', '93220/1', '91670/1', '93240/1', '93264/5', '91314/5', '11221', '11223', '93250/1', '93266/7', '93230/1']);
      });
      checkEndStation('Warszawa Rembertów', removed);
      
      // End station Sulejówek Miłosna
      removed = _.remove(trains, (t: TrainEntity) => {
        return isTrainInNums(t, ['19591']);
      });
      checkEndStation('Sulejówek Miłosna', removed);

      for (let t of trains) {
        fail(`Train [${t.line}] [${t.num}] with end station ${t.endStation.name}`);
      }

    });

    const req = httpMock.expectOne(TimetableService.API_URL);
    req.flush({ 'trains': data.trains });
  });

  it('timetable veryfing', () => {
    let timetable: Timetable;

    let noTrain = (num: string, day: number, month: number, year: number = 2018, finder: (t: TrainEntity) => boolean = (t) => true) => {
      let t = service.getTimetableForDate(createDate(day, month, year), timetable);
      expect(t.trains.find((t: TrainEntity) => t.num == num && finder(t))).not.toBeDefined();
    }

    let oneTrain = (num: string, day: number, month: number, year: number = 2018, finder: (t: TrainEntity) => boolean = (t) => true) => {
      let t = service.getTimetableForDate(createDate(day, month, year), timetable);
      let found = t.trains.filter((t: TrainEntity) => t.num == num && finder(t));
      expect(found!.length).toEqual(1);
      expect(found[0]).toBeDefined();
    }

    let checkStationAtHour = (t: TrainEntity, stationName: string, stationTime: string): boolean => {
      return t.stations.find((station: StationEntity) => station.name == stationName && station.time == stationTime) != null;
    }

    let testTrainsD = (nums: string[]) => {
      for (let num of nums) {
        noTrain(num, 5, 1, 2019);
        oneTrain(num, 4, 1, 2019);
      }
    }

    let testTrainsC = (nums: string[]) => {
      for (let num of nums) {
        noTrain(num, 2, 1, 2019);
        oneTrain(num, 1, 1, 2019);
      }
    }

    let testTrainsB = (nums: string[]) => {
      for (let num of nums) {
        noTrain(num, 5, 1, 2019);
        oneTrain(num, 6, 1, 2019);
      }
    }

    service.getTimetable().then((tt: Timetable) => {
      timetable = tt;
      expect(tt.trains.length).toBeGreaterThan(0);

      // 1. page
      noTrain('19891', 25, 12);
      oneTrain('19891', 27, 12);

      noTrain('93851', 19, 12);
      oneTrain('93851', 29, 12);

      noTrain('19841', 15, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '04:50'));
      oneTrain('19841', 14, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '04:50'));

      noTrain('19841', 14, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '05:05'));
      oneTrain('19841', 15, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '05:05'));

      noTrain('19803', 6, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '05:20'));
      oneTrain('19803', 15, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '05:20'));

      noTrain('93220/1', 14, 1, 2019);
      oneTrain('93220/1', 15, 1, 2019);

      noTrain('10453', 1, 1, 2019);
      oneTrain('10453', 2, 1, 2019);

      noTrain('93260/1', 1, 1, 2019);
      oneTrain('93260/1', 2, 1, 2019);

      // 2. page
      testTrainsD(['21840/1', '93262/3', '91670/1', '93802/3', '93240/1', '91444/5']);

      noTrain('BOLIMEK', 16, 12, 2018);
      oneTrain('BOLIMEK', 18, 12, 2018);

      noTrain('19803', 2, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '07:05'));
      oneTrain('19803', 1, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '07:05'));

      // 3. page
      testTrainsC(['19805']);

      testTrainsD(['93264/5', '93830/1', '91314/5', '93812/3']);

      // 4. page
      testTrainsD(['19806/7', '19809', '10461', '21626/7', '11221']);

      // 5. page
      testTrainsD(['11223', '93804/5', '19813', '93250/1']);

      noTrain('19591', 5, 1, 2019);
      oneTrain('19591', 6, 1, 2019);

      noTrain('ŁUKOWIANKA', 5, 1, 2019);
      oneTrain('ŁUKOWIANKA', 6, 1, 2019);

      // 6. page
      testTrainsD(['93816/7', '21826/7', '93266/7', '10467', '93230/1', '93732/3', '21842/3']);

      noTrain('93862/3', 17, 12, 2018, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '17:21'));
      oneTrain('93862/3', 18, 12, 2018, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '17:21'));

      noTrain('93862/3', 18, 12, 2018, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '17:29'));
      oneTrain('93862/3', 17, 12, 2018, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '17:29'));

      noTrain('19877', 20, 12, 2018, (t: TrainEntity) => checkStationAtHour(t, 'Sosnowe', '19:03'));
      oneTrain('19877', 22, 12, 2018, (t: TrainEntity) => checkStationAtHour(t, 'Sosnowe', '19:03'));

      noTrain('19877', 22, 12, 2018, (t: TrainEntity) => checkStationAtHour(t, 'Sosnowe', '18:55'));
      oneTrain('19877', 17, 12, 2018, (t: TrainEntity) => checkStationAtHour(t, 'Sosnowe', '18:55'));

      // 7. page
      testTrainsB(['19233', '19883', '19815']);

      testTrainsD(['21844/5']);

      // 8. page
      testTrainsD(['93330/1', '91890', '12800/1', '19442/3']);

      testTrainsC(['91852', '91854/5']);

      noTrain('93450/1', 14, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '06:25'));
      oneTrain('93450/1', 16, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '06:25'));

      noTrain('93450/1', 14, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '06:28'));
      oneTrain('93450/1', 9, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '06:28'));

      noTrain('91230/1', 6, 1, 2019);
      oneTrain('91230/1', 5, 1, 2019);

      noTrain('91800/1', 6, 1, 2019);
      oneTrain('91800/1', 5, 1, 2019);

      noTrain('91590/1', 6, 1, 2019);
      oneTrain('91590/1', 5, 1, 2019);

      // 9.page
      testTrainsD(['93940/1', '91856/7', '91856/7', '93900/1', '11850']);

      testTrainsC(['91892']);

      noTrain('93400/1', 16, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '07:32'));
      oneTrain('93400/1', 14, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '07:32'));

      noTrain('93400/1', 14, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '07:36'));
      oneTrain('93400/1', 10, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Warszawa Zachodnia', '07:36'));

      // noTrain('ŁUKOWIANKA', 13, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Halinów', '06:51'));
      // oneTrain('ŁUKOWIANKA', 12, 1, 2019, (t: TrainEntity) => checkStationAtHour(t, 'Halinów', '06:51'));
    });

    const req = httpMock.expectOne(TimetableService.API_URL);
    req.flush({ 'trains': data.trains });
  });
});

