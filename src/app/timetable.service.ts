import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Timetable } from './timetable';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  timetableUrl = 'assets/out.json'

  constructor(private http: HttpClient) { }

  getTimetable() {
    return this.http.get<Timetable>(this.timetableUrl);
  }
}
