import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Timetable, TrainEntity } from './timetable';
import Holidays from 'date-holidays';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  static API_URL = 'assets/out.json'
  private MON = 1; private TUE = 2; private WED = 3; private THU = 4; private FRI = 5; private SAT = 6; private SUN = 0;

  constructor(private http: HttpClient) { }

  getTimetable() {
    return this.http.get<Timetable>(TimetableService.API_URL).toPromise();
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
          result = this.isDayAndMonth(14, 1, date);
        }
        if (comments.includes('[2]')) {
          result = !this.isDayAndMonth(14, 1, date) && working;
        }
      } else if (num == '93220/1') {
        if(comments.includes('[2]')) {
          result = !this.isDayAndMonth(14, 1, date);
        }
      } else if (num == 'BOLIMEK') {
        if (comments.includes('[1]')) {
          result = result && this.isDayAndMonthBetween(11, 12, 18, 12, date);
        }
        if (comments.includes('[2]')) {
          result = (!this.isDayAndMonthBetween(11, 12, 14, 12, date) && !this.isDayAndMonthBetween(17, 12, 18, 12, date) && working);
        }
      } else if (num == '93862/3') {
        if (comments.includes('[1]')) {
          result = this.isDayAndMonthBefore(18, 12, date) && working;
        }
        if (comments.includes('[2]')) {
          result = this.isDayAndMonthAfter(17, 12, date) && working;
        }
      } else if (num == '19877') {
        if (comments.includes('[3]')) {
          result = ([this.FRI, this.SUN].includes(day)) || this.isDayAndMonth(22, 12, date) || this.isDayAndMonth(26, 12, date);
        }
        if (comments.includes('[4]')) {
          result = ([this.MON, this.TUE, this.WED, this.THU, this.SAT].includes(day)) && !this.isDayAndMonth(22, 12, date) && !this.isDayAndMonth(26, 12, date);
        }
      } else if (num == '93450/1') {
        if (comments.includes('[1]')) {
          result = this.isDayAndMonthBefore(15, 1, date) && working;
        }
        if (comments.includes('[2]')) {
          result = this.isDayAndMonthAfter(11, 1, date) && working;
        }
      } else if (['91230/1', '91800/1', '91590/1'].includes(num)) {
        if ((comments.includes('[3]') || comments.includes('[4]'))) {
          result = [this.MON, this.TUE, this.WED, this.THU, this.FRI, this.SAT].includes(day);
        }
      } else if (num == '93400/1') {
        if (comments.includes('[1]')) {
          result = this.isDayAndMonth(14, 1, date) && working;
        }
        if (comments.includes('[2]')) {
          result = this.isDayAndMonthAfter(11, 1, date) && working;
        }
      } else if (num == '12890/1') {
        if (comments.includes('[3]')) {
          result = [this.MON, this.TUE, this.WED, this.THU, this.FRI, this.SAT].includes(day);
        }
      } else if (num == '93460/1') {
        if (comments.includes('[4]')) {
          result = this.isDayAndMonthBefore(14, 1, date) && working;
        }
      } else if (num in ['93460/1', '93942/3']) {
        if (comments.includes('[1]')) {
          result = this.isDayAndMonthAfter(15, 1, date);
        }
      } else if (num == '11852') {
        if (comments.includes('[2]')) {
          result = day == this.SUN;
        }
      } else if (num == '93942/3') {
        if (comments.includes('[3]')) {
          result = this.isDayAndMonthBefore(14, 1, date) && working;
        }
      } else if (num == '91818/9') {
        // TODO - error!!!
        if (comments.includes('93312/3') && ((weekend || holiday) || this.isDayAndMonthBetween(10, 12, 14, 12, date) || this.isDayAndMonth(17, 12, date))) {
          result = true;
        }
      } else if (num == '93312/3') {
        if (comments.includes('[1]')) {
          result = (([this.MON, this.TUE, this.WED, this.THU, this.FRI, this.SAT].includes(day) && !holiday)
            || this.isDayAndMonth(23, 12, date) || this.isDayAndMonth(25, 12, date) || this.isDayAndMonth(30, 12, date));
        }
      } else if (num == '91234') {
        if (comments.includes('[2]')) {
          result = ((day == this.SUN || this.isDayAndMonth(26, 12, date) || this.isDayAndMonth(1, 1, date))
            && !this.isDayAndMonth(23, 12, date) && !this.isDayAndMonth(30, 12, date));
        }
      } else if (num == '91824') {
        if (comments.includes('[1]')) {
          result = this.isDayAndMonthAfter(15, 1, date) && working;
        }
        if (comments.includes('[2]')) {
          result = this.isDayAndMonthBefore(14, 1, date) && working;
        }
      } else if (num == '91848/9') {
        if (comments.includes('[1]')) {
          result = this.isDayAndMonthBefore(8, 3, date);
        }
        if (comments.includes('[2]')) {
          result = this.isDayAndMonth(9, 3, date);
        }
      }

      return result;
    });

    return { trains: trains };
  }

  private isDayAndMonth(day: number, month: number, date: Date): boolean {
    return date.getDate() == day && date.getMonth() == month - 1;
  }

  private isDayAndMonthBetween(day1: number, month1: number, day2: number, month2: number, date: Date): boolean {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    let d1 = new Date(date); d1.setDate(day1); d1.setMonth(month1 - 1);
    let d2 = new Date(date); d2.setDate(day2); d2.setMonth(month2 - 1);

    return d1.getTime() <= date.getTime() && date.getTime() <= d2.getTime();
  }

  private isDayAndMonthAfter(day: number, month: number, date): boolean {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    let d = new Date(date); d.setDate(day); d.setMonth(month - 1);

    return date.getTime() <= d.getTime();
  }

  private isDayAndMonthBefore(day: number, month: number, date): boolean {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    let d = new Date(date); d.setDate(day); d.setMonth(month - 1);

    return date.getTime() >= d.getTime();
  }
}
