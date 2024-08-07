import { TestBed } from '@angular/core/testing';

import { WebSocketServicePayslipService } from './web-socket-service-payslip.service';

describe('WebSocketServicePayslipService', () => {
  let service: WebSocketServicePayslipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketServicePayslipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
