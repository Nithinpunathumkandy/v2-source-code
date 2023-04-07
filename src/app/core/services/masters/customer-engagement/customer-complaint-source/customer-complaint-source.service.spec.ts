import { TestBed } from '@angular/core/testing';

import { CustomerComplaintSourceService } from './customer-complaint-source.service';

describe('CustomerComplaintSourceService', () => {
  let service: CustomerComplaintSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerComplaintSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
