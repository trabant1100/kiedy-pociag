import { TestBed } from '@angular/core/testing';

import { TimetableService } from './timetable.service';

describe('TrainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimetableService = TestBed.get(TimetableService);
    expect(service).toBeTruthy();
  });
});
