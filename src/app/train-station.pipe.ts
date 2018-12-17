import { Pipe, PipeTransform } from '@angular/core';
import { StationEntity } from './timetable';

@Pipe({
  name: 'trainStation'
})
export class TrainStationPipe implements PipeTransform {

  transform(station: StationEntity, args?: any): string {
    return `${station.name} ${station.time}`;
  }

}
