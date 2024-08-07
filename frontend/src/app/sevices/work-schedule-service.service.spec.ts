import { TestBed } from '@angular/core/testing';

import { WorkScheduleServiceService } from './work-schedule-service.service';

describe('WorkScheduleServiceService', () => {
  let service: WorkScheduleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkScheduleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
