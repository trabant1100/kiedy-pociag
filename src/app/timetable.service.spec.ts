import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { TimetableService } from './timetable.service';
import { Timetable, TrainEntity, StationEntity } from './timetable';

import * as data from './../../timetable/out.json';

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
    });

    const req = httpMock.expectOne(TimetableService.API_URL);
    req.flush({ 'trains': data.trains });
  });
});

