import { TestBed } from '@angular/core/testing';

import { BusinessApplicationsService } from './business-applications.service';

describe('BusinessApplicationsService', () => {
  let service: BusinessApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessApplicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
