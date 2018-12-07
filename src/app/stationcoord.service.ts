import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { StationCoord } from './stationcoord';

@Injectable({
  providedIn: 'root'
})
export class StationCoordService {
  stationUrl = 'assets/stations.json'

  constructor(private http: HttpClient) { }

  getStationCoords() {
    return this.http.get<StationCoord>(this.stationUrl);
  }
}
