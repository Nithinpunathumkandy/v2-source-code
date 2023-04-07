import { TestBed } from '@angular/core/testing';

import { CustomerComplaintInvestigationStatusService } from './customer-complaint-investigation-status.service';

describe('CustomerComplaintInvestigationStatusService', () => {
  let service: CustomerComplaintInvestigationStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerComplaintInvestigationStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
