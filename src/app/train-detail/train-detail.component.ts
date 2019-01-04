import { Component, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { TrainEntity, Timetable, StationEntity } from '../timetable';
import { TimetableService } from '../timetable.service';
import { TimetableDecorator } from '../timetable-decorator';
import { ActivatedRoute, Params } from '@angular/router';
import $ from 'jquery';

@Component({
  selector: 'app-train-detail',
  templateUrl: './train-detail.component.html',
  styleUrls: ['./train-detail.component.css']
})
export class TrainDetailComponent implements OnInit, AfterViewInit {
  private timetable: Timetable;
  private id: number;
  private stationCode: string;
  train: TrainEntity = { id: null, num: null, from: null, comments: null, startStation: null, endStation: null, isCisie: null, direction: null, line: null, stations: [] };

  @ViewChildren('stations') stationsQueryList: QueryList<any>;

  constructor(private timetableService: TimetableService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.timetableService.getTimetable().subscribe((timetable: Timetable) => {
      this.timetable = new TimetableDecorator(timetable).DecoratedTimetable;
      this.route.params.subscribe((params: Params) => {
        this.id = +params['id'];
        this.stationCode = params['stationCode'];
        this.train = this.getTrain(this.id);
      });
    });
  }

  ngAfterViewInit() {
    this.stationsQueryList.changes.subscribe(t => {
      this.scrollToStation();
    });
  }

  private scrollToStation() {
    let jqFirstStation = $(this.stationsQueryList.first.nativeElement)
    let height = jqFirstStation.outerHeight();
    let scrollIndex = Math.max(this.findStationIndex(this.stationCode, this.train) - 1, 0);

    this.stationsQueryList.toArray()[scrollIndex].nativeElement.scrollIntoView();
  }

  private findStationIndex(stationCode: string, train: TrainEntity): number {
    return train.stations.findIndex((station: StationEntity) => station.code == stationCode);
  }

  private getTrain(id: number): TrainEntity {
    return this.timetable.trains.find((t: TrainEntity) => t.id == id);
  }

}
