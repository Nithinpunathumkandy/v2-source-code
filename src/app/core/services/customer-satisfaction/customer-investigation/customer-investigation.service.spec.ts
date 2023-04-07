import { TestBed } from '@angular/core/testing';

import { CustomerInvestigationService } from './customer-investigation.service';

describe('CustomerInvestigationService', () => {
  let service: CustomerInvestigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerInvestigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
