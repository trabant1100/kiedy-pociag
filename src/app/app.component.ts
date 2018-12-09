import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { TimetableService } from './timetable.service';
import { Timetable } from './timetable';
import { StationCoord, Station } from './stationcoord';
import { StationCoordService } from './stationcoord.service';
import { GeolocationService } from './geolocation.service';
import * as geolib from 'geolib'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kiedy-pociag';
  timetable: Timetable;
  stationCoord: StationCoord;
  lat: number;
  long: number;
  nearest: StationDistance = {name: '', dist: -1};

  constructor(private http: HttpClient, private timetableService: TimetableService, private stationService: StationCoordService, 
      private geolocationService: GeolocationService) {
  }

  ngOnInit() {
    this.timetableService.getTimetable().then((data: Timetable) => this.timetable = data);
    this.stationService.getStationCoords().then((data: StationCoord) => {
      this.stationCoord = data;
      this.startTracking();
    });
    
  }

  private startTracking() {
    this.geolocationService.startTracking((lat: number, long: number) => {
      this.lat = lat;
      this.long = long;
      this.nearest = this.findNearest(this.lat, this.long);
    });
  }

  private findNearest(lat: number, long: number): StationDistance {
    let distances = this.stationCoord.stations
      .map((s: Station) => {
        return {name: s.name, dist: geolib.getDistance({latitude: s.lat, longitude: s.long}, {latitude: this.lat, longitude: this.long})}
      });

    return distances.sort((a: {name, dist}, b: {name, dist}) => a.dist - b.dist)[0]
  }
}

interface StationDistance {
  name: string,
  dist: number
}
