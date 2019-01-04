import { Pipe, PipeTransform } from '@angular/core';
import { StationDistance } from './station-distance';

@Pipe({
  name: 'humanDistance'
})
export class HumanDistancePipe implements PipeTransform {

  transform(dist: number, args?: any): string {
    return this.getDistance(dist);
  }

  private getDistance(distanceInMeters: number): string {
    let distance = '';
    if(distanceInMeters < 1000) {
        distance = distanceInMeters + 'm';
    } else {
        distance = ((distanceInMeters - distanceInMeters % 100) / 1000) + 'km';
    }

    return distance;
}

}

