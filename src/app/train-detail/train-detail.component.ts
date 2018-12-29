import { Component, OnInit } from '@angular/core';
import { TrainEntity, Timetable } from '../timetable';
import { TimetableService } from '../timetable.service';
import { TimetableDecorator } from '../timetable-decorator';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-train-detail',
  templateUrl: './train-detail.component.html',
  styleUrls: ['./train-detail.component.css']
})
export class TrainDetailComponent implements OnInit {
  private timetable: Timetable;
  private id: number;
  train: TrainEntity = { id: null, num: null, from: null, comments: null, endStation: null, isCisie: null, direction: null, line: null, stations: [] };

  constructor(private timetableService: TimetableService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.timetableService.getTimetable().subscribe((timetable: Timetable) => {
      this.timetable = new TimetableDecorator(timetable).DecoratedTimetable;
      this.route.params.subscribe((params: Params) => {
        this.id = +params['id'];
        this.train = this.getTrain(this.id);
      });
    });
  }

  private getTrain(id: number): TrainEntity {
    return this.timetable.trains.find((t: TrainEntity) => t.id == id);
  }

}
