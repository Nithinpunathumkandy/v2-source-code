import { TestBed } from '@angular/core/testing';

import { CustomerComplaintService } from './customer-complaint.service';

describe('CustomerComplaintService', () => {
  let service: CustomerComplaintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerComplaintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
