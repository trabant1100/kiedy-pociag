import { TestBed } from '@angular/core/testing';

import { StationCoordService } from './stationcoord.service';

describe('StationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StationCoordService = TestBed.get(StationCoordService);
    expect(service).toBeTruthy();
  });
});
