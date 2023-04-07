import { TestBed } from '@angular/core/testing';

import { CustomerEngagementFileServiceService } from './customer-engagement-file-service.service';

describe('CustomerEngagementFileServiceService', () => {
  let service: CustomerEngagementFileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerEngagementFileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
