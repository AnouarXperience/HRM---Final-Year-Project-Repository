import { TestBed } from '@angular/core/testing';

import { VactionsService } from './vactions.service';

describe('VactionsService', () => {
  let service: VactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
