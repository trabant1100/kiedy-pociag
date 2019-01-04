import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { TimetableService } from './timetable.service';
import { Timetable, TrainEntity, StationEntity, DIRECTION } from './timetable';
import { StationCoord, Station } from './stationcoord';
import { StationCoordService } from './stationcoord.service';
import { GeolocationService } from './geolocation.service';
import * as geolib from 'geolib'
import { TimetableDecorator } from './timetable-decorator';
import { environment } from '../environments/environment';
import { StationCoordDecorator } from './station-coord-decorator';
import { StationDistance } from './station-distance';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private availableTrains: (TrainEntity)[];
  availableTrainsWwa: (TrainEntity)[];
  availableTrainsLuk: (TrainEntity)[];
  date: Date = new Date();
  title = 'kiedy-pociag';
  timetable: Timetable;
  stationCoord: StationCoord;
  lat: number;
  long: number;
  time = { hour: 0, minute: 0 };
  nearest: StationDistance = { station: {shortName: '', name: '', code: '', lat: '-1', long: '-1'}, dist: -1 };
  appTimestamp = environment.timestamp;

  constructor(private http: HttpClient, private timetableService: TimetableService, private stationService: StationCoordService,
    private geolocationService: GeolocationService) {
  }

  ngOnInit() {
    this.date = new Date();
    this.time.hour = this.date.getHours();
    this.time.minute = this.date.getMinutes();
    this.date.setMilliseconds(0);
    this.timetableService.getTimetable().toPromise().then((data: Timetable) => {
      this.timetable = new TimetableDecorator(data).DecoratedTimetable;
      this.stationService.getStationCoords().then((data: StationCoord) => {
        this.stationCoord = new StationCoordDecorator(data).DecoratedStationCoord;
        this.updatePositionAndGetTrains();
      });
    });
  }

  whenTrainOnClick() {
    this.date = new Date(this.date);
    this.date.setHours(this.time.hour);
    this.date.setMinutes(this.time.minute);
    this.geolocationService.getCurrentPosition((lat: number, long: number) => {
      this.lat = lat;
      this.long = long;
      this.availableTrains.length = 0; this.availableTrains.push(...this.getAvailableTrains(this.date));
      this.availableTrainsWwa.length = 0; this.availableTrainsWwa = this.getAvailableTrainsWwa();
      this.availableTrainsLuk.length = 0; this.availableTrainsLuk = this.getAvailableTrainsLuk();
    });
  }

  getStationFromTrain(train: TrainEntity, stationName: string): StationEntity {
    return train.stations.find((station: StationEntity) => station.name == stationName);
  }

  getEndStation(train: TrainEntity): StationEntity {
    return train.endStation;
  }

  getDirection(train: TrainEntity): DIRECTION {
    return train.direction;
  }

  isCisie(train: TrainEntity): boolean {
    return train.isCisie;
  }

  private getAvailableTrainsWwa = (): (TrainEntity)[] => this.availableTrains.filter((train: TrainEntity) => train.direction == DIRECTION.WWA);

  private getAvailableTrainsLuk = (): (TrainEntity)[] => this.availableTrains.filter((train: TrainEntity) => train.direction == DIRECTION.LUK);


  private getAvailableTrains(date: Date): (TrainEntity)[] {
    this.nearest = this.findNearest(this.lat, this.long);

    let filterStation = (station: StationEntity, date: Date): boolean => {
      return station.name == this.nearest.station.name && station.time != '' && this.isTimeAfter(station.time, date);
    }

    let wwaCount = 0, lukCount = 0;
    return this.timetableService.getTimetableForDate(date, this.timetable).trains
      .filter((train: TrainEntity) => {
        let include = train.stations.find((station: StationEntity) => filterStation(station, date)) != null && train.isCisie;

        if (include) {
          if (train.direction == DIRECTION.WWA) {
            wwaCount++;
            if (wwaCount > 2) {
              include = false;
            }
          }
          else if (train.direction == DIRECTION.LUK) {
            lukCount++;
            if (lukCount > 2) {
              include = false;
            }
          }
        }

        return include;
      });
  }

  private updatePositionAndGetTrains() {
    this.geolocationService.getCurrentPosition((lat: number, long: number) => {
      this.lat = lat;
      this.long = long;
      this.availableTrains = this.getAvailableTrains(this.date);
      this.availableTrainsWwa = this.getAvailableTrainsWwa();
      this.availableTrainsLuk = this.getAvailableTrainsLuk();
    });
  }

  private findNearest(lat: number, long: number): StationDistance {
    let distances = this.stationCoord.stations
      .map((s: Station) => {
        return { station: s, dist: geolib.getDistance({ latitude: s.lat, longitude: s.long }, { latitude: this.lat, longitude: this.long }) }
      });

    return distances.sort((a: { station, dist }, b: { station, dist }) => a.dist - b.dist)[0]
  }

  private isTimeAfter(time: string, date: Date): boolean {
    date = new Date(date); date.setMilliseconds(0);
    let splittedTime = time.split(':').map((str: string) => Number.parseInt(str, 10));
    let timeDate = new Date(date); timeDate.setHours(splittedTime[0], splittedTime[1]);

    return timeDate.getTime() > date.getTime();
  }
}

