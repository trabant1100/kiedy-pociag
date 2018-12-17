import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private tracking = false;

  constructor() { }

  startTracking(callback: (lat: number, long: number) => void) {
    if (navigator.geolocation) {
      this.tracking = true;
      navigator.geolocation.watchPosition((position: Position) => {
        callback(position.coords.latitude, position.coords.longitude);
      });
    } else {
      alert('Geolocation not supported!');
    }
  }

  getCurrentPosition(callback: (lat: number, long: number) => void) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        callback(position.coords.latitude, position.coords.longitude);
      });
    } else {
      alert('Geolocation not supported!');
    }
  }
}
