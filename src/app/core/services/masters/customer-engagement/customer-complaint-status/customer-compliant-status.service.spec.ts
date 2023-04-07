import { TestBed } from '@angular/core/testing';

import { CustomerCompliantStatusService } from './customer-compliant-status.service';

describe('CustomerCompliantStatusService', () => {
  let service: CustomerCompliantStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerCompliantStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
