import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { TimetableService } from './timetable.service';
import { Timetable } from './timetable';
import { StationCoord } from './stationcoord';
import { StationCoordService } from './stationcoord.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kiedy-pociag';
  timetable: Timetable;
  stationCoord: StationCoord;

  constructor(private http: HttpClient, private timetableService: TimetableService, private stationService: StationCoordService) {
    this.getData()
  }

  getData() {
    this.timetable = this.timetableService.getTimetable().subscribe((data: Timetable) => this.timetable = data);
    this.stationCoord = this.stationService.getStationCoords().subscribe((data: StationCoord) => this.stationCoord = data);
  }
}
