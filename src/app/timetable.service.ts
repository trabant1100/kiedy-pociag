import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Timetable, TrainEntity } from './timetable';
import Holidays from 'date-holidays';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  static API_URL = 'assets/out.json'
  private MON = 1; private TUE = 2; private WED = 3; private THU = 4; private FRI = 5; private SAT = 6; private SUN = 0;

  constructor(private http: HttpClient) { }

  getTimetable(): Observable<Timetable> {
    return this.http.get<Timetable>(TimetableService.API_URL);
  }

  getTimetableForDate(date: Date, timetable: Timetable): Timetable {
    let hd = new Holidays('PL');
    let holiday = hd.isHoliday(date);
    let day = date.getDay();
    let weekend = date.getDay() == 6 || date.getDay() == 0;
    let working = !holiday && !weekend;

    let trains = timetable.trains.filter((train: TrainEntity) => {
      let comments = train.comments;
      let num = train.num;
      let result = false;
      if (comments.trim() == '') {
        result = true;
      }
      if (comments.includes('(C)') && ([this.SAT, this.SUN].includes(day) || holiday)) { // only in weekend and holiday
        result = true;
      }
      if (comments.includes('(D)') && working) { // only in working days
        result = true;
      }
      if (comments.includes('(B)') && [this.MON, this.TUE, this.WED, this.THU, this.FRI, this.SUN].includes(day)) { // MON-FRI and SAN
        result = true;
      }
      if (comments.includes('(E)') && [this.MON, this.TUE, this.WED, this.THU, this.FRI, this.SAT].includes(day) && !holiday) { // MON-SAT except holidays
        result = true;
      }
      if (num == '19841') {
        if (comments.includes('[1]')) {
          result = this.isEqual(date, 14, 1, 2019);
        }
        if (comments.includes('[2]')) {
          result = !this.isEqual(date, 14, 1, 2019) && working;
        }
      } else if (num == '93220/1') {
        if (comments.includes('[2]')) {
          result = !this.isEqual(date, 14, 1, 2019);
        }
      } else if (num == '93860/1 BOLIMEK') {
        if (comments.includes('[1]')) {
          result = result && this.isBetween(date, 11, 12, 2018, 18, 12, 2018);
        }
        if (comments.includes('[2]')) {
          result = (!this.isBetween(date, 11, 12, 2018, 14, 12, 2018) && !this.isBetween(date, 17, 12, 2018, 18, 12, 2018) && working);
        }
      } else if (num == '93862/3') {
        if (comments.includes('[1]')) {
          result = this.isAfterOrEqual(date, 18, 12, 2018) && working;
        }
        if (comments.includes('[2]')) {
          result = this.isBeforeOrEqual(date, 17, 12, 2018) && working;
        }
      } else if (num == '19877') {
        if (comments.includes('[3]')) {
          result = ([this.FRI, this.SUN].includes(day)) || this.isEqual(date, 22, 12, 2018) || this.isEqual(date, 26, 12, 2018);
        }
        if (comments.includes('[4]')) {
          result = ([this.MON, this.TUE, this.WED, this.THU, this.SAT].includes(day)) && !this.isEqual(date, 22, 12, 2018) && !this.isEqual(date, 26, 12, 2018);
        }
      } else if (num == '93450/1') {
        if (comments.includes('[1]')) {
          result = this.isAfterOrEqual(date, 15, 1, 2019) && working;
        }
        if (comments.includes('[2]')) {
          result = this.isBeforeOrEqual(date, 11, 1, 2019) && working;
        }
      } else if (['91230/1', '91800/1', '91590/1'].includes(num)) {
        if ((comments.includes('[3]') || comments.includes('[4]'))) {
          result = [this.MON, this.TUE, this.WED, this.THU, this.FRI, this.SAT].includes(day);
        }
      } else if (num == '93400/1') {
        if (comments.includes('[1]')) {
          result = this.isEqual(date, 14, 1, 2019) && working;
        }
        if (comments.includes('[2]')) {
          result = this.isBeforeOrEqual(date, 11, 1, 2019) && working;
        }
      } else if (num == '12890/1') {
        if (comments.includes('[3]')) {
          result = [this.MON, this.TUE, this.WED, this.THU, this.FRI, this.SAT].includes(day);
        }
      } else if (num == '93460/1') {
        if (comments.includes('[4]')) {
          result = this.isBeforeOrEqual(date, 14, 1, 2019) && working;
        }
      } else if (['93460/1', '93942/3'].includes(num)) {
        if (comments.includes('[1]')) {
          result = this.isAfterOrEqual(date, 15, 1, 2019);
        }
      } else if (num == '11852') {
        if (comments.includes('[2]')) {
          result = day == this.SUN;
        }
      } else if (num == '93942/3') {
        if (comments.includes('[3]')) {
          result = this.isBeforeOrEqual(date, 14, 1, 2019) && working;
        }
      } else if (num == '91818/9') {
        if (comments.includes('[2]')) {
          result = weekend || !!holiday || this.isBetween(date, 10, 12, 2018, 14, 12, 2018) || this.isEqual(date, 17, 12, 2018);
        }
      } else if (num == '93312/3') {
        if (comments.includes('[1]')) {
          result = this.isAfterOrEqual(date, 18, 12, 2018) && working;
        }
      } else if (num == '91234') {
        if (comments.includes('[2]')) {
          result = (day == this.SUN || this.isEqual(date, 26, 12, 2018) || this.isEqual(date, 1, 1, 2019))
            && !this.isEqual(date, 23, 12, 2018) && !this.isEqual(date, 30, 12, 2018);
        }
      } else if (num == '91824') {
        if (comments.includes('[1]')) {
          result = this.isAfterOrEqual(date, 15, 1, 2019) && working;
        }
        if (comments.includes('[2]')) {
          result = this.isBeforeOrEqual(date, 14, 1, 2019) && working;
        }
      } else if (num == '91848/9') {
        if (comments.includes('[1]')) {
          result = this.isBeforeOrEqual(date, 8, 3, 2019);
        }
        if (comments.includes('[2]')) {
          result = this.isEqual(date, 9, 3, 2019);
        }
      } else if (num == '91232/3 ŁUKOWIANKA') {
        if (comments.includes('[3]')) {
          result = [this.MON, this.TUE, this.WED, this.THU, this.FRI, this.SAT].includes(day);
        }
      } else if (num == '11862') {
        if (comments.includes('[1]')) {
          result = result || this.isEqual(date, 23, 12, 2018) || this.isEqual(date, 25, 12, 2018) || this.isEqual(date, 30, 12, 2018);
        }
      }

      return result;
    });

    return { trains: trains };
  }  

  private isEqual(dateToCheck: Date, day: number, month: number, year: number): boolean {
    return dateToCheck.getDate() == day && dateToCheck.getMonth() == month - 1 && dateToCheck.getFullYear() == year;
  }

  private isBetween(dateToCheck: Date, day1: number, month1: number, year1: number, day2: number, month2: number, year2: number): boolean {
    dateToCheck = new Date(dateToCheck);
    dateToCheck.setHours(0, 0, 0, 0);

    let d1 = new Date(); d1.setFullYear(year1, month1 - 1, day1); d1.setHours(0, 0, 0, 0);
    let d2 = new Date(); d2.setFullYear(year2, month2 - 1, day2); d2.setHours(0, 0, 0, 0);

    return d1.getTime() <= dateToCheck.getTime() && dateToCheck.getTime() <= d2.getTime();
  }  

  private isAfterOrEqual(dateToCheck: Date, day: number, month: number, year: number): boolean {
    dateToCheck = new Date(dateToCheck);
    dateToCheck.setHours(0, 0, 0, 0);
    let d = new Date(); d.setFullYear(year, month - 1, day); d.setHours(0, 0, 0, 0);

    return dateToCheck.getTime() >= d.getTime();
  }

  private isBeforeOrEqual(dateToCheck: Date, day: number, month: number, year: number): boolean {
    dateToCheck = new Date(dateToCheck);
    dateToCheck.setHours(0, 0, 0, 0);
    let d = new Date(); d.setFullYear(year, month - 1, day); d.setHours(0, 0, 0, 0)

    return dateToCheck.getTime() <= d.getTime();
  } 
}
